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
- **40+ editorial guides** covering cities, specialties, nationalities, and practical topics
- **14 audience segments** including by nationality (Japanese, Korean, Arabic), by condition (diabetes, cardiac, cancer), and by budget

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
- Blood test prices: ${BASE}/en/guide/blood-test-price-bangkok
- Executive health checkup: ${BASE}/en/guide/executive-health-checkup-bangkok

## Nationality Guides

- Japanese tourists (日本語対応): ${BASE}/en/guide/best-hospitals-japanese-tourists
- Korean tourists (한국어): ${BASE}/en/guide/best-hospitals-korean-tourists
- Arabic speakers: ${BASE}/en/guide/best-hospitals-arabic-speakers

## Practical Guides

- JCI hospitals Bangkok: ${BASE}/en/guide/jci-hospitals-bangkok
- Thailand vs Malaysia (Hat Yai): ${BASE}/en/guide/health-checkup-malaysia-vs-thailand
- Thailand vs Japan (Ningen Dock): ${BASE}/en/guide/health-checkup-japan-vs-thailand
- Private vs government hospital: ${BASE}/en/guide/private-vs-government-hospital-thailand
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
