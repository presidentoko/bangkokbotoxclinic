import type { Locale } from "./i18n";

type HomeContent = {
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  heroBadge: string;
  heroTitleLine1: string;
  heroTitleLine2: string;
  heroSubtitle: string;
  heroStats: (hospitals: number, packages: number, jci: number) => string;
  ctaCompareExecutive: string;
  ctaAllCategories: string;
  trustHospitals: string;
  trustPackages: string;
  trustJci: string;
  trustPaid: string;
  browseByType: string;
  browseByCity: string;
  allCities: string;
  howItWorksTitle: string;
  step1Title: string; step1Desc: string;
  step2Title: string; step2Desc: string;
  step3Title: string; step3Desc: string;
  executivePreviewTitle: string;
  fullComparison: string;
  seeAllExecutive: (n: number) => string;
  recentDropsTitle: string;
  allTrends: string;
  guidesTitle: string;
  allGuides: string;
  countryComparisonTitle: string;
  specialistTestsTitle: string;
  findRightPackageTitle: string;
  whyUseTitle: string;
  why1Title: string; why1Desc: string;
  why2Title: string; why2Desc: string;
  why3Title: string; why3Desc: string;
  bottomCtaTitle: string;
  bottomCtaSubtitle: string;
  bottomCtaButton: string;
};

const en: HomeContent = {
  metaDescription: "Compare published health check-up prices from Thai hospitals and clinics — Bangkok, Chiang Mai, Phuket and more. No ads, no sponsored listings, no booking fee.",
  ogTitle: "Compare Health Check-Up Prices in Thailand — Real Prices, No Ads",
  ogDescription: "Real prices from 235+ hospitals across Bangkok, Chiang Mai, Phuket and 19 more Thai cities. Executive, cancer, cardiac, women's screening and more.",
  heroBadge: "✓ No ads · No sponsored rankings · Real prices only",
  heroTitleLine1: "Compare Bangkok",
  heroTitleLine2: "Health Check-Up Prices",
  heroSubtitle: "Published prices, read from hospital websites and Thai booking platforms.",
  heroStats: (h, p, j) => `${h} hospitals · ${p} packages · ${j} JCI-accredited`,
  ctaCompareExecutive: "Compare Executive Packages →",
  ctaAllCategories: "All categories",
  trustHospitals: "Hospitals",
  trustPackages: "Packages",
  trustJci: "JCI-accredited",
  trustPaid: "Paid placements",
  browseByType: "Browse by check-up type",
  browseByCity: "Browse health check-ups by city",
  allCities: "All 22 cities →",
  howItWorksTitle: "How BangkokCheckup works",
  step1Title: "Browse real prices", step1Desc: "We read prices from hospital websites and Thai booking platforms, and record the promotional price where one is shown. No mark-ups, no \"call for price\", no ads.",
  step2Title: "Compare what's included", step2Desc: "Use filters to see which packages include MRI, cancer markers, interpreter service, or CT scan — side by side.",
  step3Title: "Book direct or get advice", step3Desc: "Book directly on the hospital's website (no middleman fee) or send us your requirements for a personalised recommendation.",
  executivePreviewTitle: "Executive packages — top picks",
  fullComparison: "Full comparison →",
  seeAllExecutive: (n) => `See all ${n} executive packages →`,
  recentDropsTitle: "Recent price drops",
  allTrends: "All price trends →",
  guidesTitle: "Health check-up guides",
  allGuides: "All 120+ guides →",
  countryComparisonTitle: "Country comparisons — how much you save",
  specialistTestsTitle: "Specialist tests & procedure costs",
  findRightPackageTitle: "Find the right package for you",
  whyUseTitle: "Why use BangkokCheckup?",
  why1Title: "Real prices only", why1Desc: "Every price is scraped from the hospital's own website — not aggregators or ad networks.",
  why2Title: "No paid rankings", why2Desc: "Packages sort by price. Hospitals can't pay for higher placement. Ever.",
  why3Title: "Multiple languages", why3Desc: "Compare in English, Chinese, Japanese, Korean, Thai, and Arabic.",
  bottomCtaTitle: "Not sure which package is right for you?",
  bottomCtaSubtitle: "Tell us your requirements and we'll find the best match.",
  bottomCtaButton: "Get personalised advice →",
};

