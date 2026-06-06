import type { Metadata } from "next";
import "./globals.css";
import { SITE } from "@/lib/i18n";
import { CompareProvider } from "@/components/CompareContext";
import { ToastProvider } from "@/components/Toast";
import { CurrencyProvider } from "@/components/CurrencyConverter";
import PersonalizationQuiz from "@/components/PersonalizationQuiz";
import SocialProofToasts from "@/components/SocialProofToasts";
import LiveChatBubble from "@/components/LiveChatBubble";
import WhatsAppCTA from "@/components/WhatsAppCTA";
import MobileBottomNav from "@/components/MobileBottomNav";
import DealsAlert from "@/components/DealsAlert";
import ExitIntentPopup from "@/components/ExitIntentPopup";
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <CurrencyProvider>
            <CompareProvider><div className="pb-20 sm:pb-0">{children}</div></CompareProvider>
            <SisterSites />
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
      </body>
    </html>
  );
}
