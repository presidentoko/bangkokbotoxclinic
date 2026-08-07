export const LOCALES = ["en", "zh", "ar", "ja", "th", "ko"] as const;
export type Locale = (typeof LOCALES)[number];

export const RTL_LOCALES: Locale[] = ["ar"];
export const isRTL = (loc: Locale) => RTL_LOCALES.includes(loc);

export const OG_LOCALE: Record<Locale, string> = {
  en: "en_US", zh: "zh_CN", ar: "ar_SA", ja: "ja_JP", th: "th_TH", ko: "ko_KR",
};

export const SITE_URL = "https://www.bangkoktopclinic.com";

/**
 * hreflang cluster for one page, for `metadata.alternates.languages`.
 *
 * Pass the path after the locale segment ("/faq", or "" for the home page), or
 * a function when the path itself is localised. Always includes `x-default`:
 * without it Google has no declared fallback for a searcher whose language
 * isn't one of the six, so it picks a variant itself — which is exactly the
 * "Duplicate, Google chose a different canonical than user" bucket in Search
 * Console. Every dynamic segment is percent-encoded here because hospital
 * slugs still carry raw Thai characters from the scraper.
 */
export function hreflangMap(path: string | ((loc: Locale) => string)): Record<string, string> {
  const at = (loc: Locale) => {
    const p = typeof path === "function" ? path(loc) : path;
    // Encode each segment individually so the "/" separators survive.
    const encoded = p.split("/").map(encodeURIComponent).join("/");
    return `${SITE_URL}/${loc}${encoded}`;
  };
  const map: Record<string, string> = {};
  for (const l of LOCALES) map[l] = at(l);
  map["x-default"] = at("en");
  return map;
}

