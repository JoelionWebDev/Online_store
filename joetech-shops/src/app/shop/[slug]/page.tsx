import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductsByShop, getShopBySlug } from "@/lib/shops";
import { isConfigured } from "@/lib/supabase";
import { ProductCard, StateBadge } from "@/components/Cards";

// Reads params + searchParams and fetches live shop data per request, so
// this route is allowed to block navigation (no static shell).
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

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm4.6 12.1c-.3-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.3-.6.8-.8 1-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4 0-.5.1-.7l.4-.5c.1-.2.1-.3 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1.1 2.7c.1.2 1.9 2.9 4.5 4 .6.3 1.1.4 1.5.6.6.2 1.2.2 1.6.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.6-.3Z" />
    </svg>
  );
}

const SAFE_TIPS = [
  "Chat the seller on WhatsApp before you pay.",
  "Pay securely with Paystack and keep your receipt.",
  "Confirm stock and delivery with the seller first.",
];

export default async function ShopPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam ?? 1) || 1);

  const shop = await getShopBySlug(slug);
  if (!shop) notFound();

  const { products, totalPages, total } = await getProductsByShop(shop.id, page);
  const whatsappHref = shop.whatsapp_number
    ? `https://wa.me/${shop.whatsapp_number}?text=${encodeURIComponent(
        `Hello ${shop.name}, I have a question about your shop.`,
      )}`
    : undefined;
  const coverSrc =
    shop.logo_url ?? `https://picsum.photos/seed/${shop.slug}/1200/500`;

  return (
    <div>
      {!isConfigured && shop.is_demo && (
        <div className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 px-4 py-2.5 text-center text-sm font-bold text-amber-950 shadow-sm">
          Demo shop — sample products only. Connect Supabase to list real shops.
        </div>
      )}

      {/* Shop banner */}
      <section className="relative overflow-hidden bg-[#172554]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={coverSrc}
          alt=""
          aria-hidden
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-[#172554] via-[#172554]/55 to-[#172554]/10"
        />
        <div className="relative mx-auto flex max-w-6xl flex-wrap items-end gap-5 px-4 pb-8 pt-16 sm:pt-24">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={shop.logo_url ?? `https://picsum.photos/seed/${shop.slug}/200/200`}
            alt={shop.name}
            loading="lazy"
            className="h-20 w-20 shrink-0 rounded-2xl border-4 border-white object-cover shadow-xl sm:h-24 sm:w-24"
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                {shop.name}
              </h1>
              {shop.is_demo && (
                <span className="rounded-full bg-amber-400 px-2.5 py-1 text-[11px] font-black tracking-wide text-amber-950 shadow">
                  DEMO
                </span>
              )}
            </div>
            {shop.description && (
              <p className="mt-2 max-w-2xl leading-relaxed text-blue-100/90">
                {shop.description}
              </p>
            )}
            <div className="mt-3">
              <StateBadge state={shop.state} city={shop.city} dark />
            </div>
          </div>
          {whatsappHref && (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-2 rounded-full bg-[#25d366] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-900/40 transition hover:-translate-y-0.5 hover:bg-[#1da851] sm:inline-flex"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Chat on WhatsApp
            </a>
          )}
        </div>
      </section>

      {/* Products + sticky seller card */}
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section>
          <div className="flex flex-wrap items-end justify-between gap-2">
            <h2 className="font-display text-2xl font-extrabold tracking-tight text-slate-900">
              Products ({total})
            </h2>
            <p className="text-sm text-slate-500">
              Prices in naira · Pay securely with Paystack
            </p>
          </div>
          {products.length === 0 ? (
            <div className="mt-6 rounded-[1.5rem] border border-dashed border-blue-200 bg-gradient-to-br from-blue-50 to-white p-8 text-center shadow-card">
              <p className="font-display text-lg font-extrabold text-slate-900">
                This shop has no products listed yet.
              </p>
              <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
                Check back soon — or chat the seller on WhatsApp to ask what
                is available.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} shop={shop} />
              ))}
            </div>
          )}
          {totalPages > 1 && (
            <nav className="mt-10 flex items-center justify-center gap-2 text-sm font-bold">
              {page > 1 && (
                <Link
                  href={`/shop/${shop.slug}?page=${page - 1}`}
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
                  href={`/shop/${shop.slug}?page=${page + 1}`}
                  className="rounded-full border border-slate-300 bg-white px-5 py-2.5 shadow-sm transition hover:border-[#2563eb] hover:text-[#2563eb]"
                >
                  Next →
                </Link>
              )}
            </nav>
          )}
        </section>

        {/* Sticky seller card */}
        <aside className="h-fit space-y-5 lg:sticky lg:top-24">
          <div className="rounded-[1.5rem] border border-blue-100 bg-white p-6 shadow-card">
            <p className="text-xs font-black tracking-[0.18em] text-[#2563eb]">
              ABOUT THIS SELLER
            </p>
            <h3 className="mt-2 font-display text-lg font-extrabold text-slate-900">
              {shop.name}
            </h3>
            <div className="mt-3">
              <StateBadge state={shop.state} city={shop.city} />
            </div>
            {shop.description && (
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {shop.description}
              </p>
            )}
            {whatsappHref ? (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 flex items-center justify-center gap-2 rounded-full bg-[#25d366] px-5 py-3 text-sm font-bold text-white shadow-md shadow-emerald-500/25 transition hover:-translate-y-0.5 hover:bg-[#1da851]"
              >
                <WhatsAppIcon className="h-4 w-4" />
                Chat the seller on WhatsApp
              </a>
            ) : (
              <p className="mt-5 rounded-full bg-slate-100 px-5 py-3 text-center text-sm font-bold text-slate-500">
                WhatsApp not set for this shop
              </p>
            )}
            <p className="mt-3 text-center text-xs leading-relaxed text-slate-500">
              Every shop here belongs to a registered seller — products only go
              live after the owner creates an account.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-white p-6 shadow-card">
            <h3 className="font-display text-base font-extrabold text-slate-900">
              Shop with confidence
            </h3>
            <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-slate-600">
              {SAFE_TIPS.map((tip) => (
                <li key={tip} className="flex items-start gap-2">
                  <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-[#1e40af] via-[#2563eb] to-[#38bdf8] p-6 text-white shadow-glow">
            <div aria-hidden className="absolute inset-0 bg-dots opacity-60" />
            <div className="relative">
              <h3 className="font-display text-lg font-extrabold">
                Sell here too?
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-blue-100">
                Open your own free shop and start taking orders today. No card
                required.
              </p>
              <Link
                href="/auth/signup"
                className="mt-4 inline-block rounded-full bg-white px-5 py-2.5 text-sm font-black text-[#1d4ed8] shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50"
              >
                Open a free shop →
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
