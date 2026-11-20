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
    <div className="flex flex-col gap-3 rounded-[1.5rem] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-white p-5 shadow-card sm:flex-row sm:items-center">
      <label
        htmlFor="state-picker"
        className="flex shrink-0 items-center gap-2 font-display text-base font-extrabold text-slate-900"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] text-white shadow-md shadow-blue-600/30">
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4.5 w-4.5" aria-hidden>
            <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
          </svg>
        </span>
        Where do you live?
      </label>
      <select
        id="state-picker"
        value={state}
        onChange={(e) => pick(e.target.value)}
        className="w-full rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition focus:border-[#2563eb] focus:outline-none focus:ring-4 focus:ring-blue-100 sm:w-auto sm:min-w-56"
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
          Showing shops in <strong className="text-[#2563eb]">{state}</strong> first.
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
        <h2 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          Shops in {state}
        </h2>
        <p className="mt-3 rounded-[1.5rem] border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-5 text-sm leading-relaxed text-amber-900 shadow-card">
          No shops in {state} yet — be the first to open one!{" "}
          <a href="/auth/signup" className="font-bold text-[#2563eb] underline">
            Open a free shop
          </a>
        </p>
      </section>
    );
  }
  return (
    <section className="mx-auto mt-12 max-w-6xl px-4">
      <h2 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
        Shops in {state} — near you
      </h2>
      <p className="mt-2 text-slate-600">
        Buy from sellers in your own state. Faster delivery, easier pickup.
      </p>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {near.map((shop) => (
          <ShopCard key={shop.id} shop={shop} />
        ))}
      </div>
    </section>
  );
}
