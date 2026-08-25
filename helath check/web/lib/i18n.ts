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
  const at = (loc: Locale) => `${SITE_URL}/${loc}${localePath(path, loc)}`;
  const map: Record<string, string> = {};
  for (const l of LOCALES) map[l] = at(l);
  map["x-default"] = at("en");
  return map;
}

function localePath(path: string | ((loc: Locale) => string), loc: Locale): string {
  const p = typeof path === "function" ? path(loc) : path;
  // Encode each segment individually so the "/" separators survive. Hospital
  // slugs are plain ASCII since the 2026-08 re-slug, but a scraper run can
  // reintroduce a stray character and a malformed <loc> is dropped silently.
  return p.split("/").map(encodeURIComponent).join("/");
}

/**
 * The `alternates` block for a page, given whether its body is actually
 * translated.
 *
 * Six locale copies of an English body is not internationalisation, it is six
 * duplicates. The site ships translations for the home page, the FAQ and the
 * comparison tables; every other route renders the same English prose under
 * `lang="ja"`, `lang="ar"` and the rest. Declaring an hreflang cluster over
 * those told Google six distinct pages existed, and 2,740 of them sat in
 * "Discovered — currently not indexed" while consuming the crawl budget that
 * the English originals needed.
 *
 * `translated: false` points every locale's canonical at the English URL, so
 * the copies consolidate into one indexable page instead of competing. They
 * stay reachable and crawlable — the language switcher still works — they just
 * stop asking to be indexed separately. No `noindex` here on purpose: a
 * canonical to another URL and a noindex on the same page are contradictory
 * instructions, and Google resolves that conflict by ignoring the canonical.
 *
 * When a route is genuinely translated, flip it back to `translated: true`.
 */
export function localeAlternates(
  locale: string,
  path: string | ((loc: Locale) => string),
  opts: { translated?: boolean } = {},
) {
  // Default from the route table rather than to `false`. Whether a path is
  // translated was being decided twice — here, per call site, and again in
  // app/sitemap.ts via isTranslatedPath — and the two had already drifted:
  // /compare/* was clustered in the sitemap while its pages still emitted a
  // bare /en canonical. Callers can still force either answer, but silence now
  // means "ask the one table".
  const translated = opts.translated ?? isTranslatedPath(localePath(path, "en"));
  if (!translated) {
    return { canonical: `${SITE_URL}/en${localePath(path, "en")}` };
  }
  return {
    canonical: `${SITE_URL}/${locale}${localePath(path, locale as Locale)}`,
    languages: hreflangMap(path),
  };
}

/**
 * Routes whose body is translated, and so earn a locale URL of their own.
 * `app/sitemap.ts` reads this to decide how many locales to submit; keep the
 * two in step.
 */
