import type { Metadata } from "next";
import "./globals.css";
import { OrgJsonLd, WebsiteJsonLd } from "@/components/JsonLd";
import { getSiteConfig } from "@/lib/site";
import { SiteHeader } from "@/components/SiteHeader";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

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
  },
  twitter: {
    card: "summary_large_image",
    title: cfg.title,
    description: cfg.description,
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
        <SiteHeader focus={cfg.focus} accent={cfg.themeAccent} />
        <main>{children}</main>
        <footer className="border-t border-[var(--border)] mt-16 bg-white">
          <div className="max-w-5xl mx-auto px-4 py-8 text-sm text-[var(--muted)]">
            <div className="flex flex-wrap gap-x-8 gap-y-3 mb-4">
              <a href="/about" className="hover:text-black">About</a>
              <a href="/contact" className="hover:text-black">Contact</a>
              <a href="/for-clinics" className="hover:text-black">For Clinics</a>
              <a href="/sitemap.xml" className="hover:text-black">Sitemap</a>
              <a href="/llms.txt" className="hover:text-black">llms.txt</a>
            </div>
            <p className="text-xs leading-relaxed max-w-2xl">
              Independent review aggregation. Not affiliated with any clinic. Data sourced from public Google Maps listings, refreshed continuously. Sponsored slots are clearly labelled and never replace organic results.
            </p>
            <p className="text-xs mt-3">
              © {new Date().getFullYear()} {cfg.brand}
            </p>
          </div>
        </footer>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
