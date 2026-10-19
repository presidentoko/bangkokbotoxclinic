import { describe, it, expect } from "vitest";
import {
  actives,
  sharedActives,
  uniqueActives,
  concernDrivers,
  unitPrice,
  comparableUnitPrice,
  crossBrandQuotes,
  hasEvidence,
  evidenceScore,
  looksLikeOpinion,
} from "../compare-evidence";
import type { Product } from "../types";

const base = (over: Partial<Product>): Product =>
  ({
    product_id: "1",
    url: "",
    name: "x",
    brand: "Brand",
    price_thb: 100,
    list_price_thb: 100,
    discount_pct: 0,
    volume: "50ml",
    image_url: "",
    description: "",
    ingredients: "",
    ingredient_analysis: [],
    ...over,
  }) as Product;

const ing = (inci: string, role: string, eff: Record<string, number> = {}) => ({
  inci,
  role,
  concern_efficacy: eff,
  safety_flags: [],
});

describe("actives", () => {
  it("keeps only the ingredients doing the work", () => {
    const p = base({
      ingredient_analysis: [
        ing("Salicylic Acid", "active", { acne: 3 }),
        ing("Aqua", "solvent"),
        ing("Glycerin", "humectant", { sensitive: 2 }),
      ],
    });
    expect(actives(p).map((i) => i.inci)).toEqual(["Salicylic Acid"]);
  });

  it("survives a product with no analysis", () => {
    expect(actives(base({ ingredient_analysis: undefined as never }))).toEqual([]);
  });
});

describe("sharedActives", () => {
  it("matches across casing and spacing", () => {
    const a = base({ ingredient_analysis: [ing("Thiamidol", "active", { whitening: 3 })] });
    const b = base({ ingredient_analysis: [ing("  thiamidol ", "active", { whitening: 3 })] });
    expect(sharedActives(a, b)).toEqual(["Thiamidol"]);
  });

  it("does not report an active only one side has", () => {
    const a = base({ ingredient_analysis: [ing("Niacinamide", "active", { whitening: 2 })] });
    const b = base({ ingredient_analysis: [ing("Arbutin", "active", { whitening: 2 })] });
    expect(sharedActives(a, b)).toEqual([]);
  });

  it("ignores a shared ingredient that is not an active", () => {
    const a = base({ ingredient_analysis: [ing("Aqua", "solvent"), ing("Azelaic Acid", "active")] });
    const b = base({ ingredient_analysis: [ing("Aqua", "solvent"), ing("Retinol", "active")] });
    expect(sharedActives(a, b)).toEqual([]);
  });
});

describe("uniqueActives", () => {
  it("orders by how much the ingredient does for that concern", () => {
    const a = base({
      ingredient_analysis: [
        ing("Weak", "active", { acne: 1 }),
        ing("Strong", "active", { acne: 3 }),
      ],
    });
    const b = base({ ingredient_analysis: [ing("Other", "active", { acne: 2 })] });
    expect(uniqueActives(a, b, "acne").map((i) => i.inci)).toEqual(["Strong", "Weak"]);
  });
});

describe("concernDrivers", () => {
  it("drops actives that do nothing for the concern asked about", () => {
    const p = base({
      ingredient_analysis: [
        ing("Salicylic Acid", "active", { acne: 3, whitening: 0 }),
        ing("Arbutin", "active", { whitening: 3 }),
      ],
    });
    expect(concernDrivers(p, "acne").map((i) => i.inci)).toEqual(["Salicylic Acid"]);
    expect(concernDrivers(p, "whitening").map((i) => i.inci)).toEqual(["Arbutin"]);
  });
});

describe("unitPrice", () => {
  it("reads ml and g", () => {
    expect(unitPrice(base({ volume: "75ml", price_thb: 300 }))?.perUnit).toBe(4);
    expect(unitPrice(base({ volume: "50 G", price_thb: 100 }))?.unit).toBe("g");
  });

  it("refuses counts, because baht per sheet is not a price anyone can compare", () => {
    expect(unitPrice(base({ volume: "30sheets", price_thb: 100 }))).toBeNull();
    expect(unitPrice(base({ volume: "60tablets", price_thb: 100 }))).toBeNull();
    expect(unitPrice(base({ volume: "", price_thb: 100 }))).toBeNull();
  });

  it("refuses a free or missing price rather than reporting 0/ml", () => {
    expect(unitPrice(base({ volume: "50ml", price_thb: 0 }))).toBeNull();
  });

  it("does not compare ml against g", () => {
    const a = base({ volume: "50ml", price_thb: 100 });
    const b = base({ volume: "50g", price_thb: 100 });
    expect(comparableUnitPrice(a, b)).toBeNull();
  });
});

