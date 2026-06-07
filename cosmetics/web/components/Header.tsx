import Link from "next/link";
import { t, concernLabelShort, LOCALES, type Locale } from "@/lib/i18n";
import { CONCERNS } from "@/lib/data";

const LOCALE_CODES: Record<Locale, string> = {
  th: "TH", en: "EN", ko: "KO", ar: "AR",
};

function LocaleToggle({ locale }: { locale: Locale }) {
  return (
    <div className="flex items-center gap-0.5">
      {LOCALES.map((l) =>
        l === locale ? (
          <span
            key={l}
            className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-500 text-white"
          >
            {LOCALE_CODES[l]}
          </span>
        ) : (
          <Link
            key={l}
            href={`/${l}`}
            className="text-[10px] font-medium px-1.5 py-0.5 rounded-full border border-[#efe1db] text-[#8a7a76] hover:border-rose-400 hover:text-rose-500 transition-colors"
          >
            {LOCALE_CODES[l]}
          </Link>
        )
      )}
    </div>
  );
}

export function Header({ locale }: { locale: Locale }) {
  const isTh = locale === "th";
  return (
    <header className="sticky top-0 z-50 border-b border-[#efe1db] bg-[#fbf4f1]/90 backdrop-blur-sm">
      {/* ── Row 1: wordmark + locale toggle ── */}
      <div className="mx-auto max-w-5xl flex items-center justify-between px-4 pt-3 pb-1 sm:hidden">
        <Link
          href={`/${locale}`}
          className="font-serif-display text-lg font-semibold text-[#2b2222] hover:text-rose-500 transition-colors"
        >
          {t(locale, "site_name")}
        </Link>
        <div className="flex items-center gap-1.5">
          <Link
            href={`/${locale}/search`}
            className="flex items-center justify-center w-7 h-7 rounded-full border border-[#efe1db] text-[#8a7a76] hover:border-rose-400 hover:text-rose-500 transition-colors"
            aria-label="Search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </Link>
          <Link
            href={`/${locale}/quiz`}
            className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-500 hover:bg-rose-100 transition-colors"
          >
            {isTh ? "ทดสอบ 🌸" : "Quiz 🌸"}
          </Link>
          <Link
            href={`/${locale}/media-kit`}
            className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border border-[#c9a86a]/50 text-[#c9a86a] hover:bg-[#c9a86a]/10 transition-colors"
          >
            {isTh ? "โฆษณา" : "Ads"}
          </Link>
          <LocaleToggle locale={locale} />
        </div>
      </div>

      {/* ── Row 2 (mobile): horizontally-scrollable concern + methodology chips ── */}
      <div className="sm:hidden relative">
        <div className="overflow-x-auto scrollbar-none px-4 pb-2.5">
          <div className="flex items-center gap-2 w-max">
            {CONCERNS.map((c) => (
              <Link
                key={c}
                href={`/${locale}/${c}`}
                className="whitespace-nowrap text-sm text-[#8a7a76] hover:text-rose-500 transition-colors px-3 py-2 rounded-full border border-[#efe1db] bg-white hover:border-rose-300 min-h-[44px] flex items-center"
              >
                {concernLabelShort(locale, c)}
              </Link>
            ))}
            <Link
              href={`/${locale}/brand`}
              className="whitespace-nowrap text-sm text-[#8a7a76] hover:text-rose-500 transition-colors px-3 py-2 rounded-full border border-[#efe1db] bg-white hover:border-rose-300 min-h-[44px] flex items-center"
            >
              {isTh ? "แบรนด์" : "Brands"}
            </Link>
            <Link
              href={`/${locale}/methodology`}
              className="whitespace-nowrap text-sm text-[#8a7a76] hover:text-rose-500 transition-colors px-3 py-2 rounded-full border border-[#efe1db] bg-white hover:border-rose-300 min-h-[44px] flex items-center"
            >
              {t(locale, "methodology")}
            </Link>
          </div>
        </div>
        {/* Scroll hint fade */}
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#fbf4f1]/95 to-transparent pointer-events-none" />
      </div>

      {/* ── Desktop: single-row nav with scrollable concern chips ── */}
      <nav className="hidden sm:flex mx-auto max-w-5xl items-center gap-1 px-4 py-2.5 text-sm overflow-x-auto scrollbar-none">
        <Link
          href={`/${locale}`}
          className="font-serif-display text-lg font-semibold text-[#2b2222] hover:text-rose-500 transition-colors mr-3 shrink-0"
        >
          {t(locale, "site_name")}
        </Link>
        {CONCERNS.map((c) => (
          <Link
            key={c}
            href={`/${locale}/${c}`}
            className="whitespace-nowrap text-[#8a7a76] hover:text-rose-500 transition-colors px-2.5 py-1 rounded-full hover:bg-rose-50 shrink-0"
          >
            {concernLabelShort(locale, c)}
          </Link>
        ))}
        <div className="ml-auto flex items-center gap-1 shrink-0">
          <Link
            href={`/${locale}/search`}
            className="flex items-center gap-1 text-[#8a7a76] hover:text-rose-500 transition-colors px-2.5 py-1 rounded-full hover:bg-rose-50 whitespace-nowrap"
            aria-label="Search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span className="text-sm">{isTh ? "ค้นหา" : "Search"}</span>
          </Link>
          <Link
            href={`/${locale}/quiz`}
            className="text-xs font-semibold px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-500 hover:bg-rose-100 transition-colors whitespace-nowrap"
          >
            {isTh ? "ทดสอบ 🌸" : "Quiz 🌸"}
          </Link>
          <Link
            href={`/${locale}/brand`}
            className="text-[#8a7a76] hover:text-rose-500 transition-colors px-2.5 py-1 rounded-full hover:bg-rose-50 whitespace-nowrap"
          >
            {isTh ? "แบรนด์" : "Brands"}
          </Link>
          <Link
            href={`/${locale}/methodology`}
            className="text-[#8a7a76] hover:text-rose-500 transition-colors whitespace-nowrap pl-1"
          >
            {t(locale, "methodology")}
          </Link>
          <Link
            href={`/${locale}/media-kit`}
            className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-[#c9a86a]/50 text-[#c9a86a] hover:bg-[#c9a86a]/10 transition-colors whitespace-nowrap"
          >
            {isTh ? "โฆษณา" : "Advertise"}
          </Link>
          <LocaleToggle locale={locale} />
        </div>
      </nav>
    </header>
  );
}
