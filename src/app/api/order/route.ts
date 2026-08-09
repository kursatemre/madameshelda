import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/client";
import { orderReceivedAdmin, orderReceivedCustomer } from "@/lib/email/templates";
import { orderSchema, firstIssueMessage } from "@/lib/validation";
import { evaluateCoupon } from "@/lib/coupons";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = orderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: firstIssueMessage(parsed) }, { status: 400 });
    }
    const { ref, full_name, email, phone, address, city, note, items, payment_method, coupon_code, session_id } = parsed.data;

    // İsteğin kendi çerezlerinden — istemci hiçbir user_id göndermez, spoof
    // edilemez. Login değilse sessizce null döner (misafir siparişi).
    const authClient = await createClient();
    const { data: { user } } = await authClient.auth.getUser();

    const supabase = await createServiceClient();

    // Gerçek toplam ve indirim burada, sunucu tarafında hesaplanır —
    // istemciden gelen total/discount'a güvenilmez.
    const subtotal = items.reduce((s, i) => s + i.price, 0);
    let discountAmount = 0;
    let appliedCouponCode: string | null = null;
    let couponId: string | null = null;
    let couponUsedCount = 0;

    if (coupon_code) {
      const { data: coupon } = await supabase
        .from("coupons")
        .select("*")
        .eq("code", coupon_code.trim().toUpperCase())
        .maybeSingle();
      const result = evaluateCoupon(coupon, subtotal);
      // Geçersiz çıkarsa (ör. checkout sırasında limit dolmuş) sipariş yine
      // de engellenmez — sadece indirim uygulanmadan devam eder.
      if (result.valid && coupon) {
        discountAmount = result.discount;
        appliedCouponCode = coupon.code;
        couponId = coupon.id;
        couponUsedCount = coupon.used_count;
      }
    }

    const total = Math.max(0, subtotal - discountAmount);

    // coupon_code/discount_amount yalnızca gerçekten bir indirim
    // uygulandıysa gönderilir. Böylece `supabase-faz5.sql` migration'ı henüz
    // production'a uygulanmamışsa bile (orders tablosunda bu 2 kolon yoksa)
    // kuponsuz siparişler eskisi gibi sorunsuz oluşturulmaya devam eder —
    // migration eksikliği tüm checkout akışını kilitlemez.
    const { error } = await supabase.from("orders").insert({
      ref,
      full_name,
      email,
      phone,
      address,
      city,
      note: note || null,
      items,
      total,
      payment_method,
      status: "pending",
      ...(discountAmount > 0 ? { coupon_code: appliedCouponCode, discount_amount: discountAmount } : {}),
      ...(user ? { user_id: user.id } : {}),
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Yan etkiler — sipariş zaten kaydedildi, bunlar başarısız olsa da
    // siparişi geçersiz kılmaz.
    if (couponId) {
      await supabase.from("coupons").update({ used_count: couponUsedCount + 1 }).eq("id", couponId);
    }
    if (session_id) {
      await supabase.from("cart_sessions").update({ converted_at: new Date().toISOString() }).eq("session_id", session_id);
    }

    // Stok azaltma — yalnızca stock_quantity girilmiş ürünler için (null =
    // sınırsız/takip edilmiyor). Aynı ürünün birden fazla varyantı sepette
    // olabileceğinden slug başına adet sayılır. Best-effort: `products`
    // tablosunda `stock_quantity` kolonu henüz yoksa (migration çalışmamışsa)
    // sessizce atlanır, sipariş etkilenmez.
    try {
      const slugCounts = new Map<string, number>();
      for (const item of items) {
        if (item.slug) slugCounts.set(item.slug, (slugCounts.get(item.slug) ?? 0) + 1);
      }
      for (const [slug, count] of slugCounts) {
        const { data: prod } = await supabase
          .from("products")
          .select("id, stock_quantity")
          .eq("slug", slug)
          .maybeSingle();
        if (prod && prod.stock_quantity !== null) {
          const newQty = Math.max(0, prod.stock_quantity - count);
          await supabase
            .from("products")
            .update(newQty === 0 ? { stock_quantity: newQty, is_available: false } : { stock_quantity: newQty })
            .eq("id", prod.id);
        }
      }
    } catch {}

    const adminEmail = process.env.ADMIN_EMAIL ?? "admin@madameshelda.com";
    const admin = orderReceivedAdmin({ ref, full_name, email, phone, address, city, note, items, total, payment_method, coupon_code: appliedCouponCode, discount_amount: discountAmount });
    const customer = orderReceivedCustomer({ ref, full_name, items, total, payment_method, coupon_code: appliedCouponCode, discount_amount: discountAmount });

    await Promise.allSettled([
      sendEmail({ to: adminEmail, subject: admin.subject, html: admin.html }),
      sendEmail({ to: email, subject: customer.subject, html: customer.html }),
    ]);

    return NextResponse.json({ success: true, ref, total, discount_amount: discountAmount });
  } catch {
    return NextResponse.json({ error: "Beklenmeyen hata." }, { status: 500 });
  }
}
