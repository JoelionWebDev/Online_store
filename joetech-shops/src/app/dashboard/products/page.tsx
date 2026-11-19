"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabase";
import { formatNaira } from "@/lib/format";
import type { Product, Shop } from "@/lib/types";

/**
 * Product management. Login-only (dashboard layout) and RLS-enforced:
 * a seller can only insert/update/delete products on their own shop.
 * Images go through /api/upload (type/size checked, UUID filename,
 * Supabase Storage) — or paste an image URL as a fallback.
 */
export default function ProductsPage() {
  const [shop, setShop] = useState<Shop | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [name, setName] = useState("");
  const [priceNaira, setPriceNaira] = useState("");
  const [stock, setStock] = useState("10");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    const sb = supabaseBrowser();
    if (!sb) {
      setLoading(false);
      return;
    }
    const { data: sessionData } = await sb.auth.getSession();
    const user = sessionData.session?.user;
    if (!user) return;
    const { data: shopData } = await sb
      .from("shops")
      .select("*")
      .eq("owner_id", user.id)
      .maybeSingle();
    setShop((shopData as Shop | null) ?? null);
    if (shopData) {
      const { data } = await sb
        .from("products")
        .select("*")
        .eq("shop_id", shopData.id)
        .order("created_at", { ascending: false });
      setProducts((data ?? []) as Product[]);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function uploadImage(): Promise<string | null> {
    if (!file) return imageUrl || null;
    const sb = supabaseBrowser();
    const { data: sessionData } = await sb!.auth.getSession();
    const token = sessionData.session?.access_token;
    if (!token) throw new Error("You are not logged in.");
    const form = new FormData();
    form.append("file", file);
    form.append("shopId", shop!.id);
    const res = await fetch("/api/upload", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Upload failed");
    return data.url as string;
  }

  async function addProduct(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setNotice("");
    setSaving(true);
    try {
      const sb = supabaseBrowser();
      const finalImage = await uploadImage();
      const priceKobo = Math.round(Number(priceNaira) * 100);
      if (!priceKobo || priceKobo <= 0) throw new Error("Enter a valid price in naira.");
      const { error: insertError } = await sb!
        .from("products")
        .insert({
          shop_id: shop!.id,
          name,
          description: description || null,
          price_kobo: priceKobo,
          stock: Number(stock) || 0,
          category: category || null,
          image_url: finalImage,
        });
      if (insertError) throw new Error(insertError.message);
      setNotice(`"${name}" is live on your shop.`);
      setName(""); setPriceNaira(""); setStock("10"); setCategory("");
      setDescription(""); setImageUrl(""); setFile(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add product");
    } finally {
      setSaving(false);
    }
  }

  async function deleteProduct(id: string, productName: string) {
    if (!confirm(`Delete "${productName}"? This cannot be undone.`)) return;
    const sb = supabaseBrowser();
    const { error: delError } = await sb!.from("products").delete().eq("id", id);
    if (delError) setError(delError.message);
    else await load();
  }

  if (loading) return <p className="text-slate-600">Loading products…</p>;

  if (!shop) {
    return (
      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
        <h2 className="text-xl font-black text-slate-900">Set up your shop first</h2>
        <p className="mt-2 text-sm text-slate-600">
          Products belong to a shop, and a shop belongs to your account. Create
          the shop, then come back here to add products.
        </p>
        <Link href="/dashboard/settings" className="mt-4 inline-block rounded-full bg-[#2563EB] px-5 py-2 text-sm font-black text-white hover:bg-[#1d4ed8]">
          Set up my shop →
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-black text-slate-900">Your products ({products.length})</h2>

      {products.length > 0 && (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <article key={p.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.image_url ?? `https://picsum.photos/seed/${p.id}/600/400`} alt={p.name} loading="lazy" className="h-36 w-full object-cover" />
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-black text-slate-900">{p.name}</h3>
                  <span className="font-black text-[#2563EB]">{formatNaira(p.price_kobo)}</span>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {p.category ?? "No category"} · {p.stock} in stock
                </p>
                <button onClick={() => deleteProduct(p.id, p.name)}
                  className="mt-3 rounded-full border border-red-300 px-3 py-1 text-xs font-bold text-red-600 hover:bg-red-50">
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <h2 className="mt-10 text-xl font-black text-slate-900">Add a product</h2>
      <form onSubmit={addProduct} className="mt-4 max-w-xl space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div>
          <label className="text-sm font-bold" htmlFor="pname">Product name</label>
          <input id="pname" required value={name} onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-[#2563EB] focus:outline-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-bold" htmlFor="pprice">Price (₦)</label>
            <input id="pprice" required type="number" min={1} step="any" value={priceNaira}
              onChange={(e) => setPriceNaira(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-[#2563EB] focus:outline-none" />
          </div>
          <div>
            <label className="text-sm font-bold" htmlFor="pstock">Stock</label>
            <input id="pstock" type="number" min={0} value={stock} onChange={(e) => setStock(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-[#2563EB] focus:outline-none" />
          </div>
        </div>
        <div>
          <label className="text-sm font-bold" htmlFor="pcat">Category</label>
          <input id="pcat" value={category} onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. Fashion, Food, Electronics"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-[#2563EB] focus:outline-none" />
        </div>
        <div>
          <label className="text-sm font-bold" htmlFor="pdesc">Description</label>
          <textarea id="pdesc" rows={3} value={description} onChange={(e) => setDescription(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-[#2563EB] focus:outline-none" />
        </div>
        <div>
          <label className="text-sm font-bold" htmlFor="pfile">Product photo (JPEG/PNG/WebP, max 5 MB)</label>
          <input id="pfile" type="file" accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-[#2563EB] focus:outline-none" />
          <p className="mt-1 text-xs text-slate-500">
            Or paste an image URL instead — it will be used if no file is chosen.
          </p>
          <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://…"
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-[#2563EB] focus:outline-none" />
        </div>
        {error && <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
        {notice && <p className="rounded-lg bg-green-50 p-3 text-sm font-semibold text-green-800">{notice}</p>}
        <button type="submit" disabled={saving}
          className="w-full rounded-full bg-[#2563EB] py-3 text-base font-black text-white hover:bg-[#1d4ed8] disabled:opacity-50">
          {saving ? "Adding…" : "Add product — go live instantly"}
        </button>
      </form>
    </div>
  );
}
