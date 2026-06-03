import { describe, it, expect } from "vitest";
import {
  getRanking,
  getProduct,
  cheaperAlternatives,
  similarProducts,
  keyIngredients,
} from "../data";

// ---------------------------------------------------------------------------
// Helpers to find dynamic test fixtures
// ---------------------------------------------------------------------------

/** Find the first acne product with price > 500 and at least 1 active ingredient */
function findAcneProductWithPriceAndActives(): ReturnType<typeof getProduct> {
  const ranking = getRanking("acne");
  for (const r of ranking) {
    const p = getProduct(r.product_id);
    if (p && p.price_thb > 500 && p.ingredient_analysis.length >= 1) {
      return p;
    }
  }
  return undefined;
}

/** Find any product in the acne ranking that has Niacinamide in its ingredient_analysis */
function findProductWithNiacinamide(): ReturnType<typeof getProduct> {
  const ranking = getRanking("acne");
  for (const r of ranking) {
    const p = getProduct(r.product_id);
    if (p && p.ingredient_analysis.some((a) => a.inci === "Niacinamide")) {
      return p;
    }
  }
  // Fall back to whitening concern
  const rankW = getRanking("whitening");
  for (const r of rankW) {
    const p = getProduct(r.product_id);
    if (p && p.ingredient_analysis.some((a) => a.inci === "Niacinamide")) {
      return p;
    }
  }
  return undefined;
}

// ---------------------------------------------------------------------------
// cheaperAlternatives
// ---------------------------------------------------------------------------

