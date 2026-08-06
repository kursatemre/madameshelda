-- Madame Shelda — Site İçeriği (Site Settings) + Workshop Kapak Görseli
-- Supabase Dashboard > SQL Editor'da çalıştırın.

-- ─── SITE SETTINGS (key/value içerik deposu) ─────────────────────────────────
-- Anasayfa, Hakkımızda, İletişim, Footer/Header, ödeme sayfası gibi "tema"
-- içeriklerini admin panelinden düzenlenebilir kılar. Her satır bir bölümü
-- (ör. "home_hero", "general") temsil eder; şekli src/lib/site-content.ts'te
-- tanımlıdır.
CREATE TABLE IF NOT EXISTS site_settings (
  key         text PRIMARY KEY,
  value       jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at  timestamptz DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read site settings"
  ON site_settings FOR SELECT USING (true);

-- Yazma işlemleri yalnızca service role ile /api/admin/site-content üzerinden yapılır.

-- supabase-schema.sql içinde tanımlı set_updated_at() fonksiyonunu yeniden kullanır.
CREATE TRIGGER trg_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─── WORKSHOP KAPAK GÖRSELİ ───────────────────────────────────────────────────
-- Ürünlerdeki images[] gibi; workshops'ta şimdiye kadar gerçek görsel yoktu.
ALTER TABLE workshops ADD COLUMN IF NOT EXISTS image_url text;
