"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { isConfigured, supabaseBrowser } from "@/lib/supabase";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
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
    const { data, error: authError } = await sb.auth.signUp({ email, password });
    if (authError) {
      setError(authError.message);
      setBusy(false);
      return;
    }
    // If email confirmation is on, the user must confirm first.
    if (data.user && !data.session) {
      setDone(true);
      setBusy(false);
      return;
    }
    router.push("/dashboard/settings");
  }

  if (done) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <div className="rounded-2xl border border-green-200 bg-green-50 p-6">
          <h1 className="text-2xl font-black text-green-950">Check your email</h1>
          <p className="mt-2 text-sm text-green-900">
            We sent a confirmation link to <strong>{email}</strong>. Click it,
            then log in — your shop setup is the first thing you&apos;ll see.
          </p>
          <Link href="/auth/login" className="mt-4 inline-block font-bold text-[#2563EB] underline">
            Go to login →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl font-black text-slate-900">Create your account</h1>
      <p className="mt-2 text-sm text-slate-600">
        Your shop and products only go live after you create an account — that
        is how buyers know every seller here is a real, registered business.
        Already have one?{" "}
        <Link href="/auth/login" className="font-bold text-[#2563EB] underline">
          Log in
        </Link>
      </p>
      {!isConfigured && (
        <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm font-semibold text-amber-900">
          Demo mode: signup needs Supabase. Follow README.md to connect it.
        </p>
      )}
      <form onSubmit={submit} className="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div>
          <label className="text-sm font-bold" htmlFor="email">Email</label>
          <input id="email" required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-[#2563EB] focus:outline-none" />
        </div>
        <div>
          <label className="text-sm font-bold" htmlFor="password">Password (at least 6 characters)</label>
          <input id="password" required type="password" minLength={6} value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-[#2563EB] focus:outline-none" />
        </div>
        {error && <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
        <button type="submit" disabled={busy}
          className="w-full rounded-full bg-[#2563EB] py-3 text-base font-black text-white hover:bg-[#1d4ed8] disabled:opacity-50">
          {busy ? "Creating your account…" : "Create account"}
        </button>
        <p className="text-center text-xs text-slate-500">
          By signing up you agree to our{" "}
          <Link href="/terms" className="underline">Terms</Link> and{" "}
          <Link href="/privacy" className="underline">Privacy Policy</Link>.
        </p>
      </form>
    </div>
  );
}
