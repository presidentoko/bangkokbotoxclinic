import master from "@/data/master_db.json";
import ingredientDb from "@/data/ingredient_db.json";
import type { MasterDb, Product, RankingEntry, IngredientEntry } from "./types";
import { slugify } from "./format";

const db = master as unknown as MasterDb;
const ingDb = ingredientDb as unknown as Record<string, IngredientEntry>;

export const CONCERNS = ["acne", "whitening", "antiaging", "pores", "oilcontrol", "sensitive"] as const;
export type Concern = (typeof CONCERNS)[number];

export const generatedAt = () => db.generated_at;
export const allProducts = (): Product[] => Object.values(db.products);
export const getProduct = (id: string): Product | undefined => db.products[id];
export const getRanking = (concern: string): RankingEntry[] => db.rankings[concern] ?? [];
export const productSlug = (p: Product) => `${slugify(p.brand)}-${p.product_id}`;
export const productIdFromSlug = (slug: string) => slug.split("-").pop() ?? "";

export const allIngredients = (): [string, IngredientEntry][] => Object.entries(ingDb);
export const ingredientSlug = (inci: string) => slugify(inci);

export const brandSlug = (brand: string) => slugify(brand);
export const brandFromSlug = (slug: string): string | undefined =>
  allBrands().find((b) => slugify(b) === slug);

export function allBrands(): string[] {
  const counts: Record<string, number> = {};
  for (const p of allProducts()) {
    counts[p.brand] = (counts[p.brand] ?? 0) + 1;
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([b]) => b);
}

export function brandProducts(brand: string): Product[] {
  return allProducts()
    .filter((p) => p.brand === brand)
    .sort((a, b) => {
      const aMax = Math.max(...Object.values(a.total_score));
      const bMax = Math.max(...Object.values(b.total_score));
      return bMax - aMax;
    });
}

export function brandStats(brand: string): {
  count: number;
  avgScore: number;
  minPrice: number;
  maxPrice: number;
  concerns: string[];
} {
  const products = brandProducts(brand);
  if (!products.length) return { count: 0, avgScore: 0, minPrice: 0, maxPrice: 0, concerns: [] };
  const prices = products.filter((p) => p.price_thb > 0).map((p) => p.price_thb);
  const allScores = products.flatMap((p) => Object.values(p.total_score));
  const concernSet = new Set<string>();
  for (const p of products) {
    const seeds = p.concern_seeds;
    const arr = Array.isArray(seeds) ? seeds : String(seeds).split("|").map((s) => s.trim());
    for (const c of arr) if (c) concernSet.add(c);
  }
  return {
    count: products.length,
    avgScore: allScores.length ? allScores.reduce((s, v) => s + v, 0) / allScores.length : 0,
    minPrice: prices.length ? Math.min(...prices) : 0,
    maxPrice: prices.length ? Math.max(...prices) : 0,
    concerns: [...concernSet].filter((c) => CONCERNS.includes(c as Concern)),
  };
}
export function getIngredient(slug: string): (IngredientEntry & { inci: string }) | undefined {
  for (const [inci, e] of Object.entries(ingDb)) {
    if (slugify(inci) === slug) return { inci, ...e };
  }
  return undefined;
}
export function productsWithIngredient(inci: string): Product[] {
  return allProducts().filter((p) => p.ingredient_analysis.some((a) => a.inci === inci));
}

/**
 * Returns products from the same concern ranking that are cheaper than `p`
 * and not much worse in score (within 10 points). Excludes `p` itself.
 * Sorted by total_score[concern] descending, capped to `limit`.
 */
export function cheaperAlternatives(p: Product, concern: string, limit = 4): Product[] {
  const ranking = getRanking(concern);
  const pScore = p.total_score[concern] ?? 0;
  const pPrice = p.price_thb;
  if (pPrice <= 0) return [];
  return ranking
    .map((r) => getProduct(r.product_id))
    .filter((q): q is Product =>
      q !== undefined &&
      q.product_id !== p.product_id &&
      q.price_thb > 0 &&
      q.price_thb < pPrice &&
      (q.total_score[concern] ?? 0) >= pScore - 10
    )
    .sort((a, b) => (b.total_score[concern] ?? 0) - (a.total_score[concern] ?? 0))
    .slice(0, limit);
}

