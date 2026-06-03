import Link from "next/link";
import { t, type Locale } from "@/lib/i18n";
import { generatedAt } from "@/lib/data";

export function Footer({ locale }: { locale: Locale }) {
  const date = generatedAt();
  const affiliateNote =
    locale === "th"
      ? "บางลิงก์เป็นลิงก์พันธมิตร"
      : "Some links are affiliate links";

  return (
    <footer className="border-t border-[#efe1db] mt-12">
      <div className="mx-auto max-w-5xl px-4 py-8">
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
            <p>{affiliateNote}</p>
            <p>
              {t(locale, "updated")}: {date}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
