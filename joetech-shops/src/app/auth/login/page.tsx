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
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl font-black text-slate-900">Log in to your shop</h1>
      <p className="mt-2 text-sm text-slate-600">
        No account yet?{" "}
        <Link href="/auth/signup" className="font-bold text-[#2563EB] underline">
          Create one — it&apos;s free
        </Link>
      </p>
      {!isConfigured && (
        <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm font-semibold text-amber-900">
          Demo mode: login needs Supabase. Follow README.md to connect it.
        </p>
      )}
      <form onSubmit={submit} className="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div>
          <label className="text-sm font-bold" htmlFor="email">Email</label>
          <input id="email" required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-[#2563EB] focus:outline-none" />
        </div>
        <div>
          <label className="text-sm font-bold" htmlFor="password">Password</label>
          <input id="password" required type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-[#2563EB] focus:outline-none" />
        </div>
        {error && <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
        <button type="submit" disabled={busy}
          className="w-full rounded-full bg-[#2563EB] py-3 text-base font-black text-white hover:bg-[#1d4ed8] disabled:opacity-50">
          {busy ? "Logging in…" : "Log in"}
        </button>
      </form>
    </div>
  );
}
