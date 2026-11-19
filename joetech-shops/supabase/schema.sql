-- Joetech Shops — Supabase schema
-- Run in the Supabase SQL Editor (or `supabase db push`).
--
-- CORE RULE: a shop only exists when its owner has an account.
--   * shops.owner_id is NOT NULL and references auth.users(id).
--   * The public SELECT policies only return rows with owner_id set.
--   * So: no account -> no shop -> no products listed anywhere public.
-- Products go live the moment the owner creates the account + shop;
-- there is no manual approval step.

-- ---------------------------------------------------------------- shops
create table if not exists public.shops (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  slug text not null unique,
  description text,
  state text not null,
  city text not null,
  whatsapp_number text,
  paystack_subaccount_code text,
  logo_url text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------- products
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references public.shops (id) on delete cascade,
  name text not null,
  description text,
  price_kobo integer not null check (price_kobo > 0),
  stock integer not null default 0 check (stock >= 0),
  image_url text,
  category text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------- orders
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references public.shops (id) on delete cascade,
  buyer_name text not null,
  buyer_phone text not null,
  buyer_state text not null,
  items jsonb not null default '[]'::jsonb,
  total_kobo integer not null check (total_kobo > 0),
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'cancelled')),
  paystack_reference text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------- indexes
-- Speed: lookups are always by slug, state or shop_id.
create index if not exists idx_shops_slug on public.shops (slug);
create index if not exists idx_shops_state on public.shops (state);
create index if not exists idx_shops_owner on public.shops (owner_id);
create index if not exists idx_products_shop on public.products (shop_id);
create index if not exists idx_orders_shop on public.orders (shop_id);
create index if not exists idx_orders_reference on public.orders (paystack_reference);

-- ---------------------------------------------------------------- RLS
alter table public.shops enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;

-- SHOPS: anyone may read shops that belong to a registered owner.
-- (owner_id IS NOT NULL is always true in practice, but the policy makes
-- the rule explicit and keeps any future ownerless row invisible.)
create policy "Public can read shops of registered owners"
  on public.shops for select
  using (owner_id is not null);

-- SHOPS: only the owner can insert/update/delete their own shop.
create policy "Owners can insert their own shop"
  on public.shops for insert
  with check (auth.uid() = owner_id);
create policy "Owners can update their own shop"
  on public.shops for update
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);
create policy "Owners can delete their own shop"
  on public.shops for delete
  using (auth.uid() = owner_id);

-- PRODUCTS: anyone may read products, but ONLY when the product's shop
-- belongs to a registered owner. A product on an ownerless shop is invisible.
create policy "Public can read products of registered owners' shops"
  on public.products for select
  using (
    exists (
      select 1 from public.shops s
      where s.id = products.shop_id and s.owner_id is not null
    )
  );

-- PRODUCTS: only the shop owner can write. The check confirms the shop
-- being written to is owned by the logged-in user.
create policy "Owners can insert products on their own shop"
  on public.products for insert
  with check (
    exists (
      select 1 from public.shops s
      where s.id = products.shop_id and s.owner_id = auth.uid()
    )
  );
create policy "Owners can update products on their own shop"
  on public.products for update
  using (
    exists (
      select 1 from public.shops s
      where s.id = products.shop_id and s.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.shops s
      where s.id = products.shop_id and s.owner_id = auth.uid()
    )
  );
create policy "Owners can delete products on their own shop"
  on public.products for delete
  using (
    exists (
      select 1 from public.shops s
      where s.id = products.shop_id and s.owner_id = auth.uid()
    )
  );

-- ORDERS: nobody reads orders through the public API except the owning
-- shop's owner. Checkout inserts go through the service-role key in the
-- API route (which bypasses RLS), and the webhook updates likewise.
create policy "Owners can read their own shop's orders"
  on public.orders for select
  using (
    exists (
      select 1 from public.shops s
      where s.id = orders.shop_id and s.owner_id = auth.uid()
    )
  );
-- No public insert/update/delete policies on orders: writes happen only
-- from the server (checkout + webhook) with the service-role key.

-- ---------------------------------------------------------------- storage
-- Create the product-images bucket in the dashboard (Storage -> New bucket,
-- name "product-images", Public bucket ON), then run:
--   (public read is needed so shop pages can show product photos)
-- The bucket's own policies live under Storage -> Policies. Minimum:
--   * SELECT (public): true  — anyone can view product images
--   * INSERT/UPDATE/DELETE: only via the service-role key (the /api/upload
--     route), never directly from the browser.
