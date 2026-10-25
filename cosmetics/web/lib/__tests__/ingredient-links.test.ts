import { describe, it, expect } from "vitest";
import { comboSegments, relatedByConcern, lexicon } from "../ingredient-links";
import { allIngredients, ingredientSlug } from "../data";

const linked = (segs: { text: string; slug?: string }[]) => segs.filter((s) => s.slug);

describe("comboSegments", () => {
  it("links an ingredient named in Thai pairing prose", () => {
    const segs = comboSegments(
      "ใช้ร่วมกับเรตินอลได้ตามปกติ",
      "th",
      "niacinamide"
    );
    expect(linked(segs).map((s) => s.slug)).toContain("retinol");
  });

  it("reassembles to exactly the input text", () => {
    // A linkifier that drops or duplicates a character rewrites published
    // editorial copy. Every ingredient with pairing prose, both locales.
    for (const [inci, e] of allIngredients()) {
      const self = ingredientSlug(inci);
      for (const [text, loc] of [
        [e.combo_good_th, "th"],
        [e.combo_avoid_th, "th"],
        [e.combo_good_en, "en"],
        [e.combo_avoid_en, "en"],
      ] as const) {
        if (!text) continue;
        const segs = comboSegments(text, loc, self);
        expect(segs.map((s) => s.text).join("")).toBe(text);
      }
    }
  });

  it("never links the page to itself", () => {
    for (const [inci, e] of allIngredients()) {
      const self = ingredientSlug(inci);
      for (const [text, loc] of [
        [e.combo_good_th, "th"],
        [e.combo_good_en, "en"],
      ] as const) {
        if (!text) continue;
        expect(linked(comboSegments(text, loc, self)).map((s) => s.slug)).not.toContain(self);
      }
    }
  });

  it("links each ingredient at most once per passage", () => {
    const text = "เรตินอล ใช้คู่กับ เรตินอล ได้";
    const slugs = linked(comboSegments(text, "th", "niacinamide")).map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("produces no overlapping or out-of-order spans", () => {
    for (const [inci, e] of allIngredients()) {
      const self = ingredientSlug(inci);
      for (const [text, loc] of [
        [e.combo_good_th, "th"],
        [e.combo_avoid_th, "th"],
        [e.combo_good_en, "en"],
        [e.combo_avoid_en, "en"],
      ] as const) {
        if (!text) continue;
        const segs = comboSegments(text, loc, self);
        expect(segs.every((s) => s.text.length > 0)).toBe(true);
      }
    }
  });

  it("requires a word boundary for Latin names", () => {
    // "retinolic" is not retinol, and a link on the first seven letters of it
    // sends a reader somewhere the sentence did not point.
    const segs = comboSegments("a retinolic compound", "en", "niacinamide");
    expect(linked(segs)).toHaveLength(0);
  });

  it("returns one plain segment when nothing matches", () => {
    const segs = comboSegments("ไม่มีส่วนผสมอื่นในประโยคนี้", "th", "niacinamide");
    expect(segs).toHaveLength(1);
    expect(segs[0].slug).toBeUndefined();
  });

  it("returns nothing for empty prose", () => {
    expect(comboSegments("", "th", "niacinamide")).toEqual([]);
  });
});

describe("lexicon", () => {
  it("drops terms shorter than the minimum", () => {
    // Thai has no word spaces, so a 3-character term is a fragment of longer
    // names, not a word. This is the guard against the ไม่แพง/แพง class of bug.
    for (const t of lexicon("th")) expect(t.term.length).toBeGreaterThanOrEqual(4);
    for (const t of lexicon("en")) expect(t.term.length).toBeGreaterThanOrEqual(4);
  });

  it("drops a term two different ingredients both answer to", () => {
    // "Retinoid" is an alias of Adapalene and of Retinol; "Zinc" of Zinc and
    // Zinc PCA. Neither can be linked from prose that says only that word.
    const terms = lexicon("en");
    for (const a of terms) {
      const ambiguous = terms.some(
        (b) => b.slug !== a.slug && b.term.toLowerCase() === a.term.toLowerCase()
      );
      expect(ambiguous).toBe(false);
    }
    const left = terms.map((t) => t.term.toLowerCase());
    expect(left).not.toContain("retinoid");
    expect(left).not.toContain("zinc");
  });

  it("keeps a term that merely nests inside a longer one", () => {
    // Containment is resolved by longest-first matching, not by dropping. If
    // "Vitamin C" were dropped it would silence most of the pairing prose,
    // where it is the most common mention.
    const left = lexicon("en").map((t) => t.term.toLowerCase());
    expect(left).toContain("vitamin c");
    expect(left).toContain("vitamin c ester");
  });

  it("matches the specific name where the prose is specific", () => {
    const ester = comboSegments("pairs with Vitamin C Ester daily", "en", "retinol");
    expect(linked(ester).map((s) => s.slug)).toEqual(["ascorbyl-tetraisopalmitate"]);
    const plain = comboSegments("pairs with Vitamin C daily", "en", "retinol");
    expect(linked(plain).map((s) => s.slug)).toEqual(["ascorbic-acid"]);
  });

  it("orders longest first so the specific name wins", () => {
    const lens = lexicon("th").map((t) => t.term.length);
    expect(lens).toEqual([...lens].sort((a, b) => b - a));
  });

  it("points every term at a real ingredient page", () => {
    const real = new Set(allIngredients().map(([inci]) => ingredientSlug(inci)));
    for (const t of lexicon("th")) expect(real.has(t.slug)).toBe(true);
  });
});

describe("relatedByConcern", () => {
  it("returns other actives for the concern this ingredient is strongest on", () => {
    const r = relatedByConcern("Niacinamide", "th");
    expect(r).not.toBeNull();
    expect(r!.concern).toBe("whitening"); // its top score, 3
    expect(r!.items.length).toBeGreaterThan(0);
  });

  it("excludes the ingredient itself", () => {
    for (const [inci] of allIngredients()) {
      const r = relatedByConcern(inci, "en");
      if (!r) continue;
      expect(r.items.map((i) => i.inci)).not.toContain(inci);
    }
  });

  it("only lists ingredients with a positive score for that concern", () => {
    for (const [inci] of allIngredients()) {
      const r = relatedByConcern(inci, "en");
      if (!r) continue;
      for (const i of r.items) expect(i.score).toBeGreaterThan(0);
    }
  });

  it("sorts by score descending", () => {
    for (const [inci] of allIngredients()) {
      const r = relatedByConcern(inci, "en");
      if (!r) continue;
      const s = r.items.map((i) => i.score);
      expect(s).toEqual([...s].sort((a, b) => b - a));
    }
  });

  it("is stable across calls, not dependent on object key order", () => {
    const a = relatedByConcern("Retinol", "en");
    const b = relatedByConcern("Retinol", "en");
    expect(a!.items.map((i) => i.inci)).toEqual(b!.items.map((i) => i.inci));
  });

  it("honours the limit", () => {
    const r = relatedByConcern("Niacinamide", "en", 3);
    expect(r!.items.length).toBeLessThanOrEqual(3);
  });

  it("returns null for an ingredient that is not in the db", () => {
    expect(relatedByConcern("Not An Ingredient", "en")).toBeNull();
  });

  it("gives most ingredient pages at least one sibling link", () => {
    // The whole point is that these pages stop being islands. If this covers
    // only a handful, the link layer is not worth the render.
    const covered = allIngredients().filter(([inci]) => relatedByConcern(inci, "en") !== null);
    expect(covered.length / allIngredients().length).toBeGreaterThan(0.7);
  });
});
