# Joetech Shops — multi-tenant storefront SaaS for Nigerian small businesses

Every small business gets its own online shop: products, WhatsApp ordering,
Paystack card payments (with split payments to the seller's own account), and
a dashboard. Buyers pick their state and see shops near them first.

**Core rule:** a shop's products are visible to customers ONLY after the owner
creates an account. No account → no shop → no products listed anywhere.
Account + shop creation is all it takes for products to go live — no manual
approval step.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- Supabase — Postgres + Auth + Storage (product images)
- Paystack — card payments + split payments (subaccounts)
- Resend — order confirmation + seller notification emails (optional)
- No external fonts (system fonts only, for speed)

## Run it with zero setup (demo mode)

```bash
npm install
npm run dev
```

Open http://localhost:3000. Without Supabase keys the site runs in **demo
mode**: 6 sample shops (Lagos ×2, Abuja, Kano, Enugu, Port Harcourt) with 18
products, clearly labelled "Demo". Checkout and the dashboard show a
"connect Supabase" notice instead of crashing.

## Full setup

1. **Supabase project** — create one at supabase.com, then in the SQL Editor
   run `supabase/schema.sql` (tables, indexes, RLS). Optionally run
   `supabase/seed.sql` after pasting your real user id into it.
2. **Storage bucket** — Storage → New bucket, name `product-images`, **Public
   bucket ON**. (Public read lets shop pages show photos; uploads go through
   the server-only `/api/upload` route with the service-role key.)
3. **Env vars** — copy `.env.example` to `.env.local` and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server only — never expose it)
   - `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`, `PAYSTACK_SECRET_KEY`
   - `NEXT_PUBLIC_APP_URL` (e.g. https://shops.joetech360.ng)
4. **Paystack webhook** — in your Paystack dashboard add the webhook URL
   `https://YOUR-DOMAIN/api/webhooks/paystack`. Start with **test keys**;
   the webhook verifies the signature and re-verifies every transaction
   with Paystack before marking an order paid.
5. **Resend (order emails — optional)** — create a free account at
   resend.com, verify your sending domain, create an API key, and add
   `RESEND_API_KEY` + `EMAIL_FROM` to `.env.local` (and to Vercel env vars
   when you deploy). After a payment succeeds, the webhook sends the buyer
   an order confirmation and the seller a "new paid order" notification.
   Without the key the app still works — emails are simply skipped.
6. **Run it**
   ```bash
   npm install
   npm run dev     # http://localhost:3000
   npm run build   # production build check
   ```

## Deploy to Vercel

Push the repo to GitHub, import it in Vercel, and set the same env vars in
the Vercel dashboard. Set `NEXT_PUBLIC_APP_URL` to your live domain.

**Before Paystack goes live:** complete the CAC business registration —
Paystack requires a registered business to verify a live account. (Joetech's
name "360 Joetech Ventures" is already reserved; the registration still needs
a business address, commencement date and means of ID.)

## How it works

| Route | What it does |
|---|---|
| `/` | Marketplace: hero, state picker (saved in localStorage), "Shops in your state", all shops (12/page), How it works |
| `/shop/[slug]` | Public storefront: shop header, state/city badge, WhatsApp button, product grid — "Order on WhatsApp" + "Buy now" |
| `/checkout?product=…` | Buyer form (name, phone, email, state, qty) → `/api/checkout` → Paystack |
| `/checkout/success` | Payment confirmation page |
| `/auth/login`, `/auth/signup` | Supabase email + password |
| `/dashboard` | Protected: total paid sales, order count, recent orders |
| `/dashboard/products` | Add/edit/delete products, image upload or image-URL fallback |
| `/dashboard/settings` | Shop name, description, state, city, WhatsApp, Paystack subaccount code, logo |
| `/terms`, `/privacy` | Terms (incl. 5% platform fee) and NDPR-aware privacy policy |
| `/api/checkout` | Server-side only: reads the price from the DB, computes the total, creates a pending order, initialises Paystack |
| `/api/webhooks/paystack` | Verifies `x-paystack-signature` (HMAC-SHA512) AND re-verifies the transaction with Paystack before marking an order paid; then sends the buyer confirmation + seller notification via Resend (never fails the webhook) |
| `/api/upload` | Login + shop-ownership check, images only (JPEG/PNG/WebP ≤ 5 MB), UUID filename, Supabase Storage |

## Security notes

- Checkout never trusts a price or total from the browser — totals are
  computed server-side from the database.
- Split payments: if a shop has a Paystack subaccount code, the transaction
  is initialised with `subaccount` + a 5% `transaction_charge`, so the
  seller's money goes to their own Paystack account.
- Card numbers are never collected or stored — Paystack handles payment
  details on its own pages.
- Row Level Security: shops/products readable by everyone (only when the shop
  has a registered owner); orders readable only by the owning shop's owner;
  writes only by the owner (`auth.uid() = shops.owner_id`). Checkout and
  webhook writes use the service-role key, server-side only.
- All secrets live in env vars only. Never commit `.env.local`.

## Storage & speed

- Product images live in Supabase Storage (CDN), never on Vercel; all images
  use `loading="lazy"`.
- DB indexes on `shops(slug)`, `shops(state)`, `products(shop_id)`,
  `orders(shop_id)`.
- Shop/product lists are paginated (12 per page); nothing loads everything
  at once.

## Project structure

```
src/
  app/            pages + API routes (see table above)
  components/     Header/Footer, ShopCard/ProductCard, StatePicker/ShopsNearYou
  lib/            supabase.ts, paystack.ts, states.ts (36 states + FCT),
                  demo-data.ts (demo mode), shops.ts (data access),
                  format.ts, email.ts (Resend order emails)
supabase/         schema.sql, seed.sql
```
