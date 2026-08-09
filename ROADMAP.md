# Madame Shelda — E-Ticaret Tamlama Roadmap'i

Bu dosya, 2026-08-09 tarihli denetimde çıkan 15 maddenin üzerinde anlaştığımız
kapsamını ve uygulama sırasını takip etmek için var. Her faz tamamlandıkça
işaretlenecek. Detaylı geçmiş için git commit mesajlarına bakılabilir.

Kaynak denetim: bkz. sohbet geçmişi / 2026-08-09 "E-Ticaret Denetimi" artifact'ı.

## Durum Özeti

- [x] Faz 0 — Site İçeriği admin editörü, mobil admin, gerçek ürün verisi (2026-08-06/07)
- [x] Faz 1 — Bildirim altyapısı (email) (2026-08-09)
- [~] Faz 2 — Güvenlik & sağlamlık — zod + admin kilitleme tamam (2026-08-09), spam/bot koruması (Turnstile) sırada
- [ ] Faz 3 — Yasal sayfalar
- [ ] Faz 4 — Görünürlük (SEO + analytics)
- [ ] Faz 5 — Büyüme (newsletter, kupon, terk edilmiş sepet)
- [ ] Faz 6 — Üyelik sistemi & sipariş takibi
- [ ] Faz 7 — Yorumlar & stok takibi

---

## Faz 1 — Bildirim Altyapısı (Email)
**Madde 1, 2.** Email gönderim altyapısını kur — şablonlar, ortak gönderim
fonksiyonu, mevcut `if (process.env.RESEND_API_KEY)` no-op kalıbı korunur.
**`RESEND_API_KEY` şimdilik bağlanmayacak** — kullanıcı kendi ekleyecek.

- [x] Ortak e-posta gönderim yardımcı fonksiyonu (`src/lib/email/client.ts` + `templates.ts`)
- [x] Sipariş durumu değişince müşteriye mail (`update-status` route'una eklendi)
- [x] Workshop başvuru durumu değişince müşteriye mail (aynı route)
- [ ] (Faz 7 review-hatırlatma maili de bu altyapıyı kullanacak — temel atıldı)

## Faz 2 — Güvenlik & Sağlamlık
**Madde 4, 5, 6.**

- [x] Zod ile API girdi doğrulama (contact, order, workshop-register)
- [x] Admin login deneme sınırı / kilitleme (`admin_login_attempts`, 15dk/5 deneme)
- [ ] Public formlarda spam/bot koruması (Turnstile) — sırada

## Faz 3 — Yasal Sayfalar
**Madde 3.** Statik değil — admin'den düzenlenebilir, "Sözleşmeler" başlığı altında.

- [ ] KVKK Aydınlatma Metni
- [ ] Gizlilik Politikası
- [ ] Mesafeli Satış Sözleşmesi
- [ ] İptal / İade Koşulları
- [ ] Admin: `/admin/sozlesmeler` — her sözleşme için metin alanı (site_settings
      kalıbına benzer, muhtemelen zengin metin/markdown)
- [ ] Footer'a linkler

## Faz 4 — Görünürlük
**Madde 7 (eksiksiz), 8 (admin'den bağlanabilir analytics).**

- [ ] `sitemap.xml`, `robots.txt`
- [ ] Open Graph / Twitter Card meta (tüm sayfalar)
- [ ] Ürün sayfalarında JSON-LD Product schema
- [ ] Admin → Genel ayarlara GA4 Measurement ID, Meta Pixel ID, Search Console
      doğrulama kodu alanları — girilirse siteye otomatik enjekte edilir

## Faz 5 — Büyüme
**Madde 9, 10, (11 — bkz. not).**

- [ ] Newsletter / e-posta toplama (footer + muhtemelen exit-intent ya da sayfa içi)
- [ ] Kupon / indirim kodu sistemi (checkout'a kod alanı, admin'den kupon yönetimi)
- [ ] ⚠️ **Madde 11 (terk edilmiş sepet hatırlatması) — onay listende atlanmıştı,
      diğer her şeyle birlikte "yapalım" dediğin için dahil ettim. Gerek
      görmüyorsan haber ver, çıkaralım.**

## Faz 6 — Üyelik Sistemi & Sipariş Takibi
**Madde 13 (genişletilmiş kapsam).**

- [ ] Müşteri hesabı / üyelik sistemi (kayıt, giriş — Supabase Auth)
- [ ] Üye paneli (sipariş geçmişi, bilgiler)
- [ ] Misafir sipariş takibi — sipariş no ile durum sorgulama (üye olmayanlar için)
- [ ] Footer'a "Sipariş Takip" linki

## Faz 7 — Yorumlar & Stok
**Madde 14 (genişletilmiş kapsam), 15.**

- [ ] Ürün yorum sistemi — yıldız + metin + **görsel yükleme**
- [ ] Admin onayı olmadan yorum yayınlanmaz (moderasyon kuyruğu)
- [ ] Sipariş tamamlandıktan sonra "yorum yap" hatırlatma maili (Faz 1 altyapısını kullanır)
- [ ] Adet bazlı stok takibi (`is_available` boolean yerine/yanında miktar alanı,
      sıfırlanınca otomatik "Tükendi")

---

## Kapsam dışı (bilinçli karar)
- Madde 12 (workshop hatırlatma maili) — **kullanıcı "gerek yok" dedi, yapılmayacak.**
- Medusa'nın çoklu para birimi / çoklu depo / B2B özellikleri — bu ölçekte gereksiz.