export const TRANSLATED_PATHS = new Set([
  "",
  "/faq",
  "/compare",
  "/for/japanese-health-checkup-bangkok",
  "/for/korean-health-checkup-bangkok",
  "/for/chinese-health-checkup-bangkok",
  "/for/arabic-health-checkup-bangkok",
  "/guide/best-hospitals-japanese-tourists",
  "/guide/best-hospitals-korean-tourists",
  "/guide/best-hospitals-chinese-speakers",
  "/guide/best-hospitals-arabic-speakers",
  "/guide/health-checkup-japan-vs-thailand",
  "/guide/health-checkup-south-korea-vs-thailand",
  "/guide/health-checkup-taiwan-vs-thailand",
  "/guide/health-checkup-uae-vs-thailand",
  "/guide/health-checkup-saudi-arabia-vs-thailand",
  "/guide/health-checkup-egypt-vs-thailand",
]);
/**
 * Hospital pages are translated as of 2026-08-26, and the reasoning is worth
 * keeping because it reverses part of the 2026-08-17 decision.
 *
 * That decision was right on its own terms: every non-English route rendered
 * byte-identical English, so six copies of one page were competing and 2,740
 * URLs sat in "Discovered – currently not indexed". Collapsing them to a
 * single /en canonical was the correct fix for prose pages, and it stays in
 * force for guides, segments and the checkup combos, which are still English.
 *
 * A hospital page is a different kind of page. Its body is a name, an address,
 * an opening-hours table and a priced package list — data that reads the same
 * in every language — wrapped in about twenty UI labels. Those labels are now
 * translated (see the hosp_* block above), which is what "translated" has to
 * mean for a data page; it is the same shape every multilingual directory
 * uses, and hreflang is the mechanism built for it.
 *
 * The evidence for spending the crawl budget here is in the 2026-08-25 Search
 * Console export: /ar/hospital/* earned 49 clicks over three months against 10
 * for /en/hospital/*, the best-performing section on the site by a factor of
 * five, with /th at 17. Telling Google to drop those URLs in favour of an
 * English canonical throws away the one audience the site is already winning.
 *
 * Cost: the sitemap roughly doubles, ~700 URLs to ~1,300. That is a deliberate
 * trade, and it is not a return to the old problem — the old 3,041 were
 * duplicate English bodies submitted without clusters, these are localised
 * pages submitted inside an hreflang cluster.
 *
 * If Search Console shows /ar/ clicks collapsing after 2026-08-18 rather than
 * holding, the canonicalisation already did its damage and this reverses it:
 * delete the /hospital/ clause below and the sitemap follows automatically.
 */
