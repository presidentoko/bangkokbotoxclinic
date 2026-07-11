import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found — BangkokCheckup",
};

// The single not-found boundary for the whole app. The root layout is a
// pass-through shell (html/body live in [locale]/layout.tsx), so this file
// MUST render its own <html><body> — without them the 404 page itself
// crashes with a 500. A locale-scoped `[locale]/not-found.tsx` would be
// preferable, but in this Next.js version notFound() thrown from a deeply
// nested page fails to resolve that boundary (NoFallbackError) and falls
// through to this root one regardless.
export default function NotFound() {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
          <p className="text-6xl mb-4">🏥</p>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Page not found</h1>
          <p className="text-slate-500 mb-8 max-w-md">
            The page you&apos;re looking for doesn&apos;t exist. Try searching for a hospital or browse packages below.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/en/compare"
              className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors">
              Compare packages →
            </Link>
            <Link href="/en/hospital"
              className="border border-slate-200 text-slate-700 font-semibold px-6 py-3 rounded-xl hover:border-blue-300 hover:text-blue-700 transition-colors">
              Browse hospitals
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl">
            {[
              { href: "/en/for/executive-health-checkup-bangkok", label: "Executive check-up" },
              { href: "/en/for/cancer-screening-bangkok", label: "Cancer screening" },
              { href: "/en/for/jci-accredited-health-checkup-bangkok", label: "JCI hospitals" },
              { href: "/en/for/budget-health-checkup-bangkok", label: "Budget packages" },
            ].map(({ href, label }) => (
              <Link key={href} href={href}
                className="text-xs text-blue-600 hover:underline bg-blue-50 rounded-lg px-3 py-2 text-center">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </body>
    </html>
  );
}
