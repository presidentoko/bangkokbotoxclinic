import type { Product, IngredientAnalysis, PantipSnippet } from "./types";

/**
 * The evidence behind a comparison, rather than the score on top of it.
 *
 * Why this exists. The compare page used to print our own numbers —
 * "acne 82 vs 55" — and nothing a reader could check. The score is computed
 * from ingredient_analysis, but the page never showed which ingredient earned
 * it, so the one verifiable fact on the page (what is printed on the bottle)
 * stayed in the JSON. AdSense called this site "low value content" on
 * 2026-09-27, and the reason is visible from the page itself: it restates a
 * number it will not justify.
 *
 * Every function here returns something a reader can confirm without trusting
 * us: an INCI name they can read off the packaging, a price with the date we
 * collected it, or a quote from a Pantip thread we link to.
 *
 * What is deliberately NOT here: any new page class. This site is under a
 * site-wide demotion whose diagnosis is mass-produced thin pages, and it has
 * already lost 833 products once to a half-finished run. Making the
 * comparisons that exist worth reading is the whole intervention.
 */

/** Ingredients the formulator put in to do the work, not to carry it. */
export function actives(p: Pick<Product, "ingredient_analysis">): IngredientAnalysis[] {
  return (p.ingredient_analysis ?? []).filter((i) => i?.role === "active" && i.inci);
}

