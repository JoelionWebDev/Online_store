import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductsByShop, getShopBySlug } from "@/lib/shops";
import { isConfigured } from "@/lib/supabase";
import { ProductCard, StateBadge } from "@/components/Cards";

// Reads params + searchParams and fetches live shop data per request, so
// this route is allowed to block navigation (no static shell).
export const instant = false;

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

  return (
    <div>
      {!isConfigured && shop.is_demo && (
        <div className="bg-amber-400 px-4 py-2 text-center text-sm font-bold text-amber-950">
          Demo shop — sample products only. Connect Supabase to list real shops.
        </div>
      )}

      {/* Shop header */}
      <section className="border-b border-blue-100 bg-blue-50">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-5 px-4 py-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={shop.logo_url ?? `https://picsum.photos/seed/${shop.slug}/200/200`}
            alt={shop.name}
            loading="lazy"
            className="h-24 w-24 rounded-2xl border-4 border-white object-cover shadow"
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-black tracking-tight text-slate-900">{shop.name}</h1>
              {shop.is_demo && (
                <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[11px] font-black text-amber-950">
                  DEMO
                </span>
              )}
            </div>
            {shop.description && <p className="mt-2 max-w-2xl text-slate-600">{shop.description}</p>}
            <div className="mt-3">
              <StateBadge state={shop.state} city={shop.city} />
            </div>
          </div>
          {whatsappHref && (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#25d366] px-5 py-3 text-sm font-bold text-white shadow hover:opacity-90"
            >
              Chat on WhatsApp
            </a>
          )}
        </div>
      </section>

      {/* Products */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="text-2xl font-black text-slate-900">
          Products ({total})
        </h2>
        {products.length === 0 ? (
          <p className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-6 text-slate-600">
            This shop has no products listed yet.
          </p>
        ) : (
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} shop={shop} />
            ))}
          </div>
        )}
        {totalPages > 1 && (
          <nav className="mt-8 flex items-center justify-center gap-2 text-sm font-bold">
            {page > 1 && (
              <Link
                href={`/shop/${shop.slug}?page=${page - 1}`}
                className="rounded-full border border-slate-300 px-4 py-2 hover:border-[#2563EB] hover:text-[#2563EB]"
              >
                ← Previous
              </Link>
            )}
            <span className="px-2 text-slate-600">Page {page} of {totalPages}</span>
            {page < totalPages && (
              <Link
                href={`/shop/${shop.slug}?page=${page + 1}`}
                className="rounded-full border border-slate-300 px-4 py-2 hover:border-[#2563EB] hover:text-[#2563EB]"
              >
                Next →
              </Link>
            )}
          </nav>
        )}
      </section>
    </div>
  );
}
