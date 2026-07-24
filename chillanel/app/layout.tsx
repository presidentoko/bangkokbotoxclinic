import type { Metadata } from "next";
import { Inter, Noto_Sans_KR, Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/site";
import { WebsiteJsonLd } from "@/components/JsonLd";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
const notoKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  variable: "--font-kr",
  display: "swap",
});
const notoTH = Noto_Sans_Thai({
  subsets: ["latin", "thai"],
  weight: ["400", "500", "600", "700", "900"],
  variable: "--font-th",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.origin),
  title: "chillanel — Real massage & spa reviews, therapist-first",
  description:
    "A Bangkok massage & spa guide built around the one thing every ranking site ignores: who's actually giving the massage. Real Google reviews, therapist mentions surfaced automatically.",
  openGraph: {
    siteName: SITE.name,
    type: "website",
    url: SITE.origin,
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${notoKR.variable} ${notoTH.variable}`}>
      <body>
        <WebsiteJsonLd />
        {children}
      </body>
    </html>
  );
}
