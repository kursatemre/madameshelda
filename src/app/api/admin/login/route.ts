import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { password } = await req.json();
  const adminPassword = process.env.ADMIN_PASSWORD;
  const secretToken = process.env.ADMIN_SECRET_TOKEN ?? "madame-shelda-admin";

  if (!adminPassword || password !== adminPassword) {
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
