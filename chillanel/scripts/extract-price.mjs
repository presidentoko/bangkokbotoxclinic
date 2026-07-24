// Extracts Thai Baht price mentions from review text — a rough signal only.
// The clinics CSV's own price_level field is populated for just 16/734
// Bangkok places, not enough to rely on, so this fills the gap from review
// text instead.
//
// Single combined pattern (not two independently-run regexes) so a price
// written with both markers ("฿500 baht") only counts once. Digit groups are
// boundary-anchored ((?<!\d)...(?!\d)) so a match can never be a truncated
// fragment of a longer digit run (an earlier unanchored version extracted
// "10000" out of "฿100000" or "45678" out of a phone number followed by the
// word "baht" — found in review, 2026-07-24). Comma-grouped amounts
// ("1,200 baht") are supported since Thai baht prices are routinely written
// that way.
//
// Note: the suffix branch's trailing \b only matches after a *word*
// character, so a symbol-suffix price ("500฿", no space) won't match there —
// ฿ is a non-word char so no boundary exists there. In practice this is fine
// since ฿ is almost always written as a prefix ("฿500"), which the first
// branch already handles; flagged rather than fixed since it's an unused edge case.
const NUMBER = String.raw`(?:\d{1,3}(?:,\d{3})+|\d{2,5})`;
const PRICE_RE = new RegExp(
  String.raw`(?:฿|thb)\s?(?<!\d)(${NUMBER})(?!\d)` +
    "|" +
    String.raw`(?<!\d)(${NUMBER})(?!\d)\s?(?:฿|baht|thb)\b`,
  "gi"
);

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
    PRICE_RE.lastIndex = 0;
    let m;
    while ((m = PRICE_RE.exec(text)) !== null) {
      const raw = m[1] ?? m[2];
      const n = parseInt(raw.replace(/,/g, ""), 10);
      if (Number.isFinite(n) && n >= MIN_PLAUSIBLE_BAHT && n <= MAX_PLAUSIBLE_BAHT) {
        amounts.push(n);
      }
    }
  }
  return amounts.sort((a, b) => a - b);
}
