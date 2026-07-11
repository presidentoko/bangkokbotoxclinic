import type { Locale } from "./i18n";

type QA = { q: string; a: string };

type FaqContent = {
  breadcrumbHome: string;
  breadcrumbFaq: string;
  pageTitle: string;
  pageIntro: string;
  categoryCostsPricing: string;
  costsPricing: QA[];
  ctaTitle: string;
  ctaSubtitle: string;
  ctaAsk: string;
  ctaCompare: string;
};

// Full scope note: only the page shell (title/intro/CTA) and the highest-traffic
// "Costs & Pricing" category are translated per locale. The remaining FAQ
// categories (What's Included, Booking, Senior Screening, Hospital Quality,
// Country Comparisons, Visa, Procedure Costs, Specific Tests, Nationality)
// stay English pending a follow-up pass — translating all ~37 Q&A pairs x 5
// languages was out of scope for this round.

const en: FaqContent = {
  breadcrumbHome: "Home", breadcrumbFaq: "FAQ",
  pageTitle: "Health Check-Up Thailand — Frequently Asked Questions",
  pageIntro: "Everything you need to know about getting a health check-up in Thailand — costs, inclusions, booking, and which hospitals to choose.",
  categoryCostsPricing: "Costs & Pricing",
  costsPricing: [
    { q: "How much does a health check-up cost in Bangkok?", a: "Bangkok health check-up prices range from ฿1,200 (basic blood panel) to ฿80,000+ (full executive with MRI at a JCI hospital). A good mid-range executive package covering blood tests, ultrasound, chest X-ray, ECG, and doctor consultation typically costs ฿6,000–฿15,000. Prices are 20–40% lower than Bumrungrad at smaller private hospitals." },
    { q: "Is health check-up cheaper in Chiang Mai than Bangkok?", a: "Yes — equivalent packages in Chiang Mai are typically 20–35% cheaper than Bangkok. A comprehensive package at Chiang Mai Ram Hospital or McCormick costs ฿4,000–฿8,000 vs ฿6,000–฿15,000 for the same scope in Bangkok. JCI hospitals are less common outside Bangkok, but private hospitals maintain excellent standards." },
    { q: "Why are prices at Bumrungrad so much higher?", a: "Bumrungrad is JCI-accredited, sees 1.1 million patients/year, and markets heavily to international medical tourists. Their prices are 40–80% above the Bangkok average. You're paying for reputation, international coordination services, and the premium location on Sukhumvit. Vejthani, Phyathai 2, and BNH offer similar JCI accreditation at lower prices." },
    { q: "Does my international health insurance cover health check-ups in Thailand?", a: "Some international health insurance plans (Cigna, Bupa, AXA, Allianz) cover preventive health screening once per year. Coverage depends on your plan — some cover basic screening only, others cover executive packages up to a specific value. Always get pre-authorisation from your insurer before booking. Most Thai private hospitals have an insurance desk." },
  ],
  ctaTitle: "Still have questions?",
  ctaSubtitle: "Tell us your age, medical concerns, budget, and city — we'll recommend the right package and hospital.",
  ctaAsk: "Ask a free question →",
  ctaCompare: "Compare prices now",
};

const zh: FaqContent = {
  breadcrumbHome: "首页", breadcrumbFaq: "常见问题",
  pageTitle: "泰国体检 — 常见问题解答",
  pageIntro: "关于在泰国进行体检您需要了解的一切 — 费用、包含项目、预约方式，以及如何选择医院。",
  categoryCostsPricing: "费用与价格",
  costsPricing: [
    { q: "曼谷体检费用是多少？", a: "曼谷体检价格从1,200泰铢（基础血液检查）到80,000泰铢以上（在JCI认证医院进行的包含核磁共振的完整高管体检）不等。一个涵盖血液检查、超声波、胸部X光、心电图和医生问诊的中档高管套餐通常价格为6,000–15,000泰铢。较小型私立医院的价格比康民医院低20–40%。" },
    { q: "清迈的体检比曼谷便宜吗？", a: "是的 — 清迈同等套餐通常比曼谷便宜20–35%。清迈兰纳医院或麦考密克医院的综合套餐价格为4,000–8,000泰铢，而曼谷同等范围的套餐价格为6,000–15,000泰铢。JCI认证医院在曼谷以外地区较少见，但私立医院仍保持极高标准。" },
    { q: "为什么康民医院的价格高出这么多？", a: "康民医院拥有JCI认证，年接待患者110万人次，并大力面向国际医疗游客进行推广。其价格比曼谷平均水平高出40–80%。您支付的是声誉、国际协调服务以及素坤逸黄金地段的溢价。维塔尼、Phyathai 2和BNH医院提供类似的JCI认证，但价格更低。" },
    { q: "我的国际健康保险能报销泰国体检费用吗？", a: "部分国际健康保险计划（信诺、保柏、安盛、安联）每年可报销一次预防性健康筛查。报销范围取决于您的保单 — 有些只覆盖基础筛查，有些可覆盖一定价值以内的高管套餐。预约前请务必向保险公司申请预授权。大多数泰国私立医院都设有保险服务柜台。" },
  ],
  ctaTitle: "还有其他问题？",
  ctaSubtitle: "告诉我们您的年龄、健康顾虑、预算和所在城市 — 我们将为您推荐合适的套餐和医院。",
  ctaAsk: "免费提问 →",
  ctaCompare: "立即比较价格",
};

