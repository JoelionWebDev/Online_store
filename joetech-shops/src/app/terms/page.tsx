export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-black text-slate-900">Terms of Service</h1>
      <p className="mt-2 text-sm text-slate-500">Last updated: 19 November 2026</p>
      <div className="mt-6 space-y-5 text-slate-700">
        <p>
          Joetech Shops is a marketplace run by Joetech360 (Lekki, Lagos).
          These terms apply to sellers who open a shop and buyers who order
          through the platform.
        </p>
        <h2 className="text-xl font-black text-slate-900">1. Accounts</h2>
        <p>
          A shop only exists after its owner creates an account. Your shop and
          products become visible to buyers once your account is created — no
          manual approval is needed. You are responsible for keeping your
          login details safe and for everything sold under your shop.
        </p>
        <h2 className="text-xl font-black text-slate-900">2. Platform fee</h2>
        <p>
          Opening a shop and listing products is free. On each completed sale
          paid through Paystack, the platform keeps a <strong>5% fee</strong>.
          If you connect a Paystack subaccount, the buyer&apos;s payment is
          split automatically: 95% goes to your Paystack account and 5% to the
          platform. Paystack&apos;s own transaction charges apply on top and
          are deducted by Paystack.
        </p>
        <h2 className="text-xl font-black text-slate-900">3. Payments</h2>
        <p>
          Card payments are processed by Paystack. We never see or store card
          numbers. An order is only marked paid after our server verifies the
          payment with Paystack. WhatsApp orders are agreed directly between
          buyer and seller; the platform is not a party to those sales.
        </p>
        <h2 className="text-xl font-black text-slate-900">4. Seller duties</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>List only products you actually have and can deliver.</li>
          <li>Keep prices, stock and your state/city accurate.</li>
          <li>Do not sell illegal, counterfeit or unsafe goods.</li>
          <li>Respond to buyers promptly and honour agreed delivery or pickup.</li>
        </ul>
        <h2 className="text-xl font-black text-slate-900">5. Buyer duties</h2>
        <p>
          Give accurate contact details at checkout. If a product is not as
          described, contact the seller first; if you cannot agree, email us
          at info@joetech360.ng and we will help mediate.
        </p>
        <h2 className="text-xl font-black text-slate-900">6. Liability</h2>
        <p>
          We provide the platform as-is. Sellers are responsible for their
          products and deliveries; the platform&apos;s liability for any order
          is limited to the 5% platform fee collected on that order.
        </p>
        <h2 className="text-xl font-black text-slate-900">7. Changes &amp; closure</h2>
        <p>
          We may update these terms and will post the new version here. Either
          side may close a shop at any time; closing your account removes your
          shop and products from the public marketplace.
        </p>
      </div>
    </div>
  );
}