/**
 * Returns products from the same concern ranking that share at least one
 * matched active ingredient INCI with `p`. If fewer than `limit` are found,
 * fills with nearest-ranked products in that concern. Excludes `p`.
 * Sorted by (shared ingredient count desc, then total_score desc), capped to `limit`.
 */
export function similarProducts(p: Product, concern: string, limit = 4): Product[] {
  const ranking = getRanking(concern);
  const pIncis = new Set(p.ingredient_analysis.map((a) => a.inci));

  const withShared: { product: Product; shared: number }[] = [];
  const others: Product[] = [];

  for (const r of ranking) {
    const q = getProduct(r.product_id);
    if (!q || q.product_id === p.product_id) continue;
    const sharedCount = q.ingredient_analysis.filter((a) => pIncis.has(a.inci)).length;
    if (sharedCount > 0) {
      withShared.push({ product: q, shared: sharedCount });
    } else {
      others.push(q);
    }
  }

  withShared.sort((a, b) => {
    if (b.shared !== a.shared) return b.shared - a.shared;
    return (b.product.total_score[concern] ?? 0) - (a.product.total_score[concern] ?? 0);
  });

  const result = withShared.map((x) => x.product);

  if (result.length < limit) {
    // Fill with nearest-ranked products (others already in ranking order)
    for (const q of others) {
      if (result.length >= limit) break;
      result.push(q);
    }
  }

  return result.slice(0, limit);
}

// ---------------------------------------------------------------------------
// Internal helper: test whether a product belongs to a concern pool.
// concern_seeds may be a string ("|"-joined or single), or a string[].
// ---------------------------------------------------------------------------
function productHasConcern(p: Product, concern: string): boolean {
  const seeds = p.concern_seeds;
  if (Array.isArray(seeds)) {
    return seeds.includes(concern);
  }
  // string — could be "|"-joined or a bare value
  return seeds.split("|").map((s) => s.trim()).includes(concern);
}

// ---------------------------------------------------------------------------
// Curation helpers — power discovery strips (Our Picks / Bestsellers / Most Loved)
// ---------------------------------------------------------------------------

/**
 * Top-scored products for a concern: the highest total_score[concern] products
 * (top of getRanking(concern) resolved to Product objects). Capped to `limit`.
 */
export function topPicks(concern: string, limit = 8): Product[] {
  return getRanking(concern)
    .slice(0, limit)
    .map((r) => getProduct(r.product_id))
    .filter((p): p is Product => p !== undefined);
}

/**
 * Products in the concern pool sorted by sold_count descending.
 * Concern pool = products whose concern_seeds includes the concern.
 * Falls back to all products if the pool is empty.
 * Capped to `limit`.
 */
export function bestSellers(concern: string, limit = 8): Product[] {
  let pool = allProducts().filter((p) => productHasConcern(p, concern));
  if (pool.length === 0) pool = allProducts();
  return pool
    .slice()
    .sort((a, b) => b.sold_count - a.sold_count)
    .slice(0, limit);
}

/**
 * Products in the concern pool with konvy_review_count >= 20, sorted by
 * konvy_review_count desc then konvy_rating desc.
 * If fewer than `limit` meet the threshold, fills with next highest review_count.
 * Capped to `limit`.
 */
export function mostLoved(concern: string, limit = 8): Product[] {
  let pool = allProducts().filter((p) => productHasConcern(p, concern));
  if (pool.length === 0) pool = allProducts();

  const sorted = pool.slice().sort((a, b) => {
    if (b.konvy_review_count !== a.konvy_review_count)
      return b.konvy_review_count - a.konvy_review_count;
    return b.konvy_rating - a.konvy_rating;
  });

  const qualified = sorted.filter((p) => p.konvy_review_count >= 20);
  if (qualified.length >= limit) return qualified.slice(0, limit);

  // Fill shortfall from the rest of the sorted pool (already ordered by review_count desc)
  const qualifiedIds = new Set(qualified.map((p) => p.product_id));
  const fill = sorted.filter((p) => !qualifiedIds.has(p.product_id));
  return [...qualified, ...fill].slice(0, limit);
}

