import type { Metadata } from "next";
import Link from "next/link";
import { type Locale, LOCALES } from "@/lib/i18n";

export const revalidate = 86400;

const BASE = "https://www.bangkoktopclinic.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  void locale;
  return {
    title: "Health Check-Up Guides — Thailand Medical Tourism",
    description: "Expert guides to health check-ups in Thailand. Bangkok, Chiang Mai, Phuket, senior health, expat health, cancer screening, JCI hospitals and more.",
    alternates: {
      canonical: `${BASE}/en/guide`,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `${BASE}/${l}/guide`])),
    },
  };
}

const GUIDES = [
  {
    slug: "bangkok-health-checkup",
    title: "Bangkok Health Check-Up Guide (2026)",
    description: "Complete guide to getting a health check-up in Bangkok: costs, best hospitals, what's included, how to book.",
    emoji: "🏙️",
    category: "City Guides",
  },
  {
    slug: "chiang-mai-health-checkup",
    title: "Chiang Mai Health Check-Up Guide (2026)",
    description: "Health check-up hospitals, prices and tips for Chiang Mai. 20–40% cheaper than Bangkok.",
    emoji: "🌸",
    category: "City Guides",
  },
  {
    slug: "phuket-health-checkup",
    title: "Phuket Health Check-Up Guide (2026)",
    description: "Combine your island holiday with a health check-up. Best hospitals in Phuket, prices from ฿1,900.",
    emoji: "🏝️",
    category: "City Guides",
  },
  {
    slug: "pattaya-health-checkup",
    title: "Pattaya Health Check-Up Guide (2026)",
    description: "Bangkok-quality care at lower prices. Best hospitals and packages in Pattaya.",
    emoji: "🌴",
    category: "City Guides",
  },
  {
    slug: "hua-hin-health-checkup",
    title: "Hua Hin Health Check-Up Guide (2026)",
    description: "Top choice for expat retirees. Annual health screening in a relaxed beach setting.",
    emoji: "🏖️",
    category: "City Guides",
  },
  {
    slug: "jci-hospitals-bangkok",
    title: "JCI-Accredited Hospitals in Bangkok (2026)",
    description: "All Joint Commission International accredited hospitals in Bangkok with packages and prices.",
    emoji: "🏅",
    category: "Hospital Guides",
  },
  {
    slug: "what-is-included-checkup",
    title: "What Is Included in a Health Check-Up?",
    description: "Full breakdown of blood tests, imaging, and specialist consultations in Thai hospital packages.",
    emoji: "🔬",
    category: "Understanding Your Check-Up",
  },
  {
    slug: "cancer-screening-bangkok",
    title: "Cancer Screening in Bangkok — Costs & Best Hospitals",
    description: "Which cancer markers, imaging, and screening tests are available in Bangkok and what they cost.",
    emoji: "🩺",
    category: "Specialist Screening",
  },
  {
    slug: "womens-health-checkup-bangkok",
    title: "Women's Health Check-Up in Bangkok",
    description: "Pap smear, mammogram, hormonal panels, and women's executive packages in Bangkok.",
    emoji: "💜",
    category: "Specialist Screening",
  },
  {
    slug: "cardiac-health-checkup-bangkok",
    title: "Cardiac Health Check-Up in Bangkok",
    description: "ECG, stress test, echocardiogram, coronary CT — what's included and which hospitals are best.",
    emoji: "❤️",
    category: "Specialist Screening",
  },
  {
    slug: "senior-health-checkup-thailand",
    title: "Senior Health Check-Up in Thailand (60+)",
    description: "Age-appropriate tests for seniors: bone density, cognitive screening, prostate/ovarian health.",
    emoji: "👴",
    category: "By Age & Lifestyle",
  },
  {
    slug: "health-checkup-expats-thailand",
    title: "Health Check-Up for Expats in Thailand",
    description: "Annual health screening guide for expats: which tests, which hospitals, insurance, and how to set up regular care.",
    emoji: "🌍",
    category: "By Age & Lifestyle",
  },
  {
    slug: "diabetes-screening-thailand",
    title: "Diabetes & Blood Sugar Screening in Thailand",
    description: "HbA1c, OGTT, fasting glucose — complete diabetes screening guide. Prices from ฿3,500.",
    emoji: "🩸",
    category: "Specialist Screening",
  },
  {
    slug: "heart-screening-thailand",
    title: "Heart & Cardiac Screening in Thailand",
    description: "ECG, echocardiogram, treadmill stress test — full cardiac check guide. From ฿8,000.",
    emoji: "🫀",
    category: "Specialist Screening",
  },
  {
    slug: "hat-yai-health-checkup",
    title: "Hat Yai Health Check-Up Guide (2026)",
    description: "For Malaysian and Singaporean medical tourists. 30–60% below Malaysian hospital prices.",
    emoji: "🇹🇭",
    category: "City Guides",
  },
  {
    slug: "koh-samui-health-checkup",
    title: "Koh Samui Health Check-Up Guide (2026)",
    description: "Two international hospitals on the island. Get screened during your holiday.",
    emoji: "🏝️",
    category: "City Guides",
  },
  {
    slug: "khon-kaen-health-checkup",
    title: "Khon Kaen Health Check-Up Guide (2026)",
    description: "Isan's medical hub. Quality check-ups 20–40% cheaper than Bangkok.",
    emoji: "🌿",
    category: "City Guides",
  },
  {
    slug: "korat-health-checkup",
    title: "Korat Health Check-Up Guide (2026)",
    description: "Northeast Thailand's largest city. Good for Khao Yai visitors and industrial zone workers.",
    emoji: "🏭",
    category: "City Guides",
  },
  {
    slug: "krabi-health-checkup",
    title: "Krabi Health Check-Up Guide (2026)",
    description: "Andaman coast hub. Private hospitals in Krabi town near the pier and island gateway.",
    emoji: "⛰️",
    category: "City Guides",
  },
  {
    slug: "udon-thani-health-checkup",
    title: "Udon Thani Health Check-Up Guide (2026)",
    description: "Isan's second city. Popular with expats from the US and Europe. Competitive prices 30–45% below Bangkok.",
    emoji: "🏯",
    category: "City Guides",
  },
  {
    slug: "rayong-health-checkup",
    title: "Rayong Health Check-Up Guide (2026)",
    description: "Eastern Seaboard industrial hub. Bangkok Hospital Rayong + 3 other options. Prices from ฿1,500.",
    emoji: "🏭",
    category: "City Guides",
  },
  {
    slug: "surat-thani-health-checkup",
    title: "Surat Thani Health Check-Up Guide (2026)",
    description: "Gateway to Koh Samui. Get screened before catching the ferry. Prices from ฿1,300.",
    emoji: "🍜",
    category: "City Guides",
  },
  {
    slug: "phitsanulok-health-checkup",
    title: "Phitsanulok Health Check-Up Guide (2026)",
    description: "Lower North Thailand hub. 30–40% below Bangkok prices. Serves Phrae, Nan, Uttaradit.",
    emoji: "⚔️",
    category: "City Guides",
  },
  {
    slug: "trang-health-checkup",
    title: "Trang Health Check-Up Guide (2026)",
    description: "Andaman coast gem. Affordable care. Good for Trang island hopping itineraries.",
    emoji: "🦞",
    category: "City Guides",
  },
  {
    slug: "medical-visa-thailand",
    title: "Medical Visa for Thailand (2026)",
    description: "Do you need a visa for a health check-up? Tourist visa vs medical visa explained.",
    emoji: "🛂",
    category: "Practical Guides",
  },
  {
    slug: "health-insurance-thailand",
    title: "Health Insurance for Thailand",
    description: "Which insurers cover Thai hospitals? AXA, Cigna, BUPA compared. Direct billing explained.",
    emoji: "🏥",
    category: "Practical Guides",
  },
  {
    slug: "how-to-prepare-health-checkup-thailand",
    title: "How to Prepare for a Thai Health Check-Up",
    description: "Fasting, what to bring, what to avoid — complete preparation checklist.",
    emoji: "📋",
    category: "Practical Guides",
  },
  {
    slug: "best-hospitals-japanese-tourists",
    title: "Best Hospitals for Japanese Tourists (2026)",
    description: "日本語対応. Japanese coordinators, ningen dock packages, gastroscopy in Bangkok.",
    emoji: "🇯🇵",
    category: "By Nationality",
  },
  {
    slug: "best-hospitals-arabic-speakers",
    title: "Best Hospitals for Arabic-Speaking Patients (2026)",
    description: "Arabic staff, Halal food, prayer rooms. GCC and Middle East visitors' guide.",
    emoji: "🌙",
    category: "By Nationality",
  },
  {
    slug: "best-hospitals-chinese-speakers",
    title: "曼谷最佳体检医院 — Best Hospitals for Chinese Speakers",
    description: "中文服务体检医院推荐。免签入境，比中国私立医院省30–60%。Mandarin-speaking coordinators.",
    emoji: "🇨🇳",
    category: "By Nationality",
  },
  {
    slug: "best-hospitals-korean-tourists",
    title: "Best Hospitals for Korean Tourists in Bangkok (2026)",
    description: "한국어 가이드. Korean coordinators, 건강검진-style packages, gastroscopy, cancer markers in Bangkok.",
    emoji: "🇰🇷",
    category: "By Nationality",
  },
  {
    slug: "thailand-vs-singapore-health-checkup",
    title: "Thailand vs Singapore Health Check-Up — Price Comparison 2026",
    description: "Bangkok hospitals vs Singapore: prices, quality, JCI status, language coverage. Bangkok is 50–70% cheaper.",
    emoji: "⚖️",
    category: "Practical Guides",
  },
  {
    slug: "health-checkup-cost-australia-vs-thailand",
    title: "Australia vs Thailand Health Check-Up Cost (2026)",
    description: "Bangkok hospitals are 60–80% cheaper than Australian private clinics for the same JCI-accredited quality. How much Australians save.",
    emoji: "🦘",
    category: "Practical Guides",
  },
  {
    slug: "health-checkup-canada-vs-thailand",
    title: "Canada vs Thailand Health Check-Up (2026) — Beating the Wait List",
    description: "Canada's public system means months of waiting for MRI, specialist, or comprehensive screening. Bangkok: same-day results at 70–85% lower cost.",
    emoji: "🍁",
    category: "Practical Guides",
  },
  {
    slug: "health-checkup-germany-vs-thailand",
    title: "Deutschland vs Thailand Gesundheitscheck (2026) — Bangkok für Deutsche",
    description: "GKV Gesundheitscheck alle 3 Jahre reicht nicht. Bangkok bietet Executive-Check ohne Wartezeit zu 60–75% niedrigeren Kosten als IGeL-Preise in Deutschland.",
    emoji: "🇩🇪",
    category: "Practical Guides",
  },
  {
    slug: "health-checkup-france-vs-thailand",
    title: "Bilan de santé France vs Thaïlande 2026 — Bangkok pour les Français",
    description: "Bilan Sécu tous les 10 ans. Bangkok : bilan complet sans attente, résultats le jour même, 60–75% moins cher qu'une clinique privée française.",
    emoji: "🇫🇷",
    category: "Practical Guides",
  },
  {
    slug: "health-checkup-russia-vs-thailand",
    title: "Медицинское обследование: Россия vs Таиланд 2026 — для россиян",
    description: "Чекап в Бангкоке: JCI-больницы, результаты в тот же день, в 3–5 раз дешевле московских частных клиник. Пхукет, Паттайя, Бангкок.",
    emoji: "🇷🇺",
    category: "Practical Guides",
  },
  {
    slug: "health-checkup-india-vs-thailand",
    title: "India vs Thailand Health Check-Up (2026) — Bangkok for Indian Patients",
    description: "Bangkok JCI hospitals: 30–60% cheaper than Apollo/Fortis/Max. Same-day results. Hindi assistance available. Visa on Arrival for Indians.",
    emoji: "🇮🇳",
    category: "Practical Guides",
  },
  {
    slug: "health-checkup-indonesia-vs-thailand",
    title: "Indonesia vs Thailand Health Check-Up (2026) — Bangkok untuk Orang Indonesia",
    description: "MCU di Bangkok vs Jakarta: 40–60% lebih murah, hasil hari yang sama, JCI accredited. Panduan untuk WNI yang ingin cek kesehatan di Thailand.",
    emoji: "🇮🇩",
    category: "Practical Guides",
  },
  {
    slug: "thyroid-screening-bangkok",
    title: "Thyroid Screening in Bangkok — TSH, T3, T4 Costs & What They Mean",
    description: "Thyroid test prices in Bangkok: TSH ฿300–600, full panel ฿800–2,500, ultrasound ฿1,500–4,000. Included in most executive packages. Same-day results.",
    emoji: "🦋",
    category: "Specialist Screening",
  },
  {
    slug: "health-checkup-day-bangkok",
    title: "What to Expect on Health Check-Up Day in Bangkok — Step-by-Step",
    description: "Step-by-step walkthrough of a Bangkok hospital health check-up morning: registration, blood draw, ECG, ultrasound, results, doctor consultation — all in 3–5 hours.",
    emoji: "🏥",
    category: "Understanding Your Check-Up",
  },
  {
    slug: "health-checkup-switzerland-vs-thailand",
    title: "Switzerland vs Thailand Health Check-Up 2026 — Bangkok für Schweizer",
    description: "Swiss Vorsorgeuntersuchung costs CHF 500–3,500. Bangkok JCI hospitals: same scope at 70–85% lower cost. Visa-free 30 days. No waiting.",
    emoji: "🇨🇭",
    category: "Practical Guides",
  },
  {
    slug: "health-checkup-netherlands-vs-thailand",
    title: "Netherlands vs Thailand Health Check-Up 2026 — Bangkok voor Nederlanders",
    description: "Dutch basisverzekering barely covers preventive checks. Bangkok JCI hospitals offer the same comprehensive Gezondheidscheck at 70–80% lower cost. Visa-free 60 days.",
    emoji: "🇳🇱",
    category: "Practical Guides",
  },
  {
    slug: "health-checkup-south-korea-vs-thailand",
    title: "한국 vs 태국 건강검진 2026 — Bangkok Health Check-Up for Koreans",
    description: "방콕 JCI 인증 병원에서 한국 프리미엄 건강검진 대비 40–60% 절약. 한국어 코디네이터, 당일 결과. Executive packages ฿8,000–฿30,000.",
    emoji: "🇰🇷",
    category: "By Nationality",
  },
  {
    slug: "health-checkup-uae-vs-thailand",
    title: "UAE / Dubai vs Thailand Health Check-Up 2026 — Bangkok for Gulf Patients",
    description: "Dubai private hospital check-ups cost AED 3,000–12,000. Bangkok JCI hospitals: same scope 60–75% cheaper. Arabic services, halal food. Direct flight 7h.",
    emoji: "🇦🇪",
    category: "Practical Guides",
  },
  {
    slug: "health-checkup-scandinavia-vs-thailand",
    title: "Scandinavia vs Thailand Health Check-Up 2026 — Nordic Patients Bangkok",
    description: "Sweden, Norway, Denmark: free universal care with long waits. Bangkok JCI hospitals offer same-day executive check-ups at 70–80% below Nordic private clinic prices.",
    emoji: "🇸🇪",
    category: "Practical Guides",
  },
  {
    slug: "vitamin-d-test-bangkok",
    title: "Vitamin D Test Bangkok — Price, Results & Treatment (2026)",
    description: "Vitamin D (25-OH) test price in Bangkok: ฿500–฿1,200 standalone. 60–80% of Bangkok expats test deficient despite tropical climate. Same-day results.",
    emoji: "☀️",
    category: "Specialist Screening",
  },
  {
    slug: "psa-test-bangkok",
    title: "PSA Test Bangkok — Prostate Cancer Screening Cost & Results (2026)",
    description: "PSA test price in Bangkok: ฿400–฿900 standalone, included in men's health packages from age 45+. Same-day results, urologist referral same day if needed.",
    emoji: "🔬",
    category: "Specialist Screening",
  },
  {
    slug: "hepatitis-test-bangkok",
    title: "Hepatitis B & C Test Bangkok — Prices, Results & What To Do (2026)",
    description: "Hepatitis B (HBsAg) ฿300–฿600, Hepatitis C (Anti-HCV) ฿300–฿600, combined panel ฿500–฿1,200. Included in executive packages. Vaccination available. HCV treatment from USD 200.",
    emoji: "🧫",
    category: "Specialist Screening",
  },
  {
    slug: "fertility-test-bangkok",
    title: "Fertility Test Bangkok — AMH, Hormone Panel, Sperm Analysis Prices (2026)",
    description: "AMH ฿1,500–฿2,500, Day-3 hormone panel ฿1,500–฿3,000, sperm analysis ฿1,000–฿2,500. Full fertility work-up at JCI hospitals. 60–80% cheaper than US or UK.",
    emoji: "🌱",
    category: "Specialist Screening",
  },
  {
    slug: "sti-hiv-test-bangkok",
    title: "STI & HIV Test Bangkok — Confidential Testing Prices & Clinics (2026)",
    description: "HIV test Bangkok: 4th-gen Ag/Ab ฿800–฿1,800, RNA PCR ฿2,000–฿4,000. Full STI panel ฿3,000–฿8,000. Same-day results. No referral. Thai Red Cross, PULSE Clinic, BNH, Bumrungrad.",
    emoji: "🔴",
    category: "Specialist Screening",
  },
  {
    slug: "h-pylori-test-bangkok",
    title: "H. pylori Test Bangkok — Breath Test, Stool Antigen & Eradication (2026)",
    description: "Urea breath test ฿800–฿1,800, stool antigen ฿600–฿1,200, biopsy CLO add-on ฿500–฿1,500. Eradication triple therapy ฿1,200–฿2,500. Walk-in, same-day results.",
    emoji: "🦠",
    category: "Specialist Screening",
  },
  {
    slug: "bone-density-dexa-scan-bangkok",
    title: "Bone Density DEXA Scan Bangkok — Osteoporosis Test Prices (2026)",
    description: "DEXA scan Bangkok: ฿2,500–฿5,000. T-score interpretation, who should get tested (women 65+, men 70+, steroid users). Osteoporosis treatment options. No referral needed.",
    emoji: "🦴",
    category: "Specialist Screening",
  },
  {
    slug: "allergy-test-bangkok",
    title: "Allergy Test Bangkok — Skin Prick, IgE Blood Tests & Immunotherapy (2026)",
    description: "Skin prick test ฿1,500–฿4,000 (20–40 allergens), specific IgE panel ฿3,000–฿8,000. Bangkok's top allergens: house dust mites, mould, seafood. Immunotherapy available.",
    emoji: "🌿",
    category: "Specialist Screening",
  },
  {
    slug: "health-checkup-italy-vs-thailand",
    title: "Health Check-Up Italy vs Thailand (2026) — Bangkok per Italiani 🇮🇹",
    description: "SSN wait times: 6–24 months for MRI. Private Italy: €400–€1,200. Bangkok JCI: ฿8,000–฿25,000 (€190–€600) — 60–80% cheaper. Italian guide with prices, results, practical tips.",
    emoji: "🇮🇹",
    category: "By Nationality",
  },
  {
    slug: "health-checkup-philippines-vs-thailand",
    title: "Health Check-Up Philippines vs Thailand (2026) — Bangkok for Filipinos",
    description: "PhilHealth gaps, Manila private ₱30,000–₱80,000 vs Bangkok JCI ฿12,000–฿25,000. 2-hour flight, no visa. Filipino nurses at Bumrungrad. Gastroscopy 50–60% cheaper.",
    emoji: "🇵🇭",
    category: "By Nationality",
  },
  {
    slug: "health-checkup-south-africa-vs-thailand",
    title: "Health Check-Up South Africa vs Thailand (2026) — Bangkok for South Africans",
    description: "SA private check-up R5,000–R25,000. Bangkok JCI: ฿8,000–฿25,000 (R3,200–R10,000). Discovery Health doesn't cover preventive screening abroad. Gastroscopy 55–65% cheaper.",
    emoji: "🇿🇦",
    category: "By Nationality",
  },
  {
    slug: "health-checkup-spain-vs-thailand",
    title: "Health Check-Up Spain vs Thailand (2026) — Bangkok para Españoles 🇪🇸",
    description: "SNS espera 3–18 meses. España privada: €300–€1,500. Bangkok JCI: ฿8,000–฿25,000 (€190–€595). Sin espera, resultados mismo día. Guía también para latinoamericanos.",
    emoji: "🇪🇸",
    category: "By Nationality",
  },
  {
    slug: "health-checkup-brazil-vs-thailand",
    title: "Health Check-Up Brazil vs Thailand (2026) — Bangkok para Brasileiros 🇧🇷",
    description: "Plano de saúde: coparticipação + glosas. Fleury/Sírio executive R$5,000–R$15,000. Bangkok JCI ฿8,000–฿25,000 (R$4,000–R$12,500). Guia completo em português.",
    emoji: "🇧🇷",
    category: "By Nationality",
  },
  {
    slug: "health-checkup-vietnam-vs-thailand",
    title: "Health Check-Up Vietnam vs Thailand (2026) — Bangkok cho người Việt Nam 🇻🇳",
    description: "Khám sức khỏe tổng quát tại Bangkok JCI: ฿8,000–฿25,000. 1.5–2 giờ bay từ TP.HCM/Hà Nội. Không cần visa. MRI 3T và PET-CT sẵn có. Hướng dẫn đầy đủ bằng tiếng Việt.",
    emoji: "🇻🇳",
    category: "By Nationality",
  },
  {
    slug: "bumrungrad-vs-samitivej-health-checkup",
    title: "Bumrungrad vs Samitivej Health Check-Up — Which Hospital? (2026)",
    description: "Direct comparison: price, atmosphere, package scope, wait times. Samitivej is 10–25% cheaper and quieter. Bumrungrad has more specialist depth. Both JCI.",
    emoji: "⚖️",
    category: "Hospital Guides",
  },
  {
    slug: "vejthani-hospital-health-checkup",
    title: "Vejthani Hospital Health Check-Up Bangkok — Packages, Prices & Review (2026)",
    description: "Vejthani is JCI-accredited with Bangkok's strongest Korean patient program. Executive packages 15–30% cheaper than Bumrungrad. Great value for Korean and Arabic patients.",
    emoji: "🏥",
    category: "Hospital Guides",
  },
  {
    slug: "bnh-hospital-health-checkup",
    title: "BNH Hospital Health Check-Up Bangkok — Expat Favourite, JCI-Accredited",
    description: "BNH Hospital (Bangkok Nursing Home) is the preferred choice for European, Japanese and long-term expats. Quiet, English-first, Silom location. Check-up packages from ฿3,000.",
    emoji: "🏨",
    category: "Hospital Guides",
  },
  {
    slug: "samitivej-hospital-health-checkup",
    title: "Samitivej Hospital Health Check-Up Bangkok — Packages & Review (2026)",
    description: "Samitivej Sukhumvit: JCI-accredited, 10–25% cheaper than Bumrungrad, quieter. Packages from ฿3,500 to ฿60,000+. Japanese/Korean coordinators. Women's health specialist.",
    emoji: "🏥",
    category: "Hospital Guides",
  },
  {
    slug: "bumrungrad-hospital-health-checkup",
    title: "Bumrungrad International Hospital Health Check-Up Bangkok (2026)",
    description: "Bumrungrad International health check-up packages from ฿5,500 to ฿80,000+. Thailand's most internationally recognised hospital. 500,000 international patients/year, 40 languages, JCI-accredited.",
    emoji: "🌐",
    category: "Hospital Guides",
  },
  {
    slug: "health-checkup-by-age-bangkok",
    title: "Health Check-Up by Age in Bangkok — Tests at 30s, 40s, 50s, 60s+ (2026)",
    description: "Evidence-based screening guide for Bangkok check-ups: glucose+lipids in your 30s, colonoscopy+mammogram in 50s, DEXA+cardiac echo at 60+. Walk-in JCI hospitals, ฿3,500–฿40,000.",
    emoji: "📅",
    category: "Understanding Your Check-Up",
  },
  {
    slug: "travel-disease-tests-bangkok",
    title: "Travel Disease Tests Bangkok — Dengue, Typhoid, Malaria, Leptospirosis (2026)",
    description: "Got sick in Thailand? Dengue NS1 ฿400–฿800, malaria RDT ฿400–฿600, typhoid ฿500–฿1,000, full tropical panel ฿3,000–฿6,000. Walk-in, same-day results. Symptom guide.",
    emoji: "🦟",
    category: "Specialist Screening",
  },
  {
    slug: "ultrasound-scan-bangkok",
    title: "Ultrasound Scan Bangkok — Abdominal, Thyroid, Pelvic, Echo Prices (2026)",
    description: "Abdominal ultrasound ฿1,500–฿3,000, thyroid ฿1,500–฿2,500, pelvic ฿1,500–฿3,500, echocardiogram ฿4,000–฿8,000. No radiation, no referral. Included in most executive packages.",
    emoji: "🔊",
    category: "Specialist Screening",
  },
  {
    slug: "high-cholesterol-treatment-bangkok",
    title: "High Cholesterol After Bangkok Check-Up — Statins, Costs & Next Steps (2026)",
    description: "Bangkok check-up showed high LDL? Generic statins from ฿300/month, cardiologist consult ฿1,500–฿3,000. Understand your lipid panel + what to do next.",
    emoji: "💊",
    category: "Understanding Your Check-Up",
  },
  {
    slug: "high-blood-pressure-treatment-bangkok",
    title: "High Blood Pressure After Bangkok Check-Up — Medication, Costs & Next Steps (2026)",
    description: "Hypertension found at Bangkok check-up? Amlodipine ฿50–฿150/month, 24-hour ABPM ฿2,000–฿3,500, same-day cardiologist ฿1,500–฿3,000. Don't panic — one reading isn't a diagnosis.",
    emoji: "🩺",
    category: "Understanding Your Check-Up",
  },
  {
    slug: "phyathai-hospital-health-checkup",
    title: "Phyathai Hospital Health Check-Up Bangkok — Packages, Prices & Review (2026)",
    description: "Phyathai 1, 2 & 3 health check-up: basic ฿2,500–฿4,500, executive ฿8,000–฿18,000 — 30–40% cheaper than Bumrungrad. JCI-accredited (Phyathai 2). Preferred by Bangkok residents.",
    emoji: "🏨",
    category: "Hospital Guides",
  },
  {
    slug: "health-checkup-turkey-vs-thailand",
    title: "Sağlık Taraması: Türkiye vs Tayland — Bangkok Check-Up Maliyetleri (2026)",
    description: "Türkiye özel hastanesine kıyasla Bangkok %40–65 daha ucuz. Gastroskopi ฿4,500–฿8,000, yönetici paketi ฿12,000–฿25,000. Türk pasaportuna 30 gün vize muafiyeti. JCI belgeli.",
    emoji: "🇹🇷",
    category: "By Nationality",
  },
  {
    slug: "abnormal-results-bangkok-what-to-do",
    title: "Bangkok Check-Up Found Something Abnormal — What To Do Next (2026)",
    description: "Don't panic. Most Bangkok check-up flags are not emergencies. Learn which results need same-day specialist attention, which can wait until home, and what documents to take back.",
    emoji: "⚠️",
    category: "Understanding Your Check-Up",
  },
  {
    slug: "health-checkup-poland-vs-thailand",
    title: "Badania Kontrolne: Polska vs Tajlandia — Bangkok dla Polaków (2026)",
    description: "Prywatna diagnostyka w Polsce 2.500–8.000 PLN. Bangkok: 1.100–2.300 PLN za executive check-up — oszczędność 40–65%. JCI, wyniki PO ANGIELSKU, brak wizy. Przewodnik po polsku.",
    emoji: "🇵🇱",
    category: "By Nationality",
  },
  {
    slug: "kidney-function-test-bangkok",
    title: "Kidney Function Test Bangkok — Creatinine, eGFR, Microalbumin Prices (2026)",
    description: "Creatinine ฿200–฿500, microalbumin ฿400–฿900, full renal panel ฿1,000–฿2,500. eGFR included free. Walk-in, no referral. Essential if you have diabetes, hypertension, or gout.",
    emoji: "🫘",
    category: "Specialist Screening",
  },
  {
    slug: "liver-function-test-bangkok",
    title: "Liver Function Test Bangkok — ALT, AST, GGT, Bilirubin Prices (2026)",
    description: "ALT/AST ฿200–฿500 each, full LFT panel ฿800–฿2,000, GGT ฿200–฿400. NAFLD, hepatitis, alcohol liver — what your Bangkok LFT results mean and what to do next.",
    emoji: "🫀",
    category: "Specialist Screening",
  },
  {
    slug: "health-checkup-egypt-vs-thailand",
    title: "فحص صحي: مصر مقابل تايلاند — بانكوك للمصريين (2026) | Egypt vs Thailand",
    description: "باقة executive في القاهرة: 15,000–60,000 جنيه. بانكوك: ฿12,000–฿25,000 (وفر 30–55%). مستشفيات JCI. e-Visa 35 دولار. طاقم ناطق بالعربية. دليل بالعربية.",
    emoji: "🇪🇬",
    category: "By Nationality",
  },
  {
    slug: "full-body-mri-bangkok",
    title: "Full Body MRI Bangkok — Whole-Body Scan Prices & What It Covers (2026)",
    description: "Whole-body MRI ฿18,000–฿45,000. 3T scanner, AI-assisted reading, English report in 24–48 hours. 60–80% cheaper than UK/US. What it detects — and what it misses.",
    emoji: "🧲",
    category: "Specialist Screening",
  },
  {
    slug: "health-checkup-mexico-vs-thailand",
    title: "Chequeo Médico: México vs Tailandia — Bangkok para Mexicanos (2026)",
    description: "Paquete ejecutivo en México: $8,000–$40,000 MXN. Bangkok: ฿12,000–฿25,000 (ahorro 30–60%). Sin visa 30 días. JCI acreditado. Resultados misma tarde. Guía en español.",
    emoji: "🇲🇽",
    category: "By Nationality",
  },
  {
    slug: "bangkok-hospital-health-checkup",
    title: "Bangkok Hospital Health Check-Up — BDMS Group Packages & Prices (2026)",
    description: "Bangkok Hospital (BDMS) is Thailand's largest private hospital group — 49 locations including Phuket, Chiang Mai, Pattaya, Hua Hin. Executive packages ฿10,000–฿25,000, PET-CT cancer screening available.",
    emoji: "🌐",
    category: "Hospital Guides",
  },
  {
    slug: "health-checkup-uk-vs-thailand",
    title: "UK vs Thailand Health Check-Up Cost (2026)",
    description: "Bupa/Nuffield vs Bangkok hospitals. Bangkok packages cost 65–75% less with same-day results and no waiting lists.",
    emoji: "🇬🇧",
    category: "Practical Guides",
  },
  {
    slug: "understanding-health-checkup-results",
    title: "Understanding Your Thai Health Check-Up Results",
    description: "Normal ranges for blood glucose, cholesterol, liver, kidney, cancer markers — explained in plain English for Bangkok hospital check-ups.",
    emoji: "📊",
    category: "Understanding Your Check-Up",
  },
  {
    slug: "health-checkup-usa-vs-thailand",
    title: "USA vs Thailand Health Check-Up Prices (2026)",
    description: "Bangkok packages cost 75–90% less than US out-of-pocket prices. No deductibles, same-day results, JCI-accredited hospitals.",
    emoji: "🇺🇸",
    category: "Practical Guides",
  },
  {
    slug: "health-checkup-malaysia-vs-thailand",
    title: "Malaysia vs Thailand Health Check-Up (2026) — Hat Yai & Bangkok",
    description: "Hat Yai and Bangkok attract 100,000+ Malaysian medical tourists yearly. Save 40–60% vs KL private hospital prices.",
    emoji: "🇲🇾",
    category: "Practical Guides",
  },
  {
    slug: "health-checkup-japan-vs-thailand",
    title: "Japan vs Thailand Health Check-Up (2026) — Ningen Dock in Bangkok",
    description: "人間ドック equivalent packages in Bangkok cost 50–70% less than in Japan. Japanese-speaking staff at BNH, Samitivej, Bumrungrad.",
    emoji: "🇯🇵",
    category: "Practical Guides",
  },
  {
    slug: "private-vs-government-hospital-thailand",
    title: "Private vs Government Hospital Thailand — Which to Choose",
    description: "Cost, waiting time, English service — full comparison of Thai private and government hospitals for health check-ups.",
    emoji: "🏥",
    category: "Practical Guides",
  },
  {
    slug: "health-checkup-for-retirement-visa-thailand",
    title: "Health Check-Up for Thailand Retirement Visa (Non-OA) 2026",
    description: "Chest X-ray, HIV test, syphilis test — exact requirements and where to get them for the Thai retirement visa and work permit.",
    emoji: "🛂",
    category: "Practical Guides",
  },
  {
    slug: "ct-scan-cost-bangkok",
    title: "CT Scan Cost in Bangkok — 2026 Price Guide",
    description: "Chest CT, abdominal CT, coronary calcium score, full-body CT — all prices at JCI and private hospitals. 40–70% cheaper than US/UK.",
    emoji: "🔭",
    category: "Practical Guides",
  },
  {
    slug: "mammogram-cost-bangkok",
    title: "Mammogram Cost in Bangkok — 2026 Price Guide",
    description: "Digital mammogram and 3D tomosynthesis prices in Bangkok. From ฿1,200. Same-day results, Hologic 3D at Samitivej and Bumrungrad.",
    emoji: "🎀",
    category: "Specialist Screening",
  },
  {
    slug: "colonoscopy-cost-bangkok",
    title: "Colonoscopy Cost in Bangkok — 2026 Price Guide",
    description: "Colonoscopy prices in Bangkok from ฿7,000. Sedation included, same-day scoping at Bumrungrad, Bangkok Hospital, Vejthani.",
    emoji: "🔬",
    category: "Specialist Screening",
  },
  {
    slug: "gastroscopy-cost-bangkok",
    title: "Gastroscopy Cost Bangkok — 2026 (Upper Endoscopy / 胃カメラ)",
    description: "Gastroscopy prices from ฿4,500 with sedation. HD endoscopes, English reports, same-day. Popular with Japanese and Korean tourists.",
    emoji: "🩻",
    category: "Specialist Screening",
  },
  {
    slug: "mens-health-checkup-bangkok",
    title: "Men's Health Check-Up in Bangkok (2026)",
    description: "PSA, testosterone, cardiac risk, liver, kidney — what's in a Bangkok men's health package and where to go.",
    emoji: "♂️",
    category: "Specialist Screening",
  },
  {
    slug: "executive-health-checkup-bangkok",
    title: "Executive Health Check-Up Bangkok (2026) — Best Packages",
    description: "Full guide to executive health check-ups in Bangkok. What's included, prices, best hospitals, how to book. From ฿18,000 at JCI hospitals.",
    emoji: "💼",
    category: "Hospital Guides",
  },
  {
    slug: "blood-test-price-bangkok",
    title: "Blood Test Price in Bangkok (2026 Guide)",
    description: "How much does a blood test cost in Bangkok? CBC, lipid panel, liver function, cancer markers — all prices compared.",
    emoji: "🩸",
    category: "Practical Guides",
  },
  {
    slug: "mri-scan-cost-bangkok",
    title: "MRI Scan Cost in Bangkok (2026 Guide)",
    description: "Brain MRI, spine MRI, cardiac MRI prices at Bangkok private hospitals. 40–70% cheaper than US/UK rates.",
    emoji: "🧲",
    category: "Practical Guides",
  },
  {
    slug: "chon-buri-health-checkup",
    title: "Chon Buri Health Check-Up Guide (2026)",
    description: "Bangkok Pattaya Hospital and Sriracha options. Serves the Eastern Seaboard expat and industrial community.",
    emoji: "🏭",
    category: "City Guides",
  },
  {
    slug: "chiang-rai-health-checkup",
    title: "Chiang Rai Health Check-Up Guide (2026)",
    description: "Golden Triangle area hospitals. 20–40% cheaper than Chiang Mai. Good for northern Thailand travellers.",
    emoji: "🌄",
    category: "City Guides",
  },
  {
    slug: "ayutthaya-health-checkup",
    title: "Ayutthaya Health Check-Up Guide (2026)",
    description: "Day trip option 80km from Bangkok. Bangkok Hospital Ayutthaya + 3 other options. From ฿2,000.",
    emoji: "🏯",
    category: "City Guides",
  },
  {
    slug: "nakhon-si-thammarat-health-checkup",
    title: "Nakhon Si Thammarat Health Check-Up Guide (2026)",
    description: "Southern Thailand's oldest city. Competitive prices, short queues. From ฿2,200.",
    emoji: "🕌",
    category: "City Guides",
  },
  {
    slug: "koh-chang-health-checkup",
    title: "Koh Chang Health Check-Up Guide (2026)",
    description: "Island options + Trat mainland hospitals. Bangkok Hospital Chanthaburi for executive packages.",
    emoji: "🏝️",
    category: "City Guides",
  },
  {
    slug: "lampang-health-checkup",
    title: "Lampang Health Check-Up Guide (2026)",
    description: "Northern hub 100km south of Chiang Mai. 20–35% cheaper than Chiang Mai. From ฿2,000.",
    emoji: "🐴",
    category: "City Guides",
  },
  {
    slug: "nakhon-pathom-health-checkup",
    title: "Nakhon Pathom Health Check-Up Guide (2026)",
    description: "Day trip from Bangkok (56km). Short queues, same quality. Bangkok Hospital branch. From ฿2,200.",
    emoji: "🏛️",
    category: "City Guides",
  },
];

