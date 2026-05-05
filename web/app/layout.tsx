import type { Metadata } from "next";
import "./globals.css";
import { OrgJsonLd, WebsiteJsonLd } from "@/components/JsonLd";
import { getSiteConfig } from "@/lib/site";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://bangkokclinics.example";
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
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
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
        <header className="border-b border-[var(--border)] bg-white">
          <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
            <a href="/" className="font-bold tracking-tight text-lg">
              {cfg.brand}<span style={{ color: cfg.themeAccent }}>.</span>
            </a>
            <nav className="text-sm flex gap-4 text-[var(--muted)]">
              {cfg.focus === "all" ? (
                <>
                  <a href="/c/botox" className="hover:text-black">Botox</a>
                  <a href="/c/filler" className="hover:text-black">Filler</a>
                  <a href="/c/hifu" className="hover:text-black">HIFU</a>
                  <a href="/c/facial" className="hover:text-black">Facial</a>
                  <a href="/c/laser" className="hover:text-black">Laser</a>
                </>
              ) : (
                <>
                  <a href="/" className="hover:text-black">All Clinics</a>
                  <a href={`/c/${cfg.focus}`} className="hover:text-black">By Service</a>
                </>
              )}
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t border-[var(--border)] mt-16">
          <div className="max-w-5xl mx-auto px-4 py-6 text-sm text-[var(--muted)]">
            Independent review aggregation. Not affiliated with any clinic. Data sourced from public Google Maps listings.
          </div>
        </footer>
      </body>
    </html>
  );
}