/**
 * Products with discount_pct >= minDiscount, sorted by discount_pct desc.
 * For a "hot deals" strip on the homepage.
 */
export function hotDeals(minDiscount = 30, limit = 10): Product[] {
  return allProducts()
    .filter((p) => (p.discount_pct ?? 0) >= minDiscount && p.price_thb > 0)
    .sort((a, b) => (b.discount_pct ?? 0) - (a.discount_pct ?? 0))
    .slice(0, limit);
}

/**
 * Site-wide aggregate stats for homepage trust signals.
 */
export function siteStats(): { products: number; reviews: number; sold: number } {
  const products = allProducts();
  return {
    products: products.length,
    reviews: products.reduce((s, p) => s + (Number(p.konvy_review_count) || 0), 0),
    sold: products.reduce((s, p) => s + (Number(p.sold_count) || 0), 0),
  };
}

/**
 * Across ALL products, sorted by sold_count descending.
 * For the homepage trending strip. Capped to `limit`.
 */
export function bestSellersAllConcerns(limit = 8): Product[] {
  return allProducts()
    .slice()
    .sort((a, b) => b.sold_count - a.sold_count)
    .slice(0, limit);
}

/**
 * Top ingredients for a concern from the ingredient DB, sorted by efficacy desc.
 * Returns entries with efficacy >= minEfficacy, enriched with product count.
 */
export function topIngredientsForConcern(
  concern: string,
  limit = 6,
  minEfficacy = 2
): {
  inci: string;
  th_name: string;
  en_name: string;
  mechanism_th: string;
  mechanism_en: string;
  efficacy: number;
  slug: string;
  productCount: number;
}[] {
  const products = allProducts();
  return Object.entries(ingDb)
    .filter(([, e]) => (e.concern_efficacy[concern] ?? 0) >= minEfficacy)
    .sort(([, a], [, b]) => (b.concern_efficacy[concern] ?? 0) - (a.concern_efficacy[concern] ?? 0))
    .slice(0, limit)
    .map(([inci, e]) => ({
      inci,
      th_name: e.th_name,
      en_name: e.en_name,
      mechanism_th: e.mechanism_th,
      mechanism_en: e.mechanism_en,
      efficacy: e.concern_efficacy[concern] ?? 0,
      slug: ingredientSlug(inci),
      productCount: products.filter((p) =>
        p.ingredient_analysis.some((a) => a.inci === inci)
      ).length,
    }));
}

/**
 * Returns key ingredient explainer entries for `p` in the given concern,
 * filtered to those with concern_efficacy[concern] > 0, enriched from the
 * ingredient DB. Sorted by efficacy desc, capped to `limit`.
 */
