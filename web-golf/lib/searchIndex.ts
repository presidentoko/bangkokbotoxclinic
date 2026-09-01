import { loadMasterDb } from "@/lib/data";
import type { SearchableEntity } from "@/components/SearchBar";

// The hero search box's index.
//
// This used to be handed to <SearchBar> as a prop. SearchBar is a client
// component, so all 641 courses were serialised into the homepage's RSC
// payload: 112 KB of a 752 KB page (measured 2026-09-01), shipped to every
// visitor and every crawler whether or not anyone ever typed a character.
// Served from /search-index.json it is one static, edge-cacheable file that
// only people who actually focus the box ever download.
//
// Sorted by trust so that page.tsx can take the head of the list as the seed
// SearchBar uses before the fetch lands.
export async function buildSearchIndex(): Promise<SearchableEntity[]> {
  const db = await loadMasterDb();
  return db.restaurants
    .map((r) => ({
      id: r.id,
      name: r.name,
      district: r.district,
      city_label: r.city_label,
      rating: r.rating,
      trust_score: r.trust_score,
    }))
    .sort((a, b) => b.trust_score - a.trust_score);
}
