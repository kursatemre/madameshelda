import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/client";
import { reviewSubmittedAdmin } from "@/lib/email/templates";
import { reviewSchema, firstIssueMessage } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = reviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: firstIssueMessage(parsed) }, { status: 400 });
    }
    const { product_id, customer_name, email, rating, comment, images } = parsed.data;

    const supabase = await createServiceClient();

    const { data: product } = await supabase.from("products").select("title").eq("id", product_id).maybeSingle();
    if (!product) return NextResponse.json({ error: "Ürün bulunamadı." }, { status: 404 });

    const { error } = await supabase.from("product_reviews").insert({
      product_id,
      customer_name,
      email,
      rating,
      comment,
      images: images ?? [],
      is_approved: false,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const adminEmail = process.env.ADMIN_EMAIL ?? "admin@madameshelda.com";
    const admin = reviewSubmittedAdmin({
      productTitle: product.title,
      customerName: customer_name,
      email,
      rating,
      comment,
      hasImages: (images?.length ?? 0) > 0,
    });
    await sendEmail({ to: adminEmail, subject: admin.subject, html: admin.html });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Beklenmeyen hata." }, { status: 500 });
  }
}