const CATEGORIES = ["City Guides", "Hospital Guides", "Understanding Your Check-Up", "Specialist Screening", "By Age & Lifestyle", "Practical Guides", "By Nationality"];

export default async function GuidesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = locale as Locale;
  const base = `/${loc}`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav className="text-sm text-slate-400 mb-6 flex items-center gap-2">
        <Link href={base} className="hover:text-blue-600">Home</Link>
        <span>›</span>
        <span className="text-slate-600">Health Check-Up Guides</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
        Health Check-Up Guides for Thailand
      </h1>
      <p className="text-slate-600 text-lg mb-10 max-w-2xl">
        Expert guides on health screening in Thailand — from Bangkok and Phuket to specialist cancer and cardiac screening. Everything you need to plan your health check-up.
      </p>

      {CATEGORIES.map((cat) => {
        const guides = GUIDES.filter((g) => g.category === cat);
        return (
          <section key={cat} className="mb-12">
            <h2 className="text-xl font-semibold text-slate-700 mb-4 border-b border-slate-200 pb-2">{cat}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {guides.map((guide) => (
                <Link
                  key={guide.slug}
                  href={`${base}/guide/${guide.slug}`}
                  className="group block bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md hover:border-blue-300 transition-all"
                >
                  <div className="text-3xl mb-3">{guide.emoji}</div>
                  <h3 className="font-semibold text-slate-900 group-hover:text-blue-700 text-sm leading-snug mb-2">
                    {guide.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{guide.description}</p>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      <div className="mt-8 bg-blue-50 rounded-xl p-6">
        <h2 className="font-semibold text-blue-900 mb-2">Ready to compare packages?</h2>
        <p className="text-sm text-blue-700 mb-4">Browse all health check-up packages across Thailand with real prices from 235 hospitals.</p>
        <div className="flex flex-wrap gap-3">
          <Link href={`${base}/compare`} className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Compare packages →
          </Link>
          <Link href={`${base}/hospital`} className="bg-white text-blue-700 border border-blue-300 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">
            Browse hospitals →
          </Link>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "BangkokCheckup", item: `${BASE}/${locale}` },
          { "@type": "ListItem", position: 2, name: "Guides", item: `${BASE}/${locale}/guide` },
        ],
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Health Check-Up Guides for Thailand",
        numberOfItems: GUIDES.length,
        itemListElement: GUIDES.map((g, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "Article",
            headline: g.title,
            description: g.description,
            url: `${BASE}/${locale}/guide/${g.slug}`,
          },
        })),
      }) }} />
    </div>
  );
}
