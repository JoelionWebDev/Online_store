"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabase";
import { formatNaira } from "@/lib/format";
import type { Order, Shop } from "@/lib/types";

export default function DashboardPage() {
  const [shop, setShop] = useState<Shop | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const sb = supabaseBrowser();
    if (!sb) {
      setLoading(false);
      return;
    }
    (async () => {
      const { data: sessionData } = await sb.auth.getSession();
      const user = sessionData.session?.user;
      if (!user) return;
      const { data: shopData, error: shopError } = await sb
        .from("shops")
        .select("*")
        .eq("owner_id", user.id)
        .maybeSingle();
      if (shopError) {
        setError(shopError.message);
        setLoading(false);
        return;
      }
      setShop((shopData as Shop | null) ?? null);
      if (shopData) {
        // RLS: a seller only ever sees their own shop's orders.
        const { data: orderData, error: orderError } = await sb
          .from("orders")
          .select("*")
          .eq("shop_id", shopData.id)
          .order("created_at", { ascending: false })
          .limit(20);
        if (orderError) setError(orderError.message);
        else setOrders((orderData ?? []) as Order[]);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <p className="text-slate-600">Loading your shop…</p>;
  if (error) return <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>;

  if (!shop) {
    return (
      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
        <h2 className="text-xl font-black text-slate-900">You don&apos;t have a shop yet</h2>
        <p className="mt-2 text-sm text-slate-600">
          Set up your shop first — name, state, city and WhatsApp number.
          Once it exists, your products go live on the marketplace.
        </p>
        <Link
          href="/dashboard/settings"
          className="mt-4 inline-block rounded-full bg-[#2563EB] px-5 py-2 text-sm font-black text-white hover:bg-[#1d4ed8]"
        >
          Set up my shop →
        </Link>
      </div>
    );
  }

  const paid = orders.filter((o) => o.status === "paid");
  const totalSales = paid.reduce((sum, o) => sum + o.total_kobo, 0);

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-slate-500">Total sales (paid)</p>
          <p className="mt-1 text-3xl font-black text-[#2563EB]">{formatNaira(totalSales)}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-slate-500">Paid orders</p>
          <p className="mt-1 text-3xl font-black text-slate-900">{paid.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-slate-500">All orders</p>
          <p className="mt-1 text-3xl font-black text-slate-900">{orders.length}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Link href={`/shop/${shop.slug}`} target="_blank" className="rounded-full bg-[#2563EB] px-5 py-2 text-sm font-black text-white hover:bg-[#1d4ed8]">
          View my public shop →
        </Link>
        <Link href="/dashboard/products" className="rounded-full border border-[#2563EB] px-5 py-2 text-sm font-black text-[#2563EB] hover:bg-blue-50">
          Manage products
        </Link>
      </div>

      <h2 className="mt-8 text-xl font-black text-slate-900">Recent orders</h2>
      {orders.length === 0 ? (
        <p className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
          No orders yet. Share your shop link and your first order will show up here.
        </p>
      ) : (
        <div className="mt-3 overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Buyer</th>
                <th className="px-4 py-3">State</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-semibold">{o.buyer_name}<br /><span className="text-xs font-normal text-slate-500">{o.buyer_phone}</span></td>
                  <td className="px-4 py-3">{o.buyer_state}</td>
                  <td className="px-4 py-3">
                    {o.items.map((i) => `${i.name} × ${i.qty}`).join(", ")}
                  </td>
                  <td className="px-4 py-3 font-bold">{formatNaira(o.total_kobo)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs font-black ${
                      o.status === "paid" ? "bg-green-100 text-green-800"
                      : o.status === "cancelled" ? "bg-red-100 text-red-800"
                      : "bg-amber-100 text-amber-800"
                    }`}>
                      {o.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {new Date(o.created_at).toLocaleDateString("en-NG")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
