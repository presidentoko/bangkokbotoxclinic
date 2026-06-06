import type { Metadata, Viewport } from "next";
import "./globals.css";
import { OrgJsonLd, WebsiteJsonLd } from "@/components/JsonLd";
import { getSiteConfig } from "@/lib/site";
import { SiteHeader } from "@/components/SiteHeader";
import { ToastProvider } from "@/components/Toast";
import NewsletterSignup from "@/components/NewsletterSignup";
import SisterSites from "@/components/SisterSites";
import { CurrencyProvider } from "@/components/CurrencyConverter";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
// Hydration-after 위젯들 — initial HTML 에서 제외. components/LazyWidgets.tsx 참고.
import {
  PersonalizationQuiz, SocialProofToasts, LiveChatBubble, CookieConsent,
  MobileBottomNav, DealsAlert, ExitIntentPopup, WhatsAppCTA,
  AccessibilityToolbar, ScrollToTopButton, ReadingProgressBar, NavSpacer,
} from "@/components/LazyWidgets";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bangkokbotoxclinic.com";
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
  alternates: {
    canonical: "/",
    languages: {
      "en": "/",
      "th": "/th",
      "ko": "/ko",
      "x-default": "/",
    },
  },
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
        <ToastProvider>
          <CurrencyProvider>
          <SiteHeader focus={cfg.focus} accent={cfg.themeAccent} />
          <main>{children}</main>
          <NavSpacer />
        <SisterSites focus={cfg.focus} />
        <footer className="border-t border-[var(--border)] mt-16 bg-white">
          <div className="max-w-5xl mx-auto px-4 py-8 text-sm text-[var(--muted)]">
            <div className="mb-8">
              <NewsletterSignup focus={cfg.focus} />
            </div>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-6">
              <div className="flex-1">
                <div className="flex flex-wrap gap-x-8 gap-y-3 mb-4">
                  <a href="/about" className="hover:text-black">About</a>
                  <a href="/insights" className="hover:text-black">Market Insights</a>
                  <a href="/contact" className="hover:text-black">Contact</a>
                  <a href="/for-clinics" className="hover:text-black">For Clinics</a>
                  <a href="/sitemap.xml" className="hover:text-black">Sitemap</a>
                  <a href="/llms.txt" className="hover:text-black">llms.txt</a>
                </div>
                <p className="text-xs leading-relaxed max-w-2xl">
                  Independent review aggregation. Not affiliated with any clinic. Data sourced from public Google Maps listings, refreshed continuously. Sponsored slots are clearly labelled and never replace organic results.
                </p>
              </div>
              <a
                href="https://line.me/R/ti/p/@405zhjqb"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 shrink-0 rounded-lg border border-[var(--border)] px-3 py-2 hover:bg-[var(--bg-soft,#f7f7f7)]"
                aria-label="Contact us via LINE @405zhjqb"
              >
                <img src="/line-qr.jpg" alt="LINE QR @405zhjqb" width={72} height={72} className="rounded" />
                <div className="text-xs leading-tight">
                  <div className="font-semibold text-black">Contact via LINE</div>
                  <div className="text-[var(--muted)]">@405zhjqb</div>
                  <div className="text-[10px] text-[var(--muted)] mt-1">Scan or tap to chat</div>
                </div>
              </a>
            </div>
            <p className="text-xs">
              © {new Date().getFullYear()} {cfg.brand}
            </p>
          </div>
        </footer>
        <PersonalizationQuiz />
        <SocialProofToasts />
        <LiveChatBubble />
        <WhatsAppCTA />
        <MobileBottomNav />
        <DealsAlert />
        <ExitIntentPopup />
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
