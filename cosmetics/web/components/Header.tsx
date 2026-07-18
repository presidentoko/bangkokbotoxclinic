import Link from "next/link";
import { t, concernLabelShort, type Locale } from "@/lib/i18n";
import { CONCERNS } from "@/lib/data";
import { currentSaleEvent } from "@/lib/sale";
import { LocaleToggle } from "@/components/LocaleToggle";
import { FavoritesBadge } from "@/components/FavoritesBadge";

export function Header({ locale }: { locale: Locale }) {
  const isTh = locale === "th";
  const sale = currentSaleEvent();
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
            href={`/${locale}/favorites`}
            className="relative flex items-center justify-center w-7 h-7 rounded-full border border-[#efe1db] text-[#8a7a76] hover:border-rose-400 hover:text-rose-500 transition-colors"
            aria-label="Saved"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <FavoritesBadge />
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
            <Link
              href={`/${locale}/sale/${sale.slug}`}
              className="whitespace-nowrap text-sm font-semibold text-rose-500 hover:text-rose-600 transition-colors px-3 py-2 rounded-full border border-rose-200 bg-rose-50 hover:bg-rose-100 min-h-[44px] flex items-center"
            >
              🔥 {isTh ? `ดีล ${sale.labelTh}` : sale.labelEn}
            </Link>
            <Link
              href={`/${locale}/budget/under-500`}
              className="whitespace-nowrap text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors px-3 py-2 rounded-full border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 min-h-[44px] flex items-center"
            >
              💰 {isTh ? "งบ 500" : "Under ฿500"}
            </Link>
          </div>
        </div>
        {/* Scroll hint fade */}
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#fbf4f1]/95 to-transparent pointer-events-none" />
      </div>

      {/* ── Desktop: 3-part layout — logo fixed | concerns scroll | actions fixed ── */}
      <div className="hidden sm:flex mx-auto max-w-5xl items-center px-4 py-2.5 gap-2">
        {/* Logo — fixed left */}
        <Link
          href={`/${locale}`}
          className="font-serif-display text-lg font-semibold text-[#2b2222] hover:text-rose-500 transition-colors shrink-0 mr-1"
        >
          {t(locale, "site_name")}
        </Link>

        {/* Concern chips + secondary nav — scrollable middle */}
        <nav className="flex-1 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1 w-max text-sm">
            {CONCERNS.map((c) => (
              <Link
                key={c}
                href={`/${locale}/${c}`}
                className="whitespace-nowrap text-[#8a7a76] hover:text-rose-500 transition-colors px-2.5 py-1 rounded-full hover:bg-rose-50"
              >
                {concernLabelShort(locale, c)}
              </Link>
            ))}
            <Link
              href={`/${locale}/brand`}
              className="whitespace-nowrap text-[#8a7a76] hover:text-rose-500 transition-colors px-2.5 py-1 rounded-full hover:bg-rose-50"
            >
              {isTh ? "แบรนด์" : "Brands"}
            </Link>
            <Link
              href={`/${locale}/sale/${sale.slug}`}
              className="whitespace-nowrap text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-500 hover:bg-rose-100 transition-colors"
            >
              🔥 {isTh ? `ดีล ${sale.labelTh}` : sale.labelEn}
            </Link>
            <Link
              href={`/${locale}/budget/under-500`}
              className="whitespace-nowrap text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 hover:bg-emerald-100 transition-colors"
            >
              💰 {isTh ? "งบ 500" : "Under ฿500"}
            </Link>
          </div>
        </nav>

        {/* Actions + locale — always visible fixed right */}
        <div className="flex items-center gap-1 shrink-0">
          <Link
            href={`/${locale}/search`}
            className="flex items-center gap-1 text-[#8a7a76] hover:text-rose-500 transition-colors px-2 py-1 rounded-full hover:bg-rose-50"
            aria-label="Search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </Link>
          <Link
            href={`/${locale}/favorites`}
            className="relative flex items-center gap-1 text-[#8a7a76] hover:text-rose-500 transition-colors px-2 py-1 rounded-full hover:bg-rose-50"
            aria-label="Saved"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <FavoritesBadge />
          </Link>
          <Link
            href={`/${locale}/quiz`}
            className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-500 hover:bg-rose-100 transition-colors whitespace-nowrap"
          >
            {isTh ? "ทดสอบ 🌸" : "Quiz 🌸"}
          </Link>
          <Link
            href={`/${locale}/media-kit`}
            className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border border-[#c9a86a]/50 text-[#c9a86a] hover:bg-[#c9a86a]/10 transition-colors whitespace-nowrap"
          >
            {isTh ? "โฆษณา" : "Ads"}
          </Link>
          <div className="w-px h-4 bg-[#efe1db] mx-0.5" />
          <LocaleToggle locale={locale} />
        </div>
      </div>
    </header>
  );
}