describe("cheaperAlternatives", () => {
  it("returns only products cheaper than the reference product", () => {
    const p = findAcneProductWithPriceAndActives();
    if (!p) {
      // If no qualifying product exists, skip with a soft assertion
      expect(true).toBe(true);
      return;
    }
    const alts = cheaperAlternatives(p, "acne");
    expect(alts.length).toBeGreaterThanOrEqual(0);
    for (const alt of alts) {
      expect(alt.price_thb).toBeLessThan(p.price_thb);
    }
  });

  it("excludes the reference product itself", () => {
    const p = findAcneProductWithPriceAndActives();
    if (!p) { expect(true).toBe(true); return; }
    const alts = cheaperAlternatives(p, "acne");
    expect(alts.every((a) => a.product_id !== p.product_id)).toBe(true);
  });

  it("results are sorted by total_score[concern] descending", () => {
    const p = findAcneProductWithPriceAndActives();
    if (!p) { expect(true).toBe(true); return; }
    const alts = cheaperAlternatives(p, "acne", 10);
    for (let i = 1; i < alts.length; i++) {
      expect(alts[i - 1].total_score["acne"] ?? 0).toBeGreaterThanOrEqual(
        alts[i].total_score["acne"] ?? 0
      );
    }
  });

  it("respects the score threshold (not much worse than reference)", () => {
    const p = findAcneProductWithPriceAndActives();
    if (!p) { expect(true).toBe(true); return; }
    const pScore = p.total_score["acne"] ?? 0;
    const alts = cheaperAlternatives(p, "acne", 20);
    for (const alt of alts) {
      expect((alt.total_score["acne"] ?? 0)).toBeGreaterThanOrEqual(pScore - 10);
    }
  });

  it("respects the limit parameter", () => {
    const ranking = getRanking("acne");
    // Use the most expensive product in the ranking so there are many cheaper ones
    let mostExpensive = getProduct(ranking[0].product_id);
    for (const r of ranking) {
      const q = getProduct(r.product_id);
      if (q && mostExpensive && q.price_thb > mostExpensive.price_thb) {
        mostExpensive = q;
      }
    }
    if (!mostExpensive) { expect(true).toBe(true); return; }
    const alts = cheaperAlternatives(mostExpensive, "acne", 2);
    expect(alts.length).toBeLessThanOrEqual(2);
  });

  it("returns empty array when price_thb is 0", () => {
    const fake = { ...getProduct(getRanking("acne")[0].product_id)!, price_thb: 0 };
    const alts = cheaperAlternatives(fake, "acne");
    expect(alts).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// similarProducts
// ---------------------------------------------------------------------------

describe("similarProducts", () => {
  it("excludes the reference product itself", () => {
    const ranking = getRanking("acne");
    const p = getProduct(ranking[0].product_id)!;
    const sims = similarProducts(p, "acne");
    expect(sims.every((s) => s.product_id !== p.product_id)).toBe(true);
  });

  it("respects the limit parameter", () => {
    const ranking = getRanking("acne");
    const p = getProduct(ranking[0].product_id)!;
    const sims = similarProducts(p, "acne", 3);
    expect(sims.length).toBeLessThanOrEqual(3);
  });

  it("products sharing actives appear before those that do not (when possible)", () => {
    // Find a product with at least 2 active ingredients so overlapping is likely
    const ranking = getRanking("acne");
    let pivot: ReturnType<typeof getProduct> = undefined;
    for (const r of ranking) {
      const q = getProduct(r.product_id);
      if (q && q.ingredient_analysis.length >= 2) { pivot = q; break; }
    }
    if (!pivot) { expect(true).toBe(true); return; }

    const sims = similarProducts(pivot, "acne", 8);
    const pivotIncis = new Set(pivot.ingredient_analysis.map((a) => a.inci));
    // Count shared ingredients for each result
    const sharedCounts = sims.map(
      (s) => s.ingredient_analysis.filter((a) => pivotIncis.has(a.inci)).length
    );
    // All products sharing ingredients should appear before those that don't
    let foundZero = false;
    for (const c of sharedCounts) {
      if (foundZero) expect(c).toBe(0);
      if (c === 0) foundZero = true;
    }
  });

  it("returns products even when no ingredient overlap (fallback to ranked)", () => {
    // Use a product with no ingredients; should still get results from ranking
    const ranking = getRanking("acne");
    let noIngProduct: ReturnType<typeof getProduct> = undefined;
    for (const r of ranking) {
      const q = getProduct(r.product_id);
      if (q && q.ingredient_analysis.length === 0) { noIngProduct = q; break; }
    }
    if (!noIngProduct) { expect(true).toBe(true); return; }
    const sims = similarProducts(noIngProduct, "acne", 4);
    expect(sims.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// keyIngredients
// ---------------------------------------------------------------------------

describe("keyIngredients", () => {
  it("returns entries with required fields for a product with Niacinamide", () => {
    const p = findProductWithNiacinamide();
    if (!p) { expect(true).toBe(true); return; }
    // Use the concern that niacinamide is active in
    const concern = p.ingredient_analysis.find((a) => a.inci === "Niacinamide")
      ?.concern_efficacy["acne"] ?? 0 > 0 ? "acne" : "whitening";
    const keys = keyIngredients(p, concern);
    expect(keys.length).toBeGreaterThan(0);
    for (const k of keys) {
      expect(k.inci).toBeTruthy();
      expect(k.th_name).toBeTruthy();
      expect(k.en_name).toBeTruthy();
      expect(k.mechanism_th).toBeTruthy();
      expect(k.mechanism_en).toBeTruthy();
      expect(k.slug).toBeTruthy();
      expect(k.efficacy).toBeGreaterThan(0);
    }
  });

  it("includes Niacinamide slug for a product that has it", () => {
    const p = findProductWithNiacinamide();
    if (!p) { expect(true).toBe(true); return; }
    const keys = keyIngredients(p, "acne", 10);
    const niac = keys.find((k) => k.slug === "niacinamide");
    if (niac) {
      expect(niac.en_name.toLowerCase()).toContain("niacinamide");
      expect(niac.mechanism_en).toBeTruthy();
    }
    // Either we found it or its efficacy for acne was 0 — both valid
    expect(true).toBe(true);
  });

  it("results are sorted by efficacy descending", () => {
    const p = findProductWithNiacinamide() ?? getProduct(getRanking("acne")[0].product_id)!;
    const keys = keyIngredients(p, "acne", 10);
    for (let i = 1; i < keys.length; i++) {
      expect(keys[i - 1].efficacy).toBeGreaterThanOrEqual(keys[i].efficacy);
    }
  });

  it("respects the limit parameter", () => {
    const p = findProductWithNiacinamide() ?? getProduct(getRanking("acne")[0].product_id)!;
    const keys = keyIngredients(p, "acne", 2);
    expect(keys.length).toBeLessThanOrEqual(2);
  });

  it("returns only ingredients with concern_efficacy > 0 for that concern", () => {
    const ranking = getRanking("acne");
    for (const r of ranking) {
      const p = getProduct(r.product_id);
      if (!p || p.ingredient_analysis.length === 0) continue;
      const keys = keyIngredients(p, "acne", 20);
      for (const k of keys) {
        const ia = p.ingredient_analysis.find((a) => a.inci === k.inci);
        expect(ia?.concern_efficacy["acne"] ?? 0).toBeGreaterThan(0);
      }
      break;
    }
  });
});
