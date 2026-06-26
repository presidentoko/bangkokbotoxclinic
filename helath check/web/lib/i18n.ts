export const LOCALES = ["en", "zh", "ar", "ja", "th"] as const;
export type Locale = (typeof LOCALES)[number];

export const RTL_LOCALES: Locale[] = ["ar"];
export const isRTL = (loc: Locale) => RTL_LOCALES.includes(loc);

export const OG_LOCALE: Record<Locale, string> = {
  en: "en_US", zh: "zh_CN", ar: "ar_SA", ja: "ja_JP", th: "th_TH",
};

const STRINGS: Record<string, Record<Locale, string>> = {
  site_name: {
    en: "BangkokCheckup", zh: "曼谷体检", ar: "فحص بانكوك", ja: "バンコク健診", th: "ตรวจสุขภาพบางกอก",
  },
  tagline: {
    en: "Real prices. No ads. Bangkok health check-up comparison.",
    zh: "透明价格，无广告。曼谷体检套餐对比。",
    ar: "أسعار حقيقية. بدون إعلانات. مقارنة الفحوصات الصحية في بانكوك.",
    ja: "実際の価格。広告なし。バンコク健康診断比較。",
    th: "ราคาจริง ไม่มีโฆษณา เปรียบเทียบแพ็กเกจตรวจสุขภาพกรุงเทพ",
  },
  compare_cta: {
    en: "Compare all packages", zh: "比较所有套餐", ar: "قارن جميع الباقات", ja: "全パッケージを比較", th: "เปรียบเทียบทุกแพ็กเกจ",
  },
  book_now: {
    en: "Book / Enquire", zh: "预约咨询", ar: "احجز / استفسر", ja: "予約・お問合せ", th: "จองหรือสอบถาม",
  },
  // nav
  nav_home:      { en: "Home",      zh: "首页",   ar: "الرئيسية", ja: "ホーム",    th: "หน้าหลัก" },
  nav_compare:   { en: "Compare",   zh: "比较",   ar: "مقارنة",   ja: "比較",      th: "เปรียบเทียบ" },
  nav_hospitals: { en: "Hospitals", zh: "医院",   ar: "مستشفيات", ja: "病院",      th: "โรงพยาบาล" },
  nav_guide:     { en: "Guide",     zh: "指南",   ar: "دليل",     ja: "ガイド",    th: "คู่มือ" },
  nav_enquiry:   { en: "Enquiry",   zh: "咨询",   ar: "استفسار",  ja: "お問合せ",  th: "สอบถาม" },
  // categories
  cat_comprehensive: { en: "Comprehensive", zh: "全面体检", ar: "شامل",      ja: "総合健診",  th: "ครบวงจร" },
  cat_executive:     { en: "Executive",     zh: "高管体检", ar: "تنفيذي",    ja: "エグゼクティブ", th: "เอ็กเซกคิวทีฟ" },
  cat_cancer:        { en: "Cancer Screen", zh: "癌症筛查", ar: "فحص السرطان", ja: "がん検診", th: "ตรวจมะเร็ง" },
  cat_cardiac:       { en: "Cardiac",       zh: "心脏筛查", ar: "صحة القلب",  ja: "心臓検査",  th: "หัวใจ" },
  cat_women:         { en: "Women",         zh: "女性体检", ar: "صحة المرأة",  ja: "女性健診",  th: "สุขภาพสตรี" },
  cat_men:           { en: "Men",           zh: "男性体检", ar: "صحة الرجل",   ja: "男性健診",  th: "สุขภาพชาย" },
  cat_basic:         { en: "Basic",         zh: "基础体检", ar: "أساسي",      ja: "基本健診",  th: "พื้นฐาน" },
  cat_age:           { en: "Age-based",     zh: "年龄体检", ar: "حسب العمر",  ja: "年齢別",    th: "ตามอายุ" },
  // table headers
  th_hospital:   { en: "Hospital",      zh: "医院",    ar: "مستشفى",    ja: "病院",     th: "โรงพยาบาล" },
  th_area:       { en: "Area",          zh: "地区",    ar: "المنطقة",   ja: "エリア",   th: "พื้นที่" },
  th_package:    { en: "Package",       zh: "套餐",    ar: "باقة",      ja: "パッケージ", th: "แพ็กเกจ" },
  th_price:      { en: "Price (THB)",   zh: "价格(铢)", ar: "السعر (بات)", ja: "価格(バーツ)", th: "ราคา (บาท)" },
  th_blood:      { en: "Blood",         zh: "血液",    ar: "دم",        ja: "血液",     th: "เลือด" },
  th_xray:       { en: "X-Ray",         zh: "X光",     ar: "أشعة",      ja: "X線",      th: "เอกซเรย์" },
  th_ultrasound: { en: "Ultrasound",    zh: "超声波",  ar: "موجات فوق صوتية", ja: "超音波", th: "อัลตราซาวด์" },
  th_ct:         { en: "CT Scan",       zh: "CT扫描",  ar: "أشعة مقطعية",  ja: "CT",      th: "CT" },
  th_mri:        { en: "MRI",           zh: "核磁共振", ar: "رنين مغناطيسي", ja: "MRI",    th: "MRI" },
  th_cancer:     { en: "Cancer Markers", zh: "肿瘤标志物", ar: "علامات السرطان", ja: "腫瘍マーカー", th: "สารบ่งชี้มะเร็ง" },
  th_consult:    { en: "Doctor",        zh: "医生",    ar: "طبيب",      ja: "医師相談",  th: "แพทย์" },
  th_interp:     { en: "Interpreter",   zh: "翻译",    ar: "مترجم",     ja: "通訳",     th: "ล่าม" },
  th_days:       { en: "Results",       zh: "出结果天数", ar: "أيام النتائج", ja: "結果日数", th: "วันรับผล" },
  th_book:       { en: "Book",          zh: "预约",    ar: "احجز",      ja: "予約",     th: "จอง" },
  // flags
  jci_yes: { en: "JCI Accredited", zh: "JCI认证", ar: "معتمد JCI", ja: "JCI認定", th: "JCI รับรอง" },
  // misc
  price_from:    { en: "from ฿", zh: "起价 ฿", ar: "ابتداءً من ฿", ja: "฿から",  th: "ตั้งแต่ ฿" },
  no_data:       { en: "No data", zh: "暂无数据", ar: "لا توجد بيانات", ja: "データなし", th: "ไม่มีข้อมูล" },
  all_categories:{ en: "All categories", zh: "全部", ar: "الكل", ja: "全て", th: "ทั้งหมด" },
  enquiry_desc:  {
    en: "Send us your requirements and we'll connect you with the best hospital for your needs.",
    zh: "告诉我们您的需求，我们将为您匹配最佳医院。",
    ar: "أرسل لنا متطلباتك وسنوصلك بأفضل مستشفى لاحتياجاتك.",
    ja: "ご要望をお知らせください。最適な病院をご紹介します。",
    th: "แจ้งความต้องการของคุณ เราจะแนะนำโรงพยาบาลที่ดีที่สุดสำหรับคุณ",
  },
};

export const t = (loc: Locale, key: string): string =>
  STRINGS[key]?.[loc] ?? STRINGS[key]?.["en"] ?? key;

export const catLabel = (loc: Locale, cat: string): string =>
  t(loc, `cat_${cat}`) === `cat_${cat}` ? cat : t(loc, `cat_${cat}`);

export const CATEGORIES = [
  "comprehensive", "executive", "cancer", "cardiac", "women", "men", "basic", "age",
] as const;
export type Category = (typeof CATEGORIES)[number];
