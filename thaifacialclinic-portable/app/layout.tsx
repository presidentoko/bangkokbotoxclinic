import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/i18n";
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

export const metadata: Metadata = {
  metadataBase: new URL(SITE.origin),
  title: {
    default: "Bangkok Hair Transplant Clinics — FUE, DHI & Verified Reviews 2026",
    template: `%s — ${SITE.name}`,
  },
  description: "Compare 130+ Bangkok hair transplant clinics. FUE from ฿65,000 · DHI from ฿85,000 · SMP from ฿15,000. Ranked by Trust Score from real Google + Bookimed + Reddit reviews. Save 50–70% vs Korea or UK.",
  openGraph: {
    type: "website",
    url: SITE.origin,
    siteName: SITE.name,
    title: "Bangkok Hair Transplant Clinics — FUE, DHI & Verified Reviews 2026",
    description: "Compare 130+ Bangkok hair transplant clinics. FUE from ฿65,000 · DHI from ฿85,000. Ranked by Trust Score.",
    images: [{ url: `${SITE.origin}/og-default.png`, width: 1200, height: 630, alt: "Bangkok Hair Transplant Clinics" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bangkok Hair Transplant Clinics — FUE, DHI & Verified Reviews 2026",
    description: "130+ clinics · FUE from ฿65,000 · Trust Score ranked from real reviews.",
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${plusJakarta.variable}`}>
      <body>
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
