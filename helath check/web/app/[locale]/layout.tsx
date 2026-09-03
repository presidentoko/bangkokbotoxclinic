import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "../globals.css";
import { LOCALES, type Locale, isRTL, t, OG_LOCALE } from "@/lib/i18n";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MobileMenuButton } from "@/app/components/MobileNav";
import { WhatsAppCTA } from "@/app/components/WhatsAppCTA";
import { SiteSearch } from "@/app/components/SiteSearch";
import { SavedCount } from "@/app/components/SaveButton";

// NEXT_PUBLIC_GA4_ID is currently unset (empty string) in both .env.local and
// Vercel production — this renders nothing until a real Measurement ID
// (G-XXXXXXX from analytics.google.com) is added as an env var. No code
// change needed once that's set; this is the one thing this fix could not
// complete, since there's no ID to wire in.
const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID;

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
    // No `template` on purpose. Appending " | BangkokCheckup" spent 17 of the
    // ~60 characters Google actually renders on every single page, pushing the
    // differentiating half of most titles past the truncation point — and the
    // brand earns nothing back at an average position of 18, where nobody
    // recognises it yet. Pages that want the brand can say so themselves.
    title: `${t(loc, "site_name")} — ${t(loc, "tagline")}`,
    description: t(loc, "tagline"),
    alternates: { canonical: `${BASE_URL}/${loc}`, languages: alternates },
    openGraph: { type: "website", siteName: t(loc, "site_name"), locale: OG_LOCALE[loc] },
    robots: { index: true, follow: true },
  };
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

// Next.js uses the LOWEST revalidate across layout+page for a route, so this
// value is the ceiling for the entire site. It was 3600, which silently
// forced all ~4,000 SSG pages (including the 86400 guide pages) to
// regenerate hourly under bot crawl — the root cause of blowing through
// Vercel hobby ISR read/write quotas. Prices are scraped once daily, so
// daily revalidation matches the data cadence.
// Fully static: no revalidation. Every value on this page comes from
// data/checkup_db.json, which is baked into the build — it cannot change
// without a redeploy, so re-rendering on a timer just reproduces byte-identical
// HTML. The old `revalidate = 86400` regenerated all ~2,600 pages daily at
// ~174 KB each: roughly 13 GB/month of Fast Origin Transfer and 2.9M ISR reads
// for zero content change. A deploy invalidates the CDN, which is the only
// invalidation this data needs.
export const revalidate = false;

