import type { Metadata, Viewport } from "next";
import { DM_Serif_Display } from "next/font/google";
import Script from "next/script";
import { headers } from "next/headers";
import Link from "next/link";
import "./globals.css";
import { OrgJsonLd, WebsiteJsonLd } from "@/components/JsonLd";
import { getSiteConfig } from "@/lib/site";
import { Logo } from "@/components/Logo";
import { BottomNav } from "@/components/BottomNav";
import { HeaderNav } from "@/components/HeaderNav";
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
  // Search Console + Bing + AdSense 검증 메타. Vercel ENV 로 주입 (옵션).
  //
  // AdSense 는 loader 스크립트만으로도 사이트를 확인할 수 있어야 하지만,
  // 실제로는 확인이 계속 실패했다. 스크립트는 Next 의 Script 컴포넌트가
  // 넣기 때문에 프리렌더 HTML 안에서 위치가 본문 쪽이고, 크롤러가 그걸
  // 놓치는 경우가 있다. google-adsense-account 메타는 <head> 최상단에
  // 정적으로 박히므로 확인 경로가 하나 더 생긴다. 둘은 배타적이지 않다.
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION,
    other: {
      ...(process.env.NEXT_PUBLIC_BING_VERIFICATION
        ? { "msvalidate.01": [process.env.NEXT_PUBLIC_BING_VERIFICATION] }
        : {}),
      ...(process.env.NEXT_PUBLIC_ADSENSE_CLIENT
        ? { "google-adsense-account": [process.env.NEXT_PUBLIC_ADSENSE_CLIENT] }
        : {}),
    },
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const db = await loadMasterDb();
  const hdrs = await headers();
  const htmlLang = hdrs.get("x-locale") ?? "en";
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
    <html lang={htmlLang} className={dmSerif.variable}>
      <body>
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        <OrgJsonLd />
        <WebsiteJsonLd />
        <header className="border-b border-[var(--border)] bg-[var(--card)] sticky top-0 z-10 backdrop-blur-sm bg-white/95">
          <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center hover:opacity-80 transition">
              <Logo accent={cfg.themeAccent} />
            </Link>
            <HeaderNav />
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