export const isTranslatedPath = (path: string) =>
  TRANSLATED_PATHS.has(path) ||
  path.startsWith("/compare/") ||
  path.startsWith("/hospital/");

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
  // These two were referenced by NavBar but never defined, so t() fell back to
  // returning the key: every page in every language showed the literal strings
  // "nav_trends" and "nav_saved" in its main navigation.
  nav_trends:    { en: "Price trends", zh: "价格走势", ar: "اتجاهات الأسعار", ja: "価格推移", th: "แนวโน้มราคา", ko: "가격 추이" },
  nav_saved:     { en: "Saved",     zh: "已收藏", ar: "المحفوظة",  ja: "保存済み",  th: "ที่บันทึกไว้",  ko: "저장됨" },
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

  // ── Hospital detail page ───────────────────────────────────────────────────
  // This page carried 21 hard-coded English labels and not one t() call, so
  // /ar/hospital/* and /th/hospital/* were English pages wearing a locale
  // prefix. That matters more than it looks: the 2026-08-25 Search Console
  // export puts /ar/hospital/* at 49 clicks, the single best-performing
  // section on the site, ahead of every English one.
  //
  // What sits between these labels is not prose — it is the hospital's name,
  // its address, its package table and its prices, which read the same in any
  // language. Translating the frame is therefore the whole job here, and it is
  // also what has to exist before /ar can honestly claim to be its own page
  // rather than a duplicate canonicalised to /en.
  hosp_view_site:    { en: "View on hospital site →", zh: "访问医院官网 →", ar: "زيارة موقع المستشفى ←", ja: "病院の公式サイトへ →", th: "ไปที่เว็บไซต์โรงพยาบาล →", ko: "병원 공식 사이트 →" },
  hosp_directions:   { en: "Directions ↗", zh: "路线导航 ↗", ar: "الاتجاهات ↗", ja: "経路案内 ↗", th: "เส้นทาง ↗", ko: "길찾기 ↗" },
  hosp_jci:          { en: "JCI Accredited", zh: "JCI 认证", ar: "معتمد من JCI", ja: "JCI認証", th: "ได้รับรอง JCI", ko: "JCI 인증" },
  hosp_from:         { en: "Packages from", zh: "套餐起价", ar: "الباقات تبدأ من", ja: "パッケージ料金", th: "แพ็กเกจเริ่มต้น", ko: "패키지 최저가" },
  hosp_hours:        { en: "Opening hours", zh: "营业时间", ar: "ساعات العمل", ja: "診療時間", th: "เวลาทำการ", ko: "진료 시간" },
  hosp_founded:      { en: "Founded", zh: "成立年份", ar: "سنة التأسيس", ja: "設立", th: "ก่อตั้ง", ko: "설립" },
  hosp_beds:         { en: "Beds", zh: "床位数", ar: "عدد الأسرة", ja: "病床数", th: "จำนวนเตียง", ko: "병상 수" },
  hosp_accred:       { en: "Accreditations", zh: "认证资质", ar: "الاعتمادات", ja: "認定", th: "การรับรอง", ko: "인증" },
  hosp_website:      { en: "Website", zh: "官网", ar: "الموقع الإلكتروني", ja: "ウェブサイト", th: "เว็บไซต์", ko: "웹사이트" },
  hosp_email:        { en: "Email", zh: "电子邮箱", ar: "البريد الإلكتروني", ja: "メール", th: "อีเมล", ko: "이메일" },
  hosp_specialties:  { en: "Specialties:", zh: "专科：", ar: "التخصصات:", ja: "診療科:", th: "ความเชี่ยวชาญ:", ko: "전문 분야:" },
  hosp_no_packages:  {
    en: "No packages scraped yet for this hospital.",
    zh: "该医院暂无已收录的套餐。",
    ar: "لم يتم جمع أي باقات لهذا المستشفى بعد.",
    ja: "この病院のパッケージはまだ収集されていません。",
    th: "ยังไม่มีข้อมูลแพ็กเกจของโรงพยาบาลนี้",
    ko: "이 병원의 패키지 정보가 아직 없습니다.",
  },
  hosp_check_back:   {
    en: "Check back soon — we update weekly.",
    zh: "我们每周更新，欢迎稍后再来查看。",
    ar: "عد قريبًا — نقوم بالتحديث أسبوعيًا.",
    ja: "毎週更新しています。またご確認ください。",
    th: "เราอัปเดตทุกสัปดาห์ กลับมาดูใหม่เร็ว ๆ นี้",
    ko: "매주 업데이트합니다. 곧 다시 확인해 주세요.",
  },
  hosp_reviews:      { en: "Patient Reviews", zh: "患者评价", ar: "آراء المرضى", ja: "患者レビュー", th: "รีวิวจากผู้ป่วย", ko: "환자 리뷰" },
  hosp_compare_with: { en: "Compare with another hospital", zh: "与其他医院比较", ar: "قارن مع مستشفى آخر", ja: "他の病院と比較", th: "เปรียบเทียบกับโรงพยาบาลอื่น", ko: "다른 병원과 비교" },
  hosp_compare_all:  { en: "Compare all hospitals →", zh: "比较所有医院 →", ar: "قارن جميع المستشفيات ←", ja: "全病院を比較 →", th: "เปรียบเทียบทุกโรงพยาบาล →", ko: "전체 병원 비교 →" },
  hosp_ask_rec:      { en: "Ask for a recommendation", zh: "获取推荐", ar: "اطلب توصية", ja: "おすすめを相談する", th: "ขอคำแนะนำ", ko: "추천 요청하기" },
  hosp_guides:       { en: "Health check-up guides", zh: "体检指南", ar: "أدلة الفحص الصحي", ja: "健康診断ガイド", th: "คู่มือตรวจสุขภาพ", ko: "건강검진 가이드" },
  hosp_city_link:    { en: "Compare all hospitals in {city} →", zh: "比较{city}所有医院 →", ar: "قارن جميع المستشفيات في {city} ←", ja: "{city}の全病院を比較 →", th: "เปรียบเทียบทุกโรงพยาบาลใน{city} →", ko: "{city} 전체 병원 비교 →" },
  hosp_city_sub:     { en: "See prices from every hospital in {city}", zh: "查看{city}每家医院的价格", ar: "اطلع على أسعار كل مستشفى في {city}", ja: "{city}の全病院の料金を見る", th: "ดูราคาจากทุกโรงพยาบาลใน{city}", ko: "{city}의 모든 병원 가격 보기" },

  // Title and description templates for the hospital page. These are the two
  // strings that actually appear in a search result, so leaving them English
  // on a page that now declares an Arabic canonical would be the localisation
  // equivalent of a shop sign in the wrong language: the ranking is in Arabic,
  // the snippet is not. Placeholders are substituted by fmt().
  hosp_meta_title:   {
    en: "{name} Health Check-Up Packages & Prices — {city}",
    zh: "{name} 体检套餐与价格 — {city}",
    ar: "باقات وأسعار الفحص الصحي في {name} — {city}",
    ja: "{name} 健康診断パッケージと料金 — {city}",
    th: "แพ็กเกจตรวจสุขภาพและราคา {name} — {city}",
    ko: "{name} 건강검진 패키지·가격 — {city}",
  },
  hosp_meta_desc:    {
    en: "Compare all health check-up packages at {name}, {city}, Thailand. {n} packages compared.",
    zh: "对比{name}（{city}，泰国）的全部体检套餐，共收录 {n} 个套餐。",
    ar: "قارن جميع باقات الفحص الصحي في {name}، {city}، تايلاند. {n} باقة تمت مقارنتها.",
    ja: "タイ・{city}の{name}の健康診断パッケージを比較。{n}件のパッケージを掲載。",
    th: "เปรียบเทียบแพ็กเกจตรวจสุขภาพทั้งหมดที่ {name} {city} ประเทศไทย เปรียบเทียบ {n} แพ็กเกจ",
    ko: "태국 {city}의 {name} 건강검진 패키지 전체 비교. {n}개 패키지 수록.",
  },
  hosp_meta_jci:     { en: " JCI accredited.", zh: " 通过 JCI 认证。", ar: " معتمد من JCI.", ja: " JCI認証取得。", th: " ได้รับการรับรอง JCI", ko: " JCI 인증." },
  hosp_meta_from:    { en: " Packages from ฿{price}.", zh: " 套餐起价 ฿{price}。", ar: " الباقات تبدأ من {price} بات.", ja: " パッケージは฿{price}から。", th: " แพ็กเกจเริ่มต้น ฿{price}", ko: " 패키지 ฿{price}부터." },
  hosp_og_title:     {
    en: "{name} — {city} Health Check-Up Packages",
    zh: "{name} — {city}体检套餐",
    ar: "{name} — باقات الفحص الصحي في {city}",
    ja: "{name} — {city}の健康診断パッケージ",
    th: "{name} — แพ็กเกจตรวจสุขภาพ {city}",
    ko: "{name} — {city} 건강검진 패키지",
  },
  hosp_og_desc:      {
    en: "Real prices for {name} health check-up packages in {city}.",
    zh: "{city}{name}体检套餐的真实价格。",
    ar: "أسعار حقيقية لباقات الفحص الصحي في {name}، {city}.",
    ja: "{city}の{name}健康診断パッケージの実際の料金。",
    th: "ราคาจริงของแพ็กเกจตรวจสุขภาพ {name} ใน{city}",
    ko: "{city} {name} 건강검진 패키지의 실제 가격.",
  },
};

/**
 * t() with {placeholder} substitution.
 *
 * Deliberately not a template literal at the call site: the word order of
 * these sentences differs by language — Arabic and Japanese both put the city
 * somewhere English would not — so the position of each value has to live in
 * the translation, not in the code that assembles it.
 */
export const fmt = (loc: Locale, key: string, vars: Record<string, string | number>): string =>
  Object.entries(vars).reduce<string>(
    (out, [k, v]) => out.replaceAll(`{${k}}`, String(v)),
    t(loc, key),
  );

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
