import { z } from "zod";

/** Zod hatasından kullanıcıya gösterilecek ilk, anlaşılır mesajı çıkarır. */
export function firstIssueMessage(result: { error: z.ZodError }): string {
  return result.error.issues[0]?.message ?? "Girdi geçersiz.";
}

export const contactSchema = z.object({
  full_name: z.string().trim().min(2, "Ad soyad en az 2 karakter olmalı."),
  email: z.string().trim().email("Geçerli bir e-posta adresi girin."),
  phone: z.string().trim().min(1).max(30).optional().nullable(),
  subject: z.string().trim().min(2, "Konu boş olamaz."),
  message: z.string().trim().min(5, "Mesaj en az 5 karakter olmalı.").max(4000, "Mesaj çok uzun."),
  product_slug: z.string().trim().optional().nullable(),
});

const cartItemSchema = z.object({
  id: z.string().min(1),
  slug: z.string().optional(),
  title: z.string().trim().min(1, "Ürün adı boş olamaz."),
  price: z.number().nonnegative("Fiyat negatif olamaz."),
  bg: z.string().optional(),
  variantName: z.string().optional(),
  variantHex: z.string().optional(),
});

export const orderSchema = z.object({
  ref: z.string().trim().min(1),
  full_name: z.string().trim().min(2, "Ad soyad en az 2 karakter olmalı."),
  email: z.string().trim().email("Geçerli bir e-posta adresi girin."),
  phone: z.string().trim().min(5, "Geçerli bir telefon numarası girin."),
  address: z.string().trim().min(5, "Adres en az 5 karakter olmalı."),
  city: z.string().trim().min(2, "Şehir boş olamaz."),
  note: z.string().trim().max(1000).optional().nullable(),
  items: z.array(cartItemSchema).min(1, "Sepetiniz boş."),
  total: z.number().nonnegative(),
  payment_method: z.enum(["havale", "whatsapp"]),
  coupon_code: z.string().trim().max(60).optional().nullable(),
  session_id: z.string().trim().max(100).optional().nullable(),
});

export const workshopRegisterSchema = z.object({
  workshop_id: z.string().trim().min(1, "Workshop seçilmedi."),
  full_name: z.string().trim().min(2, "Ad soyad en az 2 karakter olmalı."),
  email: z.string().trim().email("Geçerli bir e-posta adresi girin."),
  phone: z.string().trim().min(5, "Geçerli bir telefon numarası girin."),
  notes: z.string().trim().max(1000).optional().nullable(),
});

export const newsletterSchema = z.object({
  email: z.string().trim().email("Geçerli bir e-posta adresi girin."),
  source: z.string().trim().max(60).optional().nullable(),
});

export const reviewSchema = z.object({
  product_id: z.string().trim().min(1, "Ürün bulunamadı."),
  customer_name: z.string().trim().min(2, "Ad soyad en az 2 karakter olmalı."),
  email: z.string().trim().email("Geçerli bir e-posta adresi girin."),
  rating: z.number().int().min(1, "Puan seçin.").max(5),
  comment: z.string().trim().min(5, "Yorum en az 5 karakter olmalı.").max(2000, "Yorum çok uzun."),
  images: z.array(z.string().trim().url()).max(3, "En fazla 3 fotoğraf ekleyebilirsiniz.").optional(),
});

export const orderLookupSchema = z.object({
  ref: z.string().trim().min(1, "Sipariş numarası girin."),
  email: z.string().trim().email("Geçerli bir e-posta adresi girin."),
});

export const couponValidateSchema = z.object({
  code: z.string().trim().min(1, "Kupon kodu girin.").max(60),
  subtotal: z.number().nonnegative(),
});

const cartSyncItemSchema = z.object({
  id: z.string().min(1),
  slug: z.string().optional(),
  title: z.string().trim().min(1),
  price: z.number().nonnegative(),
  bg: z.string().optional(),
  variantName: z.string().optional(),
  variantHex: z.string().optional(),
});

export const cartSyncSchema = z
  .object({
    session_id: z.string().trim().min(1).max(100),
    items: z.array(cartSyncItemSchema).max(100).optional(),
    subtotal: z.number().nonnegative().optional(),
    email: z.string().trim().email().optional(),
  })
  .refine((v) => v.items !== undefined || v.email !== undefined, {
    message: "items veya email gerekli.",
  });