const ja: FaqContent = {
  breadcrumbHome: "ホーム", breadcrumbFaq: "よくある質問",
  pageTitle: "タイの健康診断 — よくある質問",
  pageIntro: "タイでの健康診断について知っておくべきすべてのこと — 費用、含まれる内容、予約方法、どの病院を選ぶべきか。",
  categoryCostsPricing: "費用・価格",
  costsPricing: [
    { q: "バンコクの健康診断はいくらかかりますか？", a: "バンコクの健康診断価格は、基本血液検査の1,200バーツから、JCI認定病院でのMRI付きフルエグゼクティブ健診の80,000バーツ以上まで幅があります。血液検査、超音波、胸部X線、心電図、医師相談を含む中価格帯のエグゼクティブパッケージは通常6,000〜15,000バーツです。小規模な私立病院ではバムルンラード病院より20〜40%安くなります。" },
    { q: "チェンマイの健康診断はバンコクより安いですか？", a: "はい — チェンマイの同等パッケージは通常バンコクより20〜35%安くなります。チェンマイ・ラム病院やマコーミック病院の総合パッケージは4,000〜8,000バーツですが、バンコクで同じ内容だと6,000〜15,000バーツです。JCI認定病院はバンコク以外では少ないですが、私立病院は優れた水準を維持しています。" },
    { q: "バムルンラード病院の価格はなぜこんなに高いのですか？", a: "バムルンラード病院はJCI認定を受けており、年間110万人の患者を受け入れ、国際医療旅行者に積極的にマーケティングしています。価格はバンコクの平均より40〜80%高くなっています。これは評判、国際コーディネーションサービス、スクンビットの一等地という立地への対価です。ヴェイタニ、パヤタイ2、BNHは同様のJCI認定をより低価格で提供しています。" },
    { q: "海外旅行保険でタイの健康診断はカバーされますか？", a: "一部の国際健康保険プラン（シグナ、ブーパ、アクサ、アリアンツ）は年1回の予防健診をカバーしています。カバー範囲は加入プランによって異なります — 基本検診のみのものもあれば、一定額までのエグゼクティブパッケージをカバーするものもあります。予約前に必ず保険会社から事前承認を得てください。タイの私立病院の多くには保険デスクがあります。" },
  ],
  ctaTitle: "まだ質問がありますか？",
  ctaSubtitle: "年齢、健康上の懸念、予算、都市をお知らせください — 最適なパッケージと病院をご提案します。",
  ctaAsk: "無料で質問する →",
  ctaCompare: "今すぐ価格を比較",
};