const STRINGS: Record<string, Record<Locale, string>> = {
  site_name: {
    en: "BangkokCheckup", zh: "曼谷体检", ar: "فحص بانكوك", ja: "バンコク健診", th: "ตรวจสุขภาพบางกอก", ko: "방콕건강검진",
  },
  tagline: {
    en: "Real prices. No ads. Bangkok health check-up comparison.",
    zh: "透明价格，无广告。曼谷体检套餐对比。",
    ar: "أسعار حقيقية. بدون إعلانات. مقارنة الفحوصات الصحية في بانكوك.",
    ja: "実際の価格。広告なし。バンコク健康診断比較。",
    th: "ราคาจริง ไม่มีโฆษณา เปรียบเทียบแพ็กเกจตรวจสุขภาพกรุงเทพ",
    ko: "실제 가격. 광고 없음. 방콕 건강검진 패키지 비교.",
  },
  compare_cta: {
    en: "Compare all packages", zh: "比较所有套餐", ar: "قارن جميع الباقات", ja: "全パッケージを比較", th: "เปรียบเทียบทุกแพ็กเกจ", ko: "전체 패키지 비교",
  },
  book_now: {
    en: "Book / Enquire", zh: "预约和询", ar: "احجز / استفسر", ja: "予約・お問合せ", th: "จองหรือสอบถาม", ko: "예약 / 문의",
  },
  // nav
  nav_home:      { en: "Home",      zh: "首页",   ar: "الرئيسية", ja: "ホーム",    th: "หน้าหลัก",    ko: "홈" },
  nav_compare:   { en: "Compare",   zh: "比較",   ar: "مقارنة",   ja: "比較",      th: "เปรียบเทียบ",  ko: "비교" },
  nav_hospitals: { en: "Hospitals", zh: "医院",   ar: "مستشفيات", ja: "病院",      th: "โรงพยาบาล",   ko: "병원" },
  nav_guide:     { en: "Guide",     zh: "指南",   ar: "دليل",     ja: "ガイド",    th: "คู่มือ",       ko: "가이드" },
  nav_enquiry:   { en: "Enquiry",   zh: "和询",   ar: "استفسار",  ja: "お問合せ",  th: "สอบถาม",       ko: "문의" },
  // categories
  cat_comprehensive: { en: "Comprehensive", zh: "全面体检", ar: "شامل",         ja: "総合健診",       th: "ครบวงจร",         ko: "종합검진" },
  cat_executive:     { en: "Executive",     zh: "高管体检", ar: "تنفيذي",       ja: "エグゼクティブ", th: "เอ็กเซกคิวทีฟ",  ko: "프리미엄검진" },
  cat_cancer:        { en: "Cancer Screen", zh: "癌症筛查", ar: "فحص السرطان",  ja: "がん検診",       th: "ตรวจมะเร็ง",      ko: "검진" },
  cat_cardiac:       { en: "Cardiac",       zh: "心脏筛查", ar: "صحة القلب",    ja: "心臓検査",       th: "หัวใจ",           ko: "심장검사" },
  cat_women:         { en: "Women",         zh: "女性体检", ar: "صحة المرأة",   ja: "女性健診",       th: "สุขภาพสตรี",      ko: "여성건강" },
  cat_men:           { en: "Men",           zh: "男性体检", ar: "صحة الرجل",    ja: "男性健診",       th: "สุขภาพชาย",       ko: "남성건강" },
  cat_basic:         { en: "Basic",         zh: "基础体检", ar: "أساسي",        ja: "基本健診",       th: "พื้นฐาน",         ko: "기본검진" },
  cat_standard:      { en: "Standard",      zh: "标准体检", ar: "قياسي",        ja: "スタンダード",   th: "มาตรฐาน",         ko: "표준검진" },
  cat_senior:        { en: "Senior (60+)",  zh: "老年体检", ar: "كبار السن",    ja: "シニア健診",     th: "ผู้สูงอายุ",      ko: "시니어(60+)" },
  cat_age:           { en: "Age-based",     zh: "年龄体检", ar: "حسب العمر",    ja: "年齢別",         th: "ตามอายุ",         ko: "연령별" },
  cat_diabetes:      { en: "Diabetes",      zh: "糖尿病筛查", ar: "السكري",     ja: "糖尿病検査",     th: "เบาหวาน",         ko: "당놨검사" },
  cat_eye:           { en: "Eye Exam",      zh: "眼科检查",  ar: "فحص العيون", ja: "眼科検査",       th: "ตาและสายตา",      ko: "안과검사" },
  cat_liver:         { en: "Liver Health",  zh: "肝脏检查",  ar: "صحة الكبد",   ja: "肝臓検査",       th: "ตับ",             ko: "간기능검사" },
  cat_kidney:        { en: "Kidney Health", zh: "肆脏检查",  ar: "صحة الكلى",   ja: "腐臓検査",       th: "ไต",              ko: "신장검사" },
  cat_brain:         { en: "Brain MRI",     zh: "脑部磁共振", ar: "MRI الدماغ", ja: "脳MRI検査",      th: "MRI สมอง",        ko: "뇌 MRI" },
  cat_dental:        { en: "Dental Check",  zh: "口腔检查",  ar: "فحص الأسنان", ja: "歯科検診",       th: "ทันตกรรม",        ko: "치과검진" },
  cat_heart:         { en: "Heart Screen",  zh: "心脏检查",  ar: "صحة القلب",   ja: "心臓検査",       th: "หัวใจ",           ko: "심장검진" },
  // table headers
  th_hospital:   { en: "Hospital",       zh: "医院",      ar: "مستشفى",              ja: "病院",       th: "โรงพยาบาล",      ko: "병원" },
  th_area:       { en: "Area",           zh: "地区",      ar: "المنطقة",             ja: "エリア",     th: "พื้นที่",        ko: "지역" },
  th_package:    { en: "Package",        zh: "套餐",      ar: "باقة",                ja: "パッケージ", th: "แพ็กเกจ",        ko: "패키지" },
  th_price:      { en: "Price (THB)",    zh: "价格(钓)", ar: "السعر (بات)",         ja: "価格(バーツ)", th: "ราคา (บาท)",   ko: "가격(바트)" },
  th_blood:      { en: "Blood",          zh: "血液",      ar: "دم",                  ja: "血液",       th: "เลือด",          ko: "혈액" },
  th_xray:       { en: "X-Ray",          zh: "X光",       ar: "أشعة",                ja: "X線",        th: "เอกซเรย์",       ko: "엑스레이" },
  th_ultrasound: { en: "Ultrasound",     zh: "超声波",    ar: "موجات فوق صوتية",    ja: "超音波",     th: "อัลตราซาวด์",    ko: "초음파" },
  th_ct:         { en: "CT Scan",        zh: "CT扫描",    ar: "أشعة مقطعية",         ja: "CT",         th: "CT",             ko: "CT스캔" },
  th_mri:        { en: "MRI",            zh: "核磁共振",  ar: "رنين مغناطيسي",       ja: "MRI",        th: "MRI",            ko: "MRI" },
  th_cancer:     { en: "Cancer Markers", zh: "肿瘾标志物", ar: "علامات السرطان",     ja: "腫瑞マーカー", th: "สารบ่งชี้มะเร็ง", ko: "암표지자" },
  th_consult:    { en: "Doctor",         zh: "医生",      ar: "طبيب",                ja: "医師相談",   th: "แพทย์",          ko: "의사상담" },
  th_interp:     { en: "Interpreter",    zh: "翻译",      ar: "مترجم",               ja: "通訳",       th: "ล่าม",           ko: "통역" },
  th_days:       { en: "Results",        zh: "出结果天数", ar: "أيام النتائج",       ja: "結果日数",   th: "วันรับผล",       ko: "결과일수" },
  th_book:       { en: "Book",           zh: "预约",      ar: "احجز",                ja: "予約",       th: "จอง",            ko: "예약" },
  // flags
  jci_yes: { en: "JCI Accredited", zh: "JCI认证", ar: "معتمد JCI", ja: "JCI認定", th: "JCI รับรอง", ko: "JCI인증" },
  // misc
  price_from:    { en: "from ฿", zh: "起价 ฿", ar: "ابتداءً من ฿", ja: "฿から",  th: "ตั้งแต่ ฿",  ko: "฿부터" },
  no_data:       { en: "No data", zh: "暂无数据", ar: "لا توجد بيانات", ja: "データなし", th: "ไม่มีข้อมูล", ko: "데이터없음" },
  all_categories:{ en: "All categories", zh: "全部", ar: "الكل", ja: "全て", th: "ทั้งหมด", ko: "전체" },
  enquiry_desc:  {
    en: "Send us your requirements and we'll connect you with the best hospital for your needs.",
    zh: "告诉我们您的需求，我们将为您匹配最佳医院。",
    ar: "أرسل لنا متطلباتك وسنوصلك بأفضل مستشفى لاحتياجاتك.",
    ja: "ご要望をお知らせください。最適な病院をご紹介します。",
    th: "แจ้ความต้องการของคุณ เราจะแนะนำโรงพยาบาลที่ดีที่สุดสำหรับคุณ",
    ko: "요구사항을 알려주시면 최적의 병원을 연결해 드립니다.",
  },
};

export const t = (loc: Locale, key: string): string =>
  STRINGS[key]?.[loc] ?? STRINGS[key]?.["en"] ?? key;

export const catLabel = (loc: Locale, cat: string): string =>
  t(loc, `cat_${cat}`) === `cat_${cat}` ? cat : t(loc, `cat_${cat}`);

// "age" is deliberately absent even though cat_age is translated in all six
// locales: it is a staging value the importers write, which fix_all_data.py
// then redistributes into the real categories. It is always 0 after a full
// pipeline run.
export const CATEGORIES = [
  "comprehensive", "executive", "standard", "cancer", "cardiac", "heart",
  "women", "men", "senior", "basic", "diabetes", "eye", "liver", "kidney", "brain", "dental",
] as const;
export type Category = (typeof CATEGORIES)[number];
