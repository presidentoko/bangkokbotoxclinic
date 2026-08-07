import type { Metadata } from "next";
import Link from "next/link";
import { type Locale, hreflangMap } from "@/lib/i18n";
import { getAllPackages, type PackageRow } from "@/lib/db";
import { FilteredPackageGrid } from "@/app/components/FilteredPackageGrid";

// Static — see the note in app/[locale]/page.tsx.
export const revalidate = false;

// Each longtail segment with its config
const SEGMENTS: Record<string, {
  title: string;
  h1: string;
  description: string;
  filter: (p: PackageRow) => boolean;
  intro: string;
  faqs: { q: string; a: string }[];
  relatedGuides?: { href: string; label: string }[];
}> = {
  "jci-accredited-health-checkup-bangkok": {
    title: "JCI Health Check-Up Bangkok — Accredited Hospitals 2026",
    h1: "JCI-Accredited Health Check-Up in Bangkok",
    description: "Compare health check-up packages at JCI-accredited hospitals in Bangkok. All packages from internationally certified hospitals — Bumrungrad, Samitivej, Phyathai, Vejthani, and more.",
    filter: (p) => p.jci === 1,
    intro: "JCI (Joint Commission International) accreditation is the gold standard for hospital quality outside the United States. Bangkok has 9 JCI-accredited hospitals offering health check-up packages — more than almost any city outside the US. Compare their packages below.",
    faqs: [
      { q: "What does JCI accreditation mean for a health check-up?", a: "JCI-accredited hospitals meet 1,000+ international standards for patient safety, cleanliness, infection control, and care quality. For health check-ups, this means standardised laboratory procedures, certified technicians, and consistent result interpretation." },
      { q: "Are JCI hospitals in Bangkok more expensive for health check-ups?", a: "JCI hospitals typically charge 20–40% more than non-accredited private hospitals. However, package prices at Vejthani and Saint Louis JCI hospitals are competitive with non-JCI hospitals. The price difference narrows for executive packages." },
      { q: "Which JCI hospitals in Bangkok offer the best health check-up packages?", a: "Bumrungrad International has the widest range (50+ packages). Samitivej Sukhumvit is top-rated for women's health check-ups. Vejthani offers the best price-to-JCI ratio. Bangkok Hospital is best for full executive packages with CT and MRI." },
    ],
    relatedGuides: [
      { href: "/guide/jci-hospitals-bangkok", label: "JCI Hospitals in Bangkok — Full Guide" },
      { href: "/guide/executive-health-checkup-bangkok", label: "Executive Health Check-Up Bangkok" },
    ],
  },
  "health-checkup-expats-bangkok": {
    title: "Expat Health Check-Up Bangkok — English-Speaking Hospitals",
    h1: "Health Check-Up for Expats in Bangkok",
    description: "The complete guide to annual health check-ups for expatriates living in Bangkok. English-speaking staff, international insurance accepted, same-day results at major private hospitals.",
    filter: (p) => (p.jci === 1 || p.city === "Bangkok") && (p.has_blood === 1),
    intro: "For expats in Bangkok, getting a health check-up is straightforward at any major private hospital. All Bangkok private hospitals with health check-up packages have English-speaking staff. Most accept international health insurance (Cigna, Bupa, AXA, Allianz). Results are typically available within 24 hours.",
    faqs: [
      { q: "Do Bangkok hospitals accept international health insurance for check-ups?", a: "Most private Bangkok hospitals accept major international health insurance: Cigna, Bupa, AXA, Allianz, Pacific Cross, and AIA. You'll usually need pre-authorisation from your insurer before the appointment. Government hospitals require cash payment." },
      { q: "How do I book a health check-up as a foreigner in Bangkok?", a: "Call the hospital's international health centre directly or book online. Bumrungrad, Samitivej, and Bangkok Hospital all have English-language websites and international patient desks. Walk-in appointments are available at most hospitals for morning check-ups." },
      { q: "What's included in a typical annual health check-up for expats in Bangkok?", a: "A standard expat annual check-up (฿3,000–฿8,000) includes: CBC blood panel, blood glucose, cholesterol, kidney and liver function, thyroid, chest X-ray, urinalysis, and a doctor consultation. Executive packages add ultrasound, ECG, and cancer marker panels." },
      { q: "Which Bangkok hospital is best for expat health check-ups?", a: "Bumrungrad International is the most popular for expats (1.1M patients/year, 190 nationalities). BNH Hospital is preferred by the European and Japanese expat community. Samitivej Sukhumvit is top-rated for families and women's check-ups." },
    ],
    relatedGuides: [
      { href: "/guide/health-checkup-expats-thailand", label: "Expat Health Check-Up Thailand Guide" },
      { href: "/guide/jci-hospitals-bangkok", label: "JCI-Accredited Hospitals Bangkok" },
      { href: "/guide/vitamin-d-test-bangkok", label: "Vitamin D Test — Common in Expats" },
    ],
  },
  "digital-nomad-health-checkup-bangkok": {
    title: "Digital Nomad Health Check-Up Bangkok — Walk-In Labs 2026",
    h1: "Health Check-Up for Digital Nomads in Bangkok",
    description: "No insurance? No problem. Bangkok's private hospitals offer walk-in blood tests and annual check-up packages from ฿1,500 — affordable self-pay health screening for digital nomads.",
    filter: (p) => p.city === "Bangkok" && (p.has_blood === 1),
    intro: "Bangkok is one of the world's top digital nomad hubs — and its private hospitals make health screening easy and affordable without any insurance or referral. Walk into a Bangkok private hospital laboratory in the morning, choose your tests, and have results by afternoon. Annual executive check-up packages from ฿5,000–฿8,000 cover everything a self-employed worker needs to track their health while living abroad.",
    faqs: [
      { q: "Can I get a health check-up in Bangkok without insurance?", a: "Yes — all Bangkok private hospitals accept self-pay patients for health check-ups. There's no referral needed and no insurance required. You pay directly at registration, either by card or cash. A comprehensive annual executive check-up costs ฿8,000–฿15,000 as a self-pay patient. Individual blood tests (glucose, cholesterol, liver, kidney) cost ฿1,500–฿3,000 as a walk-in." },
      { q: "What is the cheapest annual health check-up for digital nomads in Bangkok?", a: "The most cost-effective full check-up for a self-employed person in their 30s–40s: a standard package including CBC, metabolic panel, lipid panel, thyroid (TSH), liver, kidney, chest X-ray, and doctor consultation runs ฿3,000–฿5,000. For full annual check-up value, executive packages at ฿7,000–฿10,000 add ultrasound, ECG, and cancer markers. Most Bangkok private hospitals allow walk-in morning bookings — no advance appointment needed." },
      { q: "Are Vitamin D and thyroid tests recommended for digital nomads in Bangkok?", a: "Yes — both are worth testing annually. Vitamin D deficiency is surprisingly common in Bangkok digital nomads despite the tropical climate (many work indoors with air conditioning). Thyroid issues are also common in expats. Both tests cost ฿500–฿1,200 each as add-ons to any check-up package, or ฿300–฿600 as standalone walk-in tests." },
    ],
    relatedGuides: [
      { href: "/guide/health-checkup-expats-thailand", label: "Expat Health Check-Up Thailand Guide" },
      { href: "/guide/blood-test-price-bangkok", label: "All Blood Test Prices Bangkok" },
      { href: "/guide/vitamin-d-test-bangkok", label: "Vitamin D Test Bangkok" },
      { href: "/guide/executive-health-checkup-bangkok", label: "Executive Packages Guide" },
    ],
  },
  "japanese-health-checkup-bangkok": {
    title: "Japanese Health Check-Up Bangkok (人間ドック) — 日本語対応病院",
    h1: "Health Check-Up for Japanese Tourists in Bangkok",
    description: "Bangkok hospitals offering health check-up packages with Japanese interpreters, Ningen Dock packages, and Japan-standard health screening. Compare prices and inclusions.",
    filter: (p) => p.jci === 1 || ["Bumrungrad International Hospital", "Samitivej Hospital", "BNH Hospital", "Bangkok Hospital"].some(n => p.hospital_name.includes(n.split(" ")[0])),
    intro: "Bangkok is one of Asia's most popular medical tourism destinations for Japanese patients. Several Bangkok hospitals have dedicated Japanese-language departments with resident Japanese coordinators. Ningen Dock-equivalent packages (人間ドック) are available at Bumrungrad, BNH, and Samitivej starting from ฿8,000 — a fraction of the cost in Japan.",
    faqs: [
      { q: "Which Bangkok hospitals have Japanese interpreters for health check-ups?", a: "BNH Hospital has the longest history of serving Japanese patients with a dedicated Japanese desk. Samitivej Sukhumvit has full Japanese services. Bumrungrad has Japanese coordinators available. All charge ฿0–฿500 extra for Japanese interpreter service." },
      { q: "How much cheaper is a health check-up in Bangkok vs Japan?", a: "A Ningen Dock-equivalent package in Bangkok (฿8,000–฿20,000 / approximately ¥30,000–¥75,000) costs 50–70% less than the same package in Japan (typically ¥80,000–¥200,000). Travel and accommodation are additional, but the total saving is still significant for comprehensive packages." },
      { q: "What is included in a Bangkok health check-up equivalent to a Japanese Ningen Dock?", a: "The Thai executive package equivalent to Ningen Dock includes: blood panel (CBC, lipids, liver/kidney, diabetes, thyroid), urinalysis, stool test, chest X-ray, ECG, ultrasound (liver, gallbladder, kidney, spleen), and in some packages, gastroscopy or barium meal. Cancer marker panels are add-on options." },
    ],
    relatedGuides: [
      { href: "/guide/best-hospitals-japanese-tourists", label: "Japanese Tourists Guide (日本語)" },
      { href: "/guide/jci-hospitals-bangkok", label: "JCI-Accredited Hospitals Bangkok" },
    ],
  },
  "chinese-health-checkup-bangkok": {
    title: "曼谷体检推荐 2026 — Chinese Health Check-Up Bangkok (中文服务)",
    h1: "Bangkok Health Check-Up for Chinese-Speaking Visitors (中文体检指南)",
    description: "曼谷JCI认证医院体检套餐对比。中文服务，免签入境，比中国私立医院节省30–60%。Best Bangkok hospitals for mainland China, Hong Kong and Taiwan visitors.",
    filter: (p) => (p.jci === 1) || p.has_interpreter === 1,
    intro: "曼谷是中国大陆、香港和台湾游客热门的医疗旅游目的地。中国公民自2023年起可免签入境泰国30天。泰国康健医院（Vejthani）、康民国际（Bumrungrad）和三美泰（Samitivej）均设有中文服务部，提供中文体检报告。同等级体检套餐比上海、北京私立医院节省30–60%，加上飞行时间仅4–5小时，极具性价比。Bangkok hospitals below are JCI-accredited with documented interpreter services — best suited for Chinese-speaking medical tourists.",
    faqs: [
      { q: "中国公民去泰国体检需要签证吗？", a: "不需要。中国大陆公民自2023年12月起免签入境泰国，可停留30天。香港和澳门居民同样免签30天。台湾公民免签30天。" },
      { q: "曼谷医院体检结果是否有中文报告？", a: "Vejthani Hospital专门设有中文部，提供完整中文报告，通常需额外2–3个工作日。Bumrungrad等医院报告为英文，配有中文翻译协助解读。建议预约时提前说明需要中文服务。" },
      { q: "曼谷体检比中国贵还是便宜？", a: "同等级JCI认证医院的体检套餐，曼谷通常比中国主要城市私立医院便宜30–60%。例如，执行套餐曼谷约฿8,000–25,000（约人民币1,650–5,150元），而上海同等套餐通常需人民币8,000–30,000元。" },
    ],
    relatedGuides: [
      { href: "/guide/best-hospitals-chinese-speakers", label: "中文体检医院完整指南" },
      { href: "/guide/jci-hospitals-bangkok", label: "JCI-Accredited Hospitals Bangkok" },
      { href: "/guide/executive-health-checkup-bangkok", label: "Executive packages guide" },
    ],
  },
  "arabic-health-checkup-bangkok": {
    title: "Health Check-Up Bangkok for Arabic Speakers — أفضل مستشفيات بانكوك",
    h1: "Health Check-Up in Bangkok for Arabic Speakers",
    description: "Bangkok hospitals offering health check-up packages with Arabic interpreters and halal services. JCI-accredited hospitals popular with Middle Eastern medical tourists.",
    filter: (p) => (p.jci === 1) || p.has_interpreter === 1,
    intro: "Bangkok attracts a large number of medical tourists from the GCC (Saudi Arabia, UAE, Kuwait, Qatar, Bahrain, Oman) and other Arabic-speaking countries. Vejthani Hospital has the most comprehensive Arabic patient services, with a dedicated Arabic-speaking coordinator. Bumrungrad and Bangkok Hospital also serve Arabic-speaking patients with interpreter services.",
    faqs: [
      { q: "Which Bangkok hospitals have Arabic interpreters for health check-ups?", a: "Vejthani Hospital has the most established Arabic patient department with a resident Arabic coordinator. Bumrungrad International Hospital has Arabic interpreters available on request. Bangkok Hospital also accommodates Arabic-speaking patients." },
      { q: "Are halal food options available at Bangkok hospitals for check-up visits?", a: "Most Bangkok private hospitals, including Bumrungrad, Vejthani, and Bangkok Hospital, can provide halal meal options for inpatient stays. For outpatient health check-ups (half-day), meals are generally not provided, but staff can direct you to nearby halal restaurants." },
      { q: "Do Bangkok hospitals accept Saudi Aramco or DAMAN insurance?", a: "Some Bangkok hospitals accept specific GCC insurance plans, but this varies. Bumrungrad and Bangkok Hospital have the broadest international insurance acceptance. Contact the hospital's international patient office directly to verify your specific insurance plan." },
    ],
    relatedGuides: [
      { href: "/guide/best-hospitals-arabic-speakers", label: "Arabic Speakers Guide (أفضل مستشفيات)" },
      { href: "/guide/jci-hospitals-bangkok", label: "JCI-Accredited Hospitals Bangkok" },
    ],
  },
  "korean-health-checkup-bangkok": {
    title: "방콕 건강검진 한국어 가이드 — Korean Health Check-Up Bangkok 2026",
    h1: "Korean Health Check-Up in Bangkok (한국어 서비스)",
    description: "Bangkok hospitals with Korean-speaking staff for health check-ups. 한국어 상담 가능. Bumrungrad, Samitivej, Vejthani — compare packages for Korean tourists.",
    filter: (p) => p.jci === 1 || p.has_interpreter === 1,
    intro: "방콕은 한국 의료관광객이 가장 많이 찾는 해외 의료관광 목적지입니다. 범롱랏(Bumrungrad), 사미티벳(Samitivej), 벳타니(Vejthani) 병원은 모두 한국어 코디네이터를 두고 있으며, 한국식 건강검진 패키지를 제공합니다. 비용은 서울 강남 사립병원 대비 50–75% 저렴합니다. Bangkok is Thailand's leading medical tourism destination for Korean visitors — major hospitals have Korean-speaking staff and packages adapted to Korean 건강검진 standards.",
    faqs: [
      { q: "방콕 어느 병원에 한국어 통역이 있나요? (Which Bangkok hospitals have Korean interpreters?)", a: "범롱랏 국제병원(Bumrungrad International)에 한국어 통역 및 코디네이터가 40명 이상 있습니다. 사미티벳 수쿰빗(Samitivej Sukhumvit)에 한국건강센터(Korean Health Centre)가 있으며, 벳타니(Vejthani Hospital)에도 한국어 간호사가 있습니다. Bumrungrad International has 40+ Korean-speaking staff. Samitivej Sukhumvit has a dedicated Korean Health Centre. Vejthani Hospital has Korean-speaking nurses." },
      { q: "How much is a 건강검진 (health checkup) in Bangkok vs Seoul?", a: "A comprehensive 건강검진-equivalent package in Bangkok costs ฿8,000–฿18,000 (approximately 300,000–700,000원). An equivalent package at a Seoul private hospital or specialized checkup centre would cost 500,000–2,500,000원. Bangkok offers the same JCI-accredited quality at 50–75% below Seoul prices." },
      { q: "Do Korean insurance plans work at Bangkok hospitals?", a: "Korean national health insurance (건강보험) generally does not cover overseas treatment. However, some Korean travel insurance (해외여행보험) and international health insurance plans may reimburse medical costs in Thailand. Bumrungrad and Bangkok Hospital accept major international insurance for direct billing. Keep all receipts and official medical certificates for reimbursement claims." },
    ],
    relatedGuides: [
      { href: "/guide/best-hospitals-korean-tourists", label: "Korean Medical Tourists Guide (한국어)" },
      { href: "/guide/jci-hospitals-bangkok", label: "JCI-Accredited Hospitals Bangkok" },
    ],
  },
  "cancer-screening-bangkok": {
    title: "Cancer Screening Packages Bangkok — Compare Prices 2026",
    h1: "Cancer Screening Health Check-Up in Bangkok",
    description: "Compare cancer screening health check-up packages in Bangkok. Tumour markers, PET scan, low-dose CT lung cancer screening — find the right cancer check-up at Thai hospitals.",
    filter: (p) => p.has_cancer_marker === 1 || (p.category === "cancer"),
    intro: "Bangkok hospitals offer comprehensive cancer screening packages — from basic tumour marker blood tests (AFP, CEA, CA-125, PSA) to full PET/CT body scanning. Cancer marker panels start from ฿1,500 as add-ons and ฿5,000–฿15,000 as standalone packages. For full-body PET scan, budget ฿25,000–฿45,000 at JCI hospitals.",
    faqs: [
      { q: "What cancer markers are tested in Bangkok health check-up packages?", a: "Standard cancer marker panels include: AFP (liver cancer), CEA (colon/lung/breast), CA-125 (ovarian cancer), CA 19-9 (pancreatic cancer), and PSA (prostate cancer, men). Extended panels add CA 15-3 (breast), SCC (lung/cervical), Cyfra 21-1, and NSE. Beta-HCG may also be included." },
      { q: "How much does a cancer screening package cost in Bangkok?", a: "Basic cancer marker blood panel: ฿1,500–฿3,000 (add-on to any check-up). Comprehensive cancer marker package: ฿5,000–฿15,000. Low-dose CT lung cancer screening: ฿8,000–฿15,000. Full PET/CT body scan: ฿25,000–฿45,000. Combination cancer + executive package: ฿15,000–฿50,000." },
      { q: "Which Bangkok hospital is best for cancer screening?", a: "Bumrungrad International has the most comprehensive cancer screening programme including PET/CT. Bangkok Hospital's Cancer Centre offers specialised oncology-led screening. Vejthani Hospital offers competitive-priced JCI cancer marker packages. Wattanosoth Hospital specialises in cancer care." },
    ],
    relatedGuides: [
      { href: "/guide/cancer-screening-bangkok", label: "Cancer Screening Bangkok — Full Guide" },
      { href: "/guide/understanding-health-checkup-results", label: "Understanding cancer marker results" },
    ],
  },
  "womens-health-checkup-bangkok": {
    title: "Women's Health Check-Up Bangkok — Compare Prices 2026",
    h1: "Women's Health Check-Up Packages in Bangkok",
    description: "Compare women's health check-up packages in Bangkok. Pap smear, mammogram, pelvic ultrasound, bone density, HPV — comprehensive women's screening at private hospitals.",
    filter: (p) => p.category === "women" || (p.has_ultrasound === 1 && p.has_blood === 1),
    intro: "Bangkok private hospitals offer tailored women's health check-up packages including Pap smear (cervical cancer), mammogram, pelvic/breast ultrasound, bone density scan, hormone panel, and HPV testing. Samitivej Hospital is consistently ranked #1 for women's health in Bangkok. Packages are available from ฿2,500 for basic women's screening to ฿25,000 for comprehensive packages.",
    faqs: [
      { q: "What is included in a women's health check-up in Bangkok?", a: "A standard women's package (฿3,000–฿8,000) includes: blood panel, Pap smear (cervical cancer screen), pelvic ultrasound (uterus, ovaries), breast exam or breast ultrasound, and urinalysis. Executive women's packages (฿8,000–฿25,000) add mammogram, bone density, CA-125 (ovarian cancer marker), hormone panel (FSH, LH, estradiol), and thyroid." },
      { q: "How much does a Pap smear cost in Bangkok?", a: "Standalone Pap smear at a Bangkok private hospital: ฿500–฿1,500. As part of a women's package: included. As part of a standard check-up: often available as add-on for ฿500–฿800. Thin prep (liquid-based) Pap smear costs ฿800–฿1,500 and is more accurate." },
      { q: "Which Bangkok hospital is best for women's health check-ups?", a: "Samitivej Hospital Sukhumvit is consistently ranked best for women's health. Bumrungrad has the broadest women's package range. Bangkok Hospital Silom's Women's Centre is convenient for the Silom/Sathorn expat corridor. BNH Hospital is popular with European and Japanese expat women." },
    ],
    relatedGuides: [
      { href: "/guide/womens-health-checkup-bangkok", label: "Women's Health Check-Up Bangkok — Full Guide" },
      { href: "/guide/understanding-health-checkup-results", label: "Understanding your health check-up results" },
    ],
  },
  "budget-health-checkup-bangkok": {
    title: "Cheap Health Check-Up Bangkok Under ฿3,000 — Best Value 2026",
    h1: "Budget Health Check-Up in Bangkok (Under ฿3,000)",
    description: "Affordable health check-up packages in Bangkok under 3,000 baht. Government hospitals, community hospitals, and budget private hospital packages with real prices.",
    filter: (p) => p.price != null && parseFloat(p.price) < 3000,
    intro: "Bangkok has excellent health check-up options under ฿3,000 at government hospitals (Siriraj, Chulalongkorn, Ramathibodi) and budget private hospitals. The cheapest packages start from ฿900–฿1,200 for a basic blood panel plus urinalysis. A value comprehensive package with X-ray and CBC typically costs ฿1,800–฿2,800.",
    faqs: [
      { q: "What health check-ups can I get under ฿3,000 in Bangkok?", a: "Under ฿3,000: basic blood panel (CBC, glucose, lipids, liver/kidney), urinalysis, and sometimes chest X-ray. The ฿1,200–฿2,800 range covers the most common annual check-up tests that GPs recommend for adults under 40 with no health concerns." },
      { q: "Are cheap health check-ups in Bangkok still accurate?", a: "Government hospital labs (Siriraj, Chulalongkorn, Ramathibodi) and accredited private hospital labs are highly accurate — many are ISO 15189 certified. The same lab machines are used regardless of package price. The difference is in consultation time and additional imaging, not lab accuracy." },
      { q: "Can tourists get a cheap health check-up in Bangkok?", a: "Yes. Private hospitals welcome walk-in patients without a hospital ID or Thai insurance. Government hospitals are cheaper but have longer waiting times and less English support. Budget around ฿1,500–฿3,000 for a basic check-up at a community private hospital in Bangkok." },
    ],
    relatedGuides: [
      { href: "/guide/what-is-included-checkup", label: "What's included in a health check-up" },
      { href: "/guide/how-to-prepare-health-checkup-thailand", label: "How to prepare for your check-up" },
    ],
  },
  "executive-health-checkup-bangkok": {
    title: "Executive Health Check-Up Bangkok — Premium Packages 2026",
    h1: "Executive Health Check-Up Packages in Bangkok",
    description: "Compare executive and premium health check-up packages in Bangkok. Full body check-up with MRI, CT, cancer screening, cardiac assessment — prices from ฿8,000 to ฿50,000+.",
    filter: (p) => p.category === "executive" || p.category === "comprehensive" || (parseFloat(p.price ?? "0") >= 8000),
    intro: "Bangkok's executive health check-up packages are among the most comprehensive and best-priced in Asia. A full executive package at a JCI hospital in Bangkok (including CT, MRI, cancer markers, cardiac assessment, and specialist consultation) typically costs ฿15,000–฿35,000 — compared to US$3,000–US$8,000 for equivalent programmes in the US, UK, or Singapore.",
    faqs: [
      { q: "What is included in an executive health check-up in Bangkok?", a: "A Bangkok executive package (฿15,000–฿35,000) typically includes: full blood panel (30+ tests), chest X-ray, abdominal ultrasound, ECG, treadmill stress test, cancer markers (CEA, CA-125, PSA), CT scan (chest/abdomen/pelvis or coronary calcium scoring), specialist consultations, and same-day results with doctor review." },
      { q: "How long does an executive health check-up take in Bangkok?", a: "A full executive package typically takes 4–6 hours at the hospital. Most hospitals have dedicated executive health check-up lounges where you complete all tests in one visit, with a doctor consultation at the end to review results. Some premium packages spread over 2 visits." },
      { q: "How much does an executive health check-up cost in Bangkok vs Singapore?", a: "Bangkok executive package: ฿15,000–฿35,000 (approximately SGD 600–1,400). Singapore executive package: SGD 1,500–SGD 4,000 (approximately ฿40,000–฿110,000). Bangkok is 60–75% cheaper for equivalent JCI-standard executive programmes." },
    ],
    relatedGuides: [
      { href: "/guide/executive-health-checkup-bangkok", label: "Executive Health Check-Up — Full Guide" },
      { href: "/guide/jci-hospitals-bangkok", label: "JCI-Accredited Hospitals Bangkok" },
      { href: "/guide/understanding-health-checkup-results", label: "Understanding your results" },
    ],
  },
  "health-checkup-tourists-thailand": {
    title: "Health Check-Up for Tourists in Thailand — Quick Guide 2026",
    h1: "Health Check-Up for Tourists Visiting Thailand",
    description: "Can tourists get a health check-up in Thailand? Yes. Walk-in health check-ups at private hospitals across Bangkok, Phuket, Chiang Mai and Pattaya — same-day results, no appointment needed.",
    filter: (p) => p.has_blood === 1 && p.results_days != null && p.results_days <= 1,
    intro: "You don't need to be a Thai resident to get a health check-up in Thailand. Private hospitals across the country welcome walk-in medical tourists. Many visitors combine a holiday in Bangkok, Phuket, or Chiang Mai with a health check-up — saving 50–75% compared to prices in their home country.",
    faqs: [
      { q: "Can I get a health check-up without an appointment in Thailand?", a: "Yes. Most private hospitals in Bangkok, Phuket, and Chiang Mai accept walk-in patients for health check-ups, though morning appointments (7–8am) are recommended to complete fasting blood tests. Some hospitals have dedicated health check-up centres that can process walk-ins on the same day." },
      { q: "Do I need to fast before a health check-up in Thailand?", a: "Yes — fast for 8–12 hours before your appointment (water is fine). This is required for fasting blood glucose and lipid panel tests. Schedule your check-up for morning and skip breakfast. The hospital will provide a meal voucher after your fasting tests are complete." },
      { q: "How do I get my health check-up results back home after leaving Thailand?", a: "Most Bangkok private hospitals can email results as a PDF within 24–48 hours. Ask for a printed and stamped copy before you leave the hospital — this is standard practice for medical tourists. Bumrungrad and Samitivej have online patient portals where you can access results from anywhere." },
    ],
    relatedGuides: [
      { href: "/guide/how-to-prepare-health-checkup-thailand", label: "How to prepare for your check-up" },
      { href: "/guide/understanding-health-checkup-results", label: "Understanding your results" },
      { href: "/guide/health-checkup-expats-thailand", label: "Expat health check-up guide" },
    ],
  },

  "cardiac-health-checkup-bangkok": {
    title: "Cardiac Health Check-Up Bangkok — Heart Screening 2026",
    h1: "Cardiac Health Check-Up in Bangkok",
    description: "Compare cardiac health check-up packages at Bangkok hospitals. ECG, echocardiogram, treadmill stress test, coronary CT angiography. Prices from ฿3,500 at JCI hospitals.",
    filter: (p) => p.has_ecg === 1 || p.category === "cardiac",
    intro: "Bangkok's private hospitals offer some of the best cardiac health screening facilities in Asia, with modern imaging technology including 128-slice CT scanners, 3T MRI, and digital echocardiography. Cardiac health check-ups in Bangkok cost 30–60% less than equivalent screening in the US, UK, or Singapore — without the long waiting times.",
    faqs: [
      { q: "What is included in a cardiac health check-up in Bangkok?", a: "A basic cardiac screen (฿3,500–฿8,000) includes ECG, blood pressure, lipid panel (cholesterol), blood glucose, and doctor consultation. A comprehensive cardiac package (฿12,000–฿30,000) adds echocardiogram, treadmill exercise stress test, coronary calcium score (CT), and specialist cardiologist review. Advanced packages include coronary CT angiography (CCTA) for direct visualisation of coronary artery blockage." },
      { q: "Which Bangkok hospital is best for cardiac health screening?", a: "Bangkok Hospital (BDMS) Heart Centre and Samitivej Hospital Heart Centre are the most specialised. Bumrungrad International Hospital Cardiology has the broadest service range. All three have 128-slice CT scanners for coronary calcium scoring and coronary CTA. Pricing is highest at Bumrungrad and most competitive at Vejthani." },
      { q: "Do I need a referral for cardiac screening in Bangkok?", a: "No referral is required at Bangkok private hospitals. Walk in and request a cardiac check-up directly. The hospital will have a nurse measure your BP and BMI, then an internist or cardiologist will order the appropriate tests based on your risk factors. For very specific tests like coronary CTA, a brief consultation first is standard practice." },
    ],
    relatedGuides: [
      { href: "/guide/cardiac-health-checkup-bangkok", label: "Cardiac Health Check-Up Guide" },
      { href: "/guide/heart-screening-thailand", label: "Heart Screening Thailand" },
    ],
  },

  "comprehensive-health-checkup-bangkok": {
    title: "Full Body Health Check-Up Bangkok — Compare Prices 2026",
    h1: "Comprehensive Health Check-Up in Bangkok",
    description: "Compare comprehensive health check-up packages in Bangkok. Full body blood tests, abdominal ultrasound, chest X-ray, ECG, and more. Best packages ranked by value.",
    filter: (p) => p.category === "comprehensive" || (p.has_blood === 1 && p.has_ultrasound === 1 && p.has_xray === 1),
    intro: "A comprehensive health check-up in Bangkok covers every major body system in a single appointment: full blood panel, chest X-ray, abdominal ultrasound, ECG, thyroid, hepatitis, urinalysis, and a physician consultation. Bangkok hospitals offer the same scope of tests as hospitals in Singapore, Australia, or the UK — at 40–70% lower prices.",
    faqs: [
      { q: "What is the difference between a basic and comprehensive health check-up in Bangkok?", a: "A basic package (฿1,500–฿3,500) covers blood count, blood sugar, cholesterol, and urinalysis. A comprehensive package (฿4,000–฿12,000) adds chest X-ray, abdominal ultrasound, ECG, thyroid function, Hepatitis B/C, liver enzymes, and kidney function — giving you a complete picture of your health in one visit." },
      { q: "How long does a comprehensive health check-up take in Bangkok?", a: "A comprehensive check-up in Bangkok typically takes 3–4 hours. This includes blood draw (30 min), imaging (1 hour), ECG (15 min), and a physician consultation to review results (30–45 min). Some hospitals provide lunch between the tests and the consultation." },
      { q: "Can I compare comprehensive packages by what tests are included?", a: "Yes — use our compare tool with the 'Comprehensive' filter. You can see exactly which hospitals include ultrasound, ECG, cancer markers, and doctor consultation as part of their comprehensive package. Look for the ✓ Included markers on each package card." },
    ],
    relatedGuides: [
      { href: "/guide/what-is-included-checkup", label: "What's included in a health check-up" },
      { href: "/guide/bangkok-health-checkup", label: "Bangkok Health Check-Up Guide" },
      { href: "/guide/understanding-health-checkup-results", label: "Understanding your results" },
    ],
  },

  "senior-health-checkup-bangkok": {
    title: "Senior Health Check-Up Bangkok — Best Packages for 60+ (2026)",
    h1: "Senior Health Check-Up in Bangkok",
    description: "Compare senior health check-up packages in Bangkok for adults 60 and over. Includes bone density, cardiac, cognitive, and cancer screening. Packages from ฿3,500.",
    filter: (p) => p.category === "senior" || p.category === "comprehensive" || p.category === "executive",
    intro: "Bangkok's private hospitals offer dedicated senior health programmes with age-appropriate screening: bone density (DEXA), cardiac risk assessment, colorectal cancer screening, cognitive function testing, and hormone panels. Packages for adults over 60 range from ฿3,500 for a focused senior screen to ฿40,000 for an executive package with full imaging. JCI-accredited hospitals such as Bumrungrad and Samitivej have geriatric specialists on-site.",
    faqs: [
      { q: "What tests are included in a senior health check-up in Bangkok?", a: "A senior package at Bangkok private hospitals typically includes: complete blood panel (CBC, lipid, glucose, kidney/liver function), thyroid, Vitamin D, full urinalysis, ECG, chest X-ray, abdominal ultrasound, bone density scan (DEXA), and a physician consultation. Higher-tier packages add colonoscopy, cognitive assessment (Mini-Mental State Exam), echocardiogram, and cancer tumour markers." },
      { q: "Which Bangkok hospital is best for senior health check-ups?", a: "Bumrungrad International Hospital has a dedicated Geriatric & Senior Health Centre with specialist geriatricians. Samitivej Sukhumvit and Bangkok Hospital offer Senior Wellness programmes with tailored packages. For seniors concerned about bone density, Vejthani Hospital has competitive DEXA scan pricing (around ฿2,500)." },
      { q: "How often should seniors get a health check-up in Bangkok?", a: "Most geriatric specialists recommend a comprehensive check-up every 12 months for adults over 60, and every 6 months for those over 70 or with pre-existing conditions. Colonoscopy is recommended every 5–10 years from age 45, or sooner if symptoms exist." },
    ],
    relatedGuides: [
      { href: "/guide/senior-health-checkup-thailand", label: "Senior Health Check-Up Guide (60+)" },
      { href: "/guide/understanding-health-checkup-results", label: "Understanding your results" },
    ],
  },

  "diabetes-screening-bangkok": {
    title: "Diabetes Screening Bangkok — Blood Sugar Test Prices 2026",
    h1: "Diabetes Screening in Bangkok",
    description: "Compare diabetes screening and blood sugar test packages in Bangkok. Fasting glucose, HbA1c, insulin resistance panels. From ฿500 at private hospitals. Same-day results.",
    filter: (p) => p.category === "diabetes" || p.has_blood === 1,
    intro: "Bangkok private hospitals offer rapid diabetes screening with same-day results. A basic diabetes screen (fasting blood glucose + HbA1c) costs ฿500–฿1,500 and gives you a complete picture of short-term and 3-month average blood sugar levels. More comprehensive metabolic panels include fasting insulin, C-peptide, microalbumin, and kidney function — important for pre-diabetics or those managing Type 2 diabetes.",
    faqs: [
      { q: "What diabetes tests can I get in Bangkok?", a: "Bangkok private hospitals offer: fasting blood glucose (฿100–฿300), HbA1c (฿300–฿600), fasting insulin (฿500–฿800), OGTT — oral glucose tolerance test (฿600–฿1,200), C-peptide, microalbumin (for kidney monitoring), and full diabetic panels (฿1,500–฿3,500) that include kidney and eye screening." },
      { q: "Do I need to fast for a diabetes blood test in Bangkok?", a: "Yes, fasting for 8–12 hours is required for fasting blood glucose and most HbA1c tests. Drink only water. HbA1c measures average blood sugar over 3 months and is more reliable than a single fasting glucose reading. Plan to arrive at the hospital in the morning before eating." },
      { q: "Can I walk in for a diabetes test in Bangkok without an appointment?", a: "Yes, most private hospitals in Bangkok accept walk-in blood tests. Go to the laboratory or check-up department, request the test, and results are typically ready within 2–4 hours. A nurse or doctor can also review results the same day. Hospitals like Bumrungrad, Samitivej, and Bangkok Hospital all offer walk-in blood testing." },
    ],
    relatedGuides: [
      { href: "/guide/diabetes-screening-thailand", label: "Diabetes Screening Thailand — Full Guide" },
      { href: "/guide/understanding-health-checkup-results", label: "Understanding blood glucose results" },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(SEGMENTS).map((slug) => ({ slug }));
}

// SEGMENTS is the complete param space — unknown slugs 404 at the router
// without a function invocation or ISR write.
export const dynamicParams = false;

const BASE = "https://www.bangkoktopclinic.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const seg = SEGMENTS[slug];
  if (!seg) return { title: "Health Check-Up Thailand" };
  return {
    title: seg.title,
    description: seg.description,
    keywords: seg.h1.split(" "),
    alternates: {
      canonical: `${BASE}/${locale}/for/${slug}`,
      languages: hreflangMap(`/for/${slug}`),
    },
  };
}

export default async function LongtailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const loc = locale as Locale;
  const seg = SEGMENTS[slug];

  if (!seg) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-800 mb-3">Page not found</h1>
        <Link href={`/${locale}`} className="text-blue-600 hover:underline">← Back to home</Link>
      </div>
    );
  }

  // Unguarded on purpose: an empty listing cached as a 200 is worse than a
  // 500. See hospital/[slug]/page.tsx.
  const allRows: PackageRow[] = await getAllPackages();

  const rows = allRows.filter(seg.filter);
  const prices = rows.map((r) => parseFloat(r.price ?? "0")).filter(Boolean);
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const hospitals = new Set(rows.map((r) => r.hospital_slug)).size;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-slate-400 mb-6 flex items-center gap-2 flex-wrap">
        <Link href={`/${locale}`} className="hover:text-blue-600">Home</Link>
        <span>›</span>
        <Link href={`/${locale}/guide`} className="hover:text-blue-600">Guide</Link>
        <span>›</span>
        <span className="text-slate-600 truncate">{seg.h1}</span>
      </nav>

      {/* Hero */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">{seg.h1}</h1>
        <p className="text-slate-600 text-lg max-w-3xl mb-4">{seg.description}</p>
        <div className="flex flex-wrap gap-4 mt-5">
          <div className="bg-blue-50 rounded-xl px-4 py-3 text-center">
            <p className="text-2xl font-bold text-blue-700">{hospitals}</p>
            <p className="text-xs text-blue-500 font-medium">Hospitals</p>
          </div>
          <div className="bg-emerald-50 rounded-xl px-4 py-3 text-center">
            <p className="text-2xl font-bold text-emerald-700">{rows.length}</p>
            <p className="text-xs text-emerald-500 font-medium">Packages</p>
          </div>
          {minPrice > 0 && (
            <div className="bg-amber-50 rounded-xl px-4 py-3 text-center">
              <p className="text-2xl font-bold text-amber-700">฿{minPrice.toLocaleString()}</p>
              <p className="text-xs text-amber-500 font-medium">From</p>
            </div>
          )}
        </div>
      </div>

      {/* Intro text */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-8">
        <p className="text-slate-700 leading-relaxed text-sm">{seg.intro}</p>
      </div>

      {/* Package grid */}
      {rows.length > 0 ? (
        <FilteredPackageGrid rows={rows} loc={loc} />
      ) : (
        <div className="text-center py-16 text-slate-400">
          <p className="text-4xl mb-3">🏥</p>
          <p>No packages match this filter yet — check back soon.</p>
        </div>
      )}

      {/* FAQ */}
      <div className="mt-12 space-y-4">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Frequently Asked Questions</h2>
        {seg.faqs.map((faq, i) => (
          <details key={i} className="bg-white border border-slate-200 rounded-xl group">
            <summary className="p-5 font-semibold text-slate-800 cursor-pointer flex items-center justify-between gap-3">
              <span>{faq.q}</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform shrink-0">▼</span>
            </summary>
            <div className="px-5 pb-5 text-slate-600 text-sm leading-relaxed">{faq.a}</div>
          </details>
        ))}
      </div>

      {/* Related guides */}
      {seg.relatedGuides && seg.relatedGuides.length > 0 && (
        <div className="mt-10 mb-6">
          <h2 className="text-base font-semibold text-slate-600 mb-3">Related guides</h2>
          <div className="flex flex-wrap gap-3">
            {seg.relatedGuides.map((g) => (
              <Link key={g.href} href={`/${locale}${g.href}`}
                className="bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-blue-300 hover:text-blue-700 transition-colors">
                {g.label} →
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="mt-10 bg-blue-700 rounded-2xl p-8 text-center text-white">
        <h2 className="text-xl font-bold mb-2">Not sure which package to pick?</h2>
        <p className="text-blue-200 text-sm mb-5 max-w-md mx-auto">
          Tell us your requirements — age, concerns, budget, city — and we'll match you to the right package.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href={`/${locale}/enquiry`}
            className="bg-white text-blue-700 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors">
            Get free advice →
          </Link>
          <Link href={`/${locale}/compare`}
            className="border-2 border-white/40 text-white font-semibold px-6 py-3 rounded-xl hover:border-white transition-colors">
            Browse all packages
          </Link>
        </div>
      </div>

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/${locale}` },
          { "@type": "ListItem", position: 2, name: seg.h1, item: `${BASE}/${locale}/for/${slug}` },
        ],
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: seg.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      }) }} />
    </div>
  );
}
