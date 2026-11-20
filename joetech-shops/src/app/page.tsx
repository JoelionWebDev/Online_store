import Link from "next/link";
import { PAGE_SIZE, getShops } from "@/lib/shops";
import { isConfigured } from "@/lib/supabase";
import { ShopCard } from "@/components/Cards";
import { ShopsNearYou, StatePicker } from "@/components/Location";

// This page reads searchParams (pagination) and fetches live shop data per
// request, so it is allowed to block navigation (no static shell).
export const instant = false;

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M4 12.5 9.5 18 20 6.5" />
    </svg>
  );
}

const TRUST_ITEMS = [
  { title: "Free to open", sub: "No card required to start" },
  { title: "5% platform fee", sub: "Only when you sell" },
  { title: "Paystack payments", sub: "Secure checkout for buyers" },
  { title: "WhatsApp orders", sub: "Chat buyers direct" },
];

const CATEGORIES = [
  {
    name: "Fashion",
    blurb: "Ankara, gowns & more",
    href: "/shop/adaeze-fashion-hub",
    img: "/images/shop-fashion.jpg",
  },
  {
    name: "Electronics",
    blurb: "Phones, gadgets & accessories",
    href: "/shop/lekki-gadgets",
    img: "/images/shop-gadgets.jpg",
  },
  {
    name: "Foodstuff",
    blurb: "Yams, grains & fresh produce",
    href: "/shop/zuma-agro-mart",
    img: "/images/shop-produce.jpg",
  },
  {
    name: "Food & Kitchen",
    blurb: "Homemade soups & party packs",
    href: "/shop/nwanyi-kitchen",
    img: "/images/shop-food.jpg",
  },
  {
    name: "Beauty",
    blurb: "Skincare, hair & cosmetics",
    href: "/shop/ph-beauty-store",
    img: "https://picsum.photos/seed/ph-beauty-logo/600/400",
  },
];

