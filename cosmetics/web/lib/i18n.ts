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
  // Pantip multi-source
  pantip_says: { th: "ชาวพันทิปว่า", en: "What Pantip says" },
  sources_line: { th: "รีวิวจาก", en: "Reviews from" },
  mentions: { th: "การพูดถึง", en: "mentions" },
  // Discovery strips
  our_picks: { th: "พิคของเรา", en: "Our picks" },
  bestsellers: { th: "ขายดีที่สุด", en: "Bestsellers" },
  most_loved: { th: "ที่คนรักมากที่สุด", en: "Most loved" },
  trending: { th: "กำลังมาแรง", en: "Trending now" },
  popular_with: { th: "ผิวเป็นสิวนิยมใช้", en: "Popular with shoppers" },
  sold: { th: "ขายแล้ว", en: "sold" },
  reviews_short: { th: "รีวิว", en: "reviews" },
};
const CONCERN_LABELS: Record<string, Record<Locale, string>> = {
  acne:       { th: "สิว", en: "Acne" },
  whitening:  { th: "ฝ้า กระ จุดด่างดำ ผิวกระจ่างใส", en: "Brightening & dark spots" },
  antiaging:  { th: "ลดเลือนริ้วรอย", en: "Anti-aging & wrinkles" },
  pores:      { th: "กระชับรูขุมขน", en: "Pores & texture" },
  oilcontrol: { th: "ควบคุมความมัน", en: "Oil control" },
  sensitive:  { th: "ผิวแพ้ง่าย บอบบาง", en: "Sensitive & barrier" },
};
const CONCERN_LABELS_SHORT: Record<string, Record<Locale, string>> = {
  acne:       { th: "สิว",       en: "Acne" },
  whitening:  { th: "ฝ้า กระ",  en: "Brightening" },
  antiaging:  { th: "ริ้วรอย",   en: "Anti-aging" },
  pores:      { th: "รูขุมขน",   en: "Pores" },
  oilcontrol: { th: "คุมมัน",    en: "Oil control" },
  sensitive:  { th: "ผิวแพ้ง่าย", en: "Sensitive" },
};
export const t = (loc: Locale, key: string) => STRINGS[key]?.[loc] ?? key;
export const concernLabel = (loc: Locale, c: string) => CONCERN_LABELS[c]?.[loc] ?? c;
export const concernLabelShort = (loc: Locale, c: string) => CONCERN_LABELS_SHORT[c]?.[loc] ?? CONCERN_LABELS[c]?.[loc] ?? c;
