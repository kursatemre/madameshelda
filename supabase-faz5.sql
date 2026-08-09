-- Faz 5 — Büyüme: newsletter, kupon sistemi, terk edilmiş sepet hatırlatma
-- Tüm erişim createServiceClient() (service-role) üzerinden yapılır; RLS
-- enabled + policy yok, admin_login_attempts ile aynı desen.

-- 1) Bülten aboneleri
create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
alter table newsletter_subscribers enable row level security;

-- 2) Kuponlar
create table if not exists coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  type text not null default 'percent',
  value numeric not null,
  min_order_total numeric not null default 0,
  max_uses integer,
  used_count integer not null default 0,
  expires_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table coupons enable row level security;

-- 3) Sepet oturumları (terk edilmiş sepet takibi)
create table if not exists cart_sessions (
  id uuid primary key default gen_random_uuid(),
  session_id text not null unique,
  email text,
  items jsonb not null default '[]'::jsonb,
  subtotal numeric not null default 0,
  reminder_sent_at timestamptz,
  converted_at timestamptz,
  last_activity_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
alter table cart_sessions enable row level security;

-- 4) orders: kupon bilgisi
alter table orders add column if not exists coupon_code text;
alter table orders add column if not exists discount_amount numeric not null default 0;
