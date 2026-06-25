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
  title: { default: SITE.name, template: `%s — ${SITE.name}` },
  description: SITE.tagline.en,
  openGraph: {
    type: "website",
    url: SITE.origin,
    siteName: SITE.name,
    title: SITE.name,
    description: SITE.tagline.en,
  },
  twitter: { card: "summary_large_image", title: SITE.name, description: SITE.tagline.en },
  alternates: { canonical: SITE.origin },
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