function NavBar({ locale }: { locale: Locale }) {
  const base = `/${locale}`;
  const navItems = [
    { href: `${base}/compare`, label: t(locale, "nav_compare") },
    { href: `${base}/hospital`, label: t(locale, "nav_hospitals") },
    // The national register — every hospital in Thailand, not only the ones
    // we hold prices for.
    { href: `${base}/directory`, label: "All hospitals" },
    { href: `${base}/guide`, label: t(locale, "nav_guide") },
    { href: `${base}/trends`, label: t(locale, "nav_trends") },
    { href: `${base}/saved`, label: t(locale, "nav_saved") },
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
            <Link key={item.href} href={item.href} className="hover:text-blue-700 whitespace-nowrap transition-colors flex items-center">
              {item.label}
              {item.href === `${base}/saved` && <SavedCount />}
            </Link>
          ))}
        </div>

        {/* Search (desktop) */}
        <div className="hidden md:block w-48 shrink-0">
          <SiteSearch locale={locale} />
        </div>

        {/* Language switcher (desktop) */}
        <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400">
          {([["en","EN"],["zh","中"],["ja","JP"],["th","TH"],["ko","한"],["ar","عر"]] as [Locale,string][]).map(([l, label]) => (
            <Link key={l} href={`/${l}/compare`}
              className={`px-1.5 py-0.5 rounded hover:text-blue-600 transition-colors ${l === locale ? "text-blue-600 font-semibold" : ""}`}>
              {label}
            </Link>
          ))}
        </div>

        <Link href={`${base}/enquiry`}
          className="hidden md:inline-block bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors ms-3 shrink-0">
          {t(locale, "book_now")}
        </Link>

        {/* Mobile hamburger */}
        <div className="md:hidden ms-auto">
          <MobileMenuButton
            items={navItems}
            bookLabel={t(locale, "book_now")}
            bookHref={`${base}/enquiry`}
            locale={locale}
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
          <div className="flex flex-wrap gap-3 mt-4 text-xs">
            {([["en","EN"],["zh","中文"],["ja","日本語"],["th","ไทย"],["ko","한국어"],["ar","عربي"]] as [Locale,string][]).map(([l, label]) => (
              <Link key={l} href={`/${l}`} className="hover:text-blue-600">{label}</Link>
            ))}
          </div>
        </div>
        <div>
          <p className="font-semibold text-slate-800 mb-2">Compare</p>
          {/* "comprehensive" and "cardiac" hold zero packages since
              fix_all_data.py redistributes the importers' staging categories,
              and next.config.ts now 308s both to /compare — so every page on
              the site was linking two redirects from its footer. */}
          {["executive", "standard", "basic", "cancer", "heart", "women", "men", "senior"].map((c) => (
            <Link key={c} href={`${base}/compare/${c}`} className="block hover:text-blue-600 capitalize py-0.5">{c}</Link>
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
          <p className="font-semibold text-slate-800 mb-2">Cities</p>
          <Link href={`${base}/city/bangkok`} className="block hover:text-blue-600 py-0.5 text-xs">Bangkok</Link>
          <Link href={`${base}/city/chiang-mai`} className="block hover:text-blue-600 py-0.5 text-xs">Chiang Mai</Link>
          <Link href={`${base}/city/phuket`} className="block hover:text-blue-600 py-0.5 text-xs">Phuket</Link>
          <Link href={`${base}/city/pattaya`} className="block hover:text-blue-600 py-0.5 text-xs">Pattaya</Link>
          <Link href={`${base}/city/hua-hin`} className="block hover:text-blue-600 py-0.5 text-xs">Hua Hin</Link>
          <Link href={`${base}/city/ko-samui`} className="block hover:text-blue-600 py-0.5 text-xs">Ko Samui</Link>
          <Link href={`${base}/guide`} className="block hover:text-blue-600 py-0.5 mt-2 text-xs font-medium">All guides →</Link>
          <Link href={`${base}/faq`} className="block hover:text-blue-600 py-0.5 text-xs">FAQ</Link>
          <Link href={`${base}/trends`} className="block hover:text-blue-600 py-0.5 text-xs">📊 Price trends</Link>
          <Link href={`${base}/saved`} className="block hover:text-blue-600 py-0.5 text-xs">★ Saved packages</Link>
          <Link href={`${base}/about`} className="block hover:text-blue-600 py-0.5 text-xs">About</Link>
          <Link href={`${base}/privacy`} className="block hover:text-blue-600 py-0.5 text-xs">Privacy</Link>
          <Link href={`${base}/enquiry`} className="block hover:text-blue-600 py-0.5 text-xs">Book / Enquire</Link>
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

  // 알 수 없는 첫 세그먼트는 404 다 (2026-08-08 GSC "Soft 404" 대응).
  //
  // 이 가드가 없을 때 `/asdfqwer`, `/admin`, `/login`, `/robots` 같은 아무 경로나
  // locale="asdfqwer" 로 들어와 영어로 폴백 렌더링되고 **HTTP 200 + 홈페이지**를
  // 반환했다(실측). 존재하지 않는 URL 이 무한히 200 을 내니 구글이 soft 404 로
  //판정한다. 두 단계 경로(`/shop/item/123`)는 매칭되는 라우트가 없어 이미
  // 404 였고, 한 단계 경로만 이 구멍으로 샜다.
  //
  // dynamicParams=false 를 쓰지 않는 이유: 이 레이아웃 아래에
  // checkup/[type], city/[city], for/[slug], compare/[category] 처럼 빌드타임에
  // 전부 나열되지 않는 동적 라우트가 있어서, 그쪽까지 프리렌더 전용으로
  // 묶여버린다. 여기서는 로케일 세그먼트만 검증한다.
  //
  // 레이아웃이 [locale] 하위 전체를 감싸므로 이 한 곳으로 트리 전체가 보호된다.
  if (!(LOCALES as readonly string[]).includes(locale)) notFound();
  const loc = locale as Locale;

  return (
    <html lang={loc} dir={isRTL(loc) ? "rtl" : "ltr"} className={inter.variable}>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased font-[var(--font-inter)]">
        {GA4_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`} strategy="afterInteractive" />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA4_ID}');`}
            </Script>
          </>
        )}
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
        <WhatsAppCTA />
        <Footer locale={loc} />
      </body>
    </html>
  );
}
