"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { NIGERIAN_STATES } from "@/lib/states";
import { formatNaira } from "@/lib/format";
import { isConfigured, supabaseBrowser } from "@/lib/supabase";

/**
 * Buyer checkout form. Collects buyer details only — the price and total
 * are NEVER sent from here. /api/checkout looks the product up in the
 * database and computes the total server-side.
 */
export default function CheckoutForm({ productId }: { productId: string }) {
  const [productName, setProductName] = useState("");
  const [priceKobo, setPriceKobo] = useState<number | null>(null);
  const [qty, setQty] = useState(1);
  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerState, setBuyerState] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [loadingProduct, setLoadingProduct] = useState(true);

  useEffect(() => {
    (async () => {
      if (!productId) {
        setLoadingProduct(false);
        return;
      }
      // In demo mode there is no database to read prices from.
      if (!isConfigured) {
        const { DEMO_PRODUCTS } = await import("@/lib/demo-data");
        const found = DEMO_PRODUCTS.find((p) => p.id === productId);
        if (found) {
          setProductName(found.name);
          setPriceKobo(found.price_kobo);
        }
        setLoadingProduct(false);
        return;
      }
      const sb = supabaseBrowser();
      const { data } = await sb!
        .from("products")
        .select("id,name,price_kobo")
        .eq("id", productId)
        .maybeSingle();
      if (data) {
        setProductName(data.name);
        setPriceKobo(data.price_kobo);
      }
      setLoadingProduct(false);
    })();
  }, [productId]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          qty,
          buyerName,
          buyerPhone,
          buyerEmail,
          buyerState,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Checkout failed");
      window.location.href = data.authorization_url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
      setBusy(false);
    }
  }

  if (!isConfigured) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-6">
          <h1 className="text-2xl font-black text-amber-950">Checkout is not available in demo mode</h1>
          <p className="mt-2 text-sm text-amber-900">
            Connect Supabase and add your Paystack keys (see README.md) to
            enable real checkout. In the meantime you can order this product
            on WhatsApp from the shop page.
          </p>
          <Link href="/" className="mt-4 inline-block font-bold text-[#2563EB] underline">
            ← Back to the marketplace
          </Link>
        </div>
      </div>
    );
  }

  if (loadingProduct) {
    return <p className="mx-auto max-w-lg px-4 py-16 text-slate-600">Loading product…</p>;
  }

  if (!productId || priceKobo === null) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <h1 className="text-2xl font-black">Product not found</h1>
        <Link href="/" className="mt-4 inline-block font-bold text-[#2563EB] underline">
          ← Back to the marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <h1 className="text-3xl font-black text-slate-900">Checkout</h1>
      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-lg font-black">{productName}</p>
        <p className="mt-1 text-slate-600">
          {formatNaira(priceKobo)} × {qty} ={" "}
          <strong className="text-[#2563EB]">{formatNaira(priceKobo * qty)}</strong>
        </p>
        <p className="mt-2 text-xs text-slate-500">
          Price is confirmed by the server at payment time — what you see here
          is only a preview.
        </p>
      </div>

      <form onSubmit={submit} className="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div>
          <label className="text-sm font-bold" htmlFor="buyerName">Your name</label>
          <input id="buyerName" required value={buyerName} onChange={(e) => setBuyerName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-[#2563EB] focus:outline-none" />
        </div>
        <div>
          <label className="text-sm font-bold" htmlFor="buyerPhone">Phone (WhatsApp)</label>
          <input id="buyerPhone" required type="tel" value={buyerPhone} onChange={(e) => setBuyerPhone(e.target.value)}
            placeholder="0803 123 4567"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-[#2563EB] focus:outline-none" />
        </div>
        <div>
          <label className="text-sm font-bold" htmlFor="buyerEmail">Email (for your Paystack receipt)</label>
          <input id="buyerEmail" required type="email" value={buyerEmail} onChange={(e) => setBuyerEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-[#2563EB] focus:outline-none" />
        </div>
        <div>
          <label className="text-sm font-bold" htmlFor="buyerState">Your state</label>
          <select id="buyerState" required value={buyerState} onChange={(e) => setBuyerState(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-[#2563EB] focus:outline-none">
            <option value="">Select your state</option>
            {NIGERIAN_STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-bold" htmlFor="qty">Quantity</label>
          <input id="qty" type="number" min={1} max={99} value={qty}
            onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-[#2563EB] focus:outline-none" />
        </div>
        {error && <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-full bg-[#2563EB] py-3 text-base font-black text-white hover:bg-[#1d4ed8] disabled:opacity-50"
        >
          {busy ? "Redirecting to Paystack…" : `Pay ${formatNaira(priceKobo * qty)} with Paystack`}
        </button>
        <p className="text-center text-xs text-slate-500">
          You pay securely on Paystack. We never see or store your card number.
        </p>
      </form>
    </div>
  );
}