const zh: HomeContent = {
  metaDescription: "比较泰国235家以上医院、22个城市的真实体检套餐价格。曼谷、清迈、普吉、芭提雅等。无广告，无赞助排名。",
  ogTitle: "比较泰国体检价格 — 真实价格，无广告",
  ogDescription: "曼谷、清迈、普吉等19个以上泰国城市235家以上医院的真实价格。高管体检、癌症筛查、心脏检查、女性体检等。",
  heroBadge: "✓ 无广告 · 无赞助排名 · 仅真实价格",
  heroTitleLine1: "比较曼谷",
  heroTitleLine2: "体检套餐价格",
  heroSubtitle: "价格来自医院官网及泰国预约平台的公开报价。",
  heroStats: (h, p, j) => `${h}家医院 · ${p}个套餐 · ${j}家JCI认证`,
  ctaCompareExecutive: "比较高管体检套餐 →",
  ctaAllCategories: "所有类别",
  trustHospitals: "医院",
  trustPackages: "套餐",
  trustJci: "JCI认证",
  trustPaid: "付费排名",
  browseByType: "按体检类型浏览",
  browseByCity: "按城市浏览体检套餐",
  allCities: "全部22个城市 →",
  howItWorksTitle: "曼谷体检网使用方法",
  step1Title: "浏览真实价格", step1Desc: "我们从医院官网和泰国预约平台读取价格，有促销价时以促销价为准。无加价，无\"电话询价\"，无广告。",
  step2Title: "比较套餐内容", step2Desc: "使用筛选功能查看哪些套餐包含核磁共振、癌症标志物、翻译服务或CT扫描 — 一目了然。",
  step3Title: "直接预约或获取建议", step3Desc: "直接在医院官网预约（无中介费），或告诉我们您的需求获取个性化推荐。",
  executivePreviewTitle: "高管体检套餐 — 精选推荐",
  fullComparison: "查看完整对比 →",
  seeAllExecutive: (n) => `查看全部${n}个高管体检套餐 →`,
  recentDropsTitle: "近期降价",
  allTrends: "查看全部价格趋势 →",
  guidesTitle: "体检指南",
  allGuides: "全部120+篇指南 →",
  countryComparisonTitle: "国家对比 — 能省多少钱",
  specialistTestsTitle: "专项检查与项目费用",
  findRightPackageTitle: "找到适合您的套餐",
  whyUseTitle: "为什么选择曼谷体检网？",
  why1Title: "仅真实价格", why1Desc: "每个价格都直接抓取自医院官网 — 而非聚合平台或广告网络。",
  why2Title: "无付费排名", why2Desc: "套餐按价格排序。医院永远无法付费获得更高排名。",
  why3Title: "多语言支持", why3Desc: "支持英语、中文、日语、韩语、泰语和阿拉伯语比较。",
  bottomCtaTitle: "不确定哪个套餐适合您？",
  bottomCtaSubtitle: "告诉我们您的需求，我们将为您找到最佳匹配。",
  bottomCtaButton: "获取个性化建议 →",
};

