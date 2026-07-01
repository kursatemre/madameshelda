-- Supabase Dashboard > SQL Editor'da çalıştırın.

CREATE TABLE IF NOT EXISTS orders (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ref            text UNIQUE NOT NULL,
  full_name      text NOT NULL,
  email          text NOT NULL,
  phone          text NOT NULL,
  address        text NOT NULL,
  city           text NOT NULL,
  note           text,
  items          jsonb NOT NULL DEFAULT '[]',
  total          numeric(10, 2) NOT NULL,
  payment_method text NOT NULL,
  status         text NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at     timestamptz DEFAULT now(),
  updated_at     timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
