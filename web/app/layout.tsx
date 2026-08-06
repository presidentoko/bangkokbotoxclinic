import type { Metadata, Viewport } from "next";
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
  // 이게 없으면 명세상 env(safe-area-inset-*)가 전부 0px로 계산된다 —
  // FloatingContactBar와 MobileBottomNav가 이미 paddingBottom으로 safe-area를
  // 쓰고 있었는데 스위치가 꺼져 있어서 노치 아이폰에서 홈 인디케이터에 깔렸다
  // (2026-08-06 감사). thaifacialclinic-portable 쪽은 원래부터 켜져 있었다.
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)",  color: "#0a0a0a" },
  ],
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 2026-07-31: 이전엔 middleware가 넣어주는 x-lang 헤더를 여기서 headers()로
  // 읽어 <html lang>을 세팅했는데, 루트 레이아웃에서 headers()를 읽으면 이걸
  // 상속하는 모든 라우트가 요청마다 다시 렌더링되는 동적 페이지로 바뀐다 —
  // /clinic/[id] 같은 정적이어야 할 5,000+ 페이지가 매 요청마다 24MB
  // master_db.json을 다시 읽어 파싱하게 됐고, 이게 5xx 670건의 원인이었다
  // (x-nextjs-prerender 헤더가 사라진 것으로 직접 확인, 2026-07-31 감사).
  // 정적 렌더링을 되살리기 위해 <html lang>은 정적 기본값("en")으로 고정하고,
  // /th·/ko 페이지에서만 beforeInteractive 스크립트로 hydration 전에 동기적으로
  // 덮어쓴다 — 깜빡임 없이 접근성 요건(올바른 lang)을 만족시키면서도 헤더를
  // 읽지 않아 페이지 자체는 정적으로 남는다.
  return (
    <html lang="en">
      <body>
        <Script id="set-html-lang" strategy="beforeInteractive">{`
          (function(){
            var p = window.location.pathname;
            var l = (p === "/th" || p.indexOf("/th/") === 0) ? "th"
                  : (p === "/ko" || p.indexOf("/ko/") === 0) ? "ko" : null;
            if (l) document.documentElement.lang = l;
          })();
        `}</Script>
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
                {/* /doctors 는 사이트맵에만 있고 사이트 안 어디에서도 링크되지
                    않는 고아였다 — 홈·클리닉·지역·서비스 페이지 전부에서 이
                    허브로 가는 링크가 0개였고, 그 아래 의사 페이지 900여 개도
                    같이 고립돼 있었다. 내부 링크 0개 + 사이트맵에만 존재는
                    구글이 "발견됨 – 색인되지 않음"으로 분류하는 전형적 형태다
                    (2026-08-06 감사). */}
                <a href="/doctors" className="hover:text-black">Doctors</a>
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