const ja: HomeContent = {
  metaDescription: "タイ全土22都市、235以上の病院の実際の健康診断価格を比較。バンコク、チェンマイ、プーケット、パタヤなど。広告なし、スポンサー掲載なし。",
  ogTitle: "タイの健康診断価格を比較 — 実際の価格、広告なし",
  ogDescription: "バンコク、チェンマイ、プーケットなどタイ19以上の都市、235以上の病院の実際の価格。エグゼクティブ健診、がん検診、心臓検査、女性健診など。",
  heroBadge: "✓ 広告なし · スポンサー掲載なし · 実際の価格のみ",
  heroTitleLine1: "バンコクの",
  heroTitleLine2: "健康診断価格を比較",
  heroSubtitle: "病院の公式サイトとタイの予約サイトに掲載された価格。",
  heroStats: (h, p, j) => `${h}病院 · ${p}パッケージ · ${j}件JCI認定`,
  ctaCompareExecutive: "エグゼクティブ健診を比較 →",
  ctaAllCategories: "全カテゴリー",
  trustHospitals: "病院数",
  trustPackages: "パッケージ数",
  trustJci: "JCI認定",
  trustPaid: "有料掲載",
  browseByType: "検診タイプ別に見る",
  browseByCity: "都市別に健康診断を見る",
  allCities: "全22都市を見る →",
  howItWorksTitle: "BangkokCheckupの使い方",
  step1Title: "実際の価格を見る", step1Desc: "病院の公式サイトとタイの予約サイトから価格を収集し、割引価格がある場合はそちらを記載します。上乗せ料金なし、「要問合せ」なし、広告なし。",
  step2Title: "内容を比較する", step2Desc: "フィルターを使ってMRI、がんマーカー、通訳サービス、CTスキャンが含まれるパッケージを並べて比較できます。",
  step3Title: "直接予約または相談する", step3Desc: "病院の公式サイトで直接予約（仲介手数料なし)、またはご要望をお送りいただければ最適なパッケージをご提案します。",
  executivePreviewTitle: "エグゼクティブ健診 — おすすめ",
  fullComparison: "全て比較する →",
  seeAllExecutive: (n) => `全${n}件のエグゼクティブ健診を見る →`,
  recentDropsTitle: "最近の値下げ",
  allTrends: "価格推移をすべて見る →",
  guidesTitle: "健康診断ガイド",
  allGuides: "全120以上のガイドを見る →",
  countryComparisonTitle: "国別比較 — どれくらい節約できるか",
  specialistTestsTitle: "専門検査・処置費用",
  findRightPackageTitle: "あなたに合ったパッケージを探す",
  whyUseTitle: "BangkokCheckupを使う理由",
  why1Title: "実際の価格のみ", why1Desc: "すべての価格は病院公式サイトから直接収集 — 比較サイトや広告ネットワークではありません。",
  why2Title: "有料ランキングなし", why2Desc: "パッケージは価格順に並びます。病院がお金を払って上位表示されることはありません。",
  why3Title: "多言語対応", why3Desc: "英語、中国語、日本語、韓国語、タイ語、アラビア語で比較できます。",
  bottomCtaTitle: "どのパッケージが良いか分からない方へ",
  bottomCtaSubtitle: "ご要望をお知らせいただければ、最適なパッケージをご提案します。",
  bottomCtaButton: "個別アドバイスを受ける →",
};

