import brandThMap from "@/data/brand_th.json";

/**
 * Thai-script aliases for product and brand names.
 *
 * Why this exists: 987 of 1,003 products in master_db have a Latin-only
 * `name` ("Naturie Hatomugi Skin Conditioning Gel 180g"), but a Thai shopper
 * who just saw the product in an influencer clip searches in Thai script
 * ("นาทูรี่ ดีไหม"). With no Thai spelling anywhere in the title, H1 or body,
 * those queries could not match — the same gap that `alt_th_names` closed on
 * the ingredient pages, one level up at the product level.
 *
 * The brand table is mined from the Thai `description` copy already in
 * master_db (see scripts/build_brand_th.py), so the spellings are the ones
 * Thai writers actually use rather than transliterations invented here.
 * Brands the miner could not resolve are simply absent — every consumer of
 * this module treats a missing alias as "render nothing extra".
 */

const BRAND_TH: Record<string, string> = brandThMap;

export function brandThai(brand: string): string | undefined {
  return BRAND_TH[brand?.trim()];
}

/**
 * Thai word for the product form, matched against the Latin product name.
 * Ordered most-specific-first: "cleansing water" must win over both
 * "cleanser" and "water", and "sunscreen" over "cream".
 */
const TYPE_TH: { key: string; re: RegExp; th: string; en: string }[] = [
  { key: "cleansing-water", re: /cleansing\s*water|micellar/i, th: "คลีนซิ่งวอเตอร์", en: "cleansing water" },
  { key: "cleansing-oil", re: /cleansing\s*oil/i, th: "คลีนซิ่งออยล์", en: "cleansing oil" },
  { key: "cleansing-balm", re: /cleansing\s*balm/i, th: "คลีนซิ่งบาล์ม", en: "cleansing balm" },
  { key: "sunscreen", re: /sunscreen|sun\s*screen|sun\s*milk|uv\s|spf/i, th: "ครีมกันแดด", en: "sunscreen" },
  { key: "serum", re: /serum|ampoule/i, th: "เซรั่ม", en: "serum" },
  { key: "essence", re: /essence/i, th: "เอสเซนส์", en: "essence" },
  { key: "toner", re: /toner/i, th: "โทนเนอร์", en: "toner" },
  { key: "moisturizer", re: /moisturi[sz]er/i, th: "มอยส์เจอไรเซอร์", en: "moisturizer" },
  { key: "emulsion", re: /emulsion/i, th: "อิมัลชั่น", en: "emulsion" },
  { key: "mask", re: /sheet\s*mask|mask/i, th: "มาส์ก", en: "mask" },
  { key: "foundation", re: /foundation/i, th: "รองพื้น", en: "foundation" },
  { key: "concealer", re: /concealer/i, th: "คอนซีลเลอร์", en: "concealer" },
  { key: "cushion", re: /cushion/i, th: "คุชชั่น", en: "cushion" },
  { key: "lipstick", re: /lipstick|lip\s/i, th: "ลิปสติก", en: "lipstick" },
  { key: "cleanser", re: /foam|face\s*wash|cleanser|facial\s*wash/i, th: "โฟมล้างหน้า", en: "cleanser" },
  { key: "soap", re: /soap|bar\b/i, th: "สบู่", en: "soap" },
  { key: "scrub", re: /scrub/i, th: "สครับ", en: "scrub" },
  { key: "peeling", re: /peeling/i, th: "พีลลิ่ง", en: "peeling" },
  { key: "booster", re: /booster/i, th: "บูสเตอร์", en: "booster" },
  { key: "treatment", re: /treatment/i, th: "ทรีตเมนต์", en: "treatment" },
  { key: "supplement", re: /tablet|capsule|supplement/i, th: "อาหารเสริม", en: "supplement" },
  { key: "spray", re: /spray/i, th: "สเปรย์", en: "spray" },
  { key: "powder", re: /powder/i, th: "แป้ง", en: "powder" },
  { key: "lotion", re: /lotion/i, th: "โลชั่น", en: "lotion" },
  { key: "balm", re: /balm/i, th: "บาล์ม", en: "balm" },
  { key: "oil", re: /\boil\b/i, th: "ออยล์", en: "oil" },
  { key: "gel", re: /\bgel\b/i, th: "เจล", en: "gel" },
  { key: "cream", re: /\bcream\b/i, th: "ครีม", en: "cream" },
  { key: "pad", re: /\bpads?\b/i, th: "แผ่นเช็ดผิว", en: "toner pad" },
];

function matchType(name: string) {
  // "patch" is form-ambiguous — an acne patch and a hydrocolloid dressing read
  // very differently in Thai — so it is resolved from context, not the table.
  if (/patch/i.test(name)) {
    return /acne|pimple|spot|blemish/i.test(name)
      ? { key: "acne-patch", th: "แผ่นแปะสิว", en: "acne patch" }
      : { key: "patch", th: "แผ่นแปะ", en: "patch" };
  }
  return TYPE_TH.find((t) => t.re.test(name));
}

export function productTypeThai(name: string): string | undefined {
  return matchType(name)?.th;
}

export function productTypeEnglish(name: string): string | undefined {
  return matchType(name)?.en;
}

/**
 * Stable key for the product's form, used to build a like-for-like peer group
 * when comparing price per ml. Comparing a serum against the whole catalogue's
 * median ฿/ml is what once put a body lotion at the top of a ranking it had no
 * business being in — peer groups must be per form, never global.
 */
export function productTypeKey(name: string): string | undefined {
  return matchType(name)?.key;
}

/**
 * The Thai string a shopper would plausibly type for this product, e.g.
 * "นาทูรี่ เจล". Returns undefined when the brand has no mined spelling —
 * a bare product-type word ("เจล") is not a searchable alias and would only
 * add noise to the title.
 */
export function thaiAlias(p: { name: string; brand: string }): string | undefined {
  const b = brandThai(p.brand);
  if (!b) return undefined;
  const type = productTypeThai(p.name);
  return type ? `${b} ${type}` : b;
}
