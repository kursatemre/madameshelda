# Madame Shelda Design Art — Claude Code Başlatma Dökümanı
> OrionSoft.dev · 2025

---

## 1. Proje Özeti

| Alan | Detay |
|---|---|
| Marka Adı | Madame Shelda Design Art |
| Konum | Soma, Manisa, Türkiye |
| Hizmet Alanı | El yapımı dev çiçek tasarımları, özel sipariş, workshop |
| Hedef Kitle | Türkçe konuşan kadınlar, 25–50 yaş, estetik odaklı |
| Birincil Amaç | Marka hikayesi, galeri, workshop başvurusu, özel sipariş |
| E-ticaret | Altyapı hazır ama pasif — ileride aktif edilecek |

---

## 2. Teknik Stack

| Katman | Teknoloji |
|---|---|
| Framework | Next.js 14 (App Router) |
| Dil | TypeScript (strict mode) |
| Veritabanı | Supabase (PostgreSQL) |
| Auth | Supabase Auth (sadece admin) |
| Stil | Tailwind CSS v3 |
| UI Bileşenleri | shadcn/ui |
| Deploy | Vercel |
| Email | Resend (workshop onay + bildirim) |
| Görseller | Supabase Storage |
| Font | Playfair Display (serif) + DM Sans (sans) |

---

## 3. Claude Code Başlatma Promptu

> Aşağıdaki metni olduğu gibi Claude Code'a ilk mesaj olarak yapıştır.

---

```
Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui ve Supabase kullanan
"Madame Shelda Design Art" adlı bir web sitesi projesini sıfırdan kur ve geliştir.

Proje; Soma, Manisa'da faaliyet gösteren, el yapımı dev çiçek tasarımları yapan
"Madame Shelda Design Art" markası için kurumsal bir sitedir.

E-ticaret altyapısı hazır ama şimdilik aktif değil.
Workshop başvuru sistemi Supabase tabanlı olacak.
Tüm metinler ve UI Türkçe olacak.
Tasarım mobil öncelikli (mobile-first) olacak.

Bu dökümanı baştan sona oku, anla ve adım adım uygula.
Başlamadan önce klasör yapısını, Supabase şemasını ve tüm bağımlılıkları hazırla.
Her adımda ne yaptığını kısaca açıkla.
```

---

### Kurulum Komutları

```bash
npx create-next-app@latest madame-shelda \
  --typescript --tailwind --eslint --app --src-dir --import-alias '@/*'

cd madame-shelda

npx shadcn@latest init

npm install @supabase/supabase-js @supabase/ssr resend next-themes lucide-react

npx shadcn@latest add sheet drawer card badge carousel button input textarea toast
```

---

## 4. Klasör Yapısı

```
src/
  app/
    (site)/                       # Public sayfa grubu
      page.tsx                    # Ana sayfa (/)
      galeri/page.tsx             # Eser galerisi
      eser/[slug]/page.tsx        # Eser detay
      workshoplar/page.tsx        # Workshop listesi
      workshop/[slug]/page.tsx    # Workshop detay
      hakkimizda/page.tsx
      iletisim/page.tsx
    admin/                        # Şifre korumalı admin
      dashboard/page.tsx
      eserler/page.tsx
      workshoplar/page.tsx
      basvurular/page.tsx
    api/
      contact/route.ts            # Özel sipariş formu
      workshop-register/route.ts  # Workshop başvurusu
  components/
    layout/                       # Header, Footer, MobileNav
    home/                         # Hero, FeaturedGallery, WorkshopTeaser
    gallery/                      # GalleryGrid, GalleryCard, FilterBar
    workshop/                     # WorkshopCard, WorkshopDrawer
    shared/                       # OrderDrawer, Toast, Badge
  lib/
    supabase/                     # client.ts, server.ts, middleware.ts
    utils.ts
  types/                          # Database types (supabase gen)
```

---

## 5. Supabase Veritabanı Şeması

### `products` — Eserler

