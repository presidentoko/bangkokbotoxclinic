import type { NichePlace } from "@/lib/niches";

/**
 * How much text on a venue page is the venue's own, rather than the template's.
 *
 * Reviews are the only field that differs venue to venue at any length. Name,
 * address, hours, rating and the verdict sentence are either facts Google Maps
 * already shows or one of a handful of templated strings — measured 2026-09-16,
 * 41-46% of the text inside <main> on an activity venue page was shared
 * verbatim with every other activity venue page.
 */
export function uniqueTextChars(p: NichePlace): number {
  const fromSample = (p.reviews_sample ?? []).reduce(
    (n, r) => n + (r?.text?.length ?? 0),
    0
  );
  if (fromSample > 0) return fromSample;
  return p.top_review_text?.length ?? 0;
}

/**
 * Below this many Google reviews there is nothing to collect even in principle,
 * so a venue with no review text here is thin permanently rather than pending a
 * backfill.
 *
 * 20 splits the 2,135 zero-text activity venues into 1,360 that do have reviews
 * on Google (median 100+) whose text the scrape simply missed, and 775 that
 * genuinely have almost none. Only the second group is thin on the merits.
 */
export const THIN_REVIEW_FLOOR = 20;

/**
 * A venue page with no unique text and no prospect of any.
 *
 * Measured against three months of GSC (export 2026-09-16, top 1,000 pages):
 *
 *   activity venues with review text   1,811 pages   18.2% earned an impression   5,264 impressions
 *   activity venues with none          2,135 pages    1.0% earned an impression      305 impressions
 *
 * and 204 of those 305 are a single coworking page. So the zero-text half is
 * 54% of the tree and ~2% of its impressions, which is the shape that gets a
 * site reclassified rather than a page ignored — thaigle lost 80% of its
 * impressions in one day on 2026-07-24, petbkk 94% on 08-16 and the dental site
 * 92% on 08-18, all three being Google Maps data in a template.
 *
 * These pages stay crawlable and keep their internal links on purpose. A
 * robots.txt Disallow would stop Google fetching them, and a page Google cannot
 * fetch is a page whose noindex it cannot read — the already-indexed ones would
 * simply stay indexed. See lib/placeIndexing.ts, which learned this the same way.
 */
export function isThinVenue(p: NichePlace): boolean {
  return uniqueTextChars(p) === 0 && (p.review_count ?? 0) < THIN_REVIEW_FLOOR;
}

/**
 * Zero unique text but enough reviews that the text exists to be collected.
 *
 * Not noindexed: these are the backfill target, and the 1,360 of them are the
 * largest single block of real content the site could still add. Deliberately
 * left indexed so that the effect of noindexing the 775 in isThinVenue can be
 * read on its own — cutting crawl surface cost bangkokfillers 80% of its
 * impressions in 2026-08, so the two groups do not move together.
 */
export function isBackfillCandidate(p: NichePlace): boolean {
  return uniqueTextChars(p) === 0 && (p.review_count ?? 0) >= THIN_REVIEW_FLOOR;
}
