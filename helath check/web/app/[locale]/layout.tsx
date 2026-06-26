import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { LOCALES, type Locale, isRTL, t, OG_LOCALE } from "@/lib/i18n";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1d6fa4",
};

const BASE_URL = "https://www.bangkoktopclinic.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc = locale as Locale;
  const alternates: Record<string, string> = {};
  for (const l of LOCALES) {
    alternates[l] = `${BASE_URL}/${l}`;
  }
  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: `${t(loc, "site_name")} — ${t(loc, "tagline")}`,
      template: `%s | ${t(loc, "site_name")}`,
    },
    description: t(loc, "tagline"),
    alternates: {
      canonical: `${BASE_URL}/${loc}`,
      languages: alternates,
    },
    openGraph: {
      type: "website",
      siteName: t(loc, "site_name"),
      locale: OG_LOCALE[loc],
    },
  };
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export const revalidate = 86400;

function NavBar({ locale }: { locale: Locale }) {
  const base = `/${locale}`;
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center gap-6">
        <Link href={base} className="font-bold text-blue-700 text-lg tracking-tight shrink-0">
          {t(locale, "site_name")}
        </Link>
        <div className="flex gap-4 text-sm font-medium text-slate-600 overflow-x-auto">
          <Link href={`${base}/compare`} className="hover:text-blue-700 whitespace-nowrap">
            {t(locale, "nav_compare")}
          </Link>
          <Link href={`${base}/hospital`} className="hover:text-blue-700 whitespace-nowrap">
            {t(locale, "nav_hospitals")}
          </Link>
          <Link href={`${base}/guide/bangkok-health-checkup`} className="hover:text-blue-700 whitespace-nowrap">
            {t(locale, "nav_guide")}
          </Link>
          <Link href={`${base}/enquiry`} className="hover:text-blue-700 whitespace-nowrap">
            {t(locale, "nav_enquiry")}
          </Link>
        </div>
        <div className="ml-auto shrink-0">
          <Link
            href={`${base}/enquiry`}
            className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t(locale, "book_now")}
          </Link>
        </div>
      </div>
    </nav>
  );
}

function Footer({ locale }: { locale: Locale }) {
  const base = `/${locale}`;
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm text-slate-500">
        <div>
          <p className="font-semibold text-slate-800 mb-2">{t(locale, "site_name")}</p>
          <p>{t(locale, "tagline")}</p>
        </div>
        <div>
          <p className="font-semibold text-slate-800 mb-2">{t(locale, "nav_compare")}</p>
          {["executive", "comprehensive", "cancer", "cardiac"].map((c) => (
            <Link key={c} href={`${base}/compare?category=${c}`} className="block hover:text-blue-600 capitalize">
              {c}
            </Link>
          ))}
        </div>
        <div>
          <p className="font-semibold text-slate-800 mb-2">{t(locale, "nav_hospitals")}</p>
          <Link href={`${base}/hospital`} className="block hover:text-blue-600">All hospitals</Link>
        </div>
        <div>
          <p className="font-semibold text-slate-800 mb-2">More</p>
          <Link href={`${base}/guide/bangkok-health-checkup`} className="block hover:text-blue-600">{t(locale, "nav_guide")}</Link>
          <Link href={`${base}/enquiry`} className="block hover:text-blue-600">{t(locale, "nav_enquiry")}</Link>
          <Link href={`${base}/for-clinics`} className="block hover:text-blue-600">For clinics</Link>
        </div>
      </div>
      <div className="border-t border-slate-100 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} {t(locale, "site_name")}. Prices are informational and may change.
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
        <main className="flex-1">{children}</main>
        <Footer locale={loc} />
      </body>
    </html>
  );
}
