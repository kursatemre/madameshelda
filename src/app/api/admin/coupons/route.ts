import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";

async function isAdmin() {
  const jar = await cookies();
  return jar.get("admin_token")?.value === process.env.ADMIN_SECRET_TOKEN;
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const supabase = await createServiceClient();
  const { data, error } = await supabase.from("coupons").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const body = await req.json();
  const code = String(body.code ?? "").trim().toUpperCase();
  const type = body.type === "fixed" ? "fixed" : "percent";
  const value = Number(body.value);

  if (!code) return NextResponse.json({ error: "Kupon kodu zorunludur." }, { status: 400 });
  if (!Number.isFinite(value) || value <= 0) return NextResponse.json({ error: "Geçerli bir değer girin." }, { status: 400 });
  if (type === "percent" && value > 100) return NextResponse.json({ error: "Yüzde indirim 100'den büyük olamaz." }, { status: 400 });

  const supabase = await createServiceClient();
  const { data, error } = await supabase
    .from("coupons")
    .insert({
      code,
      type,
      value,
      min_order_total: Number(body.min_order_total) || 0,
      max_uses: body.max_uses ? Number(body.max_uses) : null,
      expires_at: body.expires_at || null,
      is_active: body.is_active !== false,
    })
    .select()
    .single();

  if (error) {
    const msg = error.code === "23505" ? "Bu kupon kodu zaten kullanılıyor." : error.message;
    return NextResponse.json({ error: msg }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const body = await req.json();
  const { id, ...rest } = body;
  if (!id) return NextResponse.json({ error: "id gerekli" }, { status: 400 });

  const patch: Database["public"]["Tables"]["coupons"]["Update"] = { updated_at: new Date().toISOString() };
  if ("is_active" in rest) patch.is_active = Boolean(rest.is_active);
  if ("code" in rest) patch.code = String(rest.code).trim().toUpperCase();
  if ("type" in rest) patch.type = rest.type === "fixed" ? "fixed" : "percent";
  if ("value" in rest) patch.value = Number(rest.value);
  if ("min_order_total" in rest) patch.min_order_total = Number(rest.min_order_total) || 0;
  if ("max_uses" in rest) patch.max_uses = rest.max_uses ? Number(rest.max_uses) : null;
  if ("expires_at" in rest) patch.expires_at = rest.expires_at || null;

  const supabase = await createServiceClient();
  const { data, error } = await supabase.from("coupons").update(patch).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id gerekli" }, { status: 400 });

  const supabase = await createServiceClient();
  const { error } = await supabase.from("coupons").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
