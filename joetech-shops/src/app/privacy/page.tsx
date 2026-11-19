export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-black text-slate-900">Privacy Policy</h1>
      <p className="mt-2 text-sm text-slate-500">Last updated: 19 November 2026</p>
      <div className="mt-6 space-y-5 text-slate-700">
        <p>
          Joetech Shops (operated by Joetech360, Lekki, Lagos) runs a
          marketplace where Nigerian small businesses sell to buyers. This
          policy explains what we collect and why, in line with the Nigeria
          Data Protection Regulation (NDPR).
        </p>
        <h2 className="text-xl font-black text-slate-900">What we collect</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Sellers: email, shop name, state, city, WhatsApp number, and (if provided) a Paystack subaccount code.</li>
          <li>Buyers: name, phone number, email and state, given at checkout so the seller can fulfil the order.</li>
          <li>Orders: items, totals and payment references. We never collect or store card numbers — payments are processed by Paystack on its own secure pages.</li>
        </ul>
        <h2 className="text-xl font-black text-slate-900">How we use it</h2>
        <p>
          Only to run the marketplace: show your shop, take and fulfil orders,
          send receipts, and pay sellers. We do not sell your data to anyone.
          Your state is stored so buyers can find shops near them.
        </p>
        <h2 className="text-xl font-black text-slate-900">Your rights</h2>
        <p>
          Under the NDPR you may ask for a copy of the data we hold about you,
          ask us to correct it, or ask us to delete your account and shop.
          Email <strong>info@joetech360.ng</strong> and we will act within 30 days.
        </p>
        <h2 className="text-xl font-black text-slate-900">Data storage</h2>
        <p>
          Data is stored with Supabase (Postgres) and product images in
          Supabase Storage. Access is protected by Row Level Security: only
          you can see your own orders, and only you can edit your shop.
        </p>
        <h2 className="text-xl font-black text-slate-900">Cookies</h2>
        <p>
          We use only the cookies needed to keep you logged in and to remember
          your chosen state on this device. No advertising trackers.
        </p>
      </div>
    </div>
  );
}
