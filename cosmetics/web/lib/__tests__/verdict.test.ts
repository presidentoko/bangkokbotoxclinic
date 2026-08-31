import { describe, it, expect } from "vitest";
import {
  brandThai,
  productTypeThai,
  productTypeKey,
  thaiAlias,
} from "../thai-names";
import { parseVolumeMl, pricePerMl, pricePosition, allProducts } from "../data";
import { productVerdict, productFaqs, type VerdictInput } from "../product-verdict";
import { faqLd } from "../schema";
import { fdaRecord, fdaCoverage, fdaFaqAnswer } from "../fda";
import type { Product } from "../types";

describe("thai-names", () => {
  it("resolves brands mined from the Thai description copy", () => {
    expect(brandThai("Eucerin")).toBe("ยูเซอริน");
    expect(brandThai("La Roche Posay")).toBe("ลา โรช โพเซย์");
    expect(brandThai("Naturie")).toBe("นาทูรี่");
  });

  it("returns undefined for a brand with no mined spelling", () => {
    expect(brandThai("No Such Brand 12345")).toBeUndefined();
  });

  it("matches the most specific product form first", () => {
    // "cleansing water" must not fall through to "cleanser" or "water"
    expect(productTypeThai("Bifesta Cleansing Water 300ml")).toBe("คลีนซิ่งวอเตอร์");
    // "sunscreen" must beat the "cream" that follows it in the same name
    expect(productTypeThai("Anessa Perfect UV Sunscreen Skincare Milk SPF50")).toBe(
      "ครีมกันแดด"
    );
    expect(productTypeThai("COSRX Advanced Snail 96 Mucin Power Essence")).toBe(
      "เอสเซนส์"
    );
  });

  it("disambiguates patches by context rather than by the table", () => {
    expect(productTypeThai("Nexcare Acne Dressing Patch")).toBe("แผ่นแปะสิว");
    expect(productTypeThai("Some Hydrocolloid Patch")).toBe("แผ่นแปะ");
  });

  it("only builds an alias when the brand is known", () => {
    expect(thaiAlias({ name: "Naturie Hatomugi Gel 180g", brand: "Naturie" })).toBe(
      "นาทูรี่ เจล"
    );
    // A bare form word is not a searchable alias.
    expect(thaiAlias({ name: "Whatever Serum", brand: "No Such Brand 12345" })).toBeUndefined();
  });
});

describe("price position", () => {
  it("parses volumes and rejects countable units", () => {
    expect(parseVolumeMl("30ml")).toBe(30);
    expect(parseVolumeMl("100 g")).toBe(100);
    expect(parseVolumeMl("2pcs")).toBeNull();
    expect(parseVolumeMl(undefined)).toBeNull();
    expect(parseVolumeMl("")).toBeNull();
  });

  it("compares against same-form peers, not the whole catalogue", () => {
    // A 400ml lotion is always cheaper per ml than a 30ml serum; if the peer
    // group were global, every large-format product would look like a bargain.
    const serums = allProducts().filter(
      (p) => productTypeKey(p.name) === "serum" && pricePerMl(p) !== null
    );
    expect(serums.length).toBeGreaterThan(8);
    const pos = pricePosition(serums[0]);
    expect(pos).not.toBeNull();
    expect(pos!.peerCount).toBe(serums.length);
    expect(pos!.peerCount).toBeLessThan(allProducts().length);
    expect(pos!.cheaperThanPct).toBeGreaterThanOrEqual(0);
    expect(pos!.cheaperThanPct).toBeLessThanOrEqual(100);
  });

  it("returns null when the volume cannot be parsed", () => {
    const p = { ...allProducts()[0], volume: "2pcs" } as Product;
    expect(pricePosition(p)).toBeNull();
  });
});

function inputFor(p: Product, over: Partial<VerdictInput> = {}): VerdictInput {
  return {
    p,
    locale: "th",
    concern: "acne",
    totalScore: 70,
    ingredientScore: 65,
    actives: [
      {
        inci: "Niacinamide",
        th_name: "ไนอาซินาไมด์",
        en_name: "Niacinamide",
        mechanism_th: "ลดการอักเสบ",
        mechanism_en: "Reduces inflammation",
      },
    ],
    flagLabels: [],
    pricePos: pricePosition(p),
    ...over,
  };
}

