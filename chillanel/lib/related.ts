import type { Place } from "./types";
// Explicit .ts extension required here (unlike the `import type` above,
// which is erased entirely) -- scripts/*.test.mjs run this file directly
// via `node --test`, and Node's native TS type-stripping only resolves
// extensionless relative specifiers for erased type-only imports, not real
// runtime ones. Next.js/webpack/tsc all resolve either form fine, which is
// why this only surfaced by running the test suite, not tsc --noEmit.
import { isRelevantCategory } from "./categories.ts";
import { distanceKm } from "./geo.ts";

// Picks up to `max` other places in the same city that share the place's
// top service-theme label — falls back to matching primaryType when the
// place has no service themes. Within that pool, places are ranked by
// actual distance when both places have coordinates (lat/lng coverage is
// now 100%, not the 0% it was when this only had rating to go on), so
// "similar places" reflects genuine walkable proximity instead of always
// converging on the same city-wide top-rated handful regardless of which
// place page you're on. Falls back to rating when either place lacks
// coordinates. Filters to isRelevantCategory so a suggestion never points
// at a place page/[id] excludes and 404s. Returns [] when nothing matches,
// so callers can omit the section entirely — same null/empty-safe pattern
// as RatingBars/TagCloud.
const NEARBY_RADIUS_KM = 3;

export function relatedPlaces(place: Place, allInCity: Place[], max = 3): Place[] {
  const topTheme = place.serviceThemes[0]?.label ?? null;
  const candidates = allInCity.filter((p) => p.id !== place.id && isRelevantCategory(p.primaryType));
  const pool = topTheme
    ? candidates.filter((p) => p.serviceThemes.some((s) => s.label === topTheme))
    : candidates.filter((p) => p.primaryType === place.primaryType);

  if (place.lat != null && place.lng != null) {
    const origin = { lat: place.lat, lng: place.lng };
    const withDistance = pool
      .filter((p) => p.lat != null && p.lng != null)
      .map((p) => ({ p, km: distanceKm(origin, { lat: p.lat as number, lng: p.lng as number }) }));
    const nearby = withDistance
      .filter(({ km }) => km <= NEARBY_RADIUS_KM)
      .sort((a, b) => a.km - b.km || (b.p.rating ?? 0) - (a.p.rating ?? 0));
    if (nearby.length >= max) return nearby.slice(0, max).map(({ p }) => p);
    // Not enough genuinely nearby matches -- fill the rest by distance
    // anyway rather than dropping to a city-wide rating sort, so results
    // stay "closest available" instead of "most popular city-wide".
    return withDistance
      .sort((a, b) => a.km - b.km || (b.p.rating ?? 0) - (a.p.rating ?? 0))
      .slice(0, max)
      .map(({ p }) => p);
  }

  return pool
    .slice()
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || b.reviewCount - a.reviewCount)
    .slice(0, max);
}
