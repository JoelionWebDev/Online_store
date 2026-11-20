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

  const inputCls =
    "mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 transition focus:border-[#2563eb] focus:outline-none focus:ring-4 focus:ring-blue-100";
  const labelCls = "text-sm font-bold text-slate-800";

  if (!isConfigured) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white px-4 py-16">
        <div className="relative mx-auto max-w-lg">
          <div className="rounded-[1.75rem] border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-8 shadow-lift">
            <h1 className="font-display text-2xl font-extrabold tracking-tight text-amber-950">
              Checkout is not available in demo mode
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-amber-900">
              Connect Supabase and add your Paystack keys (see README.md) to
              enable real checkout. In the meantime you can order this product
              on WhatsApp from the shop page.
            </p>
            <Link href="/" className="mt-5 inline-block font-bold text-[#2563eb] underline">
              ← Back to the marketplace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loadingProduct) {
    return (
      <div className="bg-gradient-to-b from-blue-50 via-white to-white px-4 py-16">
        <p className="mx-auto max-w-lg text-center text-slate-600">Loading product…</p>
      </div>
    );
  }

  if (!productId || priceKobo === null) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white px-4 py-16">
        <div className="relative mx-auto max-w-lg">
          <div className="rounded-[1.75rem] border border-blue-100 bg-white p-8 text-center shadow-lift">
            <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900">
              Product not found
            </h1>
            <Link href="/" className="mt-5 inline-block font-bold text-[#2563eb] underline">
              ← Back to the marketplace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white px-4 py-12">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 left-[10%] h-64 w-64 rounded-full bg-blue-200/50 blur-3xl" />
        <div className="absolute bottom-[-30%] right-[5%] h-64 w-64 rounded-full bg-sky-200/50 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-lg">
        <h1 className="text-center font-display text-3xl font-extrabold tracking-tight text-slate-900">
          Checkout
        </h1>
        <p className="mt-2 text-center text-sm text-slate-600">
          Pay securely with Paystack — your money goes to the seller.
        </p>

        <div className="mt-6 rounded-[1.5rem] border border-blue-100 bg-white p-6 shadow-card">
          <p className="font-display text-lg font-extrabold text-slate-900">{productName}</p>
          <p className="mt-2 text-slate-600">
            {formatNaira(priceKobo)} × {qty} ={" "}
            <strong className="bg-gradient-to-r from-[#2563eb] to-[#38bdf8] bg-clip-text font-display text-xl font-extrabold text-transparent">
              {formatNaira(priceKobo * qty)}
            </strong>
          </p>
          <p className="mt-2 text-xs leading-relaxed text-slate-500">
            Price is confirmed by the server at payment time — what you see here
            is only a preview.
          </p>
        </div>

        <form onSubmit={submit} className="mt-5 space-y-4 rounded-[1.75rem] border border-blue-100 bg-white p-6 shadow-lift sm:p-7">
          <div>
            <label className={labelCls} htmlFor="buyerName">Your name</label>
            <input id="buyerName" required value={buyerName} onChange={(e) => setBuyerName(e.target.value)}
              className={inputCls} />
          </div>
          <div>
            <label className={labelCls} htmlFor="buyerPhone">Phone (WhatsApp)</label>
            <input id="buyerPhone" required type="tel" value={buyerPhone} onChange={(e) => setBuyerPhone(e.target.value)}
              placeholder="0803 123 4567"
              className={inputCls} />
          </div>
          <div>
            <label className={labelCls} htmlFor="buyerEmail">Email (for your Paystack receipt)</label>
            <input id="buyerEmail" required type="email" value={buyerEmail} onChange={(e) => setBuyerEmail(e.target.value)}
              placeholder="you@example.com"
              className={inputCls} />
          </div>
          <div>
            <label className={labelCls} htmlFor="buyerState">Your state</label>
            <select id="buyerState" required value={buyerState} onChange={(e) => setBuyerState(e.target.value)}
              className={inputCls}>
              <option value="">Select your state</option>
              {NIGERIAN_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls} htmlFor="qty">Quantity</label>
            <input id="qty" type="number" min={1} max={99} value={qty}
              onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
              className={inputCls} />
          </div>
          {error && <p className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700 ring-1 ring-red-100">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] py-3.5 font-display text-base font-extrabold text-white shadow-lg shadow-blue-600/30 transition hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {busy ? "Redirecting to Paystack…" : `Pay ${formatNaira(priceKobo * qty)} with Paystack`}
          </button>
          <p className="text-center text-xs leading-relaxed text-slate-500">
            You pay securely on Paystack. We never see or store your card number.
          </p>
        </form>
      </div>
    </div>
  );
}
