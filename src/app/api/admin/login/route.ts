import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServiceClient } from "@/lib/supabase/server";

const MAX_ATTEMPTS = 5;
const WINDOW_MINUTES = 15;

function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

export async function POST(req: Request) {
  const { password } = await req.json();
  const adminPassword = process.env.ADMIN_PASSWORD;
  const secretToken = process.env.ADMIN_SECRET_TOKEN ?? "madame-shelda-admin";

  const ip = getClientIp(req);
  const supabase = await createServiceClient();
  const windowStart = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000).toISOString();

  // Son WINDOW_MINUTES içinde bu IP'den kaç başarısız deneme yapılmış?
  const { count } = await supabase
    .from("admin_login_attempts")
    .select("*", { count: "exact", head: true })
    .eq("ip", ip)
    .eq("success", false)
    .gte("created_at", windowStart);

  if ((count ?? 0) >= MAX_ATTEMPTS) {
    return NextResponse.json(
      { error: `Çok fazla başarısız deneme yapıldı. Lütfen ${WINDOW_MINUTES} dakika sonra tekrar deneyin.` },
      { status: 429 }
    );
  }

  const success = Boolean(adminPassword) && password === adminPassword;

  // Her denemeyi kaydet (denetim izi + kilitleme sayacı için).
  await supabase.from("admin_login_attempts").insert({ ip, success });

  if (!success) {
    return NextResponse.json({ error: "Hatalı şifre" }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set("admin_token", secretToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 gün
    path: "/",
  });

  return NextResponse.json({ ok: true });
}
