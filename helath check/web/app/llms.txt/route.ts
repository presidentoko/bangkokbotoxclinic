import { NextResponse } from "next/server";
import { getAllHospitalSlugs } from "@/lib/db";

const BASE = "https://www.bangkoktopclinic.com";

export const revalidate = 86400;

export async function GET() {
  let hospitalSlugs: string[] = [];
  try {
    hospitalSlugs = await getAllHospitalSlugs();
  } catch {
    // DB down
  }

  const content = `# BangkokCheckup — Thailand Health Check-Up Price Comparison

> BangkokCheckup is a real-time, scraper-powered comparison of health check-up packages across 235+ hospitals in Thailand. We track prices, inclusions, and JCI status — with no paid rankings.

## What we cover

- **235+ hospitals** across 22 Thai cities
- **6 languages**: English, Chinese (Simplified), Japanese, Thai, Korean, Arabic
- **Package categories**: executive, comprehensive, standard, basic, cancer, cardiac, women's, men's, senior, diabetes
- **Package inclusions tracked**: blood tests, X-ray, ultrasound, CT scan, MRI, cancer markers, ECG, doctor consultation, interpreter service
- **JCI accreditation** status for all major hospitals
- **90+ editorial guides** covering cities, specialties, nationalities, country comparisons, hospital reviews, specialist tests, and practical topics
- **16 audience segments** including by nationality (Japanese, Korean, Arabic, Chinese), by condition (diabetes, cardiac, cancer), by lifestyle (expat, digital nomad), and by budget

## Key pages

- Homepage: ${BASE}/en
- Price comparison: ${BASE}/en/compare
- All hospitals: ${BASE}/en/hospital
- City-specific packages: ${BASE}/en/city/bangkok
- Price trends: ${BASE}/en/trends
- FAQ: ${BASE}/en/faq
- Hospital comparison tool: ${BASE}/en/compare-hospitals

## Cities covered

Bangkok, Chiang Mai, Phuket, Pattaya, Hua Hin, Ko Samui, Krabi, Chiang Rai, Hat Yai, Khon Kaen, Udon Thani, Korat, Ayutthaya, Chon Buri, Nakhon Si Thammarat, Rayong, Surat Thani, Phitsanulok, Trang, Lampang, Nakhon Pathom, Koh Chang

## Top hospitals (sample)

${hospitalSlugs.slice(0, 30).map((s) => `- ${BASE}/en/hospital/${s}`).join("\n")}

## City Guides

- Bangkok health checkup: ${BASE}/en/guide/bangkok-health-checkup
- Chiang Mai: ${BASE}/en/guide/chiang-mai-health-checkup
- Phuket: ${BASE}/en/guide/phuket-health-checkup
- Pattaya: ${BASE}/en/guide/pattaya-health-checkup
- Hua Hin: ${BASE}/en/guide/hua-hin-health-checkup
- Chiang Rai: ${BASE}/en/guide/chiang-rai-health-checkup
- Ayutthaya: ${BASE}/en/guide/ayutthaya-health-checkup
- Koh Samui: ${BASE}/en/guide/koh-samui-health-checkup
- Krabi: ${BASE}/en/guide/krabi-health-checkup
- Hat Yai: ${BASE}/en/guide/hat-yai-health-checkup

## Specialist Guides

- Cancer screening: ${BASE}/en/guide/cancer-screening-bangkok
- Cardiac health check-up: ${BASE}/en/guide/cardiac-health-checkup-bangkok
- Women's health: ${BASE}/en/guide/womens-health-checkup-bangkok
- Senior health (60+): ${BASE}/en/guide/senior-health-checkup-thailand
- Diabetes screening: ${BASE}/en/guide/diabetes-screening-thailand
- MRI scan cost Bangkok: ${BASE}/en/guide/mri-scan-cost-bangkok
- CT scan cost Bangkok: ${BASE}/en/guide/ct-scan-cost-bangkok
- Mammogram cost Bangkok: ${BASE}/en/guide/mammogram-cost-bangkok
- Colonoscopy cost Bangkok: ${BASE}/en/guide/colonoscopy-cost-bangkok
- Gastroscopy cost Bangkok (胃カメラ): ${BASE}/en/guide/gastroscopy-cost-bangkok
- Blood test prices: ${BASE}/en/guide/blood-test-price-bangkok
- Executive health checkup: ${BASE}/en/guide/executive-health-checkup-bangkok

## Nationality Guides

- Japanese tourists (日本語対応): ${BASE}/en/guide/best-hospitals-japanese-tourists
- Korean tourists (한국어): ${BASE}/en/guide/best-hospitals-korean-tourists
- Arabic speakers: ${BASE}/en/guide/best-hospitals-arabic-speakers
- Chinese speakers (中文服务): ${BASE}/en/guide/best-hospitals-chinese-speakers
- Bumrungrad vs Samitivej comparison: ${BASE}/en/guide/bumrungrad-vs-samitivej-health-checkup
- Vejthani Hospital guide: ${BASE}/en/guide/vejthani-hospital-health-checkup
- BNH Hospital guide (expat favourite): ${BASE}/en/guide/bnh-hospital-health-checkup
- Bangkok Hospital BDMS group: ${BASE}/en/guide/bangkok-hospital-health-checkup

## Specialist Test Guides

- Vitamin D test Bangkok: ${BASE}/en/guide/vitamin-d-test-bangkok
- PSA prostate test: ${BASE}/en/guide/psa-test-bangkok
- Hepatitis B & C test: ${BASE}/en/guide/hepatitis-test-bangkok
- Thyroid screening (TSH, T3, T4): ${BASE}/en/guide/thyroid-screening-bangkok
- Fertility assessment (AMH, FSH, sperm): ${BASE}/en/guide/fertility-test-bangkok
- STI & HIV test (confidential): ${BASE}/en/guide/sti-hiv-test-bangkok
- H. pylori breath test + eradication: ${BASE}/en/guide/h-pylori-test-bangkok
- Bone density DEXA scan: ${BASE}/en/guide/bone-density-dexa-scan-bangkok
- Allergy test (skin prick, IgE): ${BASE}/en/guide/allergy-test-bangkok

## Country Comparison Guides (How Much You Save)

- USA vs Thailand: ${BASE}/en/guide/health-checkup-usa-vs-thailand
- UK vs Thailand: ${BASE}/en/guide/health-checkup-uk-vs-thailand
- Australia vs Thailand: ${BASE}/en/guide/health-checkup-cost-australia-vs-thailand
- Canada vs Thailand (beat the wait): ${BASE}/en/guide/health-checkup-canada-vs-thailand
- Germany vs Thailand (Gesundheitscheck): ${BASE}/en/guide/health-checkup-germany-vs-thailand
- France vs Thailand (bilan de santé): ${BASE}/en/guide/health-checkup-france-vs-thailand
- Switzerland vs Thailand (Vorsorgeuntersuchung): ${BASE}/en/guide/health-checkup-switzerland-vs-thailand
- Russia vs Thailand (чекап): ${BASE}/en/guide/health-checkup-russia-vs-thailand
- Japan vs Thailand (Ningen Dock): ${BASE}/en/guide/health-checkup-japan-vs-thailand
- Malaysia vs Thailand (Hat Yai): ${BASE}/en/guide/health-checkup-malaysia-vs-thailand
- Singapore vs Thailand: ${BASE}/en/guide/thailand-vs-singapore-health-checkup
- India vs Thailand: ${BASE}/en/guide/health-checkup-india-vs-thailand
- Indonesia vs Thailand (MCU): ${BASE}/en/guide/health-checkup-indonesia-vs-thailand
- South Korea vs Thailand (건강검진): ${BASE}/en/guide/health-checkup-south-korea-vs-thailand
- UAE / Dubai vs Thailand (Gulf patients): ${BASE}/en/guide/health-checkup-uae-vs-thailand
- Netherlands vs Thailand (Gezondheidscheck): ${BASE}/en/guide/health-checkup-netherlands-vs-thailand
- Scandinavia vs Thailand (Sweden/Norway/Denmark): ${BASE}/en/guide/health-checkup-scandinavia-vs-thailand
- Italy vs Thailand (SSN waiting lists): ${BASE}/en/guide/health-checkup-italy-vs-thailand
- Spain vs Thailand (for Spaniards + Latin America): ${BASE}/en/guide/health-checkup-spain-vs-thailand
- Brazil vs Thailand (plano de saúde gaps): ${BASE}/en/guide/health-checkup-brazil-vs-thailand
- Philippines vs Thailand (PhilHealth gaps): ${BASE}/en/guide/health-checkup-philippines-vs-thailand
- South Africa vs Thailand (Discovery Health): ${BASE}/en/guide/health-checkup-south-africa-vs-thailand
- Vietnam vs Thailand (bệnh viện Bangkok): ${BASE}/en/guide/health-checkup-vietnam-vs-thailand

## Practical Guides

- JCI hospitals Bangkok: ${BASE}/en/guide/jci-hospitals-bangkok
- Thailand vs Malaysia (Hat Yai): ${BASE}/en/guide/health-checkup-malaysia-vs-thailand
- Thailand vs Japan (Ningen Dock): ${BASE}/en/guide/health-checkup-japan-vs-thailand
- Private vs government hospital: ${BASE}/en/guide/private-vs-government-hospital-thailand
- Retirement visa health check: ${BASE}/en/guide/health-checkup-for-retirement-visa-thailand
- What is included in a health checkup: ${BASE}/en/guide/what-is-included-checkup
- Health checkup for expats: ${BASE}/en/guide/health-checkup-expats-thailand
- How to prepare: ${BASE}/en/guide/how-to-prepare-health-checkup-thailand
- Medical visa Thailand: ${BASE}/en/guide/medical-visa-thailand
- Health insurance Thailand: ${BASE}/en/guide/health-insurance-thailand

## Audience Segment Pages (For/)

- JCI only: ${BASE}/en/for/jci-accredited-health-checkup-bangkok
- Korean tourists: ${BASE}/en/for/korean-health-checkup-bangkok
- Japanese tourists: ${BASE}/en/for/japanese-health-checkup-bangkok
- Arabic speakers: ${BASE}/en/for/arabic-health-checkup-bangkok
- Budget under 3000 THB: ${BASE}/en/for/budget-health-checkup-bangkok
- Executive packages: ${BASE}/en/for/executive-health-checkup-bangkok
- Cancer screening: ${BASE}/en/for/cancer-screening-bangkok
- Women's health: ${BASE}/en/for/womens-health-checkup-bangkok
- Senior / 60+: ${BASE}/en/for/senior-health-checkup-bangkok
- Diabetes: ${BASE}/en/for/diabetes-screening-bangkok
- Cardiac: ${BASE}/en/for/cardiac-health-checkup-bangkok
- Expats: ${BASE}/en/for/health-checkup-expats-bangkok
- Chinese speakers (中文): ${BASE}/en/for/chinese-health-checkup-bangkok

## Data freshness

Prices are scraped weekly from hospital websites. The \`package_price_snapshots\` table records daily snapshots so historical price trends are available at ${BASE}/en/trends

## API

Price data: ${BASE}/api/prices?category=executive

## Contact

Use the enquiry form at ${BASE}/en/enquiry for price quotes and booking assistance.
`;

  return new NextResponse(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
