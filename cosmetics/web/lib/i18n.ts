export const LOCALES = ["th", "en", "ko", "ja", "ar"] as const;
export type Locale = (typeof LOCALES)[number];

// RTL locales
export const RTL_LOCALES: Locale[] = ["ar"];
export const isRTL = (loc: Locale) => RTL_LOCALES.includes(loc);

// Locale → OG locale code
export const OG_LOCALE: Record<Locale, string> = {
  th: "th_TH", en: "en_US", ko: "ko_KR", ja: "ja_JP", ar: "ar_SA",
};

const STRINGS: Record<string, Record<Locale, string>> = {
  site_name:    { th: "BangkokFillers", en: "BangkokFillers", ko: "BangkokFillers", ja: "BangkokFillers", ar: "BangkokFillers" },
  tagline:      {
    th: "เชื่อข้อมูล ไม่ใช่อินฟลูเอนเซอร์",
    en: "Trust data, not influencers",
    ko: "데이터를 믿으세요 — 방콕 여행 화장품 완벽 가이드",
    ja: "データで選ぶ — バンコク旅行コスメおすすめガイド",
    ar: "أفضل مستحضرات تجميل تايلاند للسياح — بيانات، لا مؤثرين",
  },
  buy_now:      { th: "ดูราคาล่าสุด", en: "Buy now — check latest price", ko: "최저가 확인", ja: "最新価格を確認", ar: "تحقق من أحدث سعر" },
  rank:         { th: "อันดับ", en: "Rank", ko: "순위", ja: "ランク", ar: "ترتيب" },
  product:      { th: "ผลิตภัณฑ์", en: "Product", ko: "제품", ja: "製品", ar: "منتج" },
  score:        { th: "คะแนน", en: "Score", ko: "점수", ja: "スコア", ar: "نقاط" },
  key_ingredient: { th: "ส่วนผสมเด่น", en: "Key ingredient", ko: "핵심 성분", ja: "主要成分", ar: "مكون رئيسي" },
  price:        { th: "ราคา", en: "Price", ko: "가격", ja: "価格", ar: "السعر" },
  rating:       { th: "เรตติ้ง", en: "Rating", ko: "평점", ja: "評価", ar: "تقييم" },
  reviews:      { th: "รีวิว", en: "reviews", ko: "리뷰", ja: "レビュー", ar: "مراجعات" },
  methodology:  { th: "วิธีให้คะแนน", en: "Methodology", ko: "평가 방법", ja: "評価方法", ar: "منهجية التقييم" },
  ingredients:  { th: "ส่วนผสม", en: "Ingredients", ko: "성분", ja: "成分", ar: "المكونات" },
  updated:      { th: "อัปเดต", en: "Updated", ko: "업데이트", ja: "更新", ar: "آخر تحديث" },
  based_on:     { th: "อ้างอิงจากรีวิว", en: "Based on reviews", ko: "리뷰 기반", ja: "レビュー基準", ar: "استناداً للمراجعات" },
  contains:     { th: "ผลิตภัณฑ์ที่มีส่วนผสมนี้", en: "Products with this ingredient", ko: "이 성분이 포함된 제품", ja: "この成分を含む製品", ar: "منتجات تحتوي على هذا المكون" },
  pantip_says:  { th: "ชาวพันทิปว่า", en: "What Pantip says", ko: "Pantip 반응", ja: "Pantipの評価", ar: "ما يقوله Pantip" },
  sources_line: { th: "รีวิวจาก", en: "Reviews from", ko: "리뷰 출처", ja: "レビュー元", ar: "مراجعات من" },
  mentions:     { th: "การพูดถึง", en: "mentions", ko: "언급", ja: "言及", ar: "إشارات" },
  our_picks:    { th: "พิคของเรา", en: "Our picks", ko: "에디터 추천", ja: "編集部おすすめ", ar: "اختياراتنا" },
  bestsellers:  { th: "ขายดีที่สุด", en: "Bestsellers", ko: "베스트셀러", ja: "ベストセラー", ar: "الأكثر مبيعاً" },
  most_loved:   { th: "ที่คนรักมากที่สุด", en: "Most loved", ko: "가장 사랑받는", ja: "最も人気", ar: "الأكثر شعبية" },
  trending:     { th: "กำลังมาแรง", en: "Trending now", ko: "지금 인기", ja: "今トレンド", ar: "الأكثر رواجاً الآن" },
  popular_with: { th: "ผิวเป็นสิวนิยมใช้", en: "Popular with shoppers", ko: "구매자들에게 인기", ja: "購入者に人気", ar: "شائع لدى المتسوقين" },
  sold:         { th: "ขายแล้ว", en: "sold", ko: "판매됨", ja: "販売済み", ar: "مباع" },
  reviews_short: { th: "รีวิว", en: "reviews", ko: "리뷰", ja: "レビュー", ar: "مراجعة" },
};

