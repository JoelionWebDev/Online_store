import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-blue-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2563EB] text-lg font-black text-white">
            J
          </span>
          <span className="text-lg font-black tracking-tight text-slate-900">
            Joetech <span className="text-[#2563EB]">Shops</span>
          </span>
        </Link>
        <nav className="flex items-center gap-2 text-sm font-semibold sm:gap-4">
          <Link href="/" className="hidden text-slate-600 hover:text-[#2563EB] sm:inline">
            Marketplace
          </Link>
          <Link href="/#how-it-works" className="hidden text-slate-600 hover:text-[#2563EB] sm:inline">
            How it works
          </Link>
          <Link
            href="/auth/signup"
            className="rounded-full bg-[#2563EB] px-4 py-2 text-white shadow-sm hover:bg-[#1d4ed8]"
          >
            Open a shop
          </Link>
          <Link
            href="/auth/login"
            className="rounded-full border border-[#2563EB] px-4 py-2 text-[#2563EB] hover:bg-blue-50"
          >
            Log in
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-blue-100 bg-slate-50">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 text-sm sm:grid-cols-3">
        <div>
          <p className="text-base font-black text-slate-900">
            Joetech <span className="text-[#2563EB]">Shops</span>
          </p>
          <p className="mt-2 text-slate-600">
            Every small business in Nigeria deserves a shop online. Open yours
            in minutes, take orders on WhatsApp or Paystack, and get paid
            straight into your own account.
          </p>
        </div>
        <div>
          <p className="font-bold text-slate-900">Sell</p>
          <ul className="mt-2 space-y-1 text-slate-600">
            <li><Link href="/auth/signup" className="hover:text-[#2563EB]">Open a shop</Link></li>
            <li><Link href="/dashboard" className="hover:text-[#2563EB]">Seller dashboard</Link></li>
            <li><Link href="/#how-it-works" className="hover:text-[#2563EB]">How it works</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-bold text-slate-900">Legal</p>
          <ul className="mt-2 space-y-1 text-slate-600">
            <li><Link href="/terms" className="hover:text-[#2563EB]">Terms of service</Link></li>
            <li><Link href="/privacy" className="hover:text-[#2563EB]">Privacy policy</Link></li>
            <li><a href="https://joetech360.ng" className="hover:text-[#2563EB]">Built by Joetech360</a></li>
          </ul>
        </div>
      </div>
      <p className="border-t border-blue-100 py-4 text-center text-xs text-slate-500">
        © 2026 Joetech Shops — Built by Joetech360, Lekki, Lagos.
      </p>
    </footer>
  );
}
