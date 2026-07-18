"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALES, type Locale } from "@/lib/i18n";

const LOCALE_CODES: Record<Locale, string> = {
  th: "TH", en: "EN", ko: "KO", ar: "AR",
};

// Swaps just the locale segment of the current path so switching language
// keeps the user on the equivalent page instead of bouncing to the homepage.
function pathForLocale(pathname: string, locale: Locale): string {
  const segments = pathname.split("/");
  segments[1] = locale;
  return segments.join("/") || `/${locale}`;
}

export function LocaleToggle({ locale }: { locale: Locale }) {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1">
      {LOCALES.map((l) =>
        l === locale ? (
          <span
            key={l}
            className="text-xs font-bold px-2 py-1.5 rounded-full bg-rose-500 text-white"
          >
            {LOCALE_CODES[l]}
          </span>
        ) : (
          <Link
            key={l}
            href={pathForLocale(pathname, l)}
            className="text-xs font-medium px-2 py-1.5 rounded-full border border-[#efe1db] text-[#8a7a76] hover:border-rose-400 hover:text-rose-500 transition-colors"
          >
            {LOCALE_CODES[l]}
          </Link>
        )
      )}
    </div>
  );
}
