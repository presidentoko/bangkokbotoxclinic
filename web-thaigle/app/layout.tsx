import type { Metadata } from "next";
import "./globals.css";
import { OrgJsonLd, WebsiteJsonLd } from "@/components/JsonLd";
import { getSiteConfig } from "@/lib/site";
import { Logo } from "@/components/Logo";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thaigle.com";
const cfg = getSiteConfig();

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: cfg.title, template: `%s | ${cfg.brand}` },
  description: cfg.description,
  openGraph: {
    type: "website",
    siteName: cfg.brand,
    locale: "en_US",
    url: SITE,
  },
  twitter: {
    card: "summary_large_image",
    title: cfg.title,
    description: cfg.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "/",
    languages: {
      "en": "/",
      "th": "/th",
      "ko": "/ko",
      "x-default": "/",
    },
  },
  // Search Console + Bing 검증 메타. Vercel ENV 로 주입 (옵션).
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION,
    other: process.env.NEXT_PUBLIC_BING_VERIFICATION
      ? { "msvalidate.01": [process.env.NEXT_PUBLIC_BING_VERIFICATION] }
      : undefined,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <OrgJsonLd />
        <WebsiteJsonLd />
        <header className="border-b border-[var(--border)] bg-white sticky top-0 z-10 backdrop-blur-sm bg-white/95">
          <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
            <a href="/" className="flex items-center hover:opacity-80 transition">
              <Logo accent={cfg.themeAccent} />
            </a>
            <nav className="text-sm flex gap-4 md:gap-5 text-[var(--muted)] items-center">
              <a href="/restaurants/cuisine/thai" className="hover:text-black">Thai</a>
              <a href="/restaurants/cuisine/japanese" className="hover:text-black hidden sm:inline">Japanese</a>
              <a href="/restaurants/cuisine/italian" className="hover:text-black hidden sm:inline">Italian</a>
              <a href="/best/halal" className="hover:text-black hidden md:inline">Best of</a>
              <a href="/guide" className="hover:text-black hidden md:inline">Guides</a>
              <a href="/about" className="hover:text-black hidden md:inline">About</a>
              <a
                href="/for-restaurants"
                className="px-3 py-1.5 rounded-full bg-black text-white hover:bg-gray-800 text-xs font-bold hidden sm:inline-flex"
              >
                For owners →
              </a>
              <span className="text-xs text-[var(--muted)] flex items-center gap-2">
                <a href="/" className="hover:text-black">EN</a>
                <span aria-hidden="true">·</span>
                <a href="/th" className="hover:text-black">TH</a>
                <span aria-hidden="true">·</span>
                <a href="/ko" className="hover:text-black">KO</a>
              </span>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t border-[var(--border)] mt-16 bg-white">
          <div className="max-w-5xl mx-auto px-4 py-8 text-sm text-[var(--muted)]">
            <div className="flex flex-wrap gap-x-8 gap-y-3 mb-4">
              <a href="/about" className="hover:text-black">About</a>
              <a href="/contact" className="hover:text-black">Contact</a>
              <a href="/for-restaurants" className="hover:text-black">For Restaurants</a>
              <a href="/sitemap.xml" className="hover:text-black">Sitemap</a>
              <a href="/llms.txt" className="hover:text-black">llms.txt</a>
            </div>
            <p className="text-xs leading-relaxed max-w-2xl">
              Independent restaurant review aggregation. Not affiliated with any restaurant. Data sourced from public Google Maps listings, refreshed continuously. Sponsored slots are clearly labelled and never replace organic results.
            </p>
            <p className="text-xs mt-3">© {new Date().getFullYear()} {cfg.brand}</p>
          </div>
        </footer>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
