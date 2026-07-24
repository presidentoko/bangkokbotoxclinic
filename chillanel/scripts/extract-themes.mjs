// Frequency-counts predefined service/mood themes across a place's reviews.
// Same "regex dictionary, pure function" approach as extract-therapists.mjs.
// English-only: sampling 200 of 734 Bangkok review-CSV files (8,630 reviews
// with text) found 99.8% English — not enough th/ko volume to justify
// separate dictionaries yet (checked 2026-07-24).

export const SERVICE_THEMES = {
  "Foot massage": [/\bfoot massage\b/i, /\breflexology\b/i],
  "Oil massage": [/\boil massage\b/i],
  "Thai massage": [/\bthai massage\b/i],
  "Aromatherapy": [/\baroma(?:therapy)?\b/i],
  "Deep tissue": [/\bdeep tissue\b/i],
  "Hot stone": [/\bhot stone\b/i],
  "Facial": [/\bfacial\b/i],
  "Body scrub": [/\bbody scrub\b/i, /\bscrub\b/i],
};

export const MOOD_KEYWORDS = {
  "Clean": [/\bclean\b/i, /\bspotless\b/i, /\bhygienic\b/i],
  "Quiet & relaxing": [/\bquiet\b/i, /\brelaxing\b/i, /\bpeaceful\b/i],
  "Strong pressure": [/\bstrong pressure\b/i, /\bfirm pressure\b/i, /\bdeep pressure\b/i],
  "Gentle": [/\bgentle\b/i, /\blight pressure\b/i],
  "Friendly staff": [/\bfriendly\b/i, /\bwelcoming\b/i],
  "Good value": [/\bgood value\b/i, /\baffordable\b/i, /\breasonably priced\b/i, /\bcheap\b/i],
  "Walk-in friendly": [/\bwalk[- ]?in\b/i],
};

/**
 * @param {{text: string}[]} reviews
 * @param {Record<string, RegExp[]>} dictionary
 * @returns {{label: string, count: number}[]} sorted desc; count = number of
 *   reviews mentioning that label at least once (not total occurrences).
 */
export function extractThemeCounts(reviews, dictionary) {
  const counts = new Map();
  for (const review of reviews ?? []) {
    const text = review?.text;
    if (!text || typeof text !== "string") continue;
    const mentionedThisReview = new Set();
    for (const [label, patterns] of Object.entries(dictionary)) {
      for (const pattern of patterns) {
        pattern.lastIndex = 0;
        if (pattern.test(text)) {
          mentionedThisReview.add(label);
          break;
        }
      }
    }
    for (const label of mentionedThisReview) {
      counts.set(label, (counts.get(label) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Sums per-place theme-count arrays into one city-wide total — used for the
 * site-wide "what reviewers say most" aggregate.
 * @param {{label: string, count: number}[][]} perPlaceCounts
 * @returns {{label: string, count: number}[]} sorted desc
 */
export function sumThemeCounts(perPlaceCounts) {
  const totals = new Map();
  for (const counts of perPlaceCounts) {
    for (const { label, count } of counts) {
      totals.set(label, (totals.get(label) ?? 0) + count);
    }
  }
  return [...totals.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}
