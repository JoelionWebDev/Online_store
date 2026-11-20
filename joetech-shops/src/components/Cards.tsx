import Link from "next/link";
import type { Product, Shop } from "@/lib/types";
import { formatNaira } from "@/lib/format";

function PinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.6-6.1c-.3-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.3-.6.8-.8 1-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4 0-.5.1-.7l.4-.5c.1-.2.1-.3 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1.1 2.7c.1.2 1.9 2.9 4.5 4 .6.3 1.1.4 1.5.6.6.2 1.2.2 1.6.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.6-.3Z" />
    </svg>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function StateBadge({
  state,
  city,
  dark,
}: {
  state: string;
  city?: string | null;
  dark?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${
        dark
          ? "bg-white/15 text-white ring-white/30 backdrop-blur"
          : "bg-blue-50 text-[#2563eb] ring-blue-100"
      }`}
    >
      <PinIcon className="h-3.5 w-3.5" />
      {city ? `${city}, ` : ""}
      {state}
    </span>
  );
}

export function ShopCard({ shop, productCount }: { shop: Shop; productCount?: number }) {
  return (
    <Link
      href={`/shop/${shop.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-200 hover:shadow-lift"
    >
      <div className="relative h-44 w-full overflow-hidden bg-blue-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={shop.logo_url ?? `https://picsum.photos/seed/${shop.slug}/600/400`}
          alt={shop.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-[#172554]/55 via-transparent to-transparent"
        />
        {shop.is_demo && (
          <span className="absolute left-3 top-3 rounded-full bg-amber-400 px-2.5 py-1 text-[11px] font-black tracking-wide text-amber-950 shadow">
            DEMO
          </span>
        )}
        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1.5 text-xs font-black text-[#2563eb] opacity-0 shadow-lg backdrop-blur transition-all duration-300 group-hover:opacity-100">
          Visit shop <ArrowIcon className="h-3.5 w-3.5" />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-extrabold leading-snug text-slate-900 transition group-hover:text-[#2563eb]">
            {shop.name}
          </h3>
          <ArrowIcon className="mt-1.5 h-4 w-4 shrink-0 text-slate-300 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-[#2563eb]" />
        </div>
        <p className="mt-1.5 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-600">
          {shop.description}
        </p>
        <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-4">
          <StateBadge state={shop.state} city={shop.city} />
          {typeof productCount === "number" && (
            <span className="text-xs font-semibold text-slate-500">
              {productCount} product{productCount === 1 ? "" : "s"}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export function ProductCard({ product, shop }: { product: Product; shop: Shop }) {
  const whatsappText = encodeURIComponent(
    `Hello ${shop.name}, I want to buy "${product.name}" for ${formatNaira(product.price_kobo)}. Is it available?`,
  );
  const whatsappHref = shop.whatsapp_number
    ? `https://wa.me/${shop.whatsapp_number}?text=${whatsappText}`
    : undefined;
  const inStock = product.stock > 0;

  return (
    <article className="group flex flex-col overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-200 hover:shadow-lift">
      <div className="relative h-48 w-full overflow-hidden bg-blue-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image_url ?? `https://picsum.photos/seed/${product.id}/600/400`}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-[#172554]/35 via-transparent to-transparent"
        />
        {product.category && (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-black tracking-wide text-[#1d4ed8] shadow backdrop-blur">
            {product.category.toUpperCase()}
          </span>
        )}
        {!inStock ? (
          <span className="absolute bottom-3 left-3 rounded-full bg-red-600 px-2.5 py-1 text-[11px] font-black text-white shadow">
            OUT OF STOCK
          </span>
        ) : (
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-black text-emerald-700 shadow backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            IN STOCK
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-base font-extrabold leading-snug text-slate-900">
            {product.name}
          </h3>
          <span className="shrink-0 rounded-full bg-blue-50 px-2.5 py-1 font-display text-base font-extrabold text-[#2563eb] ring-1 ring-blue-100">
            {formatNaira(product.price_kobo)}
          </span>
        </div>
        {product.description && (
          <p className="mt-1.5 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-600">
            {product.description}
          </p>
        )}
        <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-slate-500">
          <StateBadge state={shop.state} city={shop.city} />
          <span className={inStock ? "text-emerald-700" : "text-red-600"}>
            {inStock ? `${product.stock} in stock` : "Out of stock"}
          </span>
        </div>
        <div className="mt-4 flex gap-2">
          {whatsappHref ? (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[#25d366] px-3 py-2.5 text-center text-sm font-bold text-white shadow-md shadow-emerald-500/25 transition hover:-translate-y-0.5 hover:bg-[#1da851]"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Order on WhatsApp
            </a>
          ) : (
            <span className="flex-1 rounded-full bg-slate-200 px-3 py-2.5 text-center text-sm font-bold text-slate-500">
              WhatsApp not set
            </span>
          )}
          <BuyNowButton productId={product.id} disabled={!inStock} />
        </div>
      </div>
    </article>
  );
}

function BuyNowButton({ productId, disabled }: { productId: string; disabled?: boolean }) {
  return (
    <a
      href={`/checkout?product=${productId}`}
      aria-disabled={disabled}
      onClick={disabled ? (e) => e.preventDefault() : undefined}
      className={`flex-1 rounded-full px-3 py-2.5 text-center text-sm font-bold text-white shadow-md transition ${
        disabled
          ? "cursor-not-allowed bg-slate-300 shadow-none"
          : "bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] shadow-blue-600/30 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-600/40"
      }`}
    >
      Buy now
    </a>
  );
}
