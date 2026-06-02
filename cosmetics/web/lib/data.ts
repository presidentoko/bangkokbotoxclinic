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
