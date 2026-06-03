import { describe, it, expect } from "vitest";
import {
  topPicks,
  bestSellers,
  mostLoved,
  bestSellersAllConcerns,
  getRanking,
  getProduct,
  allProducts,
} from "../data";

// ---------------------------------------------------------------------------
// topPicks
// ---------------------------------------------------------------------------

describe("topPicks", () => {
  it("returns products sorted by total_score[concern] descending (acne)", () => {
    const picks = topPicks("acne");
    expect(picks.length).toBeGreaterThan(0);
    for (let i = 1; i < picks.length; i++) {
      expect(picks[i - 1].total_score["acne"] ?? 0).toBeGreaterThanOrEqual(
        picks[i].total_score["acne"] ?? 0
      );
    }
  });

  it("matches the top of getRanking resolved to Product objects", () => {
    const ranking = getRanking("acne");
    const picks = topPicks("acne", 5);
    const expectedIds = ranking
      .slice(0, 5)
      .map((r) => r.product_id)
      .filter((id) => getProduct(id) !== undefined);
    const actualIds = picks.map((p) => p.product_id);
    expect(actualIds).toEqual(expectedIds);
  });

  it("respects the limit parameter", () => {
    const picks = topPicks("acne", 3);
    expect(picks.length).toBeLessThanOrEqual(3);
  });

  it("returns Product objects (not undefined)", () => {
    const picks = topPicks("whitening");
    for (const p of picks) {
      expect(p.product_id).toBeTruthy();
      expect(p.name).toBeTruthy();
    }
  });

  it("default limit is 8", () => {
    const picks = topPicks("acne");
    expect(picks.length).toBeLessThanOrEqual(8);
  });
});

// ---------------------------------------------------------------------------
// bestSellers
// ---------------------------------------------------------------------------

describe("bestSellers", () => {
  it("returns a non-empty list for acne", () => {
    const bs = bestSellers("acne");
    expect(bs.length).toBeGreaterThan(0);
  });

  it("is sorted by sold_count descending", () => {
    const bs = bestSellers("acne", 20);
    for (let i = 1; i < bs.length; i++) {
      expect(bs[i - 1].sold_count).toBeGreaterThanOrEqual(bs[i].sold_count);
    }
  });

  it("respects the limit parameter", () => {
    const bs = bestSellers("acne", 3);
    expect(bs.length).toBeLessThanOrEqual(3);
  });

  it("default limit is 8", () => {
    const bs = bestSellers("acne");
    expect(bs.length).toBeLessThanOrEqual(8);
  });

  it("is sorted by sold_count descending for whitening", () => {
    const bs = bestSellers("whitening", 20);
    for (let i = 1; i < bs.length; i++) {
      expect(bs[i - 1].sold_count).toBeGreaterThanOrEqual(bs[i].sold_count);
    }
  });

  it("falls back to all products when concern pool is empty", () => {
    // Use a concern that does not exist; pool should be empty so falls back
    const bs = bestSellers("__nonexistent_concern__");
    const allSorted = allProducts()
      .slice()
      .sort((a, b) => b.sold_count - a.sold_count)
      .slice(0, 8);
    expect(bs.map((p) => p.product_id)).toEqual(
      allSorted.map((p) => p.product_id)
    );
  });
});

// ---------------------------------------------------------------------------
// mostLoved
// ---------------------------------------------------------------------------

describe("mostLoved", () => {
  it("returns a non-empty list for whitening", () => {
    const ml = mostLoved("whitening");
    expect(ml.length).toBeGreaterThan(0);
  });

  it("items with review_count >= 20 come first, sorted desc by review_count then rating", () => {
    const ml = mostLoved("whitening", 20);
    // Find index of first item that does NOT meet the threshold
    const firstBelowIdx = ml.findIndex((p) => p.konvy_review_count < 20);
    const qualifiedPart =
      firstBelowIdx === -1 ? ml : ml.slice(0, firstBelowIdx);

    // All qualified items must be sorted by review_count desc, then rating desc
    for (let i = 1; i < qualifiedPart.length; i++) {
      const prev = qualifiedPart[i - 1];
      const curr = qualifiedPart[i];
      if (prev.konvy_review_count !== curr.konvy_review_count) {
        expect(prev.konvy_review_count).toBeGreaterThan(curr.konvy_review_count);
      } else {
        expect(prev.konvy_rating).toBeGreaterThanOrEqual(curr.konvy_rating);
      }
    }
  });

  it("when enough products meet >= 20 reviews, all returned items meet it", () => {
    const ml = mostLoved("whitening", 8);
    // Count how many products in the whitening pool meet the threshold
    const allP = allProducts();
    const meetsThreshold = allP.filter(
      (p) => p.konvy_review_count >= 20
    ).length;
    if (meetsThreshold >= 8) {
      for (const p of ml) {
        expect(p.konvy_review_count).toBeGreaterThanOrEqual(20);
      }
    } else {
      // Not enough — just verify we still get some results
      expect(ml.length).toBeGreaterThan(0);
    }
  });

  it("respects the limit parameter", () => {
    const ml = mostLoved("acne", 3);
    expect(ml.length).toBeLessThanOrEqual(3);
  });

  it("default limit is 8", () => {
    const ml = mostLoved("acne");
    expect(ml.length).toBeLessThanOrEqual(8);
  });

  it("returns Product objects with required fields", () => {
    const ml = mostLoved("acne");
    for (const p of ml) {
      expect(p.product_id).toBeTruthy();
      expect(p.name).toBeTruthy();
      expect(typeof p.konvy_review_count).toBe("number");
      expect(typeof p.konvy_rating).toBe("number");
    }
  });
});

// ---------------------------------------------------------------------------
// bestSellersAllConcerns
// ---------------------------------------------------------------------------

describe("bestSellersAllConcerns", () => {
  it("returns a non-empty list", () => {
    const bs = bestSellersAllConcerns();
    expect(bs.length).toBeGreaterThan(0);
  });

  it("is sorted by sold_count descending across all products", () => {
    const bs = bestSellersAllConcerns(20);
    for (let i = 1; i < bs.length; i++) {
      expect(bs[i - 1].sold_count).toBeGreaterThanOrEqual(bs[i].sold_count);
    }
  });

  it("respects the limit parameter", () => {
    const bs = bestSellersAllConcerns(3);
    expect(bs.length).toBeLessThanOrEqual(3);
  });

  it("default limit is 8", () => {
    const bs = bestSellersAllConcerns();
    expect(bs.length).toBeLessThanOrEqual(8);
  });

  it("result is a subset of allProducts()", () => {
    const allIds = new Set(allProducts().map((p) => p.product_id));
    const bs = bestSellersAllConcerns(20);
    for (const p of bs) {
      expect(allIds.has(p.product_id)).toBe(true);
    }
  });

  it("first item has the highest sold_count of all products", () => {
    const bs = bestSellersAllConcerns(1);
    expect(bs.length).toBe(1);
    const maxSold = Math.max(...allProducts().map((p) => p.sold_count));
    expect(bs[0].sold_count).toBe(maxSold);
  });
});
