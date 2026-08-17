export const LOCALES = ["th", "en", "ko", "ar"] as const;
export type Locale = (typeof LOCALES)[number];

// 2026-07-26 ISR/bandwidth quota fix — ko/ar have only ~40 UI strings
// translated (content falls back to English) and are noindexed already.
// Only th/en get statically generated + crawled; ko/ar redirect to en
// at the next.config.ts routing layer before ever reaching a page.
export const STATIC_LOCALES = ["th", "en"] as const satisfies readonly Locale[];

// hreflang must only ever point at locales that actually render (STATIC_LOCALES) —
// ko/ar redirect at the routing layer before reaching a page, so listing them as
// alternates makes every hreflang cluster on the site invalid. x-default points at
// th, the site's primary indexed locale.
export function localeAlternates(pathForLocale: (locale: Locale) => string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const l of STATIC_LOCALES) out[l] = pathForLocale(l);
  out["x-default"] = pathForLocale("th");
  return out;
}

/**
 * hreflang for routes that only exist in Thai.
 *
 * Product pages are Thai-only: the /en versions were noindex for every product
 * and now 308 onto the Thai URL (see middleware.ts). Listing an "en" alternate
 * that redirects would make the whole hreflang cluster invalid — an alternate
 * has to be a self-canonical page that points back, and a redirect target
 * cannot.
 */
export function thaiOnlyAlternates(path: string): Record<string, string> {
  return { th: path, "x-default": path };
}

// Next.js merges metadata SHALLOWLY: a route whose generateMetadata returns its
// own `openGraph` object replaces the parent's wholesale — including the image
// injected by the file-convention app/[locale]/opengraph-image.tsx. Every route
// that sets openGraph but has no opengraph-image.tsx of its own therefore shipped
// `twitter:card=summary_large_image` with no image at all (brand, dupe, ingredient,
// budget and sale pages — ~1,200 URLs). Routes with a real per-page OG image keep
// using it; the rest fall back to the locale-level one via this helper.
export function localeOgImage(locale: Locale): {
  url: string;
  width: number;
  height: number;
  alt: string;
} {
  return {
    url: `https://bangkokfillers.com/${locale}/opengraph-image`,
    width: 1200,
    height: 630,
    alt: "BangkokFillers — Ranked by ingredients + real reviews",
  };
}

// RTL locales
export const RTL_LOCALES: Locale[] = ["ar"];
export const isRTL = (loc: Locale) => RTL_LOCALES.includes(loc);

// Locale → OG locale code
export const OG_LOCALE: Record<Locale, string> = {
  th: "th_TH", en: "en_US", ko: "ko_KR", ar: "ar_SA",
};

const STRINGS: Record<string, Record<Locale, string>> = {
  site_name:    { th: "BangkokFillers", en: "BangkokFillers", ko: "BangkokFillers", ar: "BangkokFillers" },
  tagline:      {
    th: "เชื่อข้อมูล ไม่ใช่อินฟลูเอนเซอร์",
    en: "Trust data, not influencers",
    ko: "데이터를 믿으세요 — 방콕 여행 화장품 완벽 가이드",
    ar: "أفضل مستحضرات تجميل تايلاند للسياح — بيانات، لا مؤثرين",
  },
  buy_now:      { th: "ดูราคาล่าสุด", en: "Buy now — check latest price", ko: "최저가 확인", ar: "تحقق من أحدث سعر" },
  rank:         { th: "อันดับ", en: "Rank", ko: "순위", ar: "ترتيب" },
  product:      { th: "ผลิตภัณฑ์", en: "Product", ko: "제품", ar: "منتج" },
  score:        { th: "คะแนน", en: "Score", ko: "점수", ar: "نقاط" },
  key_ingredient: { th: "ส่วนผสมเด่น", en: "Key ingredient", ko: "핵심 성분", ar: "مكون رئيسي" },
  price:        { th: "ราคา", en: "Price", ko: "가격", ar: "السعر" },
  rating:       { th: "เรตติ้ง", en: "Rating", ko: "평점", ar: "تقييم" },
  reviews:      { th: "รีวิว", en: "reviews", ko: "리뷰", ar: "مراجعات" },
  methodology:  { th: "วิธีให้คะแนน", en: "Methodology", ko: "평가 방법", ar: "منهجية التقييم" },
  ingredients:  { th: "ส่วนผสม", en: "Ingredients", ko: "성분", ar: "المكونات" },
  updated:      { th: "อัปเดต", en: "Updated", ko: "업데이트", ar: "آخر تحديث" },
  based_on:     { th: "อ้างอิงจากรีวิว", en: "Based on reviews", ko: "리뷰 기반", ar: "استناداً للمراجعات" },
  contains:     { th: "ผลิตภัณฑ์ที่มีส่วนผสมนี้", en: "Products with this ingredient", ko: "이 성분이 포함된 제품", ar: "منتجات تحتوي على هذا المكون" },
  pantip_says:  { th: "ชาวพันทิปว่า", en: "What Pantip says", ko: "Pantip 반응", ar: "ما يقوله Pantip" },
  sources_line: { th: "รีวิวจาก", en: "Reviews from", ko: "리뷰 출처", ar: "مراجعات من" },
  mentions:     { th: "การพูดถึง", en: "mentions", ko: "언급", ar: "إشارات" },
  our_picks:    { th: "พิคของเรา", en: "Our picks", ko: "에디터 추천", ar: "اختياراتنا" },
  bestsellers:  { th: "ขายดีที่สุด", en: "Bestsellers", ko: "베스트셀러", ar: "الأكثر مبيعاً" },
  most_loved:   { th: "ที่คนรักมากที่สุด", en: "Most loved", ko: "가장 사랑받는", ar: "الأكثر شعبية" },
  trending:     { th: "กำลังมาแรง", en: "Trending now", ko: "지금 인기", ar: "الأكثر رواجاً الآن" },
  popular_with: { th: "ผิวเป็นสิวนิยมใช้", en: "Popular with shoppers", ko: "구매자들에게 인기", ar: "شائع لدى المتسوقين" },
  sold:         { th: "ขายแล้ว", en: "sold", ko: "판매됨", ar: "مباع" },
  reviews_short: { th: "รีวิว", en: "reviews", ko: "리뷰", ar: "مراجعة" },
};