/** Case- and space-insensitive INCI key, so "Salicylic Acid" matches "salicylic acid". */
function inciKey(inci: string): string {
  return inci.trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * Actives both products contain. This is usually the most useful line on the
 * page: when two products share their active, the honest answer to "which is
 * better" is often "they do the same thing, buy the cheaper one" — which is
 * what a Pantip user said about the Eucerin and Nivea Thiamidol pair.
 */
export function sharedActives(a: Product, b: Product): string[] {
  const bKeys = new Set(actives(b).map((i) => inciKey(i.inci)));
  const seen = new Set<string>();
  const out: string[] = [];
  for (const i of actives(a)) {
    const k = inciKey(i.inci);
    if (!bKeys.has(k) || seen.has(k)) continue;
    seen.add(k);
    out.push(i.inci);
  }
  return out;
}

/** Actives only the first product has, strongest first for the given concern. */
export function uniqueActives(a: Product, b: Product, concern?: string): IngredientAnalysis[] {
  const bKeys = new Set(actives(b).map((i) => inciKey(i.inci)));
  const seen = new Set<string>();
  const out: IngredientAnalysis[] = [];
  for (const i of actives(a)) {
    const k = inciKey(i.inci);
    if (bKeys.has(k) || seen.has(k)) continue;
    seen.add(k);
    out.push(i);
  }
  if (!concern) return out;
  return out.sort((x, y) => efficacy(y, concern) - efficacy(x, concern));
}

export function efficacy(i: IngredientAnalysis, concern: string): number {
  const v = i?.concern_efficacy?.[concern];
  return typeof v === "number" ? v : 0;
}

/**
 * The ingredients that actually earned a product its score for one concern.
 * An active with efficacy 0 here is doing something else and is not evidence
 * for this question, however impressive it looks on the box.
 */
export function concernDrivers(p: Product, concern: string): IngredientAnalysis[] {
  return actives(p)
    .filter((i) => efficacy(i, concern) > 0)
    .sort((x, y) => efficacy(y, concern) - efficacy(x, concern));
}

/** Safety flags worth surfacing, deduplicated across the formula. */
export function safetyFlags(p: Product): string[] {
  const out = new Set<string>();
  for (const i of p.ingredient_analysis ?? []) {
    for (const f of i?.safety_flags ?? []) if (f) out.add(f);
  }
  return [...out];
}

/* ── price per unit ─────────────────────────────────────────────────────── */

export interface UnitPrice {
  amount: number;
  unit: string;
  perUnit: number;
}

/**
 * Baht per ml or per g. 890 rows are in ml and 562 in g; the rest count
 * sheets, tablets or pieces, where a per-unit price means nothing across
 * brands, so those get null rather than a misleading number.
 */
export function unitPrice(p: Pick<Product, "volume" | "price_thb">): UnitPrice | null {
  const m = String(p.volume ?? "")
    .trim()
    .toLowerCase()
    .match(/^([\d.,]+)\s*(ml|g)\b/);
  if (!m) return null;
  const amount = Number(m[1].replace(/,/g, ""));
  const price = Number(p.price_thb);
  if (!Number.isFinite(amount) || amount <= 0) return null;
  if (!Number.isFinite(price) || price <= 0) return null;
  return { amount, unit: m[2], perUnit: price / amount };
}

/**
 * Per-unit prices only compare when the unit matches — baht/ml against
 * baht/g is two different questions wearing the same number.
 */
export function comparableUnitPrice(
  a: Product,
  b: Product
): { a: UnitPrice; b: UnitPrice } | null {
  const ua = unitPrice(a);
  const ub = unitPrice(b);
  return ua && ub && ua.unit === ub.unit ? { a: ua, b: ub } : null;
}

/* ── what Thai buyers said about both ───────────────────────────────────── */

export interface CrossQuote {
  text: string;
  topicId: string;
  /** The product whose Pantip threads this came from. */
  fromBrand: string;
  /** The other product's brand, named inside the text. */
  mentionsBrand: string;
}

/** Brand mention test. Short brand names are skipped — too easy to hit by accident. */
function mentionsBrand(text: string, brand: string): boolean {
  const b = brand.trim().toLowerCase();
  if (b.length < 4) return false;
  return text.toLowerCase().includes(b);
}

const MIN_QUOTE_CHARS = 60;
const MAX_BRANDS_BEFORE_ITS_A_LIST = 3;

/**
 * Does this snippet read as somebody's opinion, or is it a brand list?
 *
 * Containing both brand names is not enough. Audited against the pairs this
 * site actually builds, roughly half the matches were not comparisons at all:
 *
 *   "-winkwhite -la glace -srichand -smoothE -Dentiste -Plantnery"
 *   "BANOBAGI Built Bright Skin With B" + #campaign hashtags
 *
 * The first is a shopping list, the second is event copy a brand wrote. Both
 * mention two brands and neither tells a reader anything. Publishing them
 * under "what Thai buyers said when they weighed these two" would be a claim
 * about the text that is not true, which is worse than having no quote.
 *
 * Thai writes without spaces between words, so word-boundary rules do not
 * transfer here — these tests count brands and punctuation instead of trying
 * to tokenise.
 */
export function looksLikeOpinion(text: string, knownBrands: Iterable<string>): boolean {
  const t = text.trim();
  if (t.length < MIN_QUOTE_CHARS) return false;

  // Campaign copy: hashtags are not how buyers write to each other.
  if (/#[^\s#]{2,}/.test(t)) return false;

  const lower = t.toLowerCase();
  let brandHits = 0;
  for (const b of knownBrands) {
    const bl = b.trim().toLowerCase();
    if (bl.length < 4) continue;
    if (lower.includes(bl)) brandHits++;
    if (brandHits > MAX_BRANDS_BEFORE_ITS_A_LIST) return false;
  }

  // Enumerations: "- a - b - c" or "a / b / c" carry separators far more
  // densely than prose does.
  const separators = (t.match(/[-/,|•]/g) ?? []).length;
  if (separators >= 6 && separators / t.length > 0.03) return false;

  return true;
}

/**
 * Pantip quotes from one product's threads that name the other product's brand.
 *
 * This is the part of the comparison we did not write and could not fake: a
 * Thai buyer weighing exactly these two products. 549 of 1,836 products carry
 * at least one such quote. It is published as a quotation with a link to the
 * thread, never as the site's own prose.
 */
export function crossBrandQuotes(
  a: Product,
  b: Product,
  limit = 3,
  knownBrands: Iterable<string> = []
): CrossQuote[] {
  const out: CrossQuote[] = [];
  const pairs: [Product, Product][] = [
    [a, b],
    [b, a],
  ];
  for (const [from, other] of pairs) {
    const snippets: PantipSnippet[] = from.pantip?.snippets ?? [];
    for (const s of snippets) {
      const text = (s?.text ?? "").trim();
      if (!text || !s?.topic_id) continue;
      if (!other.brand || !mentionsBrand(text, other.brand)) continue;
      if (!looksLikeOpinion(text, knownBrands)) continue;
      if (out.some((q) => q.topicId === s.topic_id)) continue;
      out.push({
        text,
        topicId: s.topic_id,
        fromBrand: from.brand,
        mentionsBrand: other.brand,
      });
      if (out.length >= limit) return out;
    }
  }
  return out;
}

export function pantipUrl(topicId: string): string {
  return `https://pantip.com/topic/${encodeURIComponent(topicId)}`;
}

/* ── is this pair worth a page? ─────────────────────────────────────────── */

/**
 * A comparison earns a page when there is something to compare. Both sides
 * need actives, or the page can only ever restate two scores — the state that
 * got this site judged.
 */
export function hasEvidence(a: Product, b: Product): boolean {
  return actives(a).length > 0 && actives(b).length > 0;
}

/** How much checkable material a pair would put on the page. Higher is better. */
export function evidenceScore(a: Product, b: Product, concern?: string): number {
  if (!hasEvidence(a, b)) return 0;
  const drivers = concern
    ? concernDrivers(a, concern).length + concernDrivers(b, concern).length
    : actives(a).length + actives(b).length;
  return (
    drivers +
    sharedActives(a, b).length * 2 +
    crossBrandQuotes(a, b, 3).length * 5 +
    (comparableUnitPrice(a, b) ? 2 : 0)
  );
}
