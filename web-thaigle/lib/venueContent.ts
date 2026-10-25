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

/**
 * Google's own category for a venue whose business is sexual services, and the
 * name patterns that advertise the same thing under a neutral category.
 *
 * Measured 2026-10-15 across the seven activity datasets: 64 venues carry the
 * category "Erotic massage" and 9 "Soapy massage", and a further 10 sit under
 * "Massage spa" or "Thai massage therapist" while naming the service in the
 * title — "Nuru Massage", "Chiang Mai Erotic Massage 色情按摩", a Phuket listing
 * advertising prostate and yoni massage. Every one of the 10 was read by hand;
 * none is a false positive, and no legitimate spa in the set matches.
 *
 * The name pass is not optional. Google's category is self-reported and a third
 * of these venues simply do not use it.
 */
const ADULT_CATEGORY = /erotic|soapy|escort|brothel|strip\s*club|sex\s*shop|adult\s*entertainment/i;
const ADULT_NAME =
  /nuru|soapy|happy\s*ending|body\s*to\s*body|\bb2b\b|lingam|prostate|\byoni\b|\bnude\b|변마|色情|유흥/i;

/**
 * A venue thaigle should not publish at all.
 *
 * Not a taste call — two concrete liabilities, both measured on 2026-10-15:
 *
 * 1. AdSense. These pages carry publisher ID ca-pub-7308941037330924, which is
 *    shared with seven other sites in the same account. 20 of the 74 pages
 *    already hold review text that names sexual acts explicitly, and the
 *    mostRelevant deepening run merged the same day raised every one of them
 *    from 3 reviews to 8 — so the volume was about to go up, not down.
 *    Sexually explicit content is a Google Publisher Policy violation and it is
 *    enforced at the account level, which puts all eight sites behind it.
 *
 * 2. Search. thaigle presents itself as a family activity directory; 74 erotic
 *    massage pages inside /activities/spa is the kind of mismatch that gets a
 *    site reclassified rather than a page demoted. Twenty-odd sites in this
 *    network took that kind of hit between 2026-07-15 and 08-30.
 *
 * Dropping them costs nothing measurable. Across the 2026-09-30 GSC export
 * (three months, top 1,000 pages) the 74 pages earned 1 impression and 0
 * clicks between them, and no adult-intent query appears in the top 1,000 at
 * all. That is why this is a removal rather than the noindex used for thin
 * venues: there are no accumulated rankings here to preserve, and a noindexed
 * page still carries the publisher ID and the explicit text.
 *
 * Applied in qualifyingNichePlaces(), so it takes effect everywhere at once —
 * listings, detail pages (dynamicParams is false, so an unbuilt slug 404s),
 * sitemap, llms.txt, the search index and the /place/ canonical map. The data
 * stays in data/by-niche/*.json; reversing this is one function.
 */
export function isAdultVenue(p: NichePlace): boolean {
  return ADULT_CATEGORY.test(p.category ?? "") || ADULT_NAME.test(p.name ?? "");
}

// ── Off-niche venues (spa) ──────────────────────────────────────────────────
//
// The spa niche was scraped by search term, and Google Maps answers "spa" /
// "massage" with whatever sits near the words: on 2026-10-25, 243 of the 2,164
// published spa venues were not spas by their own Google category — 15
// shopping malls, PTT petrol stations, Toyota and Mercedes dealers, car washes,
// a bus stop, a dog park, an ice-cream shop, a temple, and a night club, a
// cabaret and a bar. A directory that lists a petrol station as a Bangkok spa
// is exactly what "low-value content" means, and the bars/clubs carry the same
// account-level AdSense risk as the adult venues above.
//
// Removal, not noindex, for the reason given for isAdultVenue: across the
// three months to 2026-10-25 the 243 pages earned 2 impressions and 0 clicks.
//
// Three tiers, by Google category:
//   - spa categories (massage, spa, wellness, sauna, onsen, …) stay;
//   - service categories where a spa can live inside (hotel, salon, clinic)
//     stay only when the venue's own name says spa or massage;
//   - everything else goes, whatever its name says — "Spa HomePro Rama 2" is a
//     HomePro store.
// A blank category is treated like a service category: kept on its name.

const SPA_CATEGORY = /massage|\bspa\b|wellness|aromatherap|reflexolog|onsen|sauna|public bath|thai medicine|acupunct/i;
/** Sauna in the category, but not the kind this directory lists. */
const NOT_A_SPA_SAUNA = /gay sauna/i;
const SERVICE_CATEGORY =
  /hotel|resort|inn\b|villa|serviced accommodation|holiday home|salon|hairdresser|barber|beautician|beauty|esthetic|skin care|dermatolog|laser|clinic|medical|physical therap|physiotherap|physiatrist|osteopath|chiropract|rehabilitation|health|training cent|school|education/i;
const SPA_NAME = /\bspa\b|massage|reflexolog|onsen|นวด|สปา/i;

export function isOffNicheVenue(nicheSlug: string, p: NichePlace): boolean {
  if (nicheSlug !== "spa") return false;
  const cat = (p.category ?? "").trim();
  if (cat && SPA_CATEGORY.test(cat) && !NOT_A_SPA_SAUNA.test(cat)) return false;
  if (!cat || SERVICE_CATEGORY.test(cat)) return !SPA_NAME.test(p.name ?? "");
  return true;
}
