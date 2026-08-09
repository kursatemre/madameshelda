import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { couponValidateSchema, firstIssueMessage } from "@/lib/validation";
import { evaluateCoupon } from "@/lib/coupons";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = couponValidateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ valid: false, discount: 0, message: firstIssueMessage(parsed) }, { status: 400 });
    }
    const { code, subtotal } = parsed.data;

    const supabase = await createServiceClient();
    const { data: coupon } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", code.trim().toUpperCase())
      .maybeSingle();

    const result = evaluateCoupon(coupon, subtotal);
    return NextResponse.json(result, { status: result.valid ? 200 : 400 });
  } catch {
    return NextResponse.json({ valid: false, discount: 0, message: "Beklenmeyen hata." }, { status: 500 });
  }
}
