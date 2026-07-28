import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import Script from "next/script";
import "./globals.css";
import { OrgJsonLd, WebsiteJsonLd } from "@/components/JsonLd";
import { getSiteConfig, getSiteUrl } from "@/lib/site";
import { SiteHeader } from "@/components/SiteHeader";
import { ToastProvider } from "@/components/Toast";
import SisterSites from "@/components/SisterSites";
import { CurrencyProvider } from "@/components/CurrencyConverter";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
// Hydration-after 위젯들 — initial HTML 에서 제외. components/LazyWidgets.tsx 참고.
import {
  CookieConsent,
  MobileBottomNav,
  AccessibilityToolbar, ScrollToTopButton, ReadingProgressBar, NavSpacer,
} from "@/components/LazyWidgets";

const SITE = getSiteUrl();
const cfg = getSiteConfig();

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: cfg.title,
    template: `%s | ${cfg.brand}`,
  },
  description: cfg.description,
  openGraph: {
    type: "website",
    siteName: cfg.brand,
    locale: "en_US",
    url: SITE,
    images: [
      {
        url: `${SITE}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: cfg.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: cfg.title,
    description: cfg.description,
    images: [`${SITE}/opengraph-image`],
  },
  // robots: max-snippet/max-image/max-video=full → Google rich snippet
  // (긴 description, 큰 이미지 미리보기 → SERP CTR ↑)
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
  // alternates(canonical/languages)는 홈페이지 전용이라 app/page.tsx 로 이동
  // — 레이아웃 metadata 는 Next.js가 자체 metadata 없는 하위 페이지에 그대로
  // 상속시키므로, 여기 두면 /saved, /pay, /onboarding/* 등이 전부 홈으로
  // canonical 잡히는 버그가 생김 (2026-07-17 감사).
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION,
    other: process.env.NEXT_PUBLIC_BING_VERIFICATION
      ? { "msvalidate.01": [process.env.NEXT_PUBLIC_BING_VERIFICATION] }
      : undefined,
  },
};

// Mobile-first 명시. Next.js default 도 자동 viewport 추가하지만 themeColor /
// interactiveWidget / colorScheme 까지 한 번에 잡으려고 explicit export.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,          // 접근성: 사용자 zoom 허용 (시각장애 / 노안)
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)",  color: "#0a0a0a" },
  ],
  colorScheme: "light",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // middleware.ts가 pathname(/th, /ko)으로부터 계산해 넣어주는 헤더 —
  // /th, /ko 페이지가 <html lang="en">으로 나가던 걸 고침 (2026-07-28 감사).
  const lang = (await headers()).get("x-lang") ?? "en";
  return (
    <html lang={lang}>
      <body>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} strategy="afterInteractive" />
            <Script id="ga-init" strategy="afterInteractive">{`
              window.dataLayer=window.dataLayer||[];
              function gtag(){dataLayer.push(arguments);}
              gtag('js',new Date());
              gtag('config','${process.env.NEXT_PUBLIC_GA_ID}');
            `}</Script>
          </>
        )}
        <OrgJsonLd />
        <WebsiteJsonLd />
        <ToastProvider>
          <CurrencyProvider>
          <SiteHeader focus={cfg.focus} accent={cfg.themeAccent} />
          <main>{children}</main>
        <SisterSites focus={cfg.focus} />
        <footer className="border-t border-[var(--border)] mt-16 bg-white">
          <div className="max-w-5xl mx-auto px-4 py-8 text-sm text-[var(--muted)]">
            <div className="mb-6">
              <div className="flex flex-wrap gap-x-8 gap-y-3 mb-3">
                <a href="/about" className="hover:text-black">About</a>
                <a href="/insights" className="hover:text-black">Market Insights</a>
                <a href="/contact" className="hover:text-black">Contact</a>
                <a href="https://www.bangkoktopclinic.com/?ref=footer" target="_blank" rel="noopener" className="hover:text-black">For Clinics</a>
                <a href="/sitemap.xml" className="hover:text-black">Sitemap</a>
                <a href="/llms.txt" className="hover:text-black">llms.txt</a>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2 mb-4 text-xs">
                <span className="font-semibold text-[var(--fg)]">Legal:</span>
                <a href="/terms" className="hover:text-black">Terms</a>
                <a href="/privacy" className="hover:text-black">Privacy</a>
                <a href="/disclaimer" className="hover:text-black">Disclaimer</a>
                <a href="/methodology" className="hover:text-black">Methodology</a>
                <a href="/corrections" className="hover:text-black">Corrections</a>
              </div>
              <p className="text-xs leading-relaxed max-w-2xl">
                Independent review aggregation. Not affiliated with any clinic. Rankings, Trust Scores, and authenticity estimates are automated opinion based on public data — not statements of fact. Data sourced from public Google Maps listings, refreshed continuously. Sponsored slots are clearly labelled and never replace organic results.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-[var(--muted)]">
              <p>© {new Date().getFullYear()} {cfg.brand} · Independent directory, not affiliated with any clinic.</p>
              <p className="opacity-70">Review data aggregated from publicly available sources including Google Maps. Rankings and scores are automated opinions, not statements of fact.</p>
            </div>
          </div>
        </footer>
        {/* NavSpacer는 반드시 footer 뒤(진짜 문서 최하단)에 와야 한다 — footer보다
            앞에 있으면 최대 스크롤 시 footer의 마지막 줄이 항상 뷰포트 하단과
            정확히 맞물리게 되고, 그 자리는 position:fixed 바가 그대로 덮어버린다
            (spacer 높이와 무관하게 수학적으로 항상 그렇게 됨). 이전엔 이 순서가
            뒤바뀌어 있어서 홈페이지의 MobileBottomNav도 footer를 가리고 있었고,
            /clinic/* 페이지의 FloatingContactBar도 마찬가지였다
            (2026-07-28 감사 + 실제 브라우저 측정으로 확인). */}
        <NavSpacer />
        <MobileBottomNav />
        <AccessibilityToolbar />
        <ScrollToTopButton />
        <ReadingProgressBar />
        <CookieConsent />
        </CurrencyProvider>
        </ToastProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
