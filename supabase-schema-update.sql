-- Madame Shelda — Schema Güncelleme
-- Supabase Dashboard > SQL Editor'da çalıştırın.

-- ─── WORKSHOP IMAGES ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS workshop_images (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url         text NOT NULL,
  caption     text DEFAULT '',
  sort_order  int DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE workshop_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read workshop images"
  ON workshop_images FOR SELECT USING (true);

-- ─── ÜRÜN SEED DATA ──────────────────────────────────────────────────────────
-- Mevcut mock ürünleri veritabanına ekler.
-- Zaten ürün varsa çalıştırmayın (slug unique constraint'e takılır).

INSERT INTO products (slug, title, description, category, price, dimensions, materials, is_available, is_featured) VALUES
('sonbahar-koleksiyonu', 'Sonbahar Koleksiyonu',
 'Sonbaharın zengin renk paleti ilhamıyla tasarlanan bu eser; akçaağaç yapraklarının kızıl-altın tonları, kuru lavanta dalları ve büyük solmuş pembe peonies''lerden oluşuyor. Salon veya giriş holü için ideal büyük format.',
 'ozel', 4800, '80×120 cm', 'Kurutulmuş çiçekler, doğal lifler, ahşap çerçeve (meşe)', true, true),

('beyaz-peonies', 'Beyaz Peonies',
 'Saf beyaz peonies''lerin zarifliğini yaşayan mekânınıza taşıyın. Minimal ve modern iç mekânlar için tasarlanan bu eser, kalıcı bir doğallık hissi yaratır.',
 'ev', 2400, '50×70 cm', 'Kurutulmuş beyaz peonies, beyaz ahşap çerçeve', true, true),

('altin-nisan', 'Altın Nisan',
 'İlkbaharın ilk altın ışıklarından ilham alan bu düzenleme, butik mağaza veya showroom girişleri için tasarlanmıştır.',
 'magaza', 3600, '60×90 cm', 'Kurutulmuş çiçekler, altın sprey, metal çerçeve', true, false),

('ofis-serisi', 'Ofis Serisi',
 'Çalışma ortamınıza doğallık ve huzur katan sade düzenleme. Resepsiyon veya toplantı odaları için idealdir.',
 'ofis', 1800, '40×60 cm', 'Kurutulmuş çiçekler, okaliptüs, kayın çerçeve', false, false),

('bahar-esintisi', 'Bahar Esintisi',
 'Pastel tonlarıyla yatak odası veya oturma odanıza romantik bir hava katan hafif düzenleme.',
 'ev', 2100, '45×65 cm', 'Kurutulmuş çiçekler, örgü tel, beyaz ahşap', true, true),

('lila-romansi', 'Lila Romansi',
 'Özel bir mekân için tasarlanan bu büyük format eser, yoğun lila ve bordo tonlarıyla güçlü bir ifadeye sahip.',
 'ozel', 5200, '90×130 cm', 'Kurutulmuş çiçekler, lif, tel, koyu ahşap', true, false),

('modern-ofis', 'Modern Ofis',
 'Minimalist çizgilerle tasarlanan bu düzenleme, modern ofis ortamlarının estetiğini tamamlar.',
 'ofis', 2800, '50×70 cm', 'Kurutulmuş çiçekler, pamuk dalları, siyah metal', true, false),

('magaza-cephesi', 'Mağaza Cephesi',
 'Butik mağaza girişleri için özel tasarlanan monumental eser, müşterilerinize unutulmaz bir ilk izlenim yaşatır.',
 'magaza', 6500, '100×150 cm', 'Kuru & taze çiçek karışımı, montaj dahil', true, false),

('gunes-cicekleri', 'Güneş Çiçekleri',
 'Sıcak sarı ve turuncu tonlarıyla mutfak veya yemek odanıza neşe katan düzenleme.',
 'ev', 1950, '35×50 cm', 'Kurutulmuş papatya, kuru çiçekler, doğal ahşap', true, false);
