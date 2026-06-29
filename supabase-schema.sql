-- Madame Shelda Design Art — Supabase SQL Schema
-- Supabase Dashboard > SQL Editor'da çalıştırın.

-- ─── PRODUCTS ────────────────────────────────────────────────────────────────
CREATE TABLE products (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          text UNIQUE NOT NULL,
  title         text NOT NULL,
  description   text,
  category      text NOT NULL,          -- 'tablo' | 'kutu' | 'kapı-süsü' | 'özel' vb.
  price         numeric(10, 2),
  images        text[] DEFAULT '{}',    -- Supabase Storage URL'leri
  dimensions    text,
  materials     text,
  is_available  boolean DEFAULT true,
  is_featured   boolean DEFAULT false,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

-- ─── WORKSHOPS ───────────────────────────────────────────────────────────────
CREATE TABLE workshops (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug           text UNIQUE NOT NULL,
  title          text NOT NULL,
  description    text,
  date           date NOT NULL,
  duration_hours int NOT NULL DEFAULT 3,
  capacity       int NOT NULL DEFAULT 8,
  filled         int NOT NULL DEFAULT 0,
  price          numeric(10, 2) NOT NULL,
  level          text NOT NULL,         -- 'Başlangıç' | 'Orta' | 'İleri'
  location       text DEFAULT 'Soma, Manisa',
  includes       text[],               -- ['Malzemeler dahil', 'İkram' vb.]
  is_active      boolean DEFAULT true,
  created_at     timestamptz DEFAULT now(),
  updated_at     timestamptz DEFAULT now()
);

-- ─── REGISTRATIONS ───────────────────────────────────────────────────────────
CREATE TABLE registrations (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id  uuid NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  full_name    text NOT NULL,
  email        text NOT NULL,
  phone        text NOT NULL,
  notes        text,
  status       text NOT NULL DEFAULT 'pending'
                 CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

-- ─── CONTACT REQUESTS ────────────────────────────────────────────────────────
CREATE TABLE contact_requests (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name    text NOT NULL,
  email        text NOT NULL,
  phone        text,
  subject      text NOT NULL,
  message      text NOT NULL,
  product_slug text,
  status       text NOT NULL DEFAULT 'pending'
                 CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

-- ─── UPDATED_AT TRIGGER ──────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_workshops_updated_at
  BEFORE UPDATE ON workshops
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_registrations_updated_at
  BEFORE UPDATE ON registrations
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_contact_requests_updated_at
  BEFORE UPDATE ON contact_requests
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─── ROW LEVEL SECURITY ───────────────────────────────────────────────────────
-- Public read for products and workshops (site visitors)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read products"
  ON products FOR SELECT USING (true);

CREATE POLICY "Public can read active workshops"
  ON workshops FOR SELECT USING (is_active = true);

-- Only service role can insert/update/delete (API routes use service key)
-- No anon insert policies — all writes go through Next.js API routes with service key.

-- ─── SAMPLE DATA (optional) ──────────────────────────────────────────────────
-- Uncomment to seed example workshops:
/*
INSERT INTO workshops (slug, title, description, date, duration_hours, capacity, price, level) VALUES
  ('baslangic-cicek-sanati', 'Başlangıç Çiçek Sanatı',
   'Çiçek düzenleme sanatına ilk adımınızı atın. Temel teknikler ve renk uyumu.',
   '2025-06-14', 3, 8, 1200, 'Başlangıç'),
  ('dev-cicek-duzenlemeleri', 'Dev Çiçek Düzenlemeleri',
   'Etkileyici büyük ölçekli çiçek tasarımları oluşturmayı öğrenin.',
   '2025-06-21', 4, 6, 1800, 'Orta'),
  ('dogal-boyama-teknikleri', 'Doğal Boyama Teknikleri',
   'Bitkisel boyalar ile kağıt ve kumaş boyama sanatı.',
   '2025-07-05', 5, 6, 2400, 'İleri');
*/
