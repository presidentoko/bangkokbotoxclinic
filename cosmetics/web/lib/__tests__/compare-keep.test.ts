import { describe, it, expect } from "vitest";
import compareKeep from "../../data/compare-keep.json";
import masterDb from "../../data/master_db.json";

describe("compare keep-list", () => {
  const products = (masterDb as { products: Record<string, unknown> }).products;

  it("names pairs of products that are still in the catalogue", () => {
    // A pair whose product has gone is dead weight; the page cannot render.
    for (const [a, b] of compareKeep.pairs) {
      expect(products[a], `product ${a} missing`).toBeTruthy();
      expect(products[b], `product ${b} missing`).toBeTruthy();
      expect(a).not.toBe(b);
    }
  });

  it("holds the pair that was ranking when it 404'd", () => {
    // /en/compare/cetaphil-113796-vs-vaseline-110238: 29 impressions, position 9.0.
    const has = compareKeep.pairs.some(
      ([a, b]) => (a === "113796" && b === "110238") || (a === "110238" && b === "113796")
    );
    expect(has).toBe(true);
  });
});
