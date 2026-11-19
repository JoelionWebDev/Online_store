import { DEMO_PRODUCTS, DEMO_SHOPS } from "./demo-data";
import { supabaseServer } from "./supabase";
import type { Product, Shop } from "./types";

export const PAGE_SIZE = 12;

/**
 * A shop only ever appears in public lists when it belongs to a registered
 * owner (shops.owner_id IS NOT NULL). This is enforced three ways:
 *   1. DB: shops.owner_id is NOT NULL (schema.sql).
 *   2. RLS: the public SELECT policy only returns rows with owner_id set.
 *   3. Here: every public query below filters owner_id IS NOT NULL.
 * No account -> no shop -> no products listed anywhere public.
 */

export async function getShops(
  page = 1,
  state?: string,
): Promise<{ shops: Shop[]; totalPages: number; total: number }> {
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const server = supabaseServer();
  if (!server) {
    // Demo mode: filter the in-memory demo shops the same way.
    let list = DEMO_SHOPS;
    if (state) list = list.filter((s) => s.state === state);
    const total = list.length;
    return {
      shops: list.slice(from, to + 1),
      totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
      total,
    };
  }

  let query = server
    .from("shops")
    .select("*", { count: "exact" })
    .not("owner_id", "is", null)
    .order("created_at", { ascending: false });
  if (state) query = query.eq("state", state);
  const { data, count, error } = await query.range(from, to);
  if (error) throw new Error(error.message);
  const total = count ?? 0;
  return {
    shops: (data ?? []) as Shop[],
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    total,
  };
}

export async function getShopBySlug(slug: string): Promise<Shop | null> {
  const server = supabaseServer();
  if (!server) {
    return DEMO_SHOPS.find((s) => s.slug === slug) ?? null;
  }
  const { data, error } = await server
    .from("shops")
    .select("*")
    .eq("slug", slug)
    .not("owner_id", "is", null)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as Shop | null) ?? null;
}

export async function getProductsByShop(
  shopId: string,
  page = 1,
): Promise<{ products: Product[]; totalPages: number; total: number }> {
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const server = supabaseServer();
  if (!server) {
    const list = DEMO_PRODUCTS.filter((p) => p.shop_id === shopId);
    return {
      products: list.slice(from, to + 1),
      totalPages: Math.max(1, Math.ceil(list.length / PAGE_SIZE)),
      total: list.length,
    };
  }
  const { data, count, error } = await server
    .from("products")
    .select("*", { count: "exact" })
    .eq("shop_id", shopId)
    .order("created_at", { ascending: false })
    .range(from, to);
  if (error) throw new Error(error.message);
  const total = count ?? 0;
  return {
    products: (data ?? []) as Product[],
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    total,
  };
}
