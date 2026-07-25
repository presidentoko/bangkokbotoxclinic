import type { Place } from "./types";

// Picks up to `max` other places in the same city that share the place's
// top service-theme label — the closest thing to "similar/nearby" available
// without district data (the Bangkok dataset has 0% lat/lng coverage, see
// Phase 0 Task 6). Falls back to matching primaryType when the place has no
// service themes. Returns [] when nothing matches, so callers can omit the
// section entirely — same null/empty-safe pattern as RatingBars/TagCloud.
export function relatedPlaces(place: Place, allInCity: Place[], max = 3): Place[] {
  const topTheme = place.serviceThemes[0]?.label ?? null;
  const candidates = allInCity.filter((p) => p.id !== place.id);
  const pool = topTheme
    ? candidates.filter((p) => p.serviceThemes.some((s) => s.label === topTheme))
    : candidates.filter((p) => p.primaryType === place.primaryType);

  return pool
    .slice()
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || b.reviewCount - a.reviewCount)
    .slice(0, max);
}