const th: FaqContent = {
  breadcrumbHome: "หน้าหลัก", breadcrumbFaq: "คำถามที่พบบ่อย",
  pageTitle: "ตรวจสุขภาพในไทย — คำถามที่พบบ่อย",
  pageIntro: "ทุกสิ่งที่คุณต้องรู้เกี่ยวกับการตรวจสุขภาพในประเทศไทย — ค่าใช้จ่าย รายการที่รวมอยู่ วิธีจอง และควรเลือกโรงพยาบาลไหน",
  categoryCostsPricing: "ค่าใช้จ่ายและราคา",
  costsPricing: [
    { q: "ตรวจสุขภาพที่กรุงเทพราคาเท่าไหร่?", a: "ราคาตรวจสุขภาพในกรุงเทพอยู่ระหว่าง 1,200 บาท (ตรวจเลือดพื้นฐาน) ถึง 80,000 บาทขึ้นไป (แพ็กเกจผู้บริหารเต็มรูปแบบพร้อม MRI ที่โรงพยาบาลรับรอง JCI) แพ็กเกจผู้บริหารระดับกลางที่รวมตรวจเลือด อัลตราซาวด์ เอกซเรย์ทรวงอก คลื่นไฟฟ้าหัวใจ และปรึกษาแพทย์ โดยทั่วไปราคา 6,000–15,000 บาท ราคาที่โรงพยาบาลเอกชนขนาดเล็กจะถูกกว่าโรงพยาบาลบำรุงราษฎร์ 20–40%" },
    { q: "ตรวจสุขภาพที่เชียงใหม่ถูกกว่ากรุงเทพไหม?", a: "ใช่ — แพ็กเกจที่เทียบเท่ากันในเชียงใหม่มักถูกกว่ากรุงเทพ 20–35% แพ็กเกจครบวงจรที่โรงพยาบาลเชียงใหม่รามหรือแมคคอร์มิคราคา 4,000–8,000 บาท เทียบกับ 6,000–15,000 บาทสำหรับขอบเขตเดียวกันในกรุงเทพ โรงพยาบาลรับรอง JCI พบได้น้อยกว่านอกกรุงเทพ แต่โรงพยาบาลเอกชนยังคงมาตรฐานที่ดีเยี่ยม" },
    { q: "ทำไมราคาที่โรงพยาบาลบำรุงราษฎร์ถึงสูงกว่ามาก?", a: "บำรุงราษฎร์ได้รับการรับรอง JCI รองรับผู้ป่วย 1.1 ล้านคนต่อปี และทำการตลาดอย่างหนักกับนักท่องเที่ยวเชิงการแพทย์ต่างชาติ ราคาสูงกว่าค่าเฉลี่ยกรุงเทพ 40–80% คุณกำลังจ่ายเพื่อชื่อเสียง บริการประสานงานระหว่างประเทศ และทำเลทองบนถนนสุขุมวิท เวชธานี พญาไท 2 และ BNH มีการรับรอง JCI ที่คล้ายกันในราคาที่ถูกกว่า" },
    { q: "ประกันสุขภาพระหว่างประเทศของฉันครอบคลุมการตรวจสุขภาพในไทยไหม?", a: "แผนประกันสุขภาพระหว่างประเทศบางแผน (Cigna, Bupa, AXA, Allianz) ครอบคลุมการตรวจสุขภาพเชิงป้องกันปีละครั้ง ความคุ้มครองขึ้นอยู่กับแผนของคุณ — บางแผนครอบคลุมเฉพาะการตรวจพื้นฐาน บางแผนครอบคลุมแพ็กเกจผู้บริหารถึงวงเงินที่กำหนด ควรขออนุมัติล่วงหน้าจากบริษัทประกันก่อนจองเสมอ โรงพยาบาลเอกชนไทยส่วนใหญ่มีเคาน์เตอร์ประกันภัย" },
  ],
  ctaTitle: "ยังมีคำถามอยู่ไหม?",
  ctaSubtitle: "บอกอายุ ข้อกังวลด้านสุขภาพ งบประมาณ และเมืองของคุณ — เราจะแนะนำแพ็กเกจและโรงพยาบาลที่เหมาะสม",
  ctaAsk: "ถามฟรี →",
  ctaCompare: "เปรียบเทียบราคาตอนนี้",
};

const ko: FaqContent = {
  breadcrumbHome: "홈", breadcrumbFaq: "자주 묻는 질문",
  pageTitle: "태국 건강검진 — 자주 묻는 질문",
  pageIntro: "태국에서 건강검진을 받는 데 필요한 모든 것 — 비용, 포함 항목, 예약 방법, 어떤 병원을 선택할지.",
  categoryCostsPricing: "비용 및 가격",
  costsPricing: [
    { q: "방콕 건강검진 비용은 얼마인가요?", a: "방콕 건강검진 가격은 기본 혈액검사 1,200밧부터 JCI인증 병원의 MRI 포함 풀 프리미엄 검진 80,000밧 이상까지 다양합니다. 혈액검사, 초음파, 흉부 X-ray, 심전도, 의사 상담이 포함된 중가 프리미엄 패키지는 보통 6,000–15,000밧입니다. 소규모 사립병원 가격은 범룽랏 병원보다 20–40% 저렴합니다." },
    { q: "치앙마이 건강검진이 방콕보다 저렴한가요?", a: "네 — 치앙마이의 동등한 패키지는 보통 방콕보다 20–35% 저렴합니다. 치앙마이 람 병원이나 맥코믹 병원의 종합 패키지는 4,000–8,000밧인 반면, 방콕에서 같은 범위는 6,000–15,000밧입니다. JCI 인증 병원은 방콕 외 지역에서는 드물지만 사립병원은 우수한 수준을 유지합니다." },
    { q: "범룽랏 병원 가격이 왜 이렇게 높나요?", a: "범룽랏은 JCI 인증을 받았고 연간 110만 명의 환자를 진료하며 국제 의료관광객을 대상으로 적극적으로 마케팅합니다. 가격은 방콕 평균보다 40–80% 높습니다. 명성, 국제 코디네이션 서비스, 수쿰빗의 프리미엄 입지에 대한 비용을 지불하는 것입니다. 베짜니, 파야타이2, BNH는 유사한 JCI 인증을 더 저렴한 가격에 제공합니다." },
    { q: "제 해외 건강보험이 태국 건강검진을 보장하나요?", a: "일부 국제 건강보험(시그나, 부파, 악사, 알리안츠)은 연 1회 예방 건강검진을 보장합니다. 보장 범위는 가입한 플랜에 따라 다릅니다 — 기본 검진만 보장하는 경우도 있고, 특정 금액까지 프리미엄 패키지를 보장하는 경우도 있습니다. 예약 전 반드시 보험사로부터 사전 승인을 받으세요. 대부분의 태국 사립병원에는 보험 데스크가 있습니다." },
  ],
  ctaTitle: "더 궁금한 점이 있으신가요?",
  ctaSubtitle: "나이, 건강 관련 고민, 예산, 도시를 알려주세요 — 적합한 패키지와 병원을 추천해드립니다.",
  ctaAsk: "무료로 질문하기 →",
  ctaCompare: "지금 가격 비교하기",
};