const th: HomeContent = {
  metaDescription: "เปรียบเทียบราคาตรวจสุขภาพจริงจากโรงพยาบาลกว่า 235 แห่งใน 22 เมืองทั่วไทย กรุงเทพ เชียงใหม่ ภูเก็ต พัทยา และอื่นๆ ไม่มีโฆษณา ไม่มีการจัดอันดับแบบสปอนเซอร์",
  ogTitle: "เปรียบเทียบราคาตรวจสุขภาพในไทย — ราคาจริง ไม่มีโฆษณา",
  ogDescription: "ราคาจริงจากโรงพยาบาลกว่า 235 แห่งใน กรุงเทพ เชียงใหม่ ภูเก็ต และอีก 19 เมืองทั่วไทย แพ็กเกจผู้บริหาร ตรวจมะเร็ง หัวใจ สุขภาพสตรี และอื่นๆ",
  heroBadge: "✓ ไม่มีโฆษณา · ไม่มีการจัดอันดับสปอนเซอร์ · ราคาจริงเท่านั้น",
  heroTitleLine1: "เปรียบเทียบราคา",
  heroTitleLine2: "ตรวจสุขภาพกรุงเทพ",
  heroSubtitle: "ราคาที่ประกาศไว้ จากเว็บไซต์โรงพยาบาลและแพลตฟอร์มจองของไทย",
  heroStats: (h, p, j) => `${h} โรงพยาบาล · ${p} แพ็กเกจ · ${j} แห่งรับรอง JCI`,
  ctaCompareExecutive: "เปรียบเทียบแพ็กเกจผู้บริหาร →",
  ctaAllCategories: "ดูทุกประเภท",
  trustHospitals: "โรงพยาบาล",
  trustPackages: "แพ็กเกจ",
  trustJci: "รับรอง JCI",
  trustPaid: "การจัดอันดับแบบจ่ายเงิน",
  browseByType: "เลือกดูตามประเภทการตรวจ",
  browseByCity: "เลือกดูตรวจสุขภาพตามเมือง",
  allCities: "ดูทั้ง 22 เมือง →",
  howItWorksTitle: "BangkokCheckup ทำงานอย่างไร",
  step1Title: "ดูราคาจริง", step1Desc: "เราอ่านราคาจากเว็บไซต์โรงพยาบาลและแพลตฟอร์มจองของไทย และบันทึกราคาโปรโมชันหากมี ไม่มีการบวกราคา ไม่มี \"โทรสอบถามราคา\" ไม่มีโฆษณา",
  step2Title: "เปรียบเทียบสิ่งที่รวมอยู่", step2Desc: "ใช้ตัวกรองเพื่อดูว่าแพ็กเกจไหนรวม MRI สารบ่งชี้มะเร็ง บริการล่าม หรือ CT scan — เทียบกันแบบเคียงข้าง",
  step3Title: "จองตรงหรือขอคำแนะนำ", step3Desc: "จองผ่านเว็บไซต์โรงพยาบาลโดยตรง (ไม่มีค่าคนกลาง) หรือส่งความต้องการของคุณมาให้เราแนะนำแพ็กเกจที่เหมาะสม",
  executivePreviewTitle: "แพ็กเกจผู้บริหาร — ตัวเลือกยอดนิยม",
  fullComparison: "ดูการเปรียบเทียบทั้งหมด →",
  seeAllExecutive: (n) => `ดูแพ็กเกจผู้บริหารทั้งหมด ${n} รายการ →`,
  recentDropsTitle: "ราคาที่ลดลงล่าสุด",
  allTrends: "ดูแนวโน้มราคาทั้งหมด →",
  guidesTitle: "คู่มือตรวจสุขภาพ",
  allGuides: "ดูคู่มือทั้งหมด 120+ เรื่อง →",
  countryComparisonTitle: "เปรียบเทียบราคากับต่างประเทศ — ประหยัดได้เท่าไหร่",
  specialistTestsTitle: "ค่าใช้จ่ายการตรวจเฉพาะทาง",
  findRightPackageTitle: "ค้นหาแพ็กเกจที่เหมาะกับคุณ",
  whyUseTitle: "ทำไมต้องใช้ BangkokCheckup?",
  why1Title: "ราคาจริงเท่านั้น", why1Desc: "ทุกราคาดึงมาจากเว็บไซต์โรงพยาบาลโดยตรง — ไม่ใช่จากเว็บรวมหรือเครือข่ายโฆษณา",
  why2Title: "ไม่มีการจัดอันดับแบบจ่ายเงิน", why2Desc: "แพ็กเกจเรียงตามราคา โรงพยาบาลไม่สามารถจ่ายเงินเพื่อขึ้นอันดับได้",
  why3Title: "รองรับหลายภาษา", why3Desc: "เปรียบเทียบได้ทั้งภาษาอังกฤษ จีน ญี่ปุ่น เกาหลี ไทย และอาหรับ",
  bottomCtaTitle: "ไม่แน่ใจว่าแพ็กเกจไหนเหมาะกับคุณ?",
  bottomCtaSubtitle: "บอกความต้องการของคุณ แล้วเราจะหาแพ็กเกจที่เหมาะสมที่สุดให้",
  bottomCtaButton: "รับคำแนะนำเฉพาะบุคคล →",
};

