-- Madame Shelda — Admin Giriş Deneme Kilitleme
-- Supabase Dashboard > SQL Editor'da çalıştırın.

CREATE TABLE IF NOT EXISTS admin_login_attempts (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip          text NOT NULL,
  success     boolean NOT NULL,
  created_at  timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_login_attempts_ip_time
  ON admin_login_attempts (ip, created_at);

ALTER TABLE admin_login_attempts ENABLE ROW LEVEL SECURITY;

-- Bilinçli olarak hiçbir public policy yok — orders/registrations ile aynı
-- desen: RLS açık + policy yok = yalnızca service role (admin API route'ları)
-- erişebilir, anon anahtarla asla okunamaz/yazılamaz.