const ar: FaqContent = {
  breadcrumbHome: "الرئيسية", breadcrumbFaq: "الأسئلة الشائعة",
  pageTitle: "الفحص الصحي في تايلاند — الأسئلة الشائعة",
  pageIntro: "كل ما تحتاج معرفته عن إجراء فحص صحي في تايلاند — التكاليف والمحتويات وطريقة الحجز وأي المستشفيات تختار.",
  categoryCostsPricing: "التكاليف والأسعار",
  costsPricing: [
    { q: "كم تكلفة الفحص الصحي في بانكوك؟", a: "تتراوح أسعار الفحص الصحي في بانكوك من 1,200 بات (فحص دم أساسي) إلى أكثر من 80,000 بات (باقة تنفيذية كاملة مع رنين مغناطيسي في مستشفى معتمد من JCI). تكلف الباقة التنفيذية متوسطة السعر التي تشمل فحوصات الدم والموجات فوق الصوتية وأشعة الصدر وتخطيط القلب واستشارة الطبيب عادةً 6,000–15,000 بات. الأسعار في المستشفيات الخاصة الأصغر أقل بنسبة 20–40% من مستشفى بامرونغراد." },
    { q: "هل الفحص الصحي في تشيانغ ماي أرخص من بانكوك؟", a: "نعم — الباقات المكافئة في تشيانغ ماي أرخص عادةً بنسبة 20–35% من بانكوك. تكلف الباقة الشاملة في مستشفى تشيانغ ماي رام أو ماكورميك 4,000–8,000 بات مقابل 6,000–15,000 بات لنفس النطاق في بانكوك. مستشفيات JCI أقل شيوعاً خارج بانكوك، لكن المستشفيات الخاصة تحافظ على معايير ممتازة." },
    { q: "لماذا أسعار مستشفى بامرونغراد أعلى بكثير؟", a: "مستشفى بامرونغراد معتمد من JCI ويستقبل 1.1 مليون مريض سنوياً ويسوّق بشكل كبير للسياح الطبيين الدوليين. أسعاره أعلى بنسبة 40–80% من متوسط بانكوك. أنت تدفع مقابل السمعة وخدمات التنسيق الدولي والموقع المميز في سوكومفيت. تقدم مستشفيات فيثاني وفياثاي 2 وBNH اعتماد JCI مماثل بأسعار أقل." },
    { q: "هل يغطي تأميني الصحي الدولي الفحوصات الصحية في تايلاند؟", a: "تغطي بعض خطط التأمين الصحي الدولية (سيجنا، بوبا، أكسا، أليانز) الفحص الصحي الوقائي مرة واحدة سنوياً. تعتمد التغطية على خطتك — بعضها يغطي الفحص الأساسي فقط، وأخرى تغطي الباقات التنفيذية حتى قيمة معينة. احصل دائماً على موافقة مسبقة من شركة التأمين قبل الحجز. تمتلك معظم المستشفيات الخاصة التايلاندية مكتب تأمين." },
  ],
  ctaTitle: "لا تزال لديك أسئلة؟",
  ctaSubtitle: "أخبرنا بعمرك واهتماماتك الصحية وميزانيتك ومدينتك — سنوصي بالباقة والمستشفى المناسبين.",
  ctaAsk: "اسأل مجاناً ←",
  ctaCompare: "قارن الأسعار الآن",
};

const FAQ_I18N: Record<Locale, FaqContent> = { en, zh, ja, th, ko, ar };

export function faqT(locale: Locale): FaqContent {
  return FAQ_I18N[locale] ?? FAQ_I18N.en;
}
