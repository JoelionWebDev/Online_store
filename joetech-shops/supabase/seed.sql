-- Joetech Shops — demo seed data (LOCAL PREVIEW ONLY)
-- ---------------------------------------------------------------------------
-- HOW TO USE:
--   1. Create your account in the app (sign up), then copy your user id from
--      Supabase -> Authentication -> Users (the UUID under "User UID").
--   2. Paste it below in place of PASTE_YOUR_USER_ID_HERE.
--   3. Run this file in the Supabase SQL Editor.
--
-- The seed deliberately requires a REAL user id: on this platform a shop
-- only becomes visible after its owner has an account, so seed shops must
-- belong to a registered user too. Do not run this on a production project
-- with a fake id — those rows would never be shown publicly anyway.
-- ---------------------------------------------------------------------------

-- Replace this with your real Supabase auth user id:
-- (In psql you can also run: \set demo_owner 'your-uuid-here')
-- For the SQL Editor, edit the value in the DO block below.

do $$
declare
  demo_owner uuid := 'PASTE_YOUR_USER_ID_HERE'; -- <-- your real user id
  shop1 uuid := gen_random_uuid();
  shop2 uuid := gen_random_uuid();
begin
  insert into public.shops (id, owner_id, name, slug, description, state, city, whatsapp_number)
  values
    (shop1, demo_owner, 'Adaeze Fashion Hub', 'adaeze-fashion-hub',
     'Ready-to-wear Ankara dresses, gowns and two-piece sets, sewn in Lagos.', 'Lagos', 'Lekki', '2348167099131'),
    (shop2, demo_owner, 'Zuma Agro Mart', 'zuma-agro-mart',
     'Fresh farm produce from Abuja outskirts — yams, grains and vegetables.', 'FCT - Abuja', 'Gwagwalada', '2348167099131');

  insert into public.products (shop_id, name, description, price_kobo, stock, category,
    image_url)
  values
    (shop1, 'Ankara Midi Dress', 'Flared midi dress in bold Ankara print.', 2500000, 12, 'Fashion',
     'https://picsum.photos/seed/ankara-dress/600/400'),
    (shop1, 'Two-Piece Ankara Set', 'Matching top and wide-leg trousers.', 3200000, 8, 'Fashion',
     'https://picsum.photos/seed/ankara-set/600/400'),
    (shop2, 'Bag of Yams (10 tubers)', 'Fresh white yams, medium size.', 1200000, 40, 'Foodstuff',
     'https://picsum.photos/seed/yams/600/400'),
    (shop2, '50kg Bag of Rice', 'Clean long-grain rice, stone-free.', 4800000, 20, 'Foodstuff',
     'https://picsum.photos/seed/rice-bag/600/400');
end $$;
