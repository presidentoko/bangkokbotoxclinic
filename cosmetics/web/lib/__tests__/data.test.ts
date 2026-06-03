import { describe, it, expect } from "vitest";
import { slugify } from "../format";
import { getRanking, getProduct, productSlug, getIngredient, allProducts } from "../data";

describe("format.slugify", () => {
  it("lowercases, strips, hyphenates", () => {
    expect(slugify("La Roche Posay")).toBe("la-roche-posay");
    expect(slugify("Dr.PONG (Skincare)")).toBe("dr-pong-skincare");
  });
});

describe("data accessors", () => {
  it("ranking is sorted desc and resolves to products", () => {
    const r = getRanking("acne");
    expect(r.length).toBeGreaterThan(0);
    for (let i = 1; i < r.length; i++) {
      expect(r[i - 1].total_score).toBeGreaterThanOrEqual(r[i].total_score);
    }
    const top = getProduct(r[0].product_id);
    expect(top?.name).toBeTruthy();
  });
  it("productSlug round-trips via getProduct", () => {
    const p = allProducts()[0];
    const slug = productSlug(p);
    expect(slug.endsWith(p.product_id)).toBe(true);
  });
  it("getIngredient finds a known ingredient by slug", () => {
    const ing = getIngredient("niacinamide");
    expect(ing?.en_name.toLowerCase()).toContain("niacinamide");
  });
});
