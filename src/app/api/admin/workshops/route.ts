import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  return token === process.env.ADMIN_SECRET_TOKEN;
}

export async function GET() {
  const supabase = await createServiceClient();
  const { data, error } = await supabase
    .from("workshops")
    .select("id, slug, title, description, duration_hours, level, includes, is_active, created_at")
    .order("created_at", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(request: Request) {
  if (!(await checkAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const { slug, title, description, duration_hours, level, includes } = body;
  if (!slug || !title || !level) {
    return NextResponse.json({ error: "slug, title ve level zorunludur." }, { status: 400 });
  }
  const supabase = await createServiceClient();
  const { data, error } = await supabase
    .from("workshops")
    .insert({
      slug,
      title,
      description: description ?? null,
      duration_hours: duration_hours ?? 3,
      level,
      includes: includes ?? [],
      is_active: true,
      date: new Date().toISOString().split("T")[0],
      capacity: 8,
      price: 0,
    })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