const CONCERN_LABELS: Record<string, Record<Locale, string>> = {
  acne:       { th: "สิว", en: "Acne", ko: "여드름", ja: "ニキビ", ar: "حب الشباب" },
  whitening:  { th: "ฝ้า กระ จุดด่างดำ ผิวกระจ่างใส", en: "Brightening & dark spots", ko: "미백·기미·잡티", ja: "美白・くすみ・シミ", ar: "تفتيح البشرة وتقليل البقع الداكنة" },
  antiaging:  { th: "ลดเลือนริ้วรอย", en: "Anti-aging & wrinkles", ko: "안티에이징·주름", ja: "エイジングケア・しわ", ar: "مكافحة الشيخوخة والتجاعيد" },
  pores:      { th: "กระชับรูขุมขน", en: "Pores & texture", ko: "모공·피부결", ja: "毛穴・肌質", ar: "تضيق المسام" },
  oilcontrol: { th: "ควบคุมความมัน", en: "Oil control", ko: "유분 조절", ja: "皮脂コントロール", ar: "التحكم في الدهون" },
  sensitive:  { th: "ผิวแพ้ง่าย บอบบาง", en: "Sensitive & barrier", ko: "민감성·장벽 강화", ja: "敏感肌・バリア", ar: "البشرة الحساسة وتعزيز الحاجز" },
};
const CONCERN_LABELS_SHORT: Record<string, Record<Locale, string>> = {
  acne:       { th: "สิว",       en: "Acne",        ko: "여드름",    ja: "ニキビ",    ar: "حب الشباب" },
  whitening:  { th: "ฝ้า กระ",  en: "Brightening", ko: "미백",      ja: "美白",      ar: "تفتيح" },
  antiaging:  { th: "ริ้วรอย",   en: "Anti-aging",  ko: "안티에이징", ja: "エイジング", ar: "مكافحة الشيخوخة" },
  pores:      { th: "รูขุมขน",   en: "Pores",       ko: "모공",      ja: "毛穴",      ar: "المسام" },
  oilcontrol: { th: "คุมมัน",    en: "Oil control", ko: "유분조절",   ja: "皮脂",      ar: "الدهون" },
  sensitive:  { th: "ผิวแพ้ง่าย", en: "Sensitive",  ko: "민감성",    ja: "敏感肌",    ar: "حساسة" },
};
// Maps extended locales to the base locale for components that only support th/en
export const toBaseLocale = (loc: Locale): "th" | "en" => (loc === "th" ? "th" : "en");

export const t = (loc: Locale, key: string) => STRINGS[key]?.[loc] ?? STRINGS[key]?.["en"] ?? key;
export const concernLabel = (loc: Locale, c: string) => CONCERN_LABELS[c]?.[loc] ?? CONCERN_LABELS[c]?.["en"] ?? c;
export const concernLabelShort = (loc: Locale, c: string) => CONCERN_LABELS_SHORT[c]?.[loc] ?? CONCERN_LABELS_SHORT[c]?.["en"] ?? c;
