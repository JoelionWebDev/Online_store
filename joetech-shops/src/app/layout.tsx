import type { Metadata } from "next";
import "./globals.css";
import { Footer, Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Joetech Shops — Sell online in Nigeria",
  description:
    "Open a free online shop in minutes. Sell to buyers across Nigeria, take orders on WhatsApp or Paystack, and get paid into your own account.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-white font-sans text-slate-900 antialiased">
        <Header />
        <main className="min-h-[70vh] flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
