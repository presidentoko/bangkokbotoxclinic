import { describe, it, expect } from "vitest";
import { thaiNameWithVariant } from "../ingredient-name";
import ingredientDb from "../../data/ingredient_db.json";

const slash = (a: string, b: string) => `${a} / ${b}`;
const paren = (a: string, b: string) => `${a} (${b})`;

describe("thaiNameWithVariant", () => {
  const niacinamide = { th_name: "ไนอาซินาไมด์", alt_th_names: ["ไนอะซินาไมด์"] };

  it("puts the variant spelling beside the primary one in Thai", () => {
    expect(thaiNameWithVariant(niacinamide, true, slash)).toBe("ไนอาซินาไมด์ / ไนอะซินาไมด์");
    expect(thaiNameWithVariant(niacinamide, true, paren)).toBe("ไนอาซินาไมด์ (ไนอะซินาไมด์)");
  });

  it("uses only the first variant, however many are recorded", () => {
    const many = { th_name: "กรดซาลิไซลิก", alt_th_names: ["ซาลิไซลิค แอซิด", "บีเอชเอ"] };
    expect(thaiNameWithVariant(many, true, slash)).toBe("กรดซาลิไซลิก / ซาลิไซลิค แอซิด");
  });

  it("returns null when no variant is recorded, so callers cannot mistake it for a name", () => {
    // Returning the bare name here made `titleName ? withVariant : withTail`
    // take the variant branch on all 50 variant-less ingredients, dropping the
    // "— ส่วนผสมสกินแคร์" tail from their titles.
    expect(thaiNameWithVariant({ th_name: "กลีเซอรีน" }, true, slash)).toBeNull();
  });

  it("stays out of the English pages — the split is a Thai-script problem", () => {
    expect(thaiNameWithVariant(niacinamide, false, slash)).toBeNull();
  });

  it("keeps every generated Thai title short enough to survive the site-name suffix", () => {
    // The [locale] layout appends " | BangkokFillers"; a title Google truncates
    // loses the very variant this change is adding.
    const entries = Object.values(ingredientDb as Record<string, { th_name: string; alt_th_names?: string[] }>);
    const withVariant = entries.filter((e) => e.alt_th_names?.length);
    expect(withVariant.length).toBeGreaterThan(0);
    for (const e of withVariant) {
      const title = `${thaiNameWithVariant(e, true, slash)!} คืออะไร | BangkokFillers`;
      expect(title.length).toBeLessThanOrEqual(70);
    }
  });
});
