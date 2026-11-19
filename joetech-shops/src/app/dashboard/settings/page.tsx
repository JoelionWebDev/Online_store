"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { NIGERIAN_STATES } from "@/lib/states";
import { supabaseBrowser } from "@/lib/supabase";
import { slugify } from "@/lib/format";
import type { Shop } from "@/lib/types";

/**
 * Shop settings. Creating the shop is what makes a seller's products
 * visible on the marketplace — and it can only happen here, logged in.
 * owner_id is always the logged-in user's id (enforced by RLS).
 */
export default function SettingsPage() {
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [subaccount, setSubaccount] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

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
      const { data } = await sb
        .from("shops")
        .select("*")
        .eq("owner_id", user.id)
        .maybeSingle();
      const found = (data as Shop | null) ?? null;
      setShop(found);
      if (found) {
        setName(found.name);
        setDescription(found.description ?? "");
        setState(found.state);
        setCity(found.city);
        setWhatsapp(found.whatsapp_number ?? "");
        setSubaccount(found.paystack_subaccount_code ?? "");
        setLogoUrl(found.logo_url ?? "");
      }
      setLoading(false);
    })();
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setNotice("");
    setSaving(true);
    try {
      const sb = supabaseBrowser();
      const { data: sessionData } = await sb!.auth.getSession();
      const user = sessionData.session?.user;
      if (!user) throw new Error("You are not logged in.");
      if (!state) throw new Error("Choose your state — buyers use it to find shops near them.");

      const payload = {
        owner_id: user.id,
        name,
        slug: shop?.slug ?? slugify(name),
        description: description || null,
        state,
        city,
        whatsapp_number: whatsapp.replace(/[^0-9]/g, "") || null,
        paystack_subaccount_code: subaccount.trim() || null,
        logo_url: logoUrl.trim() || null,
      };

      if (shop) {
        const { error: upError } = await sb!.from("shops").update(payload).eq("id", shop.id);
        if (upError) throw new Error(upError.message);
        setNotice("Shop updated. Your public shop page shows the new details.");
      } else {
        const { data, error: insError } = await sb!.from("shops").insert(payload).select().single();
        if (insError) throw new Error(insError.message);
        setShop(data as Shop);
        setNotice("Your shop is live! Add products and buyers in your state will see you.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save shop");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-slate-600">Loading shop settings…</p>;

  return (
    <div>
      <h2 className="text-xl font-black text-slate-900">
        {shop ? "Shop settings" : "Set up your shop"}
      </h2>
      {!shop && (
        <p className="mt-2 max-w-xl text-sm text-slate-600">
          This is the step that puts you on the marketplace. Once you save,
          your shop page goes live at{" "}
          <code className="rounded bg-slate-100 px-1 font-mono">/shop/your-shop-name</code>{" "}
          and any products you add appear to buyers immediately.
        </p>
      )}
      <form onSubmit={save} className="mt-4 max-w-xl space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div>
          <label className="text-sm font-bold" htmlFor="sname">Shop name</label>
          <input id="sname" required value={name} onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Adaeze Fashion Hub"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-[#2563EB] focus:outline-none" />
        </div>
        <div>
          <label className="text-sm font-bold" htmlFor="sdesc">Description</label>
          <textarea id="sdesc" rows={3} value={description} onChange={(e) => setDescription(e.target.value)}
            placeholder="What do you sell?"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-[#2563EB] focus:outline-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-bold" htmlFor="sstate">State</label>
            <select id="sstate" required value={state} onChange={(e) => setState(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-[#2563EB] focus:outline-none">
              <option value="">Select state</option>
              {NIGERIAN_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-bold" htmlFor="scity">City / Area</label>
            <input id="scity" required value={city} onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Lekki"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-[#2563EB] focus:outline-none" />
          </div>
        </div>
        <div>
          <label className="text-sm font-bold" htmlFor="swa">WhatsApp number</label>
          <input id="swa" type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="234 816 709 9131 (country code, no +)"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-[#2563EB] focus:outline-none" />
          <p className="mt-1 text-xs text-slate-500">Buyers use this for &quot;Order on WhatsApp&quot;.</p>
        </div>
        <div>
          <label className="text-sm font-bold" htmlFor="ssub">Paystack subaccount code (optional)</label>
          <input id="ssub" value={subaccount} onChange={(e) => setSubaccount(e.target.value)}
            placeholder="e.g. ACCT_xxxxxxxx"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-[#2563EB] focus:outline-none" />
          <p className="mt-1 text-xs text-slate-500">
            Create a subaccount in your Paystack dashboard and paste its code
            here — then card payments go straight to your own Paystack account
            (platform keeps 5%). Without it, payments go to the platform
            account and are settled manually.
          </p>
        </div>
        <div>
          <label className="text-sm font-bold" htmlFor="slogo">Logo image URL (optional)</label>
          <input id="slogo" type="url" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)}
            placeholder="https://…"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-[#2563EB] focus:outline-none" />
        </div>
        {error && <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
        {notice && <p className="rounded-lg bg-green-50 p-3 text-sm font-semibold text-green-800">{notice}</p>}
        <button type="submit" disabled={saving}
          className="w-full rounded-full bg-[#2563EB] py-3 text-base font-black text-white hover:bg-[#1d4ed8] disabled:opacity-50">
          {saving ? "Saving…" : shop ? "Save changes" : "Create my shop"}
        </button>
        {shop && (
          <p className="text-center text-sm">
            <Link href={`/shop/${shop.slug}`} target="_blank" className="font-bold text-[#2563EB] underline">
              View my public shop →
            </Link>
          </p>
        )}
      </form>
    </div>
  );
}
