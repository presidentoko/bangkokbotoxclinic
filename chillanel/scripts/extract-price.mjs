// Extracts Thai Baht price mentions from review text — a rough signal only.
// The clinics CSV's own price_level field is populated for just 16/734
// Bangkok places, not enough to rely on, so this fills the gap from review
// text instead.

const PRICE_PATTERNS = [
  /(?:฿|thb)\s?(\d{2,5})/gi,
  /(\d{2,5})\s?(?:฿|baht|thb)\b/gi,
];

const MIN_PLAUSIBLE_BAHT = 50;
const MAX_PLAUSIBLE_BAHT = 20000;

/**
 * @param {{text: string}[]} reviews
 * @returns {number[]} all detected baht amounts across all reviews, sorted ascending
 */
export function extractPriceMentions(reviews) {
  const amounts = [];
  for (const review of reviews ?? []) {
    const text = review?.text;
    if (!text || typeof text !== "string") continue;
    for (const pattern of PRICE_PATTERNS) {
      pattern.lastIndex = 0;
      let m;
      while ((m = pattern.exec(text)) !== null) {
        const n = parseInt(m[1], 10);
        if (Number.isFinite(n) && n >= MIN_PLAUSIBLE_BAHT && n <= MAX_PLAUSIBLE_BAHT) {
          amounts.push(n);
        }
      }
    }
  }
  return amounts.sort((a, b) => a - b);
}