| Kolon | Tip | Nullable | Açıklama |
|---|---|---|---|
| id | uuid PK | hayır | gen_random_uuid() |
| slug | text UNIQUE | hayır | URL için benzersiz |
| title | text | hayır | Eser adı |
| description | text | evet | Açıklama |
| price | numeric(10,2) | evet | Fiyat (gösterim) |
| category | text | hayır | ev / magaza / ofis / ozel |
| images | text[] | hayır | Supabase Storage URL dizisi |
| featured | boolean | hayır | default false |
| active | boolean | hayır | default true |
| created_at | timestamptz | hayır | now() |

### `workshops` — Workshoplar

| Kolon | Tip | Nullable | Açıklama |
|---|---|---|---|
| id | uuid PK | hayır | gen_random_uuid() |
| slug | text UNIQUE | hayır | URL |
| title | text | hayır | Workshop adı |
| description | text | evet | İçerik açıklaması |
| event_date | timestamptz | hayır | Tarih ve saat |
| duration_hours | numeric(3,1) | evet | Süre (saat) |
| price | numeric(10,2) | evet | Katılım ücreti |
| capacity | integer | hayır | Max kontenjan |
| level | text | evet | baslangic / orta / ileri |
| cover_image | text | evet | Kapak görseli URL |
| active | boolean | hayır | default true |
| created_at | timestamptz | hayır | now() |

### `registrations` — Workshop Başvuruları

| Kolon | Tip | Nullable | Açıklama |
|---|---|---|---|
| id | uuid PK | hayır | gen_random_uuid() |
| workshop_id | uuid FK | hayır | workshops.id |
| full_name | text | hayır | Ad soyad |
| email | text | hayır | E-posta |
| phone | text | hayır | Telefon |
| status | text | hayır | pending / confirmed / cancelled |
| notes | text | evet | Katılımcı notu |
| created_at | timestamptz | hayır | now() |

### `contact_requests` — Özel Sipariş Talepleri

| Kolon | Tip | Nullable | Açıklama |
|---|---|---|---|
| id | uuid PK | hayır | gen_random_uuid() |
| product_id | uuid FK | evet | İlgili eser (opsiyonel) |
| full_name | text | hayır | Ad soyad |
| email | text | hayır | E-posta |
| phone | text | hayır | Telefon |
| message | text | evet | Müşteri notu |
| status | text | hayır | new / in_progress / closed |
| created_at | timestamptz | hayır | now() |

### RLS Politikaları

- `products` ve `workshops`: SELECT herkese açık (anon key ile okunabilir)
- `registrations` ve `contact_requests`: INSERT herkese açık, SELECT/UPDATE/DELETE sadece authenticated (admin)
- Tüm tablolarda RLS aktif olsun

---

## 6. Tasarım Sistemi

### Renk Paleti — `tailwind.config.ts`

```ts
colors: {
  cream:  { DEFAULT: '#fdf8f3', dark: '#f0e8dc' },
  gold:   { DEFAULT: '#a07850', light: '#d4b896', dark: '#7a5c3e' },
  brown:  { DEFAULT: '#2c1f14', light: '#5a3e2b', dark: '#1a1108' },
  sand:   { DEFAULT: '#e8d5bc', light: '#f5e6d0', dark: '#c9b49a' },
}
```

### Font Kurulumu — `app/layout.tsx`

```ts
import { Playfair_Display, DM_Sans } from 'next/font/google'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  style: ['normal', 'italic'],
  weight: ['400', '500'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500'],
})
```

### Tipografi Kuralları

- **Başlıklar (h1–h3):** `font-serif italic` — Playfair Display
- **Body ve UI:** `font-sans` — DM Sans, `font-light` (300) veya `font-normal` (400)
- **Etiketler ve butonlar:** `uppercase tracking-widest text-xs`
- **Fiyatlar ve ikincil metinler:** `text-gold-dark`

---

## 7. Kritik Bileşen Direktifleri

### MobileNav — shadcn `Sheet`
- Sağdan açılan Sheet bileşeni
- İçinde: Logo, nav linkleri (Playfair italic, büyük boy), en altta Instagram ikonu
- Overlay'e tıklanınca kapanır

