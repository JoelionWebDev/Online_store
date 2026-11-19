"use client";

import { useEffect, useState } from "react";
import { NIGERIAN_STATES } from "@/lib/states";
import type { Shop } from "@/lib/types";
import { ShopCard } from "./Cards";

const STORAGE_KEY = "joetech-shops-state";

/** State picker saved in localStorage; drives the "near you" section. */
export function StatePicker() {
  const [state, setState] = useState("");

  useEffect(() => {
    setState(localStorage.getItem(STORAGE_KEY) ?? "");
    const onChange = () => setState(localStorage.getItem(STORAGE_KEY) ?? "");
    window.addEventListener("joetech-shops-state-changed", onChange);
    return () => window.removeEventListener("joetech-shops-state-changed", onChange);
  }, []);

  function pick(value: string) {
    setState(value);
    if (value) localStorage.setItem(STORAGE_KEY, value);
    else localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event("joetech-shops-state-changed"));
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <label htmlFor="state-picker" className="text-sm font-bold text-slate-700">
        Where do you live?
      </label>
      <select
        id="state-picker"
        value={state}
        onChange={(e) => pick(e.target.value)}
        className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm focus:border-[#2563EB] focus:outline-none"
      >
        <option value="">All states</option>
        {NIGERIAN_STATES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      {state && (
        <span className="text-sm text-slate-600">
          Showing shops in <strong className="text-[#2563EB]">{state}</strong> first.
        </span>
      )}
    </div>
  );
}

/** "Shops in your state" — reads the saved state and shows matching shops. */
export function ShopsNearYou({ shops }: { shops: Shop[] }) {
  const [state, setState] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const read = () => {
      setState(localStorage.getItem(STORAGE_KEY));
      setReady(true);
    };
    read();
    window.addEventListener("joetech-shops-state-changed", read);
    return () => window.removeEventListener("joetech-shops-state-changed", read);
  }, []);

  if (!ready || !state) return null;
  const near = shops.filter((s) => s.state === state);
  if (near.length === 0) {
    return (
      <section className="mx-auto mt-10 max-w-6xl px-4">
        <h2 className="text-2xl font-black text-slate-900">Shops in {state}</h2>
        <p className="mt-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          No shops in {state} yet — be the first to open one!{" "}
          <a href="/auth/signup" className="font-bold underline">Open a free shop</a>
        </p>
      </section>
    );
  }
  return (
    <section className="mx-auto mt-10 max-w-6xl px-4">
      <h2 className="text-2xl font-black text-slate-900">
        Shops in {state} — near you
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        Buy from sellers in your own state. Faster delivery, easier pickup.
      </p>
      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {near.map((shop) => (
          <ShopCard key={shop.id} shop={shop} />
        ))}
      </div>
    </section>
  );
}
