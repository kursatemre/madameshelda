# Madame Shelda — E-Ticaret Tamlama Roadmap'i

Bu dosya, 2026-08-09 tarihli denetimde çıkan 15 maddenin üzerinde anlaştığımız
kapsamını ve uygulama sırasını takip etmek için var. Her faz tamamlandıkça
işaretlenecek. Detaylı geçmiş için git commit mesajlarına bakılabilir.

Kaynak denetim: bkz. sohbet geçmişi / 2026-08-09 "E-Ticaret Denetimi" artifact'ı.

## Durum Özeti

- [x] Faz 0 — Site İçeriği admin editörü, mobil admin, gerçek ürün verisi (2026-08-06/07)
- [x] Faz 1 — Bildirim altyapısı (email) (2026-08-09)
- [~] Faz 2 — Güvenlik & sağlamlık — zod + admin kilitleme tamam (2026-08-09), spam/bot koruması (Turnstile) **Cloudflare API token bekleniyor**
- [x] Faz 3 — Yasal sayfalar (2026-08-09)
- [x] Faz 4 — Görünürlük (SEO + analytics) (2026-08-09)
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

## Faz 3 — Yasal Sayfalar ✅
**Madde 3.** Statik değil — admin'den düzenlenebilir, "Sözleşmeler" başlığı altında.

- [x] KVKK Aydınlatma Metni (`/kvkk`)
- [x] Gizlilik Politikası (`/gizlilik-politikasi`)
- [x] Mesafeli Satış Sözleşmesi (`/mesafeli-satis-sozlesmesi`)
- [x] İptal / İade Koşulları (`/iptal-iade`)
- [x] Admin: `/admin/site-icerigi` → "Sözleşmeler" sekmesi
- [x] Footer'a linkler
- ⚠️ **Metinler şablon iskeleti — unvan/vergi no/adres `[Doldurulacak]`
      olarak işaretli, admin panelinden doldurulmalı, yayından önce hukuk
      danışmanına kontrol ettirilmesi önerilir.**

## Faz 4 — Görünürlük ✅
**Madde 7 (eksiksiz), 8 (admin'den bağlanabilir analytics).**

- [x] `sitemap.xml`, `robots.txt` (ürün + workshop slug'ları dinamik)
- [x] Open Graph / Twitter Card meta (root layout + ürün/workshop detay)
- [x] Ürün sayfalarında JSON-LD Product schema
- [x] Admin → Genel ayarlara GA4 Measurement ID, Meta Pixel ID, Search Console
      doğrulama kodu alanları — girilirse siteye otomatik enjekte edilir
      (`(site)/layout.tsx`, `next/script`)
- ⚠️ **GA4/Meta Pixel ID'leri ve arama konsolu kodu admin panelinden
      girilmeden hiçbir şey enjekte edilmez — alanlar boş kaldığı sürece
      pasif. Kullanıcı kendi GA4/Meta hesabından ID'leri alıp
      `/admin/site-icerigi` → Genel'e girmeli.**

## Faz 5 — Büyüme ✅ (kod tamam — migration bekliyor)
**Madde 9, 10, 11.** Madde 11 için ayrıca onay alındı (2026-08-09).

- [x] Newsletter / e-posta toplama — footer formu + `/admin/bulten` (liste, CSV export)
- [x] Kupon / indirim kodu sistemi — `/odeme`'de kod alanı + `/admin/kuponlar`
      (yüzde/sabit tutar, min. sepet tutarı, kullanım limiti, son kullanma tarihi)
- [x] Terk edilmiş sepet hatırlatma maili — sepet + e-posta sessizce sunucuya
      kaydedilir, 2 saat hareketsizlik sonrası günlük cron ile tek seferlik mail
- ⚠️ **`supabase-faz5.sql` production'a henüz uygulanmadı.** Önceki fazlarda
      kullanılan doğrudan Postgres bağlantısı bu oturumda elimde yok (parola
      saklanmadı — bilerek, güvenlik gereği). İki seçenek:
      1) Supabase Dashboard → SQL Editor'e `supabase-faz5.sql` içeriğini
         yapıştırıp çalıştır (en basit, hiçbir kimlik bilgisi paylaşmana
         gerek yok).
      2) Bana yeni bir bağlantı bilgisi verirsen (güvenli şekilde) ben
         uygularım.
      Migration uygulanana kadar **checkout hiçbir şekilde kilitlenmez** —
      `/api/order` kupon/indirim kolonlarını yalnızca gerçekten bir kupon
      uygulandıysa gönderir, o yüzden kuponsuz siparişler migration'dan önce
      de sorunsuz oluşur. Migration çalışana kadar sadece şunlar pasif
      kalır: kupon kodu uygulama, bülten kaydı (form hata gösterir), terk
      sepet takibi (sessizce hiçbir şey kaydetmez). Vercel'de `CRON_SECRET`
      env var'ı opsiyonel — eklemezsen cron yetkilendirmesiz çalışır,
      eklemek istersen `.env.example`'da açıklaması var.

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
