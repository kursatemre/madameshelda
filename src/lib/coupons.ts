import type { Database } from "@/types/database";

export type CouponRow = Database["public"]["Tables"]["coupons"]["Row"];

export type CouponEvalResult =
  | { valid: true; discount: number; message: string }
  | { valid: false; discount: 0; message: string };

/**
 * Bir kuponun verilen sepet ara toplamı için geçerli olup olmadığını ve
 * indirim tutarını hesaplar. Hem `/api/coupon/validate` (ön izleme) hem
 * `/api/order` (siparişi kaydederken sunucu tarafı yeniden doğrulama) aynı
 * fonksiyonu kullanır — istemciden gelen indirim tutarına asla güvenilmez.
 */
export function evaluateCoupon(coupon: CouponRow | null, subtotal: number): CouponEvalResult {
  if (!coupon) return { valid: false, discount: 0, message: "Geçersiz kupon kodu." };
  if (!coupon.is_active) return { valid: false, discount: 0, message: "Bu kupon artık geçerli değil." };
  if (coupon.expires_at && new Date(coupon.expires_at).getTime() < Date.now()) {
    return { valid: false, discount: 0, message: "Bu kuponun süresi doldu." };
  }
  if (coupon.max_uses !== null && coupon.used_count >= coupon.max_uses) {
    return { valid: false, discount: 0, message: "Bu kupon kullanım limitine ulaştı." };
  }
  if (subtotal < coupon.min_order_total) {
    return {
      valid: false,
      discount: 0,
      message: `Bu kupon en az ₺${coupon.min_order_total.toLocaleString("tr-TR")} sepet tutarında geçerlidir.`,
    };
  }

  const raw = coupon.type === "fixed" ? coupon.value : subtotal * (coupon.value / 100);
  const discount = Math.min(Math.round(raw * 100) / 100, subtotal);

  return {
    valid: true,
    discount,
    message: coupon.type === "fixed"
      ? `₺${discount.toLocaleString("tr-TR")} indirim uygulandı.`
      : `%${coupon.value} indirim uygulandı.`,
  };
}