export function keyIngredients(
  p: Product,
  concern: string,
  limit = 5
): {
  inci: string;
  th_name: string;
  en_name: string;
  mechanism_th: string;
  mechanism_en: string;
  efficacy: number;
  slug: string;
}[] {
  return p.ingredient_analysis
    .map((a) => {
      const efficacy = a.concern_efficacy[concern] ?? 0;
      if (efficacy <= 0) return null;
      const entry = getIngredient(ingredientSlug(a.inci));
      if (!entry) return null;
      return {
        inci: a.inci,
        th_name: entry.th_name,
        en_name: entry.en_name,
        mechanism_th: entry.mechanism_th,
        mechanism_en: entry.mechanism_en,
        efficacy,
        slug: ingredientSlug(a.inci),
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)
    .sort((a, b) => b.efficacy - a.efficacy)
    .slice(0, limit);
}

// ---------------------------------------------------------------------------
// Filter pages — SEO-optimised sub-pages per concern
// ---------------------------------------------------------------------------

function ingrText(p: Product): string {
  if (Array.isArray(p.ingredients)) return p.ingredients.join(" ").toLowerCase();
  return String(p.ingredients ?? "").toLowerCase();
}

function hasIngredientFn(keywords: string[]) {
  return (p: Product) =>
    keywords.some(
      (k) =>
        p.ingredient_analysis.some((a) => a.inci.toLowerCase().includes(k.toLowerCase())) ||
        ingrText(p).includes(k.toLowerCase())
    );
}

function isFragranceFree(p: Product): boolean {
  const flags = ["parfum", "fragrance"];
  const ia = p.ingredient_analysis;
  const raw = ingrText(p);
  if (!ia.length && !raw) return false;
  return !flags.some(
    (f) => ia.some((a) => a.inci.toLowerCase().includes(f)) || raw.includes(f)
  );
}

export interface FilterConfig {
  slug: string;
  th: string;
  en: string;
  emoji: string;
  apply: (p: Product) => boolean;
}

export const FILTER_CONFIGS: FilterConfig[] = [
  { slug: "under-300",      th: "ราคา ฿300 ลงมา",    en: "Under ฿300",           emoji: "💰", apply: (p) => p.price_thb > 0 && p.price_thb < 300 },
  { slug: "under-500",      th: "ราคา ฿500 ลงมา",    en: "Under ฿500",           emoji: "💰", apply: (p) => p.price_thb > 0 && p.price_thb < 500 },
  { slug: "under-1000",     th: "ราคา ฿1,000 ลงมา",  en: "Under ฿1,000",         emoji: "💰", apply: (p) => p.price_thb > 0 && p.price_thb < 1000 },
  { slug: "fragrance-free", th: "ไม่มีน้ำหอม",       en: "Fragrance-free",       emoji: "🌿", apply: isFragranceFree },
  { slug: "niacinamide",    th: "มีไนอาซินาไมด์",    en: "With Niacinamide",     emoji: "✨", apply: hasIngredientFn(["niacinamide"]) },
  { slug: "salicylic-acid", th: "มีซาลิไซลิกแอซิด", en: "With Salicylic Acid",  emoji: "🔬", apply: hasIngredientFn(["salicylic acid", "salicylate"]) },
  { slug: "vitamin-c",      th: "มีวิตามินซี",        en: "With Vitamin C",       emoji: "🍊", apply: hasIngredientFn(["ascorbic acid", "ascorbyl", "vitamin c"]) },
  { slug: "retinol",        th: "มีเรตินอล",         en: "With Retinol",         emoji: "⚡", apply: hasIngredientFn(["retinol", "retinyl", "retinal"]) },
  { slug: "hyaluronic-acid",th: "มีไฮยาลูโรนิก",    en: "With Hyaluronic Acid", emoji: "💧", apply: hasIngredientFn(["hyaluronic acid", "hyaluronate"]) },
  { slug: "serum",          th: "เซรั่ม",            en: "Serum",                emoji: "🧴", apply: (p) => /serum/i.test(p.name) },
  { slug: "moisturizer",    th: "ครีม/มอยส์เจอไรเซอร์", en: "Cream / Moisturizer", emoji: "🫙", apply: (p) => /(moisturi[sz]|cream|lotion|gel cream)/i.test(p.name) },
  { slug: "toner",          th: "โทนเนอร์",          en: "Toner / Essence",      emoji: "💦", apply: (p) => /toner|essence|mist/i.test(p.name) },
];

export const CONCERN_FILTER_SLUGS: Record<string, string[]> = {
  acne:       ["under-300", "under-500", "fragrance-free", "niacinamide", "salicylic-acid", "serum"],
  whitening:  ["under-300", "under-500", "fragrance-free", "vitamin-c", "niacinamide", "serum"],
  antiaging:  ["under-500", "under-1000", "retinol", "vitamin-c", "hyaluronic-acid", "serum", "moisturizer"],
  pores:      ["under-300", "under-500", "niacinamide", "salicylic-acid", "serum"],
  oilcontrol: ["under-300", "under-500", "niacinamide", "salicylic-acid", "toner"],
  sensitive:  ["under-300", "under-500", "fragrance-free", "hyaluronic-acid", "moisturizer"],
};

export function getFilter(slug: string): FilterConfig | undefined {
  return FILTER_CONFIGS.find((f) => f.slug === slug);
}

export function filterRanking(concern: string, filterSlug: string): Product[] {
  const config = getFilter(filterSlug);
  if (!config) return [];
  return getRanking(concern)
    .map((e) => getProduct(e.product_id))
    .filter((p): p is Product => p != null)
    .filter(config.apply);
}
