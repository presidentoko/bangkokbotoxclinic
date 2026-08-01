import type { Place, ThemeCount } from "./types";

// The 8 SERVICE_THEMES and 7 MOOD_KEYWORDS labels (scripts/extract-themes.mjs)
// never overlap (verified in theme-labels.test.mjs and by the disjointness
// test in theme-stats.test.mjs, which imports the real dictionaries), so
// checking both arrays for a given label is unambiguous.
export function placeMatchesLabel(place: Place, label: string): boolean {
  return place.serviceThemes.some((t) => t.label === label) || place.moodKeywords.some((m) => m.label === label);
}

// Hardcoded copy of scripts/extract-themes.mjs's MOOD_KEYWORDS keys — mirrors
// the same precedent already set by lib/theme-labels.ts's LABELS table (a
// separate hardcoded copy of the same 15 labels for translation). Needed
// because service/[theme]'s "Best {theme} in {city}" title/FAQ phrasing
// reads fine for noun service themes ("Best Foot massage in Bangkok") but is
// ungrammatical for adjective-like mood keywords ("Best Clean in Bangkok") —
// found in Phase 3's final review. Keep in sync with extract-themes.mjs and
// theme-labels.ts if either dictionary changes.
const MOOD_LABELS = new Set([
  "Clean",
  "Quiet & relaxing",
  "Strong pressure",
  "Gentle",
  "Friendly staff",
  "Good value",
  "Walk-in friendly",
]);

export function isMoodLabel(label: string): boolean {
  return MOOD_LABELS.has(label);
}

// Mean of non-null ratings among the given places, rounded to 1 decimal.
// Callers pass an already-filtered list (e.g. every place matching a theme)
// rather than a label, so this never re-filters.
export function averageRating(places: Place[]): number | null {
  const rated = places.filter((p) => p.rating != null);
  if (rated.length === 0) return null;
  const sum = rated.reduce((total, p) => total + (p.rating ?? 0), 0);
  return Math.round((sum / rated.length) * 10) / 10;
}

// Sums serviceThemes + moodKeywords counts across an arbitrary set of
// places, sorted descending — same semantics as each CityData.themeAggregate
// (scripts/build-data.mjs's sumThemeCounts) but usable across cities, e.g.
// the homepage's cross-city trending section.
export function aggregateThemeCounts(places: Place[]): ThemeCount[] {
  const counts = new Map<string, number>();
  for (const place of places) {
    for (const t of [...place.serviceThemes, ...place.moodKeywords]) {
      counts.set(t.label, (counts.get(t.label) ?? 0) + t.count);
    }
  }
  return [...counts.entries()].map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count);
}

// Union of every service-theme and mood-keyword label across a set of
// places, deduplicated — used to build one static /service/[theme] route
// per label and one sitemap entry per label × language.
export function allThemeAndMoodLabels(places: Place[]): string[] {
  const labels = new Set<string>();
  for (const place of places) {
    for (const theme of place.serviceThemes) labels.add(theme.label);
    for (const mood of place.moodKeywords) labels.add(mood.label);
  }
  return [...labels];
}
