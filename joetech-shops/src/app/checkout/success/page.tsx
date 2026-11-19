import Link from "next/link";

// Reads the Paystack reference from the URL, so this route is allowed to
// block navigation (no static shell).
export const instant = false;

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string }>;
}) {
  const { reference } = await searchParams;

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
        ✓
      </span>
      <h1 className="mt-4 text-3xl font-black text-slate-900">Thank you — payment received</h1>
      <p className="mt-3 text-slate-600">
        Your order has been placed and the seller has been notified. They will
        contact you on WhatsApp to confirm delivery or pickup.
      </p>
      {reference && (
        <p className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
          Payment reference:{" "}
          <code className="font-mono font-bold text-slate-900">{reference}</code>
        </p>
      )}
      <p className="mt-4 text-xs text-slate-500">
        Your payment is confirmed by our server against Paystack before the
        order is marked paid — keep your reference safe.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-full bg-[#2563EB] px-6 py-3 text-base font-black text-white hover:bg-[#1d4ed8]"
      >
        Continue shopping
      </Link>
    </div>
  );
}
