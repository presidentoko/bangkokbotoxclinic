import { loadMasterDb } from "@/lib/data";
import { getSlugMap, restaurantUrl } from "@/lib/restaurants";
import { NICHES, loadNicheDb, qualifyingNichePlaces } from "@/lib/niches";
import type { NicheSlug } from "@/lib/niches";
import type { SearchableEntity } from "@/components/SearchBar";
import { restaurantContext, restaurantVerdict, nicheContext, nicheVerdict, VERDICT_SHORT } from "@/lib/verdict";

// The hero search box's index — and, since /verify, the whole site's
// "is this place real and good?" lookup table.
//
// It used to travel to <SearchBar> as a prop. SearchBar is a client component,
// so the whole array was serialised into the homepage's RSC payload — 152 KB
// of a 1,030 KB page (measured 2026-09-01), downloaded by every visitor and
// every crawler whether or not anyone typed a character. That payload pressure
// is also why the restaurant side was capped, first at 400, then at 1,200.
//
// Served from /search-index.json it is one static, edge-cacheable file that
// only people who focus the box ever fetch. The cap is gone entirely: a
// traveller checking a venue they saw on TikTok is exactly as likely to be
// looking for restaurant #2,900 by trust as for #200, and "not found" on a
// verification site reads as "this place is fake". Every listable
// restaurant and every niche venue that gets a page is in here.
//
// Extra fields beyond SearchableEntity (t, v, n) are ignored by the shared
// SearchBar and read by <VerifySearch>.

export type IndexedEntity = SearchableEntity & {
  /** r = restaurant, or the niche slug */
  t: string;
  /** Verdict code, one char — see VERDICT_SHORT */
  v: string;
  /** Review count */
  n: number;
};

export async function buildSearchIndex(): Promise<IndexedEntity[]> {
  const [db, slugMap, niches] = await Promise.all([
    loadMasterDb(),
    getSlugMap(),
    Promise.all(
      NICHES.map(async (n) => {
        const all = (await loadNicheDb(n.slug as NicheSlug)).places;
        return {
          slug: n.slug,
          label: n.label,
          ctx: nicheContext(n.slug, all),
          places: qualifyingNichePlaces(n.slug, all),
        };
      }),
    ),
  ]);

  const restaurants: IndexedEntity[] = db.restaurants.map((r) => ({
    id: restaurantUrl(
      slugMap[r.id] ?? { city: r.city, district: r.district || "other", slug: r.id },
    ).slice(1),
    name: r.name,
    district: r.district,
    city_label: r.city_label,
    rating: r.rating,
    trust_score: r.trust_score,
    t: "r",
    v: VERDICT_SHORT[restaurantVerdict(r, restaurantContext(db.restaurants, r.city)).code],
    n: r.total_reviews,
  }));

  // rating is required by SearchableEntity, and the spa/yoga datasets ship
  // with rating null across the board, so those are dropped rather than shown
  // with a fabricated zero.
  const activities: IndexedEntity[] = niches.flatMap((n) =>
    n.places
      .filter((p) => p.rating != null)
      .map((p) => ({
        id: `activities/${n.slug}/${encodeURIComponent(p.slug)}`,
        name: p.name,
        district: p.city,
        city_label: undefined,
        rating: p.rating as number,
        trust_score: p.trust_score,
        t: n.slug,
        v: VERDICT_SHORT[nicheVerdict(p, n.label, n.ctx).code],
        n: p.review_count ?? 0,
      })),
  );

  return [...restaurants, ...activities].sort((a, b) => b.trust_score - a.trust_score);
}
