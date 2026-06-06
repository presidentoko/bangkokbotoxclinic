import Link from "next/link";
import { t, concernLabelShort, type Locale } from "@/lib/i18n";
import { CONCERNS } from "@/lib/data";

export function Header({ locale }: { locale: Locale }) {
  const other = locale === "th" ? "en" : "th";
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
          <Link
            href={`/${other}`}
            className="uppercase text-xs font-medium px-2.5 py-1 rounded-full border border-[#efe1db] text-[#8a7a76] hover:border-rose-400 hover:text-rose-500 transition-colors"
          >
            {other}
          </Link>
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
          <Link
            href={`/${other}`}
            className="uppercase text-xs font-medium px-2.5 py-1 rounded-full border border-[#efe1db] text-[#8a7a76] hover:border-rose-400 hover:text-rose-500 transition-colors"
          >
            {other}
          </Link>
        </div>
      </nav>
    </header>
  );
}
