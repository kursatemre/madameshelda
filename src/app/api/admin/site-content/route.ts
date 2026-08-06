import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { getAllSiteContent, SITE_CONTENT_DEFAULTS } from "@/lib/site-content";

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  return token === process.env.ADMIN_SECRET_TOKEN;
}

export async function GET() {
  if (!(await checkAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await getAllSiteContent());
}

export async function PUT(request: Request) {
  if (!(await checkAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { key, value } = body;

  if (!key || !(key in SITE_CONTENT_DEFAULTS)) {
    return NextResponse.json({ error: "Geçersiz bölüm anahtarı." }, { status: 400 });
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return NextResponse.json({ error: "Geçersiz veri." }, { status: 400 });
  }

  const supabase = await createServiceClient();
  const { data, error } = await supabase
    .from("site_settings")
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
