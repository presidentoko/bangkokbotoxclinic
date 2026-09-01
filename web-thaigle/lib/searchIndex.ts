import { loadMasterDb } from "@/lib/data";
import { getSlugMap, restaurantUrl } from "@/lib/restaurants";
import { NICHES, loadNicheDb, qualifyingNichePlaces } from "@/lib/niches";
import type { NicheSlug } from "@/lib/niches";
import type { SearchableEntity } from "@/components/SearchBar";

// The hero search box's index.
//
// It used to travel to <SearchBar> as a prop. SearchBar is a client component,
// so the whole array was serialised into the homepage's RSC payload — 152 KB
// of a 1,030 KB page (measured 2026-09-01), downloaded by every visitor and
// every crawler whether or not anyone typed a character. That payload pressure
// is also why the restaurant side was capped at 400: the long tail simply
// wasn't affordable inline.
//
// Served from /search-index.json it is one static, edge-cacheable file that
// only people who focus the box ever fetch, so the cap can be much looser and
// the per-niche cap of 50 can go entirely. That lands at 4,911 entries —
// 817 KB raw, 168 KB gzipped, measured on the 2026-09-01 build. Large for a
// fetch, but it is a single URL behind a 24h edge cache rather than weight on
// every page view, and finding nothing is the worse failure for a search box.
// The restaurant tail past 1,200 stays reachable by district/cuisine browsing
// exactly as before.
const RESTAURANT_LIMIT = 1200;

export async function buildSearchIndex(): Promise<SearchableEntity[]> {
  const [db, slugMap, niches] = await Promise.all([
    loadMasterDb(),
    getSlugMap(),
    Promise.all(
      NICHES.map(async (n) => ({
        slug: n.slug,
        places: qualifyingNichePlaces(
          n.slug,
          (await loadNicheDb(n.slug as NicheSlug)).places,
        ),
      })),
    ),
  ]);

  const restaurants: SearchableEntity[] = [...db.restaurants]
    .sort((a, b) => b.trust_score - a.trust_score)
    .slice(0, RESTAURANT_LIMIT)
    .map((r) => ({
      id: restaurantUrl(
        slugMap[r.id] ?? { city: r.city, district: r.district || "other", slug: r.id },
      ).slice(1),
      name: r.name,
      district: r.district,
      city_label: r.city_label,
      rating: r.rating,
      trust_score: r.trust_score,
    }));

  // rating is required by SearchableEntity, and the spa/yoga datasets ship
  // with rating null across the board, so those are dropped rather than shown
  // with a fabricated zero.
  const activities: SearchableEntity[] = niches.flatMap((n) =>
    n.places
      .filter((p) => p.rating != null)
      .map((p) => ({
        id: `activities/${n.slug}/${encodeURIComponent(p.slug)}`,
        name: p.name,
        district: p.city,
        city_label: undefined,
        rating: p.rating as number,
        trust_score: p.trust_score,
      })),
  );

  return [...restaurants, ...activities].sort((a, b) => b.trust_score - a.trust_score);
}
