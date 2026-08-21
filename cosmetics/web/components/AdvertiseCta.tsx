import Link from "next/link";
import type { Locale } from "@/lib/i18n";

/**
 * A quiet route from a brand's own page to the media kit.
 *
 * The people most likely to buy a placement are brand marketers looking at how
 * their products rank here — and until now the only links to the media kit were
 * on the homepage and in the footer, nowhere near that moment. Kept
 * deliberately plain: it sits after the content, reads as a line of text rather
 * than an ad unit, and never competes with the rankings above it.
 */
export function AdvertiseCta({
  locale,
  brand,
}: {
  locale: Locale;
  brand?: string;
}) {
  const isTh = locale === "th";
  return (
    <aside className="mt-10 rounded-xl border border-[#efe1db] bg-white/70 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
      <p className="text-sm text-neutral-600">
        {brand
          ? isTh
            ? `ทำงานให้ ${brand} อยู่ใช่ไหม? ลงโฆษณาบนหน้านี้ได้`
            : `Work with ${brand}? You can advertise on this page.`
          : isTh
            ? "แบรนด์ของคุณอยากปรากฏตรงนี้ใช่ไหม?"
            : "Want your brand featured here?"}
      </p>
      <Link
        href={`/${locale}/media-kit`}
        className="text-sm font-semibold text-rose-500 hover:text-rose-600 transition-colors whitespace-nowrap"
      >
        {isTh ? "ดูอัตราค่าโฆษณา →" : "See our rate card →"}
      </Link>
    </aside>
  );
}
