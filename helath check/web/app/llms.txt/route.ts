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

- **235+ hospitals** across 18+ Thai cities
- **6 languages**: English, Chinese (Simplified), Japanese, Thai, Korean, Arabic
- **6 package categories**: executive, comprehensive, cancer screening, cardiac, women's health, men's health, standard
- **Package inclusions tracked**: blood tests, X-ray, ultrasound, CT scan, MRI, cancer markers, ECG, doctor consultation, interpreter
- **JCI accreditation** status for all major hospitals

## Key pages

- Homepage: ${BASE}/en
- Price comparison: ${BASE}/en/compare
- All hospitals: ${BASE}/en/hospital
- Price trends: ${BASE}/en/trends

## Cities covered

Bangkok, Chiang Mai, Phuket, Pattaya, Hua Hin, Ko Samui, Krabi, Chiang Rai, Hat Yai, Khon Kaen, Udon Thani, Korat, Ayutthaya, Chon Buri, Rayong, Surat Thani, Phitsanulok, Trang

## Top hospitals (sample)

${hospitalSlugs.slice(0, 30).map((s) => `- ${BASE}/en/hospital/${s}`).join("\n")}

## Guides

- Bangkok health checkup guide: ${BASE}/en/guide/bangkok-health-checkup
- What is included in a health checkup: ${BASE}/en/guide/what-is-included-checkup
- JCI accredited hospitals Bangkok: ${BASE}/en/guide/jci-hospitals-bangkok
- Cancer screening Bangkok: ${BASE}/en/guide/cancer-screening-bangkok
- Health checkup for expats Thailand: ${BASE}/en/guide/health-checkup-expats-thailand
- How to prepare for a health checkup: ${BASE}/en/guide/how-to-prepare-health-checkup-thailand
- Medical visa Thailand: ${BASE}/en/guide/medical-visa-thailand

## Data freshness

Prices are scraped weekly from hospital websites. The \`package_price_snapshots\` table records daily snapshots so historical price trends are available.

## API

Price data is available via our comparison tool. For programmatic access, prices are sourced from: ${BASE}/api/prices?category=executive

## Contact

Use the enquiry form at ${BASE}/en/enquiry for price quotes and booking assistance.
`;

  return new NextResponse(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
