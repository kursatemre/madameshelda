import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { orderLookupSchema, firstIssueMessage } from "@/lib/validation";

/**
 * Misafir sipariş takibi — sipariş no + e-posta eşleşmesi gerektirir (ref
 * tek başına tahmin edilebilir olduğundan sadece ref ile arama yapılmaz).
 * Adres/telefon gibi bilgiler dönmez, yalnızca durum özeti.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = orderLookupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: firstIssueMessage(parsed) }, { status: 400 });
    }
    const { ref, email } = parsed.data;

    const supabase = await createServiceClient();
    const { data: order } = await supabase
      .from("orders")
      .select("ref, items, total, status, payment_method, created_at")
      .ilike("ref", ref.trim())
      .ilike("email", email.trim())
      .maybeSingle();

    if (!order) {
      return NextResponse.json({ error: "Bu sipariş numarası ve e-posta ile eşleşen bir sipariş bulunamadı." }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch {
    return NextResponse.json({ error: "Beklenmeyen hata." }, { status: 500 });
  }
}
