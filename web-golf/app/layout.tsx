import type { Metadata, Viewport } from "next";
import "./globals.css";
import { OrgJsonLd, WebsiteJsonLd } from "@/components/JsonLd";
import { getSiteConfig } from "@/lib/site";
import { Logo } from "@/components/Logo";
import { MobileMenuButton } from "@/components/MobileNav";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thailandgolfguide.com";
const cfg = getSiteConfig();

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#ffffff",
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
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
      "ko-KR": "/ko",
      "th-TH": "/th",
      "x-default": "/",
    },
  },
  verification: (() => {
    const other: Record<string, string[]> = {};
    if (process.env.NEXT_PUBLIC_BING_VERIFICATION) {
      other["msvalidate.01"] = [process.env.NEXT_PUBLIC_BING_VERIFICATION];
    }
    if (process.env.NEXT_PUBLIC_NAVER_VERIFICATION) {
      other["naver-site-verification"] = [process.env.NEXT_PUBLIC_NAVER_VERIFICATION];
    }
    // Agoda partner verification is injected as a raw <meta /> (no content attr)
    // directly in the body — React 19 auto-hoists to <head>. Metadata API
    // strips empty-content meta so we can't use it here.
    return {
      google: process.env.NEXT_PUBLIC_GSC_VERIFICATION,
      yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
      other: Object.keys(other).length > 0 ? other : undefined,
    };
  })(),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Agoda partner verification — React 19 hoists this to <head> with
            no content attribute, matching Agoda's expected meta exactly. */}
        <meta name="agd-partner-manual-verification" />
        <OrgJsonLd />
        <WebsiteJsonLd />
        <header className="border-b border-[var(--border)] bg-white sticky top-0 z-10 backdrop-blur-sm bg-white/95">
          <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
            <a href="/" className="flex items-center hover:opacity-80 transition">
              <Logo accent={cfg.themeAccent} />
            </a>
            <nav className="text-sm flex gap-4 md:gap-5 text-[var(--muted)] items-center">
              <a href="/c/course" className="hover:text-black hidden sm:inline">Courses</a>
              <a href="/c/driving_range" className="hover:text-black hidden md:inline">Driving Range</a>
              <a href="/c/resort" className="hover:text-black hidden md:inline">Resorts</a>
              <a href="/best/highly-recommended" className="hover:text-black hidden md:inline">Best of</a>
              <a href="/guide/booking-thai-golf" className="hover:text-black hidden lg:inline">Guides</a>
              <a href="/blog" className="hover:text-black hidden lg:inline">Blog</a>
              <a href="/price-compare" className="hover:text-black hidden lg:inline">Price Compare</a>
              <a href="/tee-times" className="hover:text-black hidden lg:inline">Tee Times</a>
              <a href="/conditions" className="hover:text-black hidden lg:inline">Conditions</a>
              <a
                href="/for-courses"
                className="px-3 py-1.5 rounded-full bg-black text-white hover:bg-gray-800 text-xs font-bold hidden sm:inline-flex"
              >
                For clubs →
              </a>
              <a href="/th" className="text-xs hover:text-black hidden sm:inline">TH</a>
              <a href="/ko" className="text-xs hover:text-black hidden sm:inline">KO</a>
              <MobileMenuButton />
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t border-[var(--border)] mt-16 bg-white">
          <div className="max-w-5xl mx-auto px-4 py-8 text-sm text-[var(--muted)]">
            <div className="grid sm:grid-cols-3 gap-6 mb-6">
              <div>
                <div className="font-bold text-[var(--fg)] mb-2 text-xs uppercase tracking-wide">Browse</div>
                <ul className="space-y-1.5">
                  <li><a href="/c/course" className="hover:text-black">Golf Courses</a></li>
                  <li><a href="/c/driving_range" className="hover:text-black">Driving Range</a></li>
                  <li><a href="/c/resort" className="hover:text-black">Golf Resorts</a></li>
                  <li><a href="/c/indoor" className="hover:text-black">Indoor Golf</a></li>
                </ul>
              </div>
              <div>
                <div className="font-bold text-[var(--fg)] mb-2 text-xs uppercase tracking-wide">Best of</div>
                <ul className="space-y-1.5">
                  <li><a href="/best/korean-friendly" className="hover:text-black">Korean-friendly</a></li>
                  <li><a href="/best/english-caddy" className="hover:text-black">English caddy</a></li>
                  <li><a href="/best/well-maintained" className="hover:text-black">Best condition</a></li>
                  <li><a href="/best/scenic" className="hover:text-black">Scenic views</a></li>
                </ul>
              </div>
              <div>
                <div className="font-bold text-[var(--fg)] mb-2 text-xs uppercase tracking-wide">Site</div>
                <ul className="space-y-1.5">
                  <li><a href="/blog" className="hover:text-black">Blog</a></li>
                  <li><a href="/guide/booking-thai-golf" className="hover:text-black">Booking Guide</a></li>
                  <li><a href="/methodology" className="hover:text-black">Methodology</a></li>
                  <li><a href="/about" className="hover:text-black">About</a></li>
                  <li><a href="/contact" className="hover:text-black">Contact</a></li>
                  <li><a href="/for-courses" className="hover:text-black">For Golf Clubs</a></li>
                  <li><a href="/sitemap.xml" className="hover:text-black">Sitemap</a></li>
                </ul>
              </div>
            </div>
            <p className="text-xs leading-relaxed max-w-2xl border-t border-[var(--border)] pt-4">
              Independent golf course review aggregation for Thailand. Not affiliated with any club. Data sourced from public Google Maps listings. Featured / Editor&apos;s Pick / Recommended slots are clearly labelled and never replace organic results.
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
