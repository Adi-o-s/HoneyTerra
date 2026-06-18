-- HoneyTerra Row Level Security + triggers.
-- Apply AFTER running the Drizzle migration (npm run db:migrate), in the Supabase
-- SQL editor or via psql. Safe to re-run (drops policies first).

-- ─────────────────────────────────────────────────────────────────────────
-- Helper: is the current user an admin?
-- ─────────────────────────────────────────────────────────────────────────
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ─────────────────────────────────────────────────────────────────────────
-- Auto-create a profile row when a new auth user signs up.
-- ─────────────────────────────────────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (new.id, new.raw_user_meta_data->>'full_name', new.phone)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─────────────────────────────────────────────────────────────────────────
-- Keep updated_at fresh.
-- ─────────────────────────────────────────────────────────────────────────
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

do $$
declare t text;
begin
  foreach t in array array[
    'products','product_variants','profiles','addresses','orders',
    'shipments','sample_requests','reviews','coupons'
  ] loop
    execute format('drop trigger if exists touch_%1$s on public.%1$s;', t);
    execute format(
      'create trigger touch_%1$s before update on public.%1$s
       for each row execute function public.touch_updated_at();', t);
  end loop;
end $$;

-- ─────────────────────────────────────────────────────────────────────────
-- Enable RLS.
-- ─────────────────────────────────────────────────────────────────────────
alter table public.products            enable row level security;
alter table public.product_variants    enable row level security;
alter table public.product_images      enable row level security;
alter table public.categories          enable row level security;
alter table public.product_categories  enable row level security;
alter table public.profiles            enable row level security;
alter table public.addresses           enable row level security;
alter table public.orders              enable row level security;
alter table public.order_items         enable row level security;
alter table public.order_status_history enable row level security;
alter table public.shipments           enable row level security;
alter table public.sample_requests     enable row level security;
alter table public.reviews             enable row level security;
alter table public.coupons             enable row level security;
alter table public.newsletter_subscribers enable row level security;

-- ── Public catalogue: anyone can read; only admins write. ─────────────────
do $$
declare t text;
begin
  foreach t in array array['products','product_variants','product_images','categories','product_categories'] loop
    execute format('drop policy if exists "%1$s_read" on public.%1$s;', t);
    execute format('create policy "%1$s_read" on public.%1$s for select using (true);', t);
    execute format('drop policy if exists "%1$s_admin" on public.%1$s;', t);
    execute format('create policy "%1$s_admin" on public.%1$s for all using (public.is_admin()) with check (public.is_admin());', t);
  end loop;
end $$;

-- ── Profiles: a user sees/edits their own; admins see all. ────────────────
drop policy if exists "profiles_self" on public.profiles;
create policy "profiles_self" on public.profiles
  for select using (id = auth.uid() or public.is_admin());
drop policy if exists "profiles_update_self" on public.profiles;
create policy "profiles_update_self" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

-- ── Addresses: own rows only. ─────────────────────────────────────────────
drop policy if exists "addresses_own" on public.addresses;
create policy "addresses_own" on public.addresses
  for all using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid());

-- ── Orders: own orders; admins all. Items/history/shipments follow order. ─
drop policy if exists "orders_own" on public.orders;
create policy "orders_own" on public.orders
  for select using (user_id = auth.uid() or public.is_admin());
drop policy if exists "orders_admin_write" on public.orders;
create policy "orders_admin_write" on public.orders
  for all using (public.is_admin()) with check (public.is_admin());

do $$
declare t text;
begin
  foreach t in array array['order_items','order_status_history','shipments'] loop
    execute format('drop policy if exists "%1$s_read" on public.%1$s;', t);
    execute format(
      'create policy "%1$s_read" on public.%1$s for select using (
         exists (select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or public.is_admin())));', t);
    execute format('drop policy if exists "%1$s_admin" on public.%1$s;', t);
    execute format('create policy "%1$s_admin" on public.%1$s for all using (public.is_admin()) with check (public.is_admin());', t);
  end loop;
end $$;

-- ── Reviews: anyone reads approved; authors read own; admins all. ─────────
drop policy if exists "reviews_read" on public.reviews;
create policy "reviews_read" on public.reviews
  for select using (status = 'approved' or user_id = auth.uid() or public.is_admin());
drop policy if exists "reviews_insert" on public.reviews;
create policy "reviews_insert" on public.reviews
  for insert with check (user_id = auth.uid());
drop policy if exists "reviews_admin" on public.reviews;
create policy "reviews_admin" on public.reviews
  for all using (public.is_admin()) with check (public.is_admin());

-- ── Sample requests: own + admins; anyone may submit. ─────────────────────
drop policy if exists "samples_read" on public.sample_requests;
create policy "samples_read" on public.sample_requests
  for select using (user_id = auth.uid() or public.is_admin());
drop policy if exists "samples_insert" on public.sample_requests;
create policy "samples_insert" on public.sample_requests
  for insert with check (true);
drop policy if exists "samples_admin" on public.sample_requests;
create policy "samples_admin" on public.sample_requests
  for all using (public.is_admin()) with check (public.is_admin());

-- ── Coupons: read active; admins manage. ─────────────────────────────────
drop policy if exists "coupons_read" on public.coupons;
create policy "coupons_read" on public.coupons for select using (is_active = true or public.is_admin());
drop policy if exists "coupons_admin" on public.coupons;
create policy "coupons_admin" on public.coupons for all using (public.is_admin()) with check (public.is_admin());

-- ── Newsletter: anyone may subscribe; admins read. ───────────────────────
drop policy if exists "newsletter_insert" on public.newsletter_subscribers;
create policy "newsletter_insert" on public.newsletter_subscribers for insert with check (true);
drop policy if exists "newsletter_admin" on public.newsletter_subscribers;
create policy "newsletter_admin" on public.newsletter_subscribers for select using (public.is_admin());

-- Note: orders/order_items are written server-side via the service-role key
-- (bypasses RLS), so no public insert policy is needed for checkout.

-- ─────────────────────────────────────────────────────────────────────────
-- Storage: product images. Public read; admins upload/update/delete.
-- (Admin uploads happen client-side with the user's session — see
--  components/admin/product-images.tsx.)
-- ─────────────────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "product_images_read" on storage.objects;
create policy "product_images_read" on storage.objects
  for select using (bucket_id = 'product-images');

drop policy if exists "product_images_admin_write" on storage.objects;
create policy "product_images_admin_write" on storage.objects
  for insert with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "product_images_admin_update" on storage.objects;
create policy "product_images_admin_update" on storage.objects
  for update using (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "product_images_admin_delete" on storage.objects;
create policy "product_images_admin_delete" on storage.objects
  for delete using (bucket_id = 'product-images' and public.is_admin());
