import type { Place } from "./types";

// The 8 SERVICE_THEMES and 7 MOOD_KEYWORDS labels (scripts/extract-themes.mjs)
// never overlap (verified in theme-labels.test.mjs), so checking both arrays
// for a given label is unambiguous.
export function placeMatchesLabel(place: Place, label: string): boolean {
  return place.serviceThemes.some((t) => t.label === label) || place.moodKeywords.some((m) => m.label === label);
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
