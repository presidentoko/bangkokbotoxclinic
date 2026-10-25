import { allIngredients, ingredientSlug } from "@/lib/data";
import type { IngredientEntry } from "@/lib/types";
import type { Locale } from "@/lib/i18n";

/**
 * Links between ingredient pages, on relationships the data already asserts.
 *
 * Why this exists, from the 2026-10-25 Search Console export (last 3 months):
 * /ingredient draws 501 impressions across 31 URLs — 16.2 per URL, the highest
 * of any route class on the site and more than three times /brand's 4.8 — and
 * sits at average position 70.0, the worst of any class. The pages are not
 * thin: /th/ingredient/niacinamide renders 5,907 characters, carries the exact
 * query in its title ("ไนอะซินาไมด์ คืออะไร" against the query
 * "ไนอะซินาไมด์ คือ"), is self-canonical and is in the sitemap. What it has
 * none of is links from its siblings: of 97 internal links on that page, 40 go
 * to products and 3 to /ingredient — and those 3 are the global nav, which
 * every route class gets identically. 67 ingredient pages, each an island.
 *
 * So this adds links and removes nothing. The 2026-08-17 commit that cut the
 * crawl surface by 40% took weekly impressions from 411 to 87, and nine weeks
 * later they have not recovered; the lesson recorded from it is that a
 * confident judgment about which pages "could never rank" was wrong about the
 * pages that were earning. Adding a link cannot repeat that.
 *
 * Two relationships, both already in ingredient_db.json:
 *
 *   1. Pairing. 17 of 67 ingredients carry combo_good/combo_avoid prose that
 *      names other actives in running text ("ใช้ร่วมกับวิตามินซี กรดผลัดเซลล์
 *      และเรตินอล"). Those names become links. The claim is the editor's
 *      already-published one, so linking it asserts nothing new.
 *
 *   2. Shared concern. concern_efficacy scores every ingredient 0-3 per
 *      concern, so "other actives for this concern, by strength of evidence"
 *      is arithmetic over published scores rather than an opinion.
 */

/** A run of pairing prose: plain text, or text that links to an ingredient. */
export type ComboSegment = { text: string; slug?: string };

/**
 * Thai has no word spaces, so a substring match is not a word match. The
 * recorded failure mode is counting ไม่แพง ("not expensive") as แพง
 * ("expensive"), and a 3,240-hit match collapsing to 27 once guarded. Three
 * guards, in this order:
 *
 *   - Minimum length. Short terms are fragments of longer ones. "กรด" (acid)
 *     opens a dozen ingredient names; it is never a link on its own.
 *   - Ambiguity. A term occurring inside any OTHER ingredient's term is
 *     dropped entirely, rather than linked to one of them by luck of ordering.
 *   - Longest first. Where terms nest legitimately the specific one wins, and
 *     matched spans never overlap.
 *
 * Latin terms get a word boundary as well, which Thai cannot use.
 */
const MIN_TERM_CHARS = 4;

export type Term = { term: string; slug: string; latin: boolean };

const isLatin = (s: string) => /^[\x20-\x7E]+$/.test(s);

/**
 * Every name a reader might see for an ingredient in this locale, pointing at
 * its page. Built from the same db the pages render from.
 */
export function lexicon(locale: Locale): Term[] {
  const raw: Term[] = [];
  for (const [inci, e] of allIngredients()) {
    const slug = ingredientSlug(inci);
    const names =
      locale === "th"
        ? [e.th_name, ...(e.alt_th_names ?? [])]
        : [e.en_name, ...(e.aliases ?? [])];
    for (const n of names) {
      const term = (n ?? "").trim();
      if (term.length >= MIN_TERM_CHARS) raw.push({ term, slug, latin: isLatin(term) });
    }
  }

  // Ambiguity guard: a term two different ingredients both answer to cannot be
  // linked, because the prose does not say which one it means. "Retinoid" is an
  // alias of both Adapalene and Retinol, and "Zinc" of both Zinc and Zinc PCA;
  // whichever the loop reached first would win, which is a coin toss dressed as
  // an editorial link. Dropped from both.
  //
  // Containment is a different case and is left alone: "Vitamin C" sits inside
  // "Vitamin C Ester", but the longest-first sort below matches the ester where
  // the prose says ester and ascorbic acid where it says plain Vitamin C. That
  // is correct, and it keeps the single most common mention in this prose
  // linkable — dropping it would silence most of the pairing passages.
  const duplicated = new Set(
    raw
      .filter((a) => raw.some((b) => b.slug !== a.slug && b.term.toLowerCase() === a.term.toLowerCase()))
      .map((a) => a.term.toLowerCase())
  );
  const kept = raw.filter((a) => !duplicated.has(a.term.toLowerCase()));

  // Longest first, so the specific name wins over the general one.
  return kept.sort((x, y) => y.term.length - x.term.length);
}

