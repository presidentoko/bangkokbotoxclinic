import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { isLang, SITE } from "@/lib/site";
import { fontVariables } from "@/lib/fonts";
import { WebsiteJsonLd } from "@/components/JsonLd";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";
import "../globals.css";

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "th" }, { lang: "ko" }];
}

// This is the real root layout for every content page (everything except
// the bare "/" redirect -- see app/(root)/layout.tsx). Owning <html> here
// means `lang` is set correctly per static page at build time instead of
// hardcoded to "en" and patched client-side after hydration.
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

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  return (
    <html lang={lang} className={fontVariables}>
      <body>
        <WebsiteJsonLd />
        <Header lang={lang} />
        <main>{children}</main>
        <Footer lang={lang} />
        <BottomNav lang={lang} />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