const ko: HomeContent = {
  metaDescription: "태국 22개 도시 235개 이상 병원의 실제 건강검진 가격을 비교하세요. 방콕, 치앙마이, 푸켓, 파타야 등. 광고 없음, 협찬 순위 없음.",
  ogTitle: "태국 건강검진 가격 비교 — 실제 가격, 광고 없음",
  ogDescription: "방콕, 치앙마이, 푸켓 등 태국 19개 이상 도시 235개 이상 병원의 실제 가격. 프리미엄 검진, 암검진, 심장검사, 여성검진 등.",
  heroBadge: "✓ 광고 없음 · 협찬 순위 없음 · 실제 가격만",
  heroTitleLine1: "방콕 건강검진",
  heroTitleLine2: "가격 비교",
  heroSubtitle: "병원 공식 웹사이트와 태국 예약 플랫폼에 공개된 가격.",
  heroStats: (h, p, j) => `병원 ${h}곳 · 패키지 ${p}개 · JCI인증 ${j}곳`,
  ctaCompareExecutive: "프리미엄 검진 비교하기 →",
  ctaAllCategories: "전체 카테고리",
  trustHospitals: "병원",
  trustPackages: "패키지",
  trustJci: "JCI 인증",
  trustPaid: "유료 광고",
  browseByType: "검진 유형별로 보기",
  browseByCity: "도시별로 건강검진 보기",
  allCities: "전체 22개 도시 →",
  howItWorksTitle: "방콕건강검진 이용 방법",
  step1Title: "실제 가격 확인", step1Desc: "병원 공식 웹사이트와 태국 예약 플랫폼에서 가격을 수집하며, 할인가가 있으면 할인가를 기록합니다. 추가 요금, \"전화 문의\", 광고가 없습니다.",
  step2Title: "포함 항목 비교", step2Desc: "필터를 사용해 MRI, 암표지자, 통역 서비스, CT 스캔이 포함된 패키지를 나란히 비교하세요.",
  step3Title: "직접 예약 또는 상담받기", step3Desc: "병원 웹사이트에서 직접 예약하거나(중개 수수료 없음), 원하시는 조건을 알려주시면 맞춤 추천을 해드립니다.",
  executivePreviewTitle: "프리미엄 검진 — 인기 추천",
  fullComparison: "전체 비교 보기 →",
  seeAllExecutive: (n) => `프리미엄 검진 ${n}개 전체 보기 →`,
  recentDropsTitle: "최근 가격 인하",
  allTrends: "전체 가격 동향 보기 →",
  guidesTitle: "건강검진 가이드",
  allGuides: "전체 120개+ 가이드 보기 →",
  countryComparisonTitle: "국가별 비교 — 얼마나 절약되는지",
  specialistTestsTitle: "전문 검사 및 시술 비용",
  findRightPackageTitle: "나에게 맞는 패키지 찾기",
  whyUseTitle: "왜 방콕건강검진을 이용해야 할까요?",
  why1Title: "실제 가격만", why1Desc: "모든 가격은 병원 공식 웹사이트에서 직접 수집되며, 대행업체나 광고 네트워크를 거치지 않습니다.",
  why2Title: "유료 순위 없음", why2Desc: "패키지는 가격순으로 정렬됩니다. 병원이 돈을 내고 상위에 노출될 수 없습니다.",
  why3Title: "다국어 지원", why3Desc: "영어, 중국어, 일본어, 한국어, 태국어, 아랍어로 비교할 수 있습니다.",
  bottomCtaTitle: "어떤 패키지가 맞는지 모르시겠나요?",
  bottomCtaSubtitle: "원하시는 조건을 알려주시면 가장 적합한 패키지를 찾아드립니다.",
  bottomCtaButton: "맞춤 상담 받기 →",
};

