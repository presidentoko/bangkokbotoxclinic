import type { Lang } from "./site.ts";
import type { Place } from "./types.ts";
import { tFor } from "./i18n.ts";
import { themeLabel } from "./theme-labels.ts";
import { iGa } from "./korean-particles.ts";

export function priceMedian(prices: number[]): number | null {
  if (prices.length === 0) return null;
  const sorted = [...prices].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

// Builds a per-place unique summary paragraph from real review-mining data
// (service themes, mood keywords) instead of the name+address+review-list
// template every page shared before this — the "thin content" gap flagged
// in the Phase 2 roadmap. Deliberately excludes price: the address card
// already renders the exact same priceRangeLabel sentence just below this
// paragraph (see place/[id]/page.tsx), and combining them here produced a
// literal duplicate sentence on the page (caught in Phase 2's final review).
// Returns null when a place has neither data point (71/734 in the live
// Bangkok dataset, ~9.7%) so callers can omit the section entirely, same
// pattern as RatingBars/TagCloud's null-return convention.
export function placeSummary(place: Place, lang: Lang): string | null {
  const t = tFor(lang);
  const clauses: string[] = [];

  const topTheme = place.serviceThemes[0];
  if (topTheme) {
    const label = themeLabel(topTheme.label, lang);
    // KO's summaryThemeClause template has no hardcoded particle -- {theme}
    // must already carry the grammatically correct one, since 가/이 depends
    // on whether the label ends in a batchim (e.g. "페이셜이" vs "오일 마사지가").
    const labelWithParticle = lang === "ko" ? `${label}${iGa(label)}` : label;
    clauses.push(t.place.summaryThemeClause.replace("{theme}", labelWithParticle));
  }

  const topMood = place.moodKeywords[0];
  if (topMood) {
    clauses.push(t.place.summaryMoodClause.replace("{mood}", themeLabel(topMood.label, lang)));
  }

  if (clauses.length === 0) return null;
  return clauses.join(" ");
}
