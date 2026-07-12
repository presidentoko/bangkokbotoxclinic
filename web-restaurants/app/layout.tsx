import type { Metadata, Viewport } from "next";
import { DM_Serif_Display } from "next/font/google";
import "./globals.css";
import { OrgJsonLd, WebsiteJsonLd } from "@/components/JsonLd";
import { getSiteConfig } from "@/lib/site";
import { Logo } from "@/components/Logo";
import { BottomNav } from "@/components/BottomNav";
import { LangSwitcher } from "@/components/LangSwitcher";
import { MobileMenu } from "@/components/MobileMenu";
import { ClientFooter } from "@/components/ClientFooter";
import { BackToTop } from "@/components/BackToTop";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { loadMasterDb } from "@/lib/data";

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-serif",
  display: "swap",
});

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.snsstopper.com";
const cfg = getSiteConfig();

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const db = await loadMasterDb();
  const topCuisines = Object.entries(db.cuisine_counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([c]) => c);
  // Root layout re-runs this on every request for the few dynamic (ƒ) routes
  // (e.g. /about, /contact) — aggregate the precomputed district_counts map
  // (~dozens of entries) instead of scanning all 3,630 restaurants each time.
  const districtTotals = new Map<string, number>();
  for (const [key, count] of Object.entries(db.district_counts)) {
    const name = key.split("/")[1];
    if (!name) continue;
    districtTotals.set(name, (districtTotals.get(name) ?? 0) + count);
  }
  const topDistricts = [...districtTotals.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([d]) => d);

  return (
    <html lang="en" className={dmSerif.variable}>
      <body>
        <OrgJsonLd />
        <WebsiteJsonLd />
        <header className="border-b border-[var(--border)] bg-[var(--card)] sticky top-0 z-10 backdrop-blur-sm bg-white/95">
          <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
            <a href="/" className="flex items-center hover:opacity-80 transition">
              <Logo accent={cfg.themeAccent} />
            </a>
            <nav className="text-sm flex gap-4 md:gap-5 text-[var(--muted)] items-center">
              <a href="/famous-vs-good" className="hover:text-[var(--fg)] font-medium text-[var(--accent)] hidden sm:inline">SNS Check</a>
              <a href="/c/thai" className="hover:text-[var(--fg)] hidden md:inline">Thai</a>
              <a href="/best/halal" className="hover:text-[var(--fg)] hidden md:inline">Best of</a>
              <a href="/guide" className="hover:text-[var(--fg)] hidden lg:inline">Guides</a>
              <a href="/about" className="hover:text-[var(--fg)] hidden md:inline">About</a>
              <a
                href="/for-restaurants"
                className="px-3 py-1.5 rounded-full bg-[var(--fg)] text-white hover:opacity-80 text-xs font-bold hidden sm:inline-flex transition"
              >
                For owners →
              </a>
              <LangSwitcher />
              <MobileMenu />
            </nav>
          </div>
        </header>
        <main className="pb-[calc(3.5rem+env(safe-area-inset-bottom))] sm:pb-0">{children}</main>
        <BottomNav />
        <ClientFooter brand={cfg.brand} year={new Date().getFullYear()} topCuisines={topCuisines} topDistricts={topDistricts} />
        <BackToTop />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