describe("crossBrandQuotes", () => {
  const eucerin = base({
    brand: "Eucerin",
    pantip: {
      mention_count: 1,
      thread_count: 1,
      snippets: [{ text: "สองตัวนี้มี Thiamidol เหมือนกันค่ะ เราใช้ Eucerin กับ NIVEA มาแล้วทั้งคู่ ต่างกันนิดหน่อยนะคะ", topic_id: "42" }],
    },
  } as Partial<Product>);
  const nivea = base({ brand: "NIVEA" } as Partial<Product>);

  it("finds the quote that names the other brand, and keeps the thread id", () => {
    const q = crossBrandQuotes(eucerin, nivea);
    expect(q).toHaveLength(1);
    expect(q[0].mentionsBrand).toBe("NIVEA");
    expect(q[0].fromBrand).toBe("Eucerin");
    expect(q[0].topicId).toBe("42");
  });

  it("works in either argument order", () => {
    expect(crossBrandQuotes(nivea, eucerin)).toHaveLength(1);
  });

  it("returns nothing when the other brand is never named", () => {
    const other = base({ brand: "Cetaphil" } as Partial<Product>);
    expect(crossBrandQuotes(eucerin, other)).toEqual([]);
  });

  it("skips brands too short to match safely", () => {
    const roc = base({ brand: "RoC" } as Partial<Product>);
    const chatty = base({
      brand: "Other",
      pantip: { mention_count: 1, thread_count: 1, snippets: [{ text: "process rocks", topic_id: "9" }] },
    } as Partial<Product>);
    expect(crossBrandQuotes(chatty, roc)).toEqual([]);
  });

  it("drops a snippet with no thread to link to", () => {
    const noId = base({
      brand: "Eucerin",
      pantip: { mention_count: 1, thread_count: 1, snippets: [{ text: "NIVEA ดีกว่า", topic_id: "" }] },
    } as Partial<Product>);
    expect(crossBrandQuotes(noId, nivea)).toEqual([]);
  });
});

describe("hasEvidence", () => {
  it("rejects a pair where one side has nothing checkable", () => {
    const withActive = base({ ingredient_analysis: [ing("Retinol", "active", { antiaging: 3 })] });
    const without = base({ ingredient_analysis: [ing("Aqua", "solvent")] });
    expect(hasEvidence(withActive, without)).toBe(false);
    expect(hasEvidence(withActive, withActive)).toBe(true);
  });

  it("scores a pair with a shared active and a quote above a bare pair", () => {
    const plain = base({ ingredient_analysis: [ing("Retinol", "active", { antiaging: 3 })] });
    const rich = base({
      brand: "Eucerin",
      ingredient_analysis: [ing("Retinol", "active", { antiaging: 3 })],
      // Long enough to clear looksLikeOpinion: a two-word fragment is not a
      // quote worth printing, and the gate says so.
      pantip: {
        mention_count: 1,
        thread_count: 1,
        snippets: [
          {
            text: "ใช้มาสองเดือนแล้วค่ะ เทียบกับ Brand ที่เคยใช้ก่อนหน้านี้ รู้สึกว่าตัวนี้ซึมเร็วกว่าและไม่เหนียวเลย",
            topic_id: "7",
          },
        ],
      },
    } as Partial<Product>);
    expect(evidenceScore(rich, plain, "antiaging")).toBeGreaterThan(
      evidenceScore(plain, plain, "antiaging")
    );
  });
});


/**
 * These three strings are real snippets this site would have published under
 * "what Thai buyers said when they weighed these two", found by auditing the
 * pairs the build actually produces. Two of them are not opinions at all.
 */
describe("looksLikeOpinion", () => {
  const brands = [
    "winkwhite", "la glace", "Srichand", "smoothE", "Dentiste", "Plantnery",
    "Her Hyness", "Biore", "Bioderma", "Bifesta", "Senka", "MIZUMI",
    "BANOBAGI", "CeraVe", "NIVEA", "Eucerin",
  ];

  it("rejects a shopping list of brand names", () => {
    const list = "mi -ingu % -eve's -winkwhite -la glace -srichand -smoothE -Dentiste -Plantnery -Her Hyness";
    expect(looksLikeOpinion(list, brands)).toBe(false);
  });

  it("rejects another enumeration, this one space separated", () => {
    const list = "in face Biore Ganier ชมพู Bioderma ชมพู Bifesta Senka - A.L.L. MIZUMI Neutrogena";
    expect(looksLikeOpinion(list, brands)).toBe(false);
  });

  it("rejects campaign copy carrying a hashtag", () => {
    const promo = 'ชวนทุกเจนเดบิวต์ผิวใส #โกลว์เรีย ในงาน "BANOBAGI Built Bright Skin With B" จัดจึ้งสมชื่อ';
    expect(looksLikeOpinion(promo, brands)).toBe(false);
  });

  it("keeps a buyer actually comparing two products", () => {
    const real = "ถ้าถามว่าแรงมากมั้ย nivea กลิ่นน้ำหอมเลย เราคิดว่า cerave อาจจะไม่ค่อยมีกลิ่นค่ะ เพราะตัวครีมเนื้อบางมาก";
    expect(looksLikeOpinion(real, brands)).toBe(true);
  });

  it("rejects a fragment too short to say anything", () => {
    expect(looksLikeOpinion("nivea ดีกว่า", brands)).toBe(false);
  });

  it("does not need a brand list to reject a hashtag or a stub", () => {
    expect(looksLikeOpinion("#promo ".repeat(12), [])).toBe(false);
    expect(looksLikeOpinion("สั้น", [])).toBe(false);
  });
  it("rejects product copy that is not anyone speaking", () => {
    // Clears every list and hashtag test above, and is still a brochure.
    const blurb = "เซรั่มเนื้อบางเบา ซึมไวไม่เหนียวเหนอะหนะ ช่วยปรับผิวให้กระจ่างใสขึ้นอย่างเป็นธรรมชาติ เหมาะสำหรับผิวทุกประเภท";
    expect(looksLikeOpinion(blurb, brands)).toBe(false);
  });

  it("keeps an English post written in the first person", () => {
    const en = "I tried this for about two months and my skin texture improved a lot, though it did sting a little at first.";
    expect(looksLikeOpinion(en, brands)).toBe(true);
  });

  it("keeps a Thai post marked by its polite particle", () => {
    const th = "ใช้มาสามเดือนแล้วค่ะ หน้าใสขึ้นจริง แต่ต้องทาต่อเนื่องนะคะ ไม่งั้นกลับมาเหมือนเดิม";
    expect(looksLikeOpinion(th, brands)).toBe(true);
  });
});