describe("product verdict", () => {
  const p = allProducts().find((x) => x.price_thb > 0 && parseVolumeMl(x.volume))!;

  it("always produces a buy-if line", () => {
    expect(productVerdict(inputFor(p)).buyIf.length).toBeGreaterThan(20);
  });

  it("raises a skip-if from real formulation flags", () => {
    const v = productVerdict(inputFor(p, { flagLabels: ["น้ำหอม — เสี่ยงแพ้ง่าย"] }));
    expect(v.skipIf).toContain("น้ำหอม");
  });

  it("leaves skip-if null rather than inventing a downside", () => {
    const v = productVerdict(
      inputFor(p, {
        flagLabels: [],
        // comfortably mid-market: no flag, no price objection
        pricePos: { perMl: 5, medianPerMl: 5, cheaperThanPct: 50, peerCount: 50 },
      })
    );
    expect(v.skipIf).toBeNull();
  });

  it("states the price against same-form peers", () => {
    const v = productVerdict(
      inputFor(p, {
        pricePos: { perMl: 5, medianPerMl: 8, cheaperThanPct: 70, peerCount: 42 },
      })
    );
    expect(v.priceNote).toContain("70%");
    expect(v.priceNote).toContain("42");
  });
});

describe("product FAQs", () => {
  const p = allProducts().find((x) => (x.pantip?.mention_count ?? 0) > 0)!;
  const input = inputFor(p);
  const verdict = productVerdict(input);
  const faqs = productFaqs(input, verdict, ["สิว"]);

  it("asks the query shape Thai shoppers actually type", () => {
    expect(faqs[0].q).toContain("ดีไหม");
    expect(faqs.some((f) => f.q.includes("ราคาเท่าไหร่"))).toBe(true);
    expect(faqs.some((f) => f.q.includes("Pantip"))).toBe(true);
  });

  it("answers the caution question either way", () => {
    const noFlags = productFaqs(inputFor(p, { flagLabels: [] }), verdict, ["สิว"]);
    const caution = noFlags.find((f) => f.q.includes("ข้อควรระวัง"));
    expect(caution?.a).toContain("ไม่พบธงเตือน");
  });

  it("never emits an empty question or answer", () => {
    for (const f of faqs) {
      expect(f.q.trim().length).toBeGreaterThan(0);
      expect(f.a.trim().length).toBeGreaterThan(0);
    }
  });

  it("feeds FAQPage JSON-LD that matches the rendered list one-for-one", () => {
    const ld = faqLd(faqs) as { mainEntity: { name: string }[] };
    expect(ld.mainEntity).toHaveLength(faqs.length);
    expect(ld.mainEntity.map((m) => m.name)).toEqual(faqs.map((f) => f.q));
  });
});