const STEPS = [
  {
    n: "1",
    title: "Create your account",
    text: "Sign up with your email, then set up your shop — name, state, city and WhatsApp number. Your products only go live once your account exists.",
  },
  {
    n: "2",
    title: "Add your products",
    text: "Upload photos, set prices in naira and stock levels. Buyers in your state see your shop first.",
  },
  {
    n: "3",
    title: "Get orders & get paid",
    text: "Customers order on WhatsApp or pay with Paystack. With a Paystack subaccount, the money lands in your own account — we keep only a 5% platform fee.",
  },
];

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; state?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? 1) || 1);
  const stateFilter = params.state || undefined;
  const { shops, totalPages, total } = await getShops(page, stateFilter);

  return (
    <div>
      {/* Demo-mode banner: shown only when Supabase is not connected. */}
      {!isConfigured && (
        <div className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 px-4 py-2.5 text-center text-sm font-bold text-amber-950 shadow-sm">
          Demo mode — showing sample shops. Connect Supabase to list real
          shops. (Real shops only appear after the owner creates an account.)
        </div>
      )}

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1e40af] via-[#2563eb] to-[#38bdf8] text-white">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 right-[-8%] h-96 w-96 rounded-full bg-sky-300/40 blur-3xl" />
          <div className="absolute bottom-[-35%] left-[-6%] h-96 w-96 rounded-full bg-amber-400/30 blur-3xl" />
          <div className="absolute inset-0 bg-dots opacity-70" />
        </div>
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-black tracking-wide text-white ring-1 ring-white/30 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              NIGERIA&apos;S MARKETPLACE FOR SMALL BUSINESSES
            </span>
            <h1 className="mt-5 font-display text-[2.7rem] font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
              Sell online in Nigeria. Start today,{" "}
              <span className="bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">
                get paid today.
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-blue-100">
              Open a free shop in minutes, list your products, and take orders
              on WhatsApp or Paystack. Your money goes straight to your own
              account.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/auth/signup"
                className="rounded-full bg-white px-7 py-3.5 font-display text-base font-extrabold text-[#1d4ed8] shadow-xl shadow-blue-900/30 transition hover:-translate-y-0.5 hover:bg-blue-50 hover:shadow-2xl"
              >
                Open your shop — it&apos;s free
              </Link>
              <a
                href="#shops"
                className="rounded-full border-2 border-white/70 px-7 py-3.5 font-display text-base font-extrabold text-white backdrop-blur transition hover:-translate-y-0.5 hover:border-white hover:bg-white/10"
              >
                Shop the marketplace
              </a>
            </div>
            <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-blue-100">
              <li className="flex items-center gap-1.5">
                <CheckIcon className="h-4 w-4 text-emerald-300" /> No card
                required to start
              </li>
              <li className="flex items-center gap-1.5">
                <CheckIcon className="h-4 w-4 text-emerald-300" /> 5% platform
                fee only when you sell
              </li>
            </ul>
          </div>

          <div className="relative animate-fade-up" style={{ animationDelay: "120ms" }}>
            <div className="overflow-hidden rounded-[2rem] shadow-glow ring-1 ring-white/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/hero-seller.jpg"
                alt="A happy Nigerian seller holding up her phone to show her online shop, with parcels ready for delivery"
                fetchPriority="high"
                className="aspect-[3/2] w-full object-cover"
              />
            </div>
            <div className="absolute -left-2 top-6 animate-float rounded-2xl bg-white px-4 py-3 shadow-lift ring-1 ring-blue-100 sm:-left-5">
              <p className="font-display text-lg font-extrabold leading-none text-[#1d4ed8]">
                ₦0 to start
              </p>
              <p className="mt-1 text-xs font-semibold text-slate-500">
                No card required
              </p>
            </div>
            <div className="absolute -bottom-4 right-3 animate-float-slow rounded-2xl bg-white px-4 py-3 shadow-lift ring-1 ring-blue-100 sm:right-6">
              <p className="flex items-center gap-2 font-display text-sm font-extrabold text-slate-900">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#25d366] text-white">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
                    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm4.6 12.1c-.3-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.3-.6.8-.8 1-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4 0-.5.1-.7l.4-.5c.1-.2.1-.3 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1.1 2.7c.1.2 1.9 2.9 4.5 4 .6.3 1.1.4 1.5.6.6.2 1.2.2 1.6.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.6-.3Z" />
                  </svg>
                </span>
                Order on WhatsApp
              </p>
              <p className="mt-1 pl-9 text-xs font-semibold text-slate-500">
                Buyers chat you direct
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b border-blue-100 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 py-6 lg:grid-cols-4">
          {TRUST_ITEMS.map((item) => (
            <div key={item.title} className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 text-[#2563eb] ring-1 ring-blue-100">
                <CheckIcon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-display text-sm font-extrabold text-slate-900">
                  {item.title}
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                  {item.sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="mx-auto max-w-6xl px-4 pt-12">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-black tracking-[0.18em] text-[#2563eb]">
              SHOP BY CATEGORY
            </p>
            <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Find what you need, near you
            </h2>
          </div>
          <a
            href="#shops"
            className="text-sm font-bold text-[#2563eb] hover:underline"
          >
            See all shops →
          </a>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="group relative block h-44 overflow-hidden rounded-[1.5rem] shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cat.img}
                alt={cat.name}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-[#172554]/85 via-[#172554]/25 to-transparent"
              />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="font-display text-base font-extrabold leading-tight text-white">
                  {cat.name}
                </p>
                <p className="mt-0.5 text-xs font-semibold text-blue-100">
                  {cat.blurb}
                </p>
                <p className="mt-2 inline-flex items-center gap-1 text-xs font-black text-amber-300 opacity-0 transition-all duration-300 group-hover:opacity-100">
                  Explore →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* State picker */}
      <section className="mx-auto max-w-6xl px-4 pt-10">
        <StatePicker />
      </section>

      {/* Shops in your state (client-side, from the saved state) */}
      <ShopsNearYou shops={shops} />

      {/* All shops */}
      <section id="shops" className="mx-auto max-w-6xl px-4 pt-12">
        <p className="text-xs font-black tracking-[0.18em] text-[#2563eb]">
          FEATURED SHOPS
        </p>
        <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          Shops on the marketplace
        </h2>
        <p className="mt-2 text-slate-600">
          {total} shop{total === 1 ? "" : "s"} on the marketplace — every one
          owned by a registered seller.
        </p>
        {shops.length === 0 ? (
          <div className="mt-6 rounded-[1.5rem] border border-dashed border-blue-200 bg-gradient-to-br from-blue-50 to-white p-8 text-center shadow-card">
            <p className="font-display text-lg font-extrabold text-slate-900">
              No shops here yet.
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
              Be the first seller in this marketplace — open your free shop
              today.
            </p>
            <Link
              href="/auth/signup"
              className="mt-5 inline-block rounded-full bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] px-6 py-3 text-sm font-black text-white shadow-lg shadow-blue-600/30 transition hover:-translate-y-0.5"
            >
              Open a free shop
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {shops.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>
        )}

        {/* Pagination — 12 shops per page max, never load everything at once */}
        {totalPages > 1 && (
          <nav className="mt-10 flex items-center justify-center gap-2 text-sm font-bold">
            {page > 1 && (
              <Link
                href={`/?page=${page - 1}`}
                className="rounded-full border border-slate-300 bg-white px-5 py-2.5 shadow-sm transition hover:border-[#2563eb] hover:text-[#2563eb]"
              >
                ← Previous
              </Link>
            )}
            <span className="rounded-full bg-blue-50 px-4 py-2.5 text-[#2563eb] ring-1 ring-blue-100">
              Page {page} of {totalPages}
            </span>
            {page < totalPages && (
              <Link
                href={`/?page=${page + 1}`}
                className="rounded-full border border-slate-300 bg-white px-5 py-2.5 shadow-sm transition hover:border-[#2563eb] hover:text-[#2563eb]"
              >
                Next →
              </Link>
            )}
          </nav>
        )}
        <p className="mt-4 text-center text-xs text-slate-400">
          Showing page {page} ({shops.length} of {total} shops, {PAGE_SIZE} per page)
        </p>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mx-auto max-w-6xl px-4 pb-16 pt-16">
        <div className="text-center">
          <p className="text-xs font-black tracking-[0.18em] text-[#2563eb]">
            HOW IT WORKS
          </p>
          <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Selling online in three easy steps
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-slate-600">
            No website skills needed. If you can chat on WhatsApp, you can run
            a shop here.
          </p>
        </div>
        <div className="relative mt-10 grid gap-5 sm:grid-cols-3">
          <div
            aria-hidden
            className="absolute left-[16%] right-[16%] top-9 hidden border-t-2 border-dashed border-blue-200 sm:block"
          />
          {STEPS.map((step) => (
            <div
              key={step.n}
              className="group relative rounded-[1.5rem] border border-blue-100 bg-gradient-to-b from-white to-blue-50/60 p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
            >
              <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#3b82f6] via-[#2563eb] to-[#1e40af] font-display text-lg font-extrabold text-white shadow-lg shadow-blue-600/30 ring-4 ring-white">
                {step.n}
              </span>
              <h3 className="mt-5 font-display text-lg font-extrabold text-slate-900">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {step.text}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/auth/signup"
            className="inline-block rounded-full bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] px-8 py-3.5 font-display text-base font-extrabold text-white shadow-lg shadow-blue-600/30 transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            Open your free shop now
          </Link>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#1e40af] via-[#2563eb] to-[#38bdf8] px-6 py-14 text-center text-white shadow-glow sm:px-12">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute -top-20 left-1/4 h-64 w-64 rounded-full bg-sky-300/40 blur-3xl" />
            <div className="absolute bottom-[-40%] right-[10%] h-64 w-64 rounded-full bg-amber-400/30 blur-3xl" />
            <div className="absolute inset-0 bg-dots opacity-60" />
          </div>
          <div className="relative">
            <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              Ready to sell online?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-blue-100">
              Join the sellers opening shops on Joetech Shops. Set up in
              minutes, share your shop link, and start taking orders today.
            </p>
            <Link
              href="/auth/signup"
              className="mt-8 inline-block rounded-full bg-white px-8 py-3.5 font-display text-base font-extrabold text-[#1d4ed8] shadow-xl shadow-blue-900/30 transition hover:-translate-y-0.5 hover:bg-blue-50"
            >
              Open your shop — it&apos;s free
            </Link>
            <p className="mt-4 text-xs font-semibold text-blue-100">
              No card required · 5% platform fee only when you sell
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
