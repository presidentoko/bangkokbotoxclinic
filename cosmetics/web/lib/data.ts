import master from "@/data/master_db.json";
import ingredientDb from "@/data/ingredient_db.json";
import type { MasterDb, Product, RankingEntry, IngredientEntry } from "./types";
import { slugify } from "./format";

const db = master as unknown as MasterDb;
const ingDb = ingredientDb as unknown as Record<string, IngredientEntry>;

export const CONCERNS = ["acne", "whitening"] as const;
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
