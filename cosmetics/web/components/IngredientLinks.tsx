import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { concernLabel } from "@/lib/i18n";
import { comboSegments, relatedByConcern } from "@/lib/ingredient-links";

/**
 * The two link blocks on an ingredient page. See lib/ingredient-links.ts for
 * why these exist and what relationship each one stands on.
 */

/**
 * Pairing prose with the ingredients it names turned into links.
 *
 * The text is unchanged — comboSegments reassembles to the input exactly, and a
 * test asserts that over every passage in the db, because this is published
 * editorial copy and a linkifier that drops a character rewrites it.
 */
export function ComboProse({
  text,
  locale,
  selfSlug,
}: {
  text: string;
  locale: Locale;
  selfSlug: string;
}) {
  const segs = comboSegments(text, locale, selfSlug);
  return (
    <span>
      {segs.map((s, i) =>
        s.slug ? (
          <Link
            key={i}
            href={`/${locale}/ingredient/${s.slug}`}
            className="underline decoration-rose-200 decoration-2 underline-offset-2 hover:decoration-rose-400 transition-colors"
          >
            {s.text}
          </Link>
        ) : (
          <span key={i}>{s.text}</span>
        )
      )}
    </span>
  );
}

const STRENGTH: Record<number, { th: string; en: string }> = {
  3: { th: "หลักฐานหนาแน่น", en: "strong evidence" },
  2: { th: "หลักฐานปานกลาง", en: "moderate evidence" },
  1: { th: "หลักฐานจำกัด", en: "limited evidence" },
};

/**
 * Other actives for the same concern, strongest first.
 *
 * Each row carries the evidence strength behind it, so the list answers "what
 * else could I use for this, and is it better supported than what I am reading
 * about" rather than just filling a related-links box. The scores are the
 * published concern_efficacy values, the same ones the page above ranks by.
 */
export function SameConcernActives({
  inci,
  locale,
}: {
  inci: string;
  locale: Locale;
}) {
  const rel = relatedByConcern(inci, locale);
  if (!rel) return null;
  const isTh = locale === "th";
  const label = concernLabel(locale, rel.concern);

  return (
    <section className="not-prose space-y-3">
      <h2 className="font-serif-display text-lg sm:text-xl font-semibold text-neutral-800">
        {isTh ? `ส่วนผสมอื่นที่ใช้สำหรับ${label}` : `Other actives used for ${label}`}
      </h2>
      <p className="text-sm text-neutral-500">
        {isTh
          ? "เรียงตามความหนาแน่นของหลักฐานสำหรับปัญหาผิวนี้"
          : "Ordered by how well supported each one is for this concern."}
      </p>
      <ul className="rounded-2xl border border-[#f5e6d3] bg-white overflow-hidden">
        {rel.items.map((i) => (
          <li key={i.slug}>
            <Link
              href={`/${locale}/ingredient/${i.slug}`}
              className="flex items-baseline justify-between gap-3 px-5 py-3 border-b last:border-b-0 border-[#faf0e6] hover:bg-rose-50/40 transition-colors"
            >
              <span className="text-sm font-medium text-neutral-800">{i.name}</span>
              <span className="text-xs text-neutral-400 shrink-0">
                {(isTh ? STRENGTH[i.score]?.th : STRENGTH[i.score]?.en) ?? ""}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
