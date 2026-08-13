import type { Lang } from "./site.ts";
import type { Place } from "./types.ts";
import { tFor } from "./i18n.ts";
import { themeLabel } from "./theme-labels.ts";
import { districtLabel } from "./district-labels.ts";
import { iGa } from "./korean-particles.ts";

export function priceMedian(prices: number[]): number | null {
  if (prices.length === 0) return null;
  const sorted = [...prices].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

// A single median hides how much prices actually vary across a place's
// reviews (e.g. different service tiers) -- min/max from the same
// priceMentions array a caller already has access to.
export function priceRange(prices: number[]): { min: number; max: number } | null {
  if (prices.length === 0) return null;
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

// Builds a per-place unique summary paragraph from real review-mining data
// (rating/review count, service themes, mood keywords, district) instead of
// the name+address+review-list template every page shared before this — the
// "thin content" gap flagged in the Phase 2 roadmap. serviceTheme x
// moodKeyword alone only combines to ~50 distinct sentences across 2,556
// Bangkok places (top theme/mood pair repeats a lot); the stats clause
// (rating is 100% covered, reviewCount is close to unique per place) and
// district clause push most places to a genuinely unique description.
// Deliberately excludes price: the address card already renders the exact
// same priceRangeLabel sentence just below this paragraph (see
// place/[id]/page.tsx), and combining them here produced a literal
// duplicate sentence on the page (caught in Phase 2's final review).
// Returns null when a place has none of these data points so callers can
// omit the section entirely, same pattern as RatingBars/TagCloud's
// null-return convention.
export function placeSummary(place: Place, lang: Lang): string | null {
  const t = tFor(lang);
  const clauses: string[] = [];

  if (place.rating != null) {
    clauses.push(
      t.place.summaryStatsClause.replace("{rating}", place.rating.toFixed(1)).replace("{reviewCount}", String(place.reviewCount))
    );
  }

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

  if (place.district) {
    clauses.push(t.place.summaryDistrictClause.replace("{district}", districtLabel(place.district, lang)));
  }

  if (clauses.length === 0) return null;
  return clauses.join(" ");
}
