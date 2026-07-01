-- Madame Shelda — Varyant kolonunu ekle
-- Supabase Dashboard > SQL Editor'da çalıştırın.

ALTER TABLE products ADD COLUMN IF NOT EXISTS variants jsonb DEFAULT '[]'::jsonb;
