import Link from "next/link";

function LogoMark({ size = "md" }: { size?: "md" | "lg" }) {
  const box =
    size === "lg" ? "h-11 w-11 rounded-2xl" : "h-10 w-10 rounded-xl";
  return (
    <span
      className={`flex ${box} items-center justify-center bg-gradient-to-br from-[#60a5fa] via-[#2563eb] to-[#1e40af] text-white shadow-lg shadow-blue-600/40 ring-1 ring-white/40`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
        aria-hidden
      >
        <path d="M6 7h12l1.2 13.2a1 1 0 0 1-1 1.1H5.8a1 1 0 0 1-1-1.1L6 7Z" />
        <path d="M9 10V6a3 3 0 0 1 6 0v4" />
      </svg>
    </span>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-blue-100/70 bg-white/85 shadow-[0_1px_0_rgb(37_99_235/0.05)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="group flex items-center gap-2.5">
          <LogoMark />
          <span className="font-display text-lg font-extrabold tracking-tight text-slate-900">
            Joetech{" "}
            <span className="bg-gradient-to-r from-[#2563eb] to-[#38bdf8] bg-clip-text text-transparent">
              Shops
            </span>
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm font-semibold sm:gap-2">
          <Link
            href="/"
            className="hidden rounded-full px-3 py-2 text-slate-600 transition hover:bg-blue-50 hover:text-[#2563eb] sm:inline"
          >
            Marketplace
          </Link>
          <Link
            href="/#categories"
            className="hidden rounded-full px-3 py-2 text-slate-600 transition hover:bg-blue-50 hover:text-[#2563eb] sm:inline"
          >
            Categories
          </Link>
          <Link
            href="/#how-it-works"
            className="hidden rounded-full px-3 py-2 text-slate-600 transition hover:bg-blue-50 hover:text-[#2563eb] md:inline"
          >
            How it works
          </Link>
          <Link
            href="/auth/signup"
            className="rounded-full bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] px-4 py-2 text-white shadow-md shadow-blue-600/30 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-600/40"
          >
            Open a shop
          </Link>
          <Link
            href="/auth/login"
            className="rounded-full border border-blue-200 px-4 py-2 text-[#2563eb] transition hover:border-[#2563eb] hover:bg-blue-50"
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
    <footer className="relative bg-[#0b1e4b] text-blue-100">
      <div
        aria-hidden
        className="h-1 bg-gradient-to-r from-[#38bdf8] via-[#2563eb] to-[#f59e0b]"
      />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-2.5">
            <LogoMark size="lg" />
            <span className="font-display text-lg font-extrabold tracking-tight text-white">
              Joetech{" "}
              <span className="bg-gradient-to-r from-[#60a5fa] to-[#38bdf8] bg-clip-text text-transparent">
                Shops
              </span>
            </span>
          </Link>
          <p className="mt-4 leading-relaxed text-blue-200/80">
            Every small business in Nigeria deserves a shop online. Open yours
            in minutes, take orders on WhatsApp or Paystack, and get paid
            straight into your own account.
          </p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-white ring-1 ring-white/15">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Free to open · No card required
          </p>
        </div>
        <div>
          <p className="font-display font-bold text-white">Shop</p>
          <ul className="mt-3 space-y-2.5 text-blue-200/80">
            <li>
              <Link href="/" className="transition hover:text-white">
                Marketplace
              </Link>
            </li>
            <li>
              <Link href="/#categories" className="transition hover:text-white">
                Categories
              </Link>
            </li>
            <li>
              <Link
                href="/#how-it-works"
                className="transition hover:text-white"
              >
                How it works
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-display font-bold text-white">Sell</p>
          <ul className="mt-3 space-y-2.5 text-blue-200/80">
            <li>
              <Link href="/auth/signup" className="transition hover:text-white">
                Open a shop
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="transition hover:text-white">
                Seller dashboard
              </Link>
            </li>
            <li>
              <Link href="/auth/login" className="transition hover:text-white">
                Log in
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-display font-bold text-white">Legal</p>
          <ul className="mt-3 space-y-2.5 text-blue-200/80">
            <li>
              <Link href="/terms" className="transition hover:text-white">
                Terms of service
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="transition hover:text-white">
                Privacy policy
              </Link>
            </li>
            <li>
              <a
                href="https://joetech360.ng"
                className="transition hover:text-white"
              >
                Built by Joetech360
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-4 text-xs text-blue-200/60">
          <span>© 2026 Joetech Shops — Built by Joetech360, Lekki, Lagos.</span>
          <span>Made for Nigerian sellers, buyers in every state.</span>
        </p>
      </div>
    </footer>
  );
}
