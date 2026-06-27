import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { LOCALES, type Locale, isRTL, t, OG_LOCALE } from "@/lib/i18n";
import Link from "next/link";
import { MobileMenuButton } from "@/app/components/MobileNav";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1d6fa4",
};

const BASE_URL = "https://www.bangkoktopclinic.com";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const loc = locale as Locale;
  const alternates: Record<string, string> = {};
  for (const l of LOCALES) alternates[l] = `${BASE_URL}/${l}`;
  return {
    metadataBase: new URL(BASE_URL),
    title: { default: `${t(loc, "site_name")} — ${t(loc, "tagline")}`, template: `%s | ${t(loc, "site_name")}` },
    description: t(loc, "tagline"),
    alternates: { canonical: `${BASE_URL}/${loc}`, languages: alternates },
    openGraph: { type: "website", siteName: t(loc, "site_name"), locale: OG_LOCALE[loc] },
    robots: { index: true, follow: true },
  };
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export const revalidate = 3600;

function NavBar({ locale }: { locale: Locale }) {
  const base = `/${locale}`;
  const navItems = [
    { href: `${base}/compare`, label: t(locale, "nav_compare") },
    { href: `${base}/hospital`, label: t(locale, "nav_hospitals") },
    { href: `${base}/guide/bangkok-health-checkup`, label: t(locale, "nav_guide") },
    { href: `${base}/enquiry`, label: t(locale, "nav_enquiry") },
  ];
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center gap-4 relative">
        <Link href={base} className="font-bold text-blue-700 text-lg tracking-tight shrink-0">
          {t(locale, "site_name")}
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex gap-5 text-sm font-medium text-slate-600 flex-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-blue-700 whitespace-nowrap transition-colors">
              {item.label}
            </Link>
          ))}
        </div>

        {/* Language switcher (desktop) */}
        <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 ml-auto">
          {(["en", "zh", "ja", "th"] as Locale[]).map((l) => (
            <Link key={l} href={`/${l}/compare`}
              className={`px-1.5 py-0.5 rounded hover:text-blue-600 transition-colors ${l === locale ? "text-blue-600 font-semibold" : ""}`}>
              {l === "en" ? "EN" : l === "zh" ? "中" : l === "ja" ? "JP" : "TH"}
            </Link>
          ))}
        </div>

        <Link href={`${base}/enquiry`}
          className="hidden md:inline-block bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors ml-3 shrink-0">
          {t(locale, "book_now")}
        </Link>

        {/* Mobile hamburger */}
        <div className="md:hidden ml-auto">
          <MobileMenuButton
            items={navItems}
            bookLabel={t(locale, "book_now")}
            bookHref={`${base}/enquiry`}
          />
        </div>
      </div>
    </nav>
  );
}

function Footer({ locale }: { locale: Locale }) {
  const base = `/${locale}`;
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm text-slate-500">
        <div>
          <p className="font-semibold text-slate-800 mb-2">{t(locale, "site_name")}</p>
          <p className="text-xs leading-relaxed">{t(locale, "tagline")}</p>
          <div className="flex gap-3 mt-4 text-xs">
            {(["en", "zh", "ja", "th", "ar"] as Locale[]).map((l) => (
              <Link key={l} href={`/${l}`} className="hover:text-blue-600">
                {l === "en" ? "EN" : l === "zh" ? "中文" : l === "ja" ? "日本語" : l === "th" ? "ไทย" : "عر"}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="font-semibold text-slate-800 mb-2">Compare</p>
          {["executive", "comprehensive", "cancer", "cardiac", "women", "men"].map((c) => (
            <Link key={c} href={`${base}/compare?category=${c}`} className="block hover:text-blue-600 capitalize py-0.5">{c}</Link>
          ))}
        </div>
        <div>
          <p className="font-semibold text-slate-800 mb-2">Hospitals</p>
          <Link href={`${base}/hospital`} className="block hover:text-blue-600 py-0.5">All hospitals</Link>
          <Link href={`${base}/hospital/bumrungrad`} className="block hover:text-blue-600 py-0.5 text-xs">Bumrungrad</Link>
          <Link href={`${base}/hospital/bangkok-hospital`} className="block hover:text-blue-600 py-0.5 text-xs">Bangkok Hospital</Link>
          <Link href={`${base}/hospital/vejthani`} className="block hover:text-blue-600 py-0.5 text-xs">Vejthani</Link>
          <Link href={`${base}/hospital/bnh`} className="block hover:text-blue-600 py-0.5 text-xs">BNH Hospital</Link>
        </div>
        <div>
          <p className="font-semibold text-slate-800 mb-2">Info</p>
          <Link href={`${base}/guide/bangkok-health-checkup`} className="block hover:text-blue-600 py-0.5 text-xs">Bangkok guide</Link>
          <Link href={`${base}/guide/cancer-screening-bangkok`} className="block hover:text-blue-600 py-0.5 text-xs">Cancer screening</Link>
          <Link href={`${base}/guide/womens-health-checkup-bangkok`} className="block hover:text-blue-600 py-0.5 text-xs">Women&apos;s health</Link>
          <Link href={`${base}/guide/cardiac-health-checkup-bangkok`} className="block hover:text-blue-600 py-0.5 text-xs">Cardiac screening</Link>
          <Link href={`${base}/enquiry`} className="block hover:text-blue-600 py-0.5 text-xs">Book / Enquire</Link>
          <Link href={`${base}/for-clinics`} className="block hover:text-blue-600 py-0.5 text-xs">For hospitals</Link>
        </div>
      </div>
      <div className="border-t border-slate-100 py-4 text-center text-xs text-slate-400">
        © {year} {t(locale, "site_name")}. Prices are informational and subject to change without notice.
        No paid placement — all rankings sorted by price only.
      </div>
    </footer>
  );
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = locale as Locale;
  return (
    <html lang={loc} dir={isRTL(loc) ? "rtl" : "ltr"} className={inter.variable}>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased font-[var(--font-inter)]">
        <NavBar locale={loc} />
        <main className="flex-1 pb-14 md:pb-0">{children}</main>
        {/* Mobile sticky bottom CTA — hidden on md+ (compare drawer uses its own sticky bar) */}
        <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-slate-200 px-4 py-2.5 flex gap-2 shadow-lg">
          <Link href={`/${loc}/compare`}
            className="flex-1 bg-blue-600 text-white text-sm font-bold py-2.5 rounded-xl text-center hover:bg-blue-700 transition-colors">
            Compare packages
          </Link>
          <Link href={`/${loc}/enquiry`}
            className="flex-none border border-blue-200 text-blue-700 text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-blue-50 transition-colors">
            Get help
          </Link>
        </div>
        <Footer locale={loc} />
      </body>
    </html>
  );
}