const ar: HomeContent = {
  metaDescription: "قارن أسعار الفحوصات الصحية الحقيقية من أكثر من 235 مستشفى في 22 مدينة في تايلاند. بانكوك، تشيانغ ماي، بوكيت، باتايا وغيرها. بدون إعلانات، بدون تصنيفات ممولة.",
  ogTitle: "قارن أسعار الفحوصات الصحية في تايلاند — أسعار حقيقية، بدون إعلانات",
  ogDescription: "أسعار حقيقية من أكثر من 235 مستشفى في بانكوك وتشيانغ ماي وبوكيت و19 مدينة أخرى في تايلاند. فحوصات تنفيذية وفحص السرطان والقلب وصحة المرأة وغيرها.",
  heroBadge: "✓ بدون إعلانات · بدون تصنيفات ممولة · أسعار حقيقية فقط",
  heroTitleLine1: "قارن أسعار الفحص الصحي",
  heroTitleLine2: "في بانكوك",
  heroSubtitle: "أسعار معلنة، مأخوذة من مواقع المستشفيات ومنصات الحجز التايلاندية.",
  heroStats: (h, p, j) => `${h} مستشفى · ${p} باقة · ${j} معتمدة من JCI`,
  ctaCompareExecutive: "قارن الباقات التنفيذية ←",
  ctaAllCategories: "جميع الفئات",
  trustHospitals: "مستشفيات",
  trustPackages: "باقات",
  trustJci: "معتمدة JCI",
  trustPaid: "إعلانات مدفوعة",
  browseByType: "تصفح حسب نوع الفحص",
  browseByCity: "تصفح الفحوصات الصحية حسب المدينة",
  allCities: "جميع الـ22 مدينة ←",
  howItWorksTitle: "كيف يعمل BangkokCheckup",
  step1Title: "تصفح الأسعار الحقيقية", step1Desc: "نقرأ الأسعار من مواقع المستشفيات ومنصات الحجز التايلاندية، ونسجل السعر الترويجي عند وجوده. بدون زيادة في السعر، وبدون \"اتصل للاستفسار عن السعر\"، وبدون إعلانات.",
  step2Title: "قارن ما هو مشمول", step2Desc: "استخدم الفلاتر لمعرفة أي الباقات تشمل الرنين المغناطيسي أو علامات السرطان أو خدمة الترجمة أو الأشعة المقطعية — جنباً إلى جنب.",
  step3Title: "احجز مباشرة أو احصل على استشارة", step3Desc: "احجز مباشرة عبر موقع المستشفى (بدون رسوم وسيط) أو أرسل لنا متطلباتك للحصول على توصية شخصية.",
  executivePreviewTitle: "الباقات التنفيذية — الأفضل اختياراً",
  fullComparison: "المقارنة الكاملة ←",
  seeAllExecutive: (n) => `عرض جميع الباقات التنفيذية الـ${n} ←`,
  recentDropsTitle: "انخفاضات الأسعار الأخيرة",
  allTrends: "جميع اتجاهات الأسعار ←",
  guidesTitle: "أدلة الفحص الصحي",
  allGuides: "جميع الأدلة (+120) ←",
  countryComparisonTitle: "مقارنات الدول — كم يمكنك التوفير",
  specialistTestsTitle: "الفحوصات المتخصصة وتكاليف الإجراءات",
  findRightPackageTitle: "ابحث عن الباقة المناسبة لك",
  whyUseTitle: "لماذا تستخدم BangkokCheckup؟",
  why1Title: "أسعار حقيقية فقط", why1Desc: "كل سعر مأخوذ من موقع المستشفى نفسه — وليس من مجمّعات أو شبكات إعلانية.",
  why2Title: "بدون تصنيفات مدفوعة", why2Desc: "تُرتَّب الباقات حسب السعر. لا يمكن للمستشفيات الدفع مقابل ترتيب أعلى أبداً.",
  why3Title: "لغات متعددة", why3Desc: "قارن بالإنجليزية والصينية واليابانية والكورية والتايلاندية والعربية.",
  bottomCtaTitle: "لست متأكداً من الباقة المناسبة لك؟",
  bottomCtaSubtitle: "أخبرنا بمتطلباتك وسنجد لك الأنسب.",
  bottomCtaButton: "احصل على استشارة شخصية ←",
};

const HOME_I18N: Record<Locale, HomeContent> = { en, zh, ja, th, ko, ar };

export function homeT(locale: Locale): HomeContent {
  return HOME_I18N[locale] ?? HOME_I18N.en;
}
