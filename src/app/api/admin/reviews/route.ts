import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

async function isAdmin() {
  const jar = await cookies();
  return jar.get("admin_token")?.value === process.env.ADMIN_SECRET_TOKEN;
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const supabase = await createServiceClient();
  const { data, error } = await supabase
    .from("product_reviews")
    .select("*, products(title, slug)")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const { id, is_approved } = await req.json();
  if (!id) return NextResponse.json({ error: "id gerekli" }, { status: 400 });

  const supabase = await createServiceClient();
  const { error } = await supabase.from("product_reviews").update({ is_approved: Boolean(is_approved) }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id gerekli" }, { status: 400 });

  const supabase = await createServiceClient();
  const { error } = await supabase.from("product_reviews").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
