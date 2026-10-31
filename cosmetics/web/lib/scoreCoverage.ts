import { allProducts, generatedAt } from "@/lib/data";
import type { Product } from "@/lib/types";

/**
 * What the published scores actually rest on, counted from the catalogue.
 *
 * /methodology prints "ส่วนผสม 45%" as if every row carried a measured
 * ingredient score. Measured 2026-10-30 over data/master_db.json
 * (generated 2026-10-16, 1,836 products):
 *
 *   ingredients + analysis   1,144  62.3%   measured
 *   neither                    564  30.7%   ingredient_count 0 — 529 of them
 *                                           published as exactly 10.0/100
 *   ingredients only            89   4.8%   10.0 is legitimate here: the list
 *                                           was read, nothing in it matched a
 *                                           scored active
 *   analysis only               39   2.1%
 *
 * scoring.py: `ingredient_score = _BASE + reward - penalty` with `_BASE = 10`,
 * commented "floor so a no-active product isn't 0". That floor is right for
 * the 89 — a product whose INCI we read and found nothing relevant in is a
 * real finding. It is wrong for the 564, where `analysis` is empty because
 * there was never an ingredient list to analyse. Both states return 10.0 and
 * the product page draws the same bar for them.
 *
 * The oral path already gets this right (build_master_db.py: an unparseable
 * dose "score[s] 0 for every concern and are correctly absent from every
 * list"), and so does makeup, whose bar the product page suppresses with the
 * note that showing it "claimed a 0/100 ingredient rating for products that
 * were never rated on it". This is that same rule for topical skincare.
 *
 * Deliberately a display-layer fix. The stored numbers do not move, so no
 * ranking changes: at 10 x 0.45 these products cannot climb, and none of them
 * reaches the top 20 of any concern (acne 217 and whitening 280 appear only in
 * the long tail; the other four concerns have none). Recomputing instead would
 * mean re-running build_master_db.py, which has deleted 833 products once
 * before — `recovered_from` is set on 833 rows, the trace of that recovery —
 * and Konvy is WAF-blocked, so a lost row cannot be re-scraped.
 */

/** Was there anything to score this product's ingredients from? */
export function hasIngredientEvidence(
  p: Pick<Product, "ingredients" | "ingredient_analysis">,
): boolean {
  if (p.ingredient_analysis?.length) return true;
  const ing = p.ingredients;
  if (Array.isArray(ing)) return ing.length > 0;
  return Boolean(ing && String(ing).trim());
}

export type Coverage = {
  /** Catalogue size and the date the rows were built. */
  products: number;
  brands: number;
  generated: string | null;
  /** Ingredient-score provenance, the four states above. */
  measured: number;
  listOnly: number;
  analysisOnly: number;
  noIngredientData: number;
  /** Review provenance. */
  konvyReviewCount: number;
  reviewTextsHeld: number;
  reviewTextProducts: number;
  withoutReviews: number;
  retailerSources: { name: string; products: number }[];
  /** Price provenance — the oldest and newest scrape dates in the catalogue. */
  priceFrom: string | null;
  priceTo: string | null;
};

/**
 * Counted at build time, never written down. A hand-copied figure on a trust
 * page goes stale silently: bangkoktopclinic's editorial policy claimed
 * "955/1,001 URLs" when the real number had drifted to 857.
 */
export function coverage(): Coverage {
  const P = allProducts();
  const brands = new Set<string>();
  let measured = 0;
  let listOnly = 0;
  let analysisOnly = 0;
  let noIngredientData = 0;
  let konvyReviewCount = 0;
  let reviewTextsHeld = 0;
  let reviewTextProducts = 0;
  let withoutReviews = 0;
  const retailers = new Map<string, number>();
  const dates: string[] = [];

  for (const p of P) {
    if (p.brand) brands.add(p.brand);

    const hasAnalysis = Boolean(p.ingredient_analysis?.length);
    const ing = p.ingredients;
    const hasList = Array.isArray(ing)
      ? ing.length > 0
      : Boolean(ing && String(ing).trim());
    if (hasList && hasAnalysis) measured++;
    else if (hasList) listOnly++;
    else if (hasAnalysis) analysisOnly++;
    else noIngredientData++;

    const n = Number(p.konvy_review_count) || 0;
    konvyReviewCount += n;
    if (!n) withoutReviews++;
    const texts = Number((p as { reviews_scraped?: number }).reviews_scraped) || 0;
    reviewTextsHeld += texts;
    if (texts > 0) reviewTextProducts++;

    for (const key of ["watsons", "boots", "pantip"] as const) {
      if ((p as unknown as Record<string, unknown>)[key]) {
        retailers.set(key, (retailers.get(key) ?? 0) + 1);
      }
    }

    const iso = String(p.fetched_at ?? "").slice(0, 10);
    if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) dates.push(iso);
  }

  dates.sort();
  const LABELS: Record<string, string> = {
    watsons: "Watsons",
    boots: "Boots",
    pantip: "Pantip",
  };

  return {
    products: P.length,
    brands: brands.size,
    generated: generatedAt()?.slice(0, 10) ?? null,
    measured,
    listOnly,
    analysisOnly,
    noIngredientData,
    konvyReviewCount,
    reviewTextsHeld,
    reviewTextProducts,
    withoutReviews,
    retailerSources: [...retailers.entries()]
      .map(([name, products]) => ({ name: LABELS[name] ?? name, products }))
      .sort((a, b) => b.products - a.products),
    priceFrom: dates[0] ?? null,
    priceTo: dates[dates.length - 1] ?? null,
  };
}
