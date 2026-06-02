import Link from "next/link";
import { t, concernLabel, type Locale } from "@/lib/i18n";

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
          <Link
            href={`/${locale}/acne`}
            className="whitespace-nowrap text-sm text-[#8a7a76] hover:text-rose-500 transition-colors px-3 py-1 rounded-full border border-[#efe1db] bg-white hover:border-rose-300"
          >
            {concernLabel(locale, "acne")}
          </Link>
          <Link
            href={`/${locale}/whitening`}
            className="whitespace-nowrap text-sm text-[#8a7a76] hover:text-rose-500 transition-colors px-3 py-1 rounded-full border border-[#efe1db] bg-white hover:border-rose-300"
          >
            {concernLabel(locale, "whitening")}
          </Link>
          <Link
            href={`/${locale}/methodology`}
            className="whitespace-nowrap text-sm text-[#8a7a76] hover:text-rose-500 transition-colors px-3 py-1 rounded-full border border-[#efe1db] bg-white hover:border-rose-300"
          >
            {t(locale, "methodology")}
          </Link>
        </div>
      </div>

      {/* ── Desktop: single-row nav ── */}
      <nav className="hidden sm:flex mx-auto max-w-5xl items-center gap-5 px-4 py-3 text-sm">
        <Link
          href={`/${locale}`}
          className="font-serif-display text-lg font-semibold text-[#2b2222] hover:text-rose-500 transition-colors mr-2"
        >
          {t(locale, "site_name")}
        </Link>
        <Link
          href={`/${locale}/acne`}
          className="text-[#8a7a76] hover:text-rose-500 transition-colors"
        >
          {concernLabel(locale, "acne")}
        </Link>
        <Link
          href={`/${locale}/whitening`}
          className="text-[#8a7a76] hover:text-rose-500 transition-colors"
        >
          {concernLabel(locale, "whitening")}
        </Link>
        <Link
          href={`/${locale}/methodology`}
          className="ml-auto text-[#8a7a76] hover:text-rose-500 transition-colors"
        >
          {t(locale, "methodology")}
        </Link>
        <Link
          href={`/${other}`}
          className="uppercase text-xs font-medium px-2.5 py-1 rounded-full border border-[#efe1db] text-[#8a7a76] hover:border-rose-400 hover:text-rose-500 transition-colors"
        >
          {other}
        </Link>
      </nav>
    </header>
  );
}
