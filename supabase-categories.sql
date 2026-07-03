-- Supabase SQL Editor'da çalıştır

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Site ziyaretçileri kategorileri okuyabilir
CREATE POLICY "Public can read categories"
  ON categories FOR SELECT
  USING (true);

-- Başlangıç kategorileri (isteğe bağlı, admin panelinden ekleyebilirsin)
INSERT INTO categories (name, slug, sort_order) VALUES
  ('Ev & Yaşam', 'ev-yasam', 1),
  ('Mağaza', 'magaza', 2),
  ('Ofis', 'ofis', 3),
  ('Özel Sipariş', 'ozel-siparis', 4)
ON CONFLICT (slug) DO NOTHING;
