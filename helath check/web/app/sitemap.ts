import type { MetadataRoute } from "next";
import { LOCALES, CATEGORIES } from "@/lib/i18n";

const CITY_SLUGS = [
  "bangkok", "chiang-mai", "phuket", "pattaya", "hua-hin", "ko-samui",
  "krabi", "chiang-rai", "hat-yai", "khon-kaen", "koh-chang", "udon-thani",
  "korat", "ayutthaya", "chon-buri", "nakhon-si-thammarat", "lampang", "nakhon-pathom",
  "rayong", "surat-thani", "phitsanulok", "trang",
];

const BASE = "https://www.bangkoktopclinic.com";

async function getHospitalSlugs(): Promise<string[]> {
  try {
    const { getAllHospitalSlugs } = await import("@/lib/db");
    return await getAllHospitalSlugs();
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getHospitalSlugs();
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    // Home
    entries.push({ url: `${BASE}/${locale}`, lastModified: now, changeFrequency: "weekly", priority: 1.0 });
    // Compare
    for (const cat of CATEGORIES) {
      entries.push({ url: `${BASE}/${locale}/compare?category=${cat}`, lastModified: now, changeFrequency: "weekly", priority: 0.9 });
    }
    // Hospitals
    entries.push({ url: `${BASE}/${locale}/hospital`, lastModified: now, changeFrequency: "weekly", priority: 0.7 });
    for (const slug of slugs) {
      entries.push({ url: `${BASE}/${locale}/hospital/${slug}`, lastModified: now, changeFrequency: "weekly", priority: 0.8 });
    }
    // City pages
    for (const city of CITY_SLUGS) {
      entries.push({ url: `${BASE}/${locale}/city/${city}`, lastModified: now, changeFrequency: "weekly", priority: 0.85 });
    }
    // Longtail
    for (const cat of CATEGORIES) {
      entries.push({ url: `${BASE}/${locale}/checkup/${cat}`, lastModified: now, changeFrequency: "weekly", priority: 0.7 });
      for (const slug of slugs) {
        entries.push({ url: `${BASE}/${locale}/checkup/${cat}/${slug}`, lastModified: now, changeFrequency: "weekly", priority: 0.6 });
      }
    }
    // Longtail "for" pages
    for (const seg of [
      "jci-accredited-health-checkup-bangkok",
      "health-checkup-expats-bangkok",
      "japanese-health-checkup-bangkok",
      "arabic-health-checkup-bangkok",
      "cancer-screening-bangkok",
      "womens-health-checkup-bangkok",
      "budget-health-checkup-bangkok",
      "executive-health-checkup-bangkok",
      "health-checkup-tourists-thailand",
      "cardiac-health-checkup-bangkok",
      "comprehensive-health-checkup-bangkok",
      "senior-health-checkup-bangkok",
      "diabetes-screening-bangkok",
      "korean-health-checkup-bangkok",
      "chinese-health-checkup-bangkok",
      "digital-nomad-health-checkup-bangkok",
    ]) {
      entries.push({ url: `${BASE}/${locale}/for/${seg}`, lastModified: now, changeFrequency: "weekly", priority: 0.85 });
    }
    // FAQ
    entries.push({ url: `${BASE}/${locale}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.8 });
    // About + Privacy
    entries.push({ url: `${BASE}/${locale}/about`, lastModified: now, changeFrequency: "yearly", priority: 0.5 });
    entries.push({ url: `${BASE}/${locale}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.1 });
    // Price trends
    entries.push({ url: `${BASE}/${locale}/trends`, lastModified: now, changeFrequency: "daily", priority: 0.75 });
    // Compare hospitals
    entries.push({ url: `${BASE}/${locale}/compare-hospitals`, lastModified: now, changeFrequency: "monthly", priority: 0.6 });
    // Saved packages
    entries.push({ url: `${BASE}/${locale}/saved`, lastModified: now, changeFrequency: "never", priority: 0.1 });
    // Guide index
    entries.push({ url: `${BASE}/${locale}/guide`, lastModified: now, changeFrequency: "monthly", priority: 0.75 });
    // Guides
    for (const guideSlug of [
      "bangkok-health-checkup",
      "jci-hospitals-bangkok",
      "what-is-included-checkup",
      "cancer-screening-bangkok",
      "womens-health-checkup-bangkok",
      "cardiac-health-checkup-bangkok",
      "chiang-mai-health-checkup",
      "phuket-health-checkup",
      "senior-health-checkup-thailand",
      "health-checkup-expats-thailand",
      "pattaya-health-checkup",
      "hua-hin-health-checkup",
      "khon-kaen-health-checkup",
      "udon-thani-health-checkup",
      "korat-health-checkup",
      "hat-yai-health-checkup",
      "koh-samui-health-checkup",
      "krabi-health-checkup",
      "diabetes-screening-thailand",
      "heart-screening-thailand",
      "medical-visa-thailand",
      "health-insurance-thailand",
      "how-to-prepare-health-checkup-thailand",
      "best-hospitals-japanese-tourists",
      "best-hospitals-arabic-speakers",
      "rayong-health-checkup",
      "surat-thani-health-checkup",
      "phitsanulok-health-checkup",
      "trang-health-checkup",
      "executive-health-checkup-bangkok",
      "blood-test-price-bangkok",
      "mri-scan-cost-bangkok",
      "chon-buri-health-checkup",
      "chiang-rai-health-checkup",
      "ayutthaya-health-checkup",
      "nakhon-si-thammarat-health-checkup",
      "koh-chang-health-checkup",
      "lampang-health-checkup",
      "nakhon-pathom-health-checkup",
      "best-hospitals-korean-tourists",
      "thailand-vs-singapore-health-checkup",
      "health-checkup-cost-australia-vs-thailand",
      "health-checkup-uk-vs-thailand",
      "understanding-health-checkup-results",
      "health-checkup-usa-vs-thailand",
      "mens-health-checkup-bangkok",
      "health-checkup-malaysia-vs-thailand",
      "health-checkup-japan-vs-thailand",
      "private-vs-government-hospital-thailand",
      "health-checkup-for-retirement-visa-thailand",
      "ct-scan-cost-bangkok",
      "mammogram-cost-bangkok",
      "colonoscopy-cost-bangkok",
      "gastroscopy-cost-bangkok",
      "best-hospitals-chinese-speakers",
      "health-checkup-canada-vs-thailand",
      "health-checkup-germany-vs-thailand",
      "health-checkup-france-vs-thailand",
      "health-checkup-russia-vs-thailand",
      "health-checkup-india-vs-thailand",
      "bumrungrad-vs-samitivej-health-checkup",
      "health-checkup-indonesia-vs-thailand",
      "thyroid-screening-bangkok",
      "health-checkup-day-bangkok",
      "health-checkup-switzerland-vs-thailand",
      "health-checkup-netherlands-vs-thailand",
      "health-checkup-south-korea-vs-thailand",
      "health-checkup-uae-vs-thailand",
      "health-checkup-scandinavia-vs-thailand",
      "vejthani-hospital-health-checkup",
      "bnh-hospital-health-checkup",
      "vitamin-d-test-bangkok",
      "psa-test-bangkok",
      "hepatitis-test-bangkok",
      "bangkok-hospital-health-checkup",
      "fertility-test-bangkok",
      "sti-hiv-test-bangkok",
      "h-pylori-test-bangkok",
      "bone-density-dexa-scan-bangkok",
      "allergy-test-bangkok",
      "health-checkup-italy-vs-thailand",
      "health-checkup-philippines-vs-thailand",
      "health-checkup-south-africa-vs-thailand",
      "health-checkup-spain-vs-thailand",
      "health-checkup-brazil-vs-thailand",
    ]) {
      entries.push({ url: `${BASE}/${locale}/guide/${guideSlug}`, lastModified: now, changeFrequency: "monthly", priority: 0.7 });
    }
  }

  return entries;
}