### OrderDrawer & WorkshopDrawer — shadcn `Drawer`
- Ekranın altından yukarı kayarak açılır (vaul tabanlı Drawer)
- Üstte handle bar, başlık + alt başlık
- Form alanları: underline-only style (`border-b`, box border yok)
- Submit sonrası: Drawer kapanır, shadcn Toast gösterilir
- WorkshopDrawer'da Supabase'den canlı kontenjan çek; dolarsa buton `disabled` + "Kontenjan dolmuştur" mesajı

### Galeri Filtresi
- Sticky, yatay kaydırmalı pill/tab bar
- Kategoriler: `Tümü / Ev / Mağaza / Ofis / Özel Sipariş`
- URL query param ile senkronize (`?kategori=ev`)

### Eser Detay Sayfası
- Üstte tam genişlik görsel
- Sayfa altında sticky `Sipariş İçin İletişime Geç` butonu
- Butona tıklayınca OrderDrawer açılır

---

## 8. API Route Direktifleri

### `POST /api/workshop-register`

```
1. Body: { workshop_id, full_name, email, phone }
2. Supabase'den kontenjanı kontrol et: capacity - mevcut kayıt sayısı
3. Kontenjan doluysa: 400 + "Kontenjan dolmuştur" mesajı döndür
4. Kayıt oluştur (status: 'pending')
5. Resend ile admin'e bildirim maili gönder
6. 200 döndür
```

### `POST /api/contact`

```
1. Body: { full_name, email, phone, message, product_id? }
2. Supabase contact_requests tablosuna kaydet (status: 'new')
3. Resend ile admin'e bildirim maili gönder
4. 200 döndür
```

---

## 9. Environment Variables

`.env.local` dosyasına ekle:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
RESEND_API_KEY=re_xxx...
ADMIN_EMAIL=admin@madshelda.com
ADMIN_PASSWORD=xxxx
NEXT_PUBLIC_SITE_URL=https://madshelda.com
```

---

## 10. Geliştirme Sırası

| Adım | Kapsam | Süre |
|---|---|---|
| 1 | Proje kurulum, Tailwind config, font entegrasyonu, Supabase bağlantısı, DB şema | 0.5 gün |
| 2 | Layout: Header (sticky), Footer, MobileNav (Sheet), tema renkleri | 0.5 gün |
| 3 | Ana Sayfa: Hero, Öne Çıkan Eserler carousel, Workshop teaser, CTA banner | 1 gün |
| 4 | Galeri sayfası: filtreleme, grid, kart bileşenleri | 1 gün |
| 5 | Eser Detay: görsel, bilgi, sabit alt buton, OrderDrawer | 0.5 gün |
| 6 | Workshop listesi ve detay sayfası, WorkshopDrawer, kontenjan kontrolü | 1 gün |
| 7 | API Route'ları: workshop-register, contact — Supabase + Resend | 0.5 gün |
| 8 | Admin panel: eser/workshop CRUD, başvuru listesi, onay aksiyonu | 1.5 gün |
| 9 | Hakkımızda, İletişim sayfaları | 0.5 gün |
| 10 | SEO (metadata), OG images, performans, Vercel deploy | 0.5 gün |

**Toplam tahmini süre: 7–8 iş günü**

---

## 11. Önemli Notlar

- **E-ticaret:** Sepet ve ödeme akışı şimdilik YOK. Ürünlerde fiyat gösterilir, "Satın Al" butonu sipariş formuna yönlendirir. Stripe/iyzico entegrasyonu için `products` tablosu hazır bekliyor.
- **Dil:** Site tamamen Türkçe. Tüm bileşen metinleri ve hata mesajları Türkçe olmalı.
- **Görseller:** Gerçek fotoğraflar yokken placeholder kullan (aspect-ratio korunmalı). Supabase Storage bucket adı: `madame-shelda`.
- **Mobile First:** Tüm bileşenler mobil öncelikli tasarlanmalı. Drawer'lar modal'ın yerini alır.
- **Admin Panel:** Basit, şifre korumalı Next.js sayfaları yeterli. Harici CMS gerekmez.
- **Type Safety:** Supabase CLI ile type üret:
  ```bash
  npx supabase gen types typescript --linked > src/types/database.ts
  ```

---

*Madame Shelda Design Art · OrionSoft.dev tarafından hazırlanmıştır*
