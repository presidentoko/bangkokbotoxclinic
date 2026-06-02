export const LOCALES = ["th", "en"] as const;
export type Locale = (typeof LOCALES)[number];

const STRINGS: Record<string, Record<Locale, string>> = {
  site_name: { th: "BangkokFillers", en: "BangkokFillers" },
  tagline: { th: "เชื่อข้อมูล ไม่ใช่อินฟลูเอนเซอร์", en: "Trust data, not influencers" },
  buy_now: { th: "ดูราคาล่าสุด", en: "Buy now — check latest price" },
  rank: { th: "อันดับ", en: "Rank" }, product: { th: "ผลิตภัณฑ์", en: "Product" },
  score: { th: "คะแนน", en: "Score" }, key_ingredient: { th: "ส่วนผสมเด่น", en: "Key ingredient" },
  price: { th: "ราคา", en: "Price" }, rating: { th: "เรตติ้ง", en: "Rating" },
  reviews: { th: "รีวิว", en: "reviews" }, methodology: { th: "วิธีให้คะแนน", en: "Methodology" },
  ingredients: { th: "ส่วนผสม", en: "Ingredients" }, updated: { th: "อัปเดต", en: "Updated" },
  based_on: { th: "อ้างอิงจากรีวิว", en: "Based on reviews" },
  contains: { th: "ผลิตภัณฑ์ที่มีส่วนผสมนี้", en: "Products with this ingredient" },
};
const CONCERN_LABELS: Record<string, Record<Locale, string>> = {
  acne: { th: "สิว", en: "Acne" },
  whitening: { th: "ฝ้า กระ จุดด่างดำ ผิวกระจ่างใส", en: "Brightening & dark spots" },
};
export const t = (loc: Locale, key: string) => STRINGS[key]?.[loc] ?? key;
export const concernLabel = (loc: Locale, c: string) => CONCERN_LABELS[c]?.[loc] ?? c;
