import type { Metadata, Viewport } from "next";
import "./globals.css";
import { OrgJsonLd, WebsiteJsonLd } from "@/components/JsonLd";
import { getSiteConfig } from "@/lib/site";
import { Logo } from "@/components/Logo";
import { HeaderNav } from "@/components/HeaderNav";
import { ShortlistTray } from "@/components/ShortlistTray";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thaisupplyhub.com";
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
    images: [{ url: `${SITE}/opengraph-image`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@thaisupplyhub",
    creator: "@thaisupplyhub",
  },
  keywords: [
    "Thai manufacturers",
    "Thailand B2B suppliers",
    "plastic injection molding Thailand",
    "food ingredient supplier Thailand",
    "3PL provider Thailand",
    "warehouse Thailand",
    "industrial estate Thailand",
    "DBD verified suppliers",
    "Eastern Seaboard manufacturers",
    "Thai sourcing directory",
  ],
  robots: { index: true, follow: true },
  // perf: explicit viewport, theme-color, format-detection.
  formatDetection: { telephone: false, email: false, address: false },
  // alternates 명시는 페이지별로. root layout 에 두면 자식 페이지가 override 안 한 경우
  // 모든 페이지가 canonical="/" 로 새어나가는 사고가 남.
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION,
    other: process.env.NEXT_PUBLIC_BING_VERIFICATION
      ? { "msvalidate.01": [process.env.NEXT_PUBLIC_BING_VERIFICATION] }
      : undefined,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f766e",
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
        <header className="border-b border-[var(--border)] bg-white sticky top-0 z-10 shadow-sm">
          <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
            <a href="/" className="flex items-center hover:opacity-80 transition">
              <Logo accent={cfg.themeAccent} />
            </a>
            <HeaderNav />
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t border-[var(--border)] mt-16 bg-white">
          <div className="max-w-5xl mx-auto px-4 py-8 text-sm text-[var(--muted)]">
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <div>
                <div className="font-bold text-[var(--fg)] mb-2 text-xs uppercase tracking-wide">Browse</div>
                <ul className="space-y-1.5">
                  <li><a href="/c/manufacturer" className="hover:text-black">Manufacturers</a></li>
                  <li><a href="/c/auto_parts" className="hover:text-black">Auto Parts</a></li>
                  <li><a href="/c/warehouse" className="hover:text-black">Warehouses</a></li>
                  <li><a href="/estate" className="hover:text-black">Industrial Estates</a></li>
                  <li><a href="/c/logistics" className="hover:text-black">Logistics</a></li>
                  <li><a href="/c/food_mfg" className="hover:text-black">Food Manufacturers</a></li>
                </ul>
              </div>
              <div>
                <div className="font-bold text-[var(--fg)] mb-2 text-xs uppercase tracking-wide">By Region</div>
                <ul className="space-y-1.5">
                  <li><a href="/city/chon_buri" className="hover:text-black">Chon Buri</a></li>
                  <li><a href="/city/rayong" className="hover:text-black">Rayong</a></li>
                  <li><a href="/city/bangkok" className="hover:text-black">Bangkok</a></li>
                  <li><a href="/city/phra_nakhon_si_ayutthaya" className="hover:text-black">Ayutthaya</a></li>
                  <li><a href="/city/pathum_thani" className="hover:text-black">Pathum Thani</a></li>
                </ul>
              </div>
              <div>
                <div className="font-bold text-[var(--fg)] mb-2 text-xs uppercase tracking-wide">Content</div>
                <ul className="space-y-1.5">
                  <li><a href="/guide" className="hover:text-black">Buyer Guides</a></li>
                  <li><a href="/blog" className="hover:text-black">Blog</a></li>
                  <li><a href="/best" className="hover:text-black">Best of — All Lists</a></li>
                  <li><a href="/community" className="hover:text-black">Community</a></li>
                  <li><a href="/best/boi-eligible" className="hover:text-black">BOI-Eligible Factories</a></li>
                  <li><a href="/best/export-ready" className="hover:text-black">Export-Ready Suppliers</a></li>
                </ul>
              </div>
              <div>
                <div className="font-bold text-[var(--fg)] mb-2 text-xs uppercase tracking-wide">Site</div>
                <ul className="space-y-1.5">
                  <li><a href="/about" className="hover:text-black">About</a></li>
                  <li><a href="/contact" className="hover:text-black">Contact</a></li>
                  <li><a href="/for-suppliers" className="hover:text-black">For Suppliers</a></li>
                  <li><a href="/quote" className="hover:text-black">Bulk Quote Request</a></li>
                  <li><a href="/compare" className="hover:text-black">Compare Suppliers</a></li>
                  <li><a href="/favorites" className="hover:text-black">Saved Suppliers</a></li>
                  <li><a href="/trust-score" className="hover:text-black">Trust Score Methodology</a></li>
                  <li><a href="/sitemap.xml" className="hover:text-black">Sitemap</a></li>
                  <li className="pt-1.5 mt-1.5 border-t border-[var(--border)]/60">
                    <a href="/" className="text-xs hover:text-black mr-2">EN</a>
                    <a href="/ko" className="text-xs hover:text-black mr-2">한국어</a>
                    <a href="/th" className="text-xs hover:text-black">ภาษาไทย</a>
                  </li>
                </ul>
              </div>
            </div>
            <p className="text-xs leading-relaxed max-w-2xl border-t border-[var(--border)] pt-4">
              Independent supplier directory for Thailand. Not affiliated with any company. Data sourced from public Google Maps listings. Featured / Editor&apos;s Pick / Recommended slots are clearly labelled and never replace organic results.
            </p>
            <p className="text-xs mt-3">© {new Date().getFullYear()} {cfg.brand}</p>
          </div>
        </footer>
        <ShortlistTray />
      </body>
    </html>
  );
}
