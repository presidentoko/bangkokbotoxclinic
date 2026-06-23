import type { Metadata } from "next";
import { DM_Serif_Display } from "next/font/google";
import "./globals.css";
import { OrgJsonLd, WebsiteJsonLd } from "@/components/JsonLd";
import { getSiteConfig } from "@/lib/site";
import { Logo } from "@/components/Logo";
import { BottomNav } from "@/components/BottomNav";
import { LangSwitcher } from "@/components/LangSwitcher";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-serif",
  display: "swap",
});

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://snsstopper.com";
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
            </nav>
          </div>
        </header>
        <main className="pb-14 sm:pb-0">{children}</main>
        <BottomNav />
        <footer className="border-t border-[var(--border)] mt-16 bg-[var(--card)]">
          <div className="max-w-5xl mx-auto px-4 py-8 text-sm text-[var(--muted)]">
            <p className="font-serif-display text-xl text-[var(--fg)] mb-1">
              No filter. Just numbers.
            </p>
            <p className="text-xs text-[var(--muted)] mb-5 max-w-xl">
              Your feed is a paid ad pretending to be a friend's opinion. We ended it with data.{" "}
              <a href="/famous-vs-good" className="text-[var(--accent)] hover:underline font-medium">
                See the SNS lie detector →
              </a>
            </p>
            <div className="flex flex-wrap gap-x-8 gap-y-3 mb-4">
              <a href="/famous-vs-good" className="hover:text-[var(--fg)] font-medium">SNS Check</a>
              <a href="/about" className="hover:text-[var(--fg)]">About</a>
              <a href="/contact" className="hover:text-[var(--fg)]">Contact</a>
              <a href="/for-restaurants" className="hover:text-[var(--fg)]">For Restaurants</a>
              <a href="/sitemap.xml" className="hover:text-[var(--fg)]">Sitemap</a>
              <a href="/llms.txt" className="hover:text-[var(--fg)]">llms.txt</a>
            </div>
            <p className="text-xs leading-relaxed max-w-2xl">
              Independent restaurant data analysis. Not affiliated with any restaurant. Rankings derived from public Google Maps review data — no human curation, no editorial intervention. Sponsored slots are clearly labelled and never displace organic results.
            </p>
            <p className="text-xs mt-3">© {new Date().getFullYear()} {cfg.brand} · No filter. Just numbers.</p>
          </div>
        </footer>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