const CONCERN_LABELS: Record<string, Record<Locale, string>> = {
  acne:       { th: "สิว", en: "Acne", ko: "여드름", ar: "حب الشباب" },
  whitening:  { th: "ฝ้า กระ จุดด่างดำ ผิวกระจ่างใส", en: "Brightening & dark spots", ko: "미백·기미·잡티", ar: "تفتيح البشرة وتقليل البقع الداكنة" },
  antiaging:  { th: "ลดเลือนริ้วรอย", en: "Anti-aging & wrinkles", ko: "안티에이징·주름", ar: "مكافحة الشيخوخة والتجاعيد" },
  pores:      { th: "กระชับรูขุมขน", en: "Pores & texture", ko: "모공·피부결", ar: "تضيق المسام" },
  oilcontrol: { th: "ควบคุมความมัน", en: "Oil control", ko: "유분 조절", ar: "التحكم في الدهون" },
  sensitive:  { th: "ผิวแพ้ง่าย บอบบาง", en: "Sensitive & barrier", ko: "민감성·장벽 강화", ar: "البشرة الحساسة وتعزيز الحاجز" },
};
export const SAFETY_FLAG_LABELS: Record<string, { th: string; en: string }> = {
  irritant:        { th: "อาจระคายเคือง — เริ่มจากความเข้มข้นต่ำ", en: "Can irritate — start at a low concentration" },
  photosensitizer: { th: "เพิ่มความไวต่อแสงแดด — ควรทากันแดดร่วมด้วย", en: "Increases sun sensitivity — pair with daily SPF" },
  comedogenic:     { th: "อาจอุดตันรูขุมขนในบางคน", en: "May be comedogenic for some skin types" },
  fragrance:       { th: "มีน้ำหอม — ผิวแพ้ง่ายควรระวัง", en: "Contains fragrance — caution for sensitive skin" },
  alcohol:         { th: "มีแอลกอฮอล์ — อาจทำให้ผิวแห้ง", en: "Contains alcohol — can be drying" },
};

const CONCERN_LABELS_SHORT: Record<string, Record<Locale, string>> = {
  acne:       { th: "สิว",       en: "Acne",        ko: "여드름",    ar: "حب الشباب" },
  whitening:  { th: "ฝ้า กระ",  en: "Brightening", ko: "미백",      ar: "تفتيح" },
  antiaging:  { th: "ริ้วรอย",   en: "Anti-aging",  ko: "안티에이징", ar: "مكافحة الشيخوخة" },
  pores:      { th: "รูขุมขน",   en: "Pores",       ko: "모공",      ar: "المسام" },
  oilcontrol: { th: "คุมมัน",    en: "Oil control", ko: "유분조절",   ar: "الدهون" },
  sensitive:  { th: "ผิวแพ้ง่าย", en: "Sensitive",  ko: "민감성",    ar: "حساسة" },
};
// Maps extended locales to the base locale for components that only support th/en
export const toBaseLocale = (loc: Locale): "th" | "en" => (loc === "th" ? "th" : "en");

export const t = (loc: Locale, key: string) => STRINGS[key]?.[loc] ?? STRINGS[key]?.["en"] ?? key;
export const concernLabel = (loc: Locale, c: string) => CONCERN_LABELS[c]?.[loc] ?? CONCERN_LABELS[c]?.["en"] ?? c;
export const concernLabelShort = (loc: Locale, c: string) => CONCERN_LABELS_SHORT[c]?.[loc] ?? CONCERN_LABELS_SHORT[c]?.["en"] ?? c;
