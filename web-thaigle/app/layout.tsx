import type { Metadata, Viewport } from "next";
import "./globals.css";
import { OrgJsonLd, WebsiteJsonLd } from "@/components/JsonLd";
import { getSiteConfig } from "@/lib/site";
import { Logo } from "@/components/Logo";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { PlannerProvider } from "@/components/PlannerContext";
import { PlannerBar } from "@/components/PlannerBar";
import { StickyBottomNav } from "@/components/StickyBottomNav";
import { TikTokGuard } from "@/components/TikTokGuard";
import { CookieConsent } from "@/components/CookieConsent";
import { BackToTop } from "@/components/BackToTop";
import { HeaderNav } from "@/components/HeaderNav";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thaigle.com";
const cfg = getSiteConfig();

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
  viewportFit: "cover",
  colorScheme: "light",
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
      "ja": "/ja",
      "ru": "/ru",
      "ar": "/ar",
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
        <PlannerProvider>
          <TikTokGuard />
          <OrgJsonLd />
          <WebsiteJsonLd />
          <header className="border-b border-[var(--border)] bg-white sticky top-0 z-10 backdrop-blur-sm bg-white/95">
            <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
              <a href="/" className="flex items-center hover:opacity-80 transition">
                <Logo accent={cfg.themeAccent} />
              </a>
              <HeaderNav />
            </div>
          </header>
          <main className="pb-16 md:pb-0">{children}</main>
          <BackToTop />
          <PlannerBar />
          <StickyBottomNav />
          <footer className="border-t border-[var(--border)] mt-16 bg-white">
            <div className="max-w-5xl mx-auto px-4 py-8 text-sm text-[var(--muted)]">
              <div className="flex flex-wrap gap-x-8 gap-y-3 mb-4">
                <a href="/about" className="hover:text-black">About</a>
                <a href="/quiz" className="hover:text-black">Bangkok Quiz</a>
                <a href="/bingo" className="hover:text-black">Bucket List</a>
                <a href="/my-trip" className="hover:text-black">My Trip</a>
                <a href="/local-tips" className="hover:text-black">Local Tips</a>
                <a href="/for" className="hover:text-black">Perfect For</a>
                <a href="/contact" className="hover:text-black">Contact</a>
                <a href="/for-venues" className="hover:text-black">For Venues</a>
                <a href="/terms" className="hover:text-black">Terms</a>
                <a href="/privacy" className="hover:text-black">Privacy</a>
                <a href="/takedown" className="hover:text-black">Corrections</a>
                <a href="/sitemap.xml" className="hover:text-black">Sitemap</a>
              </div>
              <p className="text-xs leading-relaxed max-w-2xl">
                Independent Bangkok activity &amp; restaurant directory. Not affiliated with any venue. All data sourced from public Google Maps listings. Trust Scores are computed automatically — no payment changes organic rankings. Affiliate links clearly labelled.
              </p>
              <p className="text-xs mt-3">© {new Date().getFullYear()} {cfg.brand} · <a href="/privacy" className="underline hover:text-black">Privacy Policy</a></p>
            </div>
          </footer>
          <CookieConsent />
          <Analytics />
          <SpeedInsights />
        </PlannerProvider>
      </body>
    </html>
  );
}
