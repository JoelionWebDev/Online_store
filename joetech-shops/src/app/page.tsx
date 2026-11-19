import Link from "next/link";
import { PAGE_SIZE, getShops } from "@/lib/shops";
import { isConfigured } from "@/lib/supabase";
import { ShopCard } from "@/components/Cards";
import { ShopsNearYou, StatePicker } from "@/components/Location";

// This page reads searchParams (pagination) and fetches live shop data per
// request, so it is allowed to block navigation (no static shell).
export const instant = false;

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
        <div className="bg-amber-400 px-4 py-2 text-center text-sm font-bold text-amber-950">
          Demo mode — showing sample shops. Connect Supabase to list real
          shops. (Real shops only appear after the owner creates an account.)
        </div>
      )}

      {/* Hero */}
      <section className="bg-[#2563EB] text-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
          <h1 className="max-w-2xl text-4xl font-black leading-tight tracking-tight sm:text-6xl">
            Sell online in Nigeria. Start today, get paid today.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-blue-100">
            Open a free shop in minutes, list your products, and take orders on
            WhatsApp or Paystack. Your money goes straight to your own account.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/auth/signup"
              className="rounded-full bg-white px-6 py-3 text-base font-black text-[#2563EB] shadow-lg hover:bg-blue-50"
            >
              Open your shop — it&apos;s free
            </Link>
            <a
              href="#shops"
              className="rounded-full border-2 border-white px-6 py-3 text-base font-black text-white hover:bg-white/10"
            >
              Shop the marketplace
            </a>
          </div>
          <p className="mt-4 text-sm font-semibold text-blue-200">
            No card required to start · 5% platform fee only when you sell
          </p>
        </div>
      </section>

      {/* State picker */}
      <section className="mx-auto max-w-6xl px-4 pt-8">
        <StatePicker />
      </section>

      {/* Shops in your state (client-side, from the saved state) */}
      <ShopsNearYou shops={shops} />

      {/* All shops */}
      <section id="shops" className="mx-auto mt-12 max-w-6xl px-4">
        <h2 className="text-2xl font-black text-slate-900">All shops</h2>
        <p className="mt-1 text-sm text-slate-600">
          {total} shop{total === 1 ? "" : "s"} on the marketplace — every one
          owned by a registered seller.
        </p>
        {shops.length === 0 ? (
          <p className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-6 text-slate-600">
            No shops here yet.{" "}
            <Link href="/auth/signup" className="font-bold text-[#2563EB] underline">
              Be the first to open one.
            </Link>
          </p>
        ) : (
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {shops.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>
        )}

        {/* Pagination — 12 shops per page max, never load everything at once */}
        {totalPages > 1 && (
          <nav className="mt-8 flex items-center justify-center gap-2 text-sm font-bold">
            {page > 1 && (
              <Link
                href={`/?page=${page - 1}`}
                className="rounded-full border border-slate-300 px-4 py-2 hover:border-[#2563EB] hover:text-[#2563EB]"
              >
                ← Previous
              </Link>
            )}
            <span className="px-2 text-slate-600">
              Page {page} of {totalPages}
            </span>
            {page < totalPages && (
              <Link
                href={`/?page=${page + 1}`}
                className="rounded-full border border-slate-300 px-4 py-2 hover:border-[#2563EB] hover:text-[#2563EB]"
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
      <section id="how-it-works" className="mx-auto mt-16 max-w-6xl px-4 pb-16">
        <h2 className="text-center text-3xl font-black text-slate-900">How it works</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2563EB] text-xl font-black text-white">1</span>
            <h3 className="mt-4 text-lg font-black text-slate-900">Create your account</h3>
            <p className="mt-2 text-sm text-slate-600">
              Sign up with your email, then set up your shop — name, state,
              city and WhatsApp number. Your products only go live once your
              account exists.
            </p>
          </div>
          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2563EB] text-xl font-black text-white">2</span>
            <h3 className="mt-4 text-lg font-black text-slate-900">Add your products</h3>
            <p className="mt-2 text-sm text-slate-600">
              Upload photos, set prices in naira and stock levels. Buyers in
              your state see your shop first.
            </p>
          </div>
          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2563EB] text-xl font-black text-white">3</span>
            <h3 className="mt-4 text-lg font-black text-slate-900">Get orders &amp; get paid</h3>
            <p className="mt-2 text-sm text-slate-600">
              Customers order on WhatsApp or pay with Paystack. With a
              Paystack subaccount, the money lands in your own account — we
              keep only a 5% platform fee.
            </p>
          </div>
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/auth/signup"
            className="inline-block rounded-full bg-[#2563EB] px-8 py-3 text-base font-black text-white shadow-lg hover:bg-[#1d4ed8]"
          >
            Open your free shop now
          </Link>
        </div>
      </section>
    </div>
  );
}
