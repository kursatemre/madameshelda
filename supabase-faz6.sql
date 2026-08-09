-- Faz 6 — Üyelik sistemi: siparişleri Supabase Auth kullanıcısına bağlama.
-- Üyelik/oturum yönetimi Supabase Auth'un kendi auth.users tablosunda
-- tutulur — ayrı bir "customers" tablosuna gerek yok, ad/telefon/adres
-- gibi profil bilgileri auth.users.raw_user_meta_data içinde saklanır.

alter table orders add column if not exists user_id uuid references auth.users(id) on delete set null;
create index if not exists orders_user_id_idx on orders(user_id);
