-- Faz 7 — Ürün yorumları (görsel + moderasyon) + adet bazlı stok takibi.

create table if not exists product_reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  customer_name text not null,
  email text not null,
  rating integer not null check (rating between 1 and 5),
  comment text not null,
  images text[] not null default '{}',
  is_approved boolean not null default false,
  created_at timestamptz not null default now()
);
alter table product_reviews enable row level security;
create index if not exists product_reviews_product_id_idx on product_reviews(product_id);

-- Stok: null = sınırsız/takip edilmiyor (mevcut ürünler için varsayılan davranış korunur).
alter table products add column if not exists stock_quantity integer;

-- Sipariş onaylandıktan N gün sonra "yorum yap" hatırlatma maili gönderildi mi.
alter table orders add column if not exists review_reminder_sent_at timestamptz;
