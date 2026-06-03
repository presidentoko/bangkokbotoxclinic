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
export const productIdFromSlug = (slug: string) => slug.split("-").pop()!;

export const allIngredients = (): [string, IngredientEntry][] => Object.entries(ingDb);
export const ingredientSlug = (inci: string) => slugify(inci);
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