function latinBounded(hay: string, idx: number, len: number): boolean {
  const wordish = (c: string | undefined) => c !== undefined && /[A-Za-z0-9]/.test(c);
  return !wordish(hay[idx - 1]) && !wordish(hay[idx + len]);
}

/**
 * Splits pairing prose into segments, linking the ingredient names it finds.
 *
 * `selfSlug` is never linked: a page linking to itself spends a link and tells
 * a reader nothing. Returns a single plain segment when nothing matches, so the
 * caller can render every result the same way.
 */
export function comboSegments(
  text: string,
  locale: Locale,
  selfSlug: string,
  terms: Term[] = lexicon(locale)
): ComboSegment[] {
  if (!text) return [];
  const hay = text;
  const taken: { start: number; end: number; slug: string }[] = [];

  for (const { term, slug, latin } of terms) {
    if (slug === selfSlug) continue;
    const needle = latin ? term.toLowerCase() : term;
    const scope = latin ? hay.toLowerCase() : hay;
    let from = 0;
    for (;;) {
      const at = scope.indexOf(needle, from);
      if (at < 0) break;
      from = at + 1;
      if (latin && !latinBounded(hay, at, term.length)) continue;
      const end = at + term.length;
      // No overlapping links, and one link per ingredient per passage: a
      // second mention of the same name adds crawl weight, not information.
      if (taken.some((t) => at < t.end && end > t.start)) continue;
      if (taken.some((t) => t.slug === slug)) continue;
      taken.push({ start: at, end, slug });
    }
  }

  if (taken.length === 0) return [{ text }];

  taken.sort((a, b) => a.start - b.start);
  const out: ComboSegment[] = [];
  let cursor = 0;
  for (const t of taken) {
    if (t.start > cursor) out.push({ text: hay.slice(cursor, t.start) });
    out.push({ text: hay.slice(t.start, t.end), slug: t.slug });
    cursor = t.end;
  }
  if (cursor < hay.length) out.push({ text: hay.slice(cursor) });
  return out;
}

export type RelatedIngredient = {
  slug: string;
  inci: string;
  name: string;
  score: number;
};

/**
 * Other actives for the same concern, strongest evidence first.
 *
 * The concern is the ingredient's own best one, so the comparison is the one a
 * reader on this page is already making. Ties break on name, so the order is
 * stable across builds instead of following object key order.
 */
export function relatedByConcern(
  inci: string,
  locale: Locale,
  limit = 6
): { concern: string; items: RelatedIngredient[] } | null {
  const all = allIngredients();
  const self = all.find(([k]) => k === inci)?.[1];
  if (!self) return null;

  const best = Object.entries(self.concern_efficacy ?? {})
    .filter(([, v]) => (v ?? 0) > 0)
    .sort((a, b) => b[1] - a[1])[0];
  if (!best) return null;
  const concern = best[0];

  const items = all
    .filter(([k, e]) => k !== inci && (e.concern_efficacy?.[concern] ?? 0) > 0)
    .map(([k, e]: [string, IngredientEntry]) => ({
      slug: ingredientSlug(k),
      inci: k,
      name: locale === "th" ? e.th_name : e.en_name,
      score: e.concern_efficacy[concern],
    }))
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
    .slice(0, limit);

  return items.length > 0 ? { concern, items } : null;
}
