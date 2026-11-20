"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { isConfigured, supabaseBrowser } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const sb = supabaseBrowser();
    if (!sb) {
      setError("Supabase is not connected yet. See README.md to connect it.");
      setBusy(false);
      return;
    }
    const { error: authError } = await sb.auth.signInWithPassword({ email, password });
    if (authError) {
      setError(authError.message);
      setBusy(false);
      return;
    }
    router.push("/dashboard");
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white px-4 py-16">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 left-[10%] h-64 w-64 rounded-full bg-blue-200/50 blur-3xl" />
        <div className="absolute bottom-[-30%] right-[5%] h-64 w-64 rounded-full bg-sky-200/50 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-md">
        <div className="rounded-[1.75rem] border border-blue-100 bg-white p-6 shadow-lift sm:p-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3b82f6] via-[#2563eb] to-[#1e40af] font-display text-xl font-extrabold text-white shadow-lg shadow-blue-600/30">
            J
          </div>
          <h1 className="mt-5 text-center font-display text-3xl font-extrabold tracking-tight text-slate-900">
            Log in to your shop
          </h1>
          <p className="mt-2 text-center text-sm text-slate-600">
            No account yet?{" "}
            <Link href="/auth/signup" className="font-bold text-[#2563eb] underline">
              Create one — it&apos;s free
            </Link>
          </p>
          {!isConfigured && (
            <p className="mt-5 rounded-xl bg-amber-50 p-3 text-sm font-semibold text-amber-900 ring-1 ring-amber-100">
              Demo mode: login needs Supabase. Follow README.md to connect it.
            </p>
          )}
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-bold text-slate-800" htmlFor="email">Email</label>
              <input id="email" required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 transition focus:border-[#2563eb] focus:outline-none focus:ring-4 focus:ring-blue-100" />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-800" htmlFor="password">Password</label>
              <input id="password" required type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 transition focus:border-[#2563eb] focus:outline-none focus:ring-4 focus:ring-blue-100" />
            </div>
            {error && <p className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700 ring-1 ring-red-100">{error}</p>}
            <button type="submit" disabled={busy}
              className="w-full rounded-full bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] py-3 font-display text-base font-extrabold text-white shadow-lg shadow-blue-600/30 transition hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50 disabled:hover:translate-y-0">
              {busy ? "Logging in…" : "Log in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
