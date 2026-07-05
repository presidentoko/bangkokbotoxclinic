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

// checkup/[cat]/[hospital] pages call notFound() when no package row matches
// that (category, hospital) pair — a naive cat x hospital cartesian product
// here submits thousands of URLs that 404. Only emit combos backed by a real
// checkup_packages row.
async function getRealComboKeys(): Promise<Set<string>> {
  try {
    const { getCheckupCombos } = await import("@/lib/db");
    const combos = await getCheckupCombos();
    return new Set(combos.map((c) => `${c.category}::${c.hospital_slug}`));
  } catch {
    return new Set();
  }
}

// city/[city] renders a "0 packages found" soft-404 page for any city with
// no hospitals in the DB. Only emit cities that actually have package data.
async function getRealCitySlugs(): Promise<Set<string>> {
  try {
    const { getCities } = await import("@/lib/db");
    const cities = await getCities();
    return new Set(cities.map((c) => c.city.toLowerCase().replace(/\s+/g, "-")));
  } catch {
    return new Set();
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getHospitalSlugs();
  const realCombos = await getRealComboKeys();
  const realCities = await getRealCitySlugs();
  const realCategories = new Set(Array.from(realCombos).map((k) => k.split("::")[0]));
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
      if (!realCities.has(city)) continue;
      entries.push({ url: `${BASE}/${locale}/city/${city}`, lastModified: now, changeFrequency: "weekly", priority: 0.85 });
    }
    // Longtail
    for (const cat of CATEGORIES) {
      if (!realCategories.has(cat)) continue;
      entries.push({ url: `${BASE}/${locale}/checkup/${cat}`, lastModified: now, changeFrequency: "weekly", priority: 0.7 });
      for (const slug of slugs) {
        if (!realCombos.has(`${cat}::${slug}`)) continue;
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
    // NOTE: /saved is intentionally NOT included here — it's a client-side,
    // localStorage-only bookmarks page with no indexable content, and
    // robots.txt disallows "/*/saved". Listing it in the sitemap caused a
    // "blocked by robots.txt" report in Search Console.
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
      "health-checkup-vietnam-vs-thailand",
      "samitivej-hospital-health-checkup",
      "bumrungrad-hospital-health-checkup",
      "health-checkup-by-age-bangkok",
      "travel-disease-tests-bangkok",
      "ultrasound-scan-bangkok",
      "high-cholesterol-treatment-bangkok",
      "high-blood-pressure-treatment-bangkok",
      "phyathai-hospital-health-checkup",
      "health-checkup-turkey-vs-thailand",
      "abnormal-results-bangkok-what-to-do",
      "health-checkup-poland-vs-thailand",
      "kidney-function-test-bangkok",
      "liver-function-test-bangkok",
      "health-checkup-egypt-vs-thailand",
      "full-body-mri-bangkok",
      "health-checkup-mexico-vs-thailand",
      "health-checkup-nigeria-vs-thailand",
      "health-checkup-argentina-vs-thailand",
      "gout-treatment-bangkok",
      "anemia-iron-test-bangkok",
      "health-checkup-pakistan-vs-thailand",
      "diabetes-management-bangkok",
      "health-checkup-colombia-vs-thailand",
      "health-checkup-bangladesh-vs-thailand",
      "thyroid-nodule-bangkok",
      "cardiac-ct-calcium-score-bangkok",
      "health-checkup-kenya-vs-thailand",
      "fatty-liver-bangkok",
      "vitamin-b12-deficiency-bangkok",
      "health-checkup-saudi-arabia-vs-thailand",
      "prostate-health-check-bangkok",
      "health-checkup-central-europe-vs-thailand",
      "health-checkup-taiwan-vs-thailand",
    ]) {
      entries.push({ url: `${BASE}/${locale}/guide/${guideSlug}`, lastModified: now, changeFrequency: "monthly", priority: 0.7 });
    }
  }

  return entries;
}
