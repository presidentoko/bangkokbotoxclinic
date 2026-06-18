import Link from "next/link";
import { t, type Locale } from "@/lib/i18n";
import { generatedAt } from "@/lib/data";

export function Footer({ locale }: { locale: Locale }) {
  const date = generatedAt();
  const isTh = locale === "th";

  return (
    <footer className="border-t border-[#efe1db] mt-12">
      <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
        {/* Main row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <p className="font-serif-display font-semibold text-[#2b2222]">
              BangkokFillers
            </p>
            <p className="text-sm text-[#8a7a76]">
              {t(locale, "tagline")}
            </p>
          </div>
          <div className="flex flex-col gap-1 text-sm text-[#8a7a76] sm:items-end">
            <Link
              href={`/${locale}/methodology`}
              className="text-rose-500 hover:text-rose-600 transition-colors"
            >
              {t(locale, "methodology")}
            </Link>
            <Link
              href={`/${locale}/media-kit`}
              className="text-[#c9a86a] hover:text-amber-600 transition-colors font-medium"
            >
              {isTh ? "โฆษณากับเรา" : "Advertise with us"}
            </Link>
            <p>{isTh ? "บางลิงก์เป็นลิงก์พันธมิตร" : "Some links are affiliate links"}</p>
            <p>{t(locale, "updated")}: {date}</p>
          </div>
        </div>

        {/* Advertising contact */}
        <div className="rounded-2xl border border-[#efe1db] bg-white px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="text-sm text-neutral-600">
            {isTh
              ? "สนใจลงโฆษณาหรือความร่วมมือทางธุรกิจ?"
              : "Interested in advertising or business partnerships?"}
          </p>
          <Link
            href={`/${locale}/contact`}
            className="text-sm font-semibold text-rose-500 hover:text-rose-600 transition-colors whitespace-nowrap"
          >
            {isTh ? "문의하기 →" : "Get in touch →"}
          </Link>
        </div>
      </div>
    </footer>
  );
}