describe("Thai FDA notification", () => {
  const withFda = allProducts().find((p) => fdaRecord(p.product_id));

  it("resolves a notification for a meaningful share of the catalogue", () => {
    // Recall was deliberately traded for precision; guard the floor so a
    // future matcher change cannot quietly gut the feature.
    expect(fdaCoverage()).toBeGreaterThan(400);
    expect(fdaCoverage()).toBeLessThanOrEqual(allProducts().length);
  });

  it("carries a registration number, a status and an FDA link", () => {
    const r = fdaRecord(withFda!.product_id)!;
    expect(r.lcnno).toMatch(/\d/);
    expect(r.status.length).toBeGreaterThan(0);
    expect(r.url).toMatch(/^https:\/\/cosmetica\.fda\.moph\.go\.th\//);
    // The entity decoding bug that produced &amp; in the query string.
    expect(r.url).not.toContain("&amp;");
  });

  it("marks only 'คงอยู่' as an in-force notification", () => {
    for (const p of allProducts()) {
      const r = fdaRecord(p.product_id);
      if (r) expect(r.active).toBe(r.status.startsWith("คงอยู่"));
    }
  });

  it("never states a product is unregistered — absence renders nothing", () => {
    const none = allProducts().find((p) => !fdaRecord(p.product_id))!;
    const faqs = productFaqs(inputFor(none), productVerdict(inputFor(none)), ["สิว"], undefined);
    expect(faqs.some((f) => f.q.includes("อย."))).toBe(false);
    expect(faqs.some((f) => f.a.includes("ไม่ได้จดแจ้ง"))).toBe(false);
  });

  it("adds the อย. question only when a record exists", () => {
    const r = fdaRecord(withFda!.product_id)!;
    const input = inputFor(withFda!);
    const faqs = productFaqs(input, productVerdict(input), ["สิว"], r);
    const q = faqs.find((f) => f.q.includes("อย."));
    expect(q).toBeDefined();
    expect(q!.a).toContain(r.lcnno);
    // The caveat must survive: we matched on name, the box is authoritative.
    expect(q!.a).toContain("กล่อง");
  });

  it("does not claim an expired notification is in force", () => {
    const expired = allProducts()
      .map((p) => fdaRecord(p.product_id))
      .find((r) => r && !r.active)!;
    const a = fdaFaqAnswer(expired, "X", "th");
    expect(a).toContain(expired.status);
    expect(a).not.toContain("คงอยู่");
  });
});

describe("makeup scoring", () => {
  // build_master_db leaves total_score at 0 for every makeup product and
  // scores them through makeup_score instead. Reading the concern score
  // published "0/100" for all 57 of them.
  const makeup = allProducts().filter((p) => p.makeup_category);

  it("every makeup product really does have a zero concern score", () => {
    expect(makeup.length).toBeGreaterThan(0);
    for (const p of makeup) {
      expect(Object.values(p.total_score ?? {}).every((v) => v === 0)).toBe(true);
      // 4 of the 57 score 0 as well — each has no reviews at all, which the
      // verdict reports as "not enough reviews" rather than as a 0/100 rating.
      if ((p.konvy_review_count ?? 0) > 0) {
        expect(p.makeup_score ?? 0).toBeGreaterThan(0);
      }
    }
  });

  it("states the makeup score, not the zero concern score", () => {
    const p = makeup.find((x) => (x.makeup_score ?? 0) > 0)!;
    const score = Math.round(p.makeup_score ?? 0);
    const v = productVerdict(inputFor(p, { isMakeup: true, totalScore: score, actives: [] }));
    expect(v.buyIf).toContain(`${score}/100`);
    expect(v.buyIf).not.toContain("0/100");
  });

  it("does not describe makeup as a skincare product without actives", () => {
    const v = productVerdict(inputFor(makeup[0], { isMakeup: true, actives: [] }));
    expect(v.buyIf).toContain("เครื่องสำอางแต่งหน้า");
  });

  it("drops the concern-fit question for makeup", () => {
    const input = inputFor(makeup[0], { isMakeup: true, actives: [] });
    const faqs = productFaqs(input, productVerdict(input), ["ลดเลือนริ้วรอย"]);
    expect(faqs.some((f) => f.q.includes("เหมาะกับปัญหาผิว"))).toBe(false);
  });
});

describe("unscored products", () => {
  // A score of 0 in this catalogue always comes from having no reviews, never
  // from a bad rating. Publishing "0/100" would read as a verdict.
  const unscored = allProducts().filter(
    (p) =>
      (p.konvy_review_count ?? 0) === 0 &&
      (p.makeup_category
        ? (p.makeup_score ?? 0) === 0
        : Object.values(p.total_score ?? {}).every((v) => v === 0))
  );

  it("says there is not enough data instead of scoring zero", () => {
    expect(unscored.length).toBeGreaterThan(0);
    const input = inputFor(unscored[0], { totalScore: 0, actives: [] });
    const v = productVerdict(input);
    expect(v.buyIf).not.toContain("0/100");
    expect(v.buyIf).toContain("ยังไม่มีรีวิวมากพอ");
    const faqs = productFaqs(input, v, []);
    expect(faqs[0].a).not.toContain("0/100");
  });
});

describe("no self-contradicting score claims", () => {
  it("omits the ingredient score when it is zero but actives were found", () => {
    // Oral supplements carry zinc/vitamin C (credited with acne evidence in the
    // ingredient DB) while ingredient_score[acne] is 0, which produced
    // "contains evidence-backed actives ... and scores 0/100 on ingredients".
    const p = allProducts()[0];
    const v = productVerdict(inputFor(p, { ingredientScore: 0 }));
    expect(v.buyIf).toContain("สารออกฤทธิ์");
    expect(v.buyIf).not.toContain("0/100");
    const withScore = productVerdict(inputFor(p, { ingredientScore: 72 }));
    expect(withScore.buyIf).toContain("72/100");
  });
});
