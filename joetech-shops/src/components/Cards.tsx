import Link from "next/link";
import type { Product, Shop } from "@/lib/types";
import { formatNaira } from "@/lib/format";

export function StateBadge({ state, city }: { state: string; city?: string | null }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-[#2563EB]">
      📍 {city ? `${city}, ` : ""}
      {state}
    </span>
  );
}

export function ShopCard({ shop, productCount }: { shop: Shop; productCount?: number }) {
  return (
    <Link
      href={`/shop/${shop.slug}`}
      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative h-36 w-full overflow-hidden bg-blue-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={shop.logo_url ?? `https://picsum.photos/seed/${shop.slug}/600/400`}
          alt={shop.name}
          loading="lazy"
          className="h-full w-full object-cover transition group-hover:scale-105"
        />
        {shop.is_demo && (
          <span className="absolute left-2 top-2 rounded-full bg-amber-400 px-2 py-0.5 text-[11px] font-black text-amber-950">
            DEMO
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-base font-black leading-snug text-slate-900">{shop.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-slate-600">{shop.description}</p>
        <div className="mt-3 flex items-center justify-between gap-2">
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

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="relative h-44 w-full overflow-hidden bg-blue-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image_url ?? `https://picsum.photos/seed/${product.id}/600/400`}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        {product.stock <= 0 && (
          <span className="absolute left-2 top-2 rounded-full bg-red-600 px-2 py-0.5 text-[11px] font-black text-white">
            OUT OF STOCK
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-black leading-snug text-slate-900">{product.name}</h3>
          <span className="shrink-0 text-base font-black text-[#2563EB]">
            {formatNaira(product.price_kobo)}
          </span>
        </div>
        {product.description && (
          <p className="mt-1 line-clamp-2 text-sm text-slate-600">{product.description}</p>
        )}
        <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-slate-500">
          <StateBadge state={shop.state} city={shop.city} />
          <span>{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</span>
        </div>
        <div className="mt-4 flex gap-2">
          {whatsappHref ? (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 rounded-full bg-[#25d366] px-3 py-2 text-center text-sm font-bold text-white hover:opacity-90"
            >
              Order on WhatsApp
            </a>
          ) : (
            <span className="flex-1 rounded-full bg-slate-200 px-3 py-2 text-center text-sm font-bold text-slate-500">
              WhatsApp not set
            </span>
          )}
          <BuyNowButton productId={product.id} disabled={product.stock <= 0} />
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
      className={`flex-1 rounded-full px-3 py-2 text-center text-sm font-bold text-white ${
        disabled ? "cursor-not-allowed bg-slate-300" : "bg-[#2563EB] hover:bg-[#1d4ed8]"
      }`}
    >
      Buy now
    </a>
  );
}
