import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { isLang, SITE } from "@/lib/site";
import { fontVariables } from "@/lib/fonts";
import { listCities } from "@/lib/data";
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
  title: "chillanel — Find your massage & spa vibe",
  description:
    "A Thailand massage & spa guide that reads real Google reviews to surface each place's actual mood — quiet & relaxing, strong pressure, good value — not just a star rating.",
  openGraph: {
    siteName: SITE.name,
    type: "website",
    url: SITE.origin,
    // Next's metadata objects don't deep-merge across segments — a child
    // page setting its own `openGraph` replaces this whole object, which
    // silently drops the image the parent app/opengraph-image.tsx route
    // would otherwise auto-attach. Every page below re-declares `images`
    // for that reason (see each page.tsx's openGraph block).
    images: [`${SITE.origin}/opengraph-image`],
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
  // "Browse" in the bottom tab bar used to point straight at /city/bangkok —
  // now that other cities can have data too, send it to the city chooser
  // unless there's genuinely only one city (skip the extra tap in that case).
  const cities = listCities();
  const browseHref = cities.length === 1 ? `/${lang}/city/${cities[0]}` : `/${lang}/city`;
  return (
    <html lang={lang} className={fontVariables}>
      <body>
        <WebsiteJsonLd />
        <Header lang={lang} />
        <main>{children}</main>
        <Footer lang={lang} />
        <BottomNav lang={lang} browseHref={browseHref} />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
