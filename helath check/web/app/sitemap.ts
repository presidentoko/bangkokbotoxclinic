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
    ]) {
      entries.push({ url: `${BASE}/${locale}/for/${seg}`, lastModified: now, changeFrequency: "weekly", priority: 0.85 });
    }
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
    ]) {
      entries.push({ url: `${BASE}/${locale}/guide/${guideSlug}`, lastModified: now, changeFrequency: "monthly", priority: 0.7 });
    }
  }

  return entries;
}
