// Pure-function therapist-name extraction from review text.
// Heuristic, not NLP/NER — deliberately conservative (see plan constraint:
// a name only surfaces with 2+ independent review mentions).

const STOPWORDS = new Set([
  "This", "That", "These", "Those", "The", "It", "She", "He", "They",
  "Best", "Great", "Super", "Very", "Highly", "Overall", "Everything",
  "Staff", "Service", "Place", "Massage", "Spa", "Room", "Price", "Ambience",
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
]);

const NAME = "([A-Z][a-zA-Z]{1,20})";

const PATTERNS = [
  new RegExp(`\\bask (?:for|to have)\\s+${NAME}\\b`, "gi"),
  new RegExp(`\\b${NAME}\\s+(?:was|is)\\s+(?:amazing|great|wonderful|excellent|fantastic|the best|so good|incredible)\\b`, "gi"),
  new RegExp(`\\bthanks?\\s+to\\s+${NAME}\\b`, "gi"),
  new RegExp(`\\btherapist\\s+(?:named\\s+)?${NAME}\\b`, "gi"),
  new RegExp(`\\brequest\\s+${NAME}\\b`, "gi"),
];

function extractSentenceContaining(text, index) {
  const before = text.lastIndexOf(".", index);
  const after = text.indexOf(".", index);
  const start = before === -1 ? 0 : before + 1;
  const end = after === -1 ? text.length : after + 1;
  return text.slice(start, end).trim();
}

function candidatesFromText(text) {
  const out = [];
  if (!text || typeof text !== "string") return out;
  for (const pattern of PATTERNS) {
    pattern.lastIndex = 0;
    let m;
    while ((m = pattern.exec(text)) !== null) {
      const name = m[1];
      if (STOPWORDS.has(name)) continue;
      out.push({ name, quote: extractSentenceContaining(text, m.index) });
    }
  }
  return out;
}

/**
 * @param {{text: string}[]} reviews
 * @returns {{name: string, count: number, quotes: string[]}[]}
 */
export function extractMentionsFromReviews(reviews) {
  const byName = new Map();
  for (const review of reviews ?? []) {
    const candidates = candidatesFromText(review?.text);
    // Dedup within a single review: same name matched by 2 patterns in one
    // review should still only count once toward that review's contribution.
    const seenThisReview = new Set();
    for (const { name, quote } of candidates) {
      if (seenThisReview.has(name)) continue;
      seenThisReview.add(name);
      const entry = byName.get(name) ?? { name, count: 0, quotes: [] };
      entry.count += 1;
      if (entry.quotes.length < 5) entry.quotes.push(quote);
      byName.set(name, entry);
    }
  }
  return [...byName.values()]
    .filter((e) => e.count >= 2)
    .sort((a, b) => b.count - a.count);
}
