"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { isConfigured, supabaseBrowser } from "@/lib/supabase";

/**
 * Dashboard shell. Login-only: without a session the seller is sent to
 * /auth/login. No shop or product can be created without signing in first.
 */
export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const sb = supabaseBrowser();
    if (!sb) {
      setChecked(true);
      return;
    }
    sb.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace("/auth/login");
        return;
      }
      setEmail(data.session.user.email ?? "");
      setChecked(true);
    });
  }, [router]);

  async function logout() {
    await supabaseBrowser()?.auth.signOut();
    router.push("/");
  }

  if (!isConfigured) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-6">
          <h1 className="text-2xl font-black text-amber-950">Dashboard needs Supabase</h1>
          <p className="mt-2 text-sm text-amber-900">
            The seller dashboard only works once Supabase is connected (see
            README.md). Connect it, create an account, and your shop setup
            will appear here.
          </p>
          <Link href="/" className="mt-4 inline-block font-bold text-[#2563EB] underline">
            ← Back to the marketplace
          </Link>
        </div>
      </div>
    );
  }

  if (!checked) {
    return <p className="mx-auto max-w-6xl px-4 py-16 text-slate-600">Checking your login…</p>;
  }

  const link = (href: string, label: string) => (
    <Link
      key={href}
      href={href}
      className={`rounded-full px-4 py-2 text-sm font-bold ${
        pathname === href
          ? "bg-[#2563EB] text-white"
          : "text-slate-600 hover:bg-blue-50 hover:text-[#2563EB]"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Seller dashboard</h1>
          {email && <p className="mt-1 text-sm text-slate-600">Signed in as {email}</p>}
        </div>
        <button onClick={logout} className="rounded-full border border-slate-300 px-4 py-2 text-sm font-bold text-slate-600 hover:border-red-400 hover:text-red-600">
          Log out
        </button>
      </div>
      <nav className="mt-6 flex flex-wrap gap-2 border-b border-slate-200 pb-4">
        {link("/dashboard", "Overview")}
        {link("/dashboard/products", "Products")}
        {link("/dashboard/settings", "Shop settings")}
      </nav>
      <div className="mt-6">{children}</div>
    </div>
  );
}
