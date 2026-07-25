import type { Lang } from "./site.ts";
import type { Place } from "./types.ts";
import { tFor } from "./i18n.ts";
import { themeLabel } from "./theme-labels.ts";

export function priceMedian(prices: number[]): number | null {
  if (prices.length === 0) return null;
  const sorted = [...prices].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

// Builds a per-place unique summary paragraph from real review-mining data
// (service themes, mood keywords, price mentions) instead of the
// name+address+review-list template every page shared before this — the
// "thin content" gap flagged in the Phase 2 roadmap. Returns null when a
// place has none of the three data points (68/734 in the live Bangkok
// dataset, ~9.3%) so callers can omit the section entirely, same pattern
// as RatingBars/TagCloud's null-return convention.
export function placeSummary(place: Place, lang: Lang): string | null {
  const t = tFor(lang);
  const clauses: string[] = [];

  const topTheme = place.serviceThemes[0];
  if (topTheme) {
    clauses.push(t.place.summaryThemeClause.replace("{theme}", themeLabel(topTheme.label, lang)));
  }

  const topMood = place.moodKeywords[0];
  if (topMood) {
    clauses.push(t.place.summaryMoodClause.replace("{mood}", themeLabel(topMood.label, lang)));
  }

  const median = priceMedian(place.priceMentions);
  if (median != null) {
    clauses.push(t.place.priceRangeLabel.replace("{price}", median.toLocaleString()));
  }

  if (clauses.length === 0) return null;
  return clauses.join(" ");
}
