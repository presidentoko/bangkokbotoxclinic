import Link from "next/link";
import { t, concernLabelShort, type Locale } from "@/lib/i18n";
import { CONCERNS } from "@/lib/data";

export function Header({ locale }: { locale: Locale }) {
  const other = locale === "th" ? "en" : "th";
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
        <Link
          href={`/${other}`}
          className="uppercase text-xs font-medium px-2.5 py-1 rounded-full border border-[#efe1db] text-[#8a7a76] hover:border-rose-400 hover:text-rose-500 transition-colors"
        >
          {other}
        </Link>
      </div>

      {/* ── Row 2 (mobile): horizontally-scrollable concern + methodology chips ── */}
      <div className="sm:hidden overflow-x-auto scrollbar-none px-4 pb-2.5">
        <div className="flex items-center gap-2 w-max">
          {CONCERNS.map((c) => (
            <Link
              key={c}
              href={`/${locale}/${c}`}
              className="whitespace-nowrap text-sm text-[#8a7a76] hover:text-rose-500 transition-colors px-3 py-1 rounded-full border border-[#efe1db] bg-white hover:border-rose-300"
            >
              {concernLabelShort(locale, c)}
            </Link>
          ))}
          <Link
            href={`/${locale}/methodology`}
            className="whitespace-nowrap text-sm text-[#8a7a76] hover:text-rose-500 transition-colors px-3 py-1 rounded-full border border-[#efe1db] bg-white hover:border-rose-300"
          >
            {t(locale, "methodology")}
          </Link>
        </div>
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
        <Link
          href={`/${locale}/methodology`}
          className="ml-auto text-[#8a7a76] hover:text-rose-500 transition-colors whitespace-nowrap shrink-0 pl-2"
        >
          {t(locale, "methodology")}
        </Link>
        <Link
          href={`/${other}`}
          className="uppercase text-xs font-medium px-2.5 py-1 rounded-full border border-[#efe1db] text-[#8a7a76] hover:border-rose-400 hover:text-rose-500 transition-colors shrink-0"
        >
          {other}
        </Link>
      </nav>
    </header>
  );
}
