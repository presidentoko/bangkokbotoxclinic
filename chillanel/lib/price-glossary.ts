import type { Place } from "./types";
import { placeMatchesLabel, isMoodLabel, allThemeAndMoodLabels } from "./theme-stats";
import { priceMedian } from "./summary";
import { isRelevantCategory } from "./categories";

export type PriceGlossaryRow = {
  theme: string;
  median: number;
  sampleSize: number;
};

// Minimum places with actual priceMentions data (not just matching the
// theme) before a row is worth showing -- below this a "median" is really
// just one or two review-mined numbers dressed up as a statistic.
const MIN_SAMPLE_SIZE = 3;

// Per-service-theme (never mood keywords -- "median price of Clean" isn't a
// coherent question) median price across a city's places, built entirely
// from priceMentions already extracted from review text at build time (no
// new scraping). Sorted by sample size descending so the most-evidenced
// rows lead the table, not whichever theme happens to sort alphabetically
// first.
export function priceGlossaryForCity(places: Place[]): PriceGlossaryRow[] {
  const relevant = places.filter((p) => isRelevantCategory(p.primaryType));
  const themes = allThemeAndMoodLabels(relevant).filter((label) => !isMoodLabel(label));
  const rows: PriceGlossaryRow[] = [];
  for (const theme of themes) {
    const matching = relevant.filter((p) => placeMatchesLabel(p, theme) && p.priceMentions.length > 0);
    if (matching.length < MIN_SAMPLE_SIZE) continue;
    const allPrices = matching.flatMap((p) => p.priceMentions);
    const median = priceMedian(allPrices);
    if (median == null) continue;
    rows.push({ theme, median, sampleSize: matching.length });
  }
  return rows.sort((a, b) => b.sampleSize - a.sampleSize);
}
