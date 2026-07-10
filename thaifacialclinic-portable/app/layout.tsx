import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/i18n";
import { loadClinics } from "@/lib/data";
import { CompareProvider } from "@/components/CompareContext";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz"],
  weight: "variable",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});
import { ToastProvider } from "@/components/Toast";
import { CurrencyProvider } from "@/components/CurrencyConverter";
import LiveChatBubble from "@/components/LiveChatBubble";
import WhatsAppCTA from "@/components/WhatsAppCTA";
import MobileBottomNav from "@/components/MobileBottomNav";
import AccessibilityToolbar from "@/components/AccessibilityToolbar";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import ReadingProgressBar from "@/components/ReadingProgressBar";
import CookieConsent from "@/components/CookieConsent";
import SisterSites from "@/components/SisterSites";

export async function generateMetadata(): Promise<Metadata> {
  const { total } = loadClinics();
  return {
  metadataBase: new URL(SITE.origin),
  title: {
    default: "Hair Transplant Thailand — Bangkok Clinics, FUE, DHI & Verified Reviews 2026",
    template: `%s — ${SITE.name}`,
  },
  description: `Compare ${total}+ Bangkok hair transplant clinics. FUE from ฿65,000 · DHI from ฿85,000 · SMP from ฿15,000. Ranked by Trust Score from real Google + Bookimed + Reddit reviews. Save 50–70% vs Korea or UK.`,
  openGraph: {
    type: "website",
    url: SITE.origin,
    siteName: SITE.name,
    title: "Hair Transplant Thailand — Bangkok Clinics, FUE, DHI & Verified Reviews 2026",
    description: `Compare ${total}+ Bangkok hair transplant clinics. FUE from ฿65,000 · DHI from ฿85,000. Ranked by Trust Score.`,
    // images intentionally omitted — app/opengraph-image.tsx provides the default via Next's file convention
  },
  twitter: {
    card: "summary_large_image",
    title: "Hair Transplant Thailand — Bangkok Clinics, FUE, DHI & Verified Reviews 2026",
    description: `${total}+ clinics · FUE from ฿65,000 · Trust Score ranked from real reviews.`,
  },
  alternates: {
    canonical: SITE.origin,
    languages: {
      "en": `${SITE.origin}/en/`,
      "th": `${SITE.origin}/th/`,
      "ko": `${SITE.origin}/ko/`,
      "zh": `${SITE.origin}/zh/`,
      "ar": `${SITE.origin}/ar/`,
      "x-default": `${SITE.origin}/en/`,
    },
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
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${plusJakarta.variable}`}>
      <body>
        {/* 루트 레이아웃은 [lang] 세그먼트 파라미터를 못 받음(Next.js App Router
            구조상 <html> 태그는 트리 최상단 1곳에만 존재 가능) — URL의 첫 세그먼트로
            lang/dir 을 렌더 전에 동기 보정. 원본 HTML은 en 이지만 구글은 JS를
            실행해 렌더링된 DOM을 색인하므로 실질적으로 정정됨. */}
        <Script id="lang-dir-fix" strategy="beforeInteractive">{`
          (function(){
            try {
              var seg = location.pathname.split('/')[1];
              var supported = ['en','ko','th','zh','ar'];
              if (supported.indexOf(seg) === -1) return;
              document.documentElement.lang = seg;
              document.documentElement.dir = seg === 'ar' ? 'rtl' : 'ltr';
            } catch(e) {}
          })();
        `}</Script>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-RV4GRV07P7" strategy="afterInteractive" />
        <Script id="ga-init" strategy="afterInteractive">{`
          window.dataLayer=window.dataLayer||[];
          function gtag(){dataLayer.push(arguments);}
          gtag('js',new Date());
          gtag('config','G-RV4GRV07P7');
        `}</Script>
        <ToastProvider>
          <CurrencyProvider>
            <CompareProvider><div className="pb-20 sm:pb-0">{children}</div></CompareProvider>
            <SisterSites />
            <LiveChatBubble />
            <WhatsAppCTA />
            <MobileBottomNav />
            <AccessibilityToolbar />
            <ScrollToTopButton />
            <ReadingProgressBar />
            <CookieConsent />
          </CurrencyProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
