import type { MetadataRoute } from "next";
import { LOCALES, CATEGORIES } from "@/lib/i18n";

const BASE = "https://www.bangkoktopclinic.com";

export const revalidate = 86400;

// Hospital slugs come straight from the scraper and still carry raw Thai and
// accented characters ("w9-wellness-center-โรงพยาบาลพระรามเกา"). A sitemap
// <loc> has to be an RFC 3986 URI, so ~70 of those entries were malformed and
// dropped on ingest. Encode every dynamic segment; the literal path pieces
// around them are already ASCII.
const enc = encodeURIComponent;

// Checkup combo pages (/checkup/[cat]/[hospital]) render an English body in
// every locale, so six locale copies were ~6,800 near-identical URLs — 71% of
// the sitemap, and the bulk of the "Discovered – currently not indexed" pile
// in Search Console. Submit the English set only. The other locales stay
// crawlable through internal links and keep their hreflang cluster; they just
// stop competing with the pages that actually rank for the crawl budget.
const COMBO_LOCALES: readonly string[] = ["en"];

const CITY_SLUGS = [
  "bangkok", "chiang-mai", "phuket", "pattaya", "hua-hin", "ko-samui",
  "krabi", "chiang-rai", "hat-yai", "khon-kaen", "koh-chang", "udon-thani",
  "korat", "ayutthaya", "chon-buri", "nakhon-si-thammarat", "lampang", "nakhon-pathom",
  "rayong", "surat-thani", "phitsanulok", "trang",
];

const SEGMENT_SLUGS = [
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
];

const GUIDE_SLUGS = [
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
];

type ChangeFreq = MetadataRoute.Sitemap[number]["changeFrequency"];

/** One locale-agnostic page, expanded to one URL per locale below. */
type PageSpec = {
  /** Path after the locale segment, already percent-encoded. "" for home. */
  path: string;
  priority: number;
  changeFrequency: ChangeFreq;
  /** Defaults to every locale. */
  locales?: readonly string[];
};

async function getHospitalSlugs(): Promise<string[]> {
  try {
    const { getAllHospitalSlugs } = await import("@/lib/db");
    return await getAllHospitalSlugs();
  } catch {
    return [];
  }
}

// checkup/[cat]/[hospital] calls notFound() when no package row matches that
// (category, hospital) pair — a naive cat x hospital cartesian product here
// submits thousands of URLs that 404. Only emit combos backed by a real,
// priced checkup_packages row.
async function getRealComboKeys(): Promise<Set<string>> {
  try {
    const { getCheckupCombos } = await import("@/lib/db");
    const combos = await getCheckupCombos();
    return new Set(combos.map((c) => `${c.category}::${c.hospital_slug}`));
  } catch {
    return new Set();
  }
}

// city/[city] renders a "0 packages found" page for any city with no hospitals
// in the DB. Only emit cities that actually have package data.
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
  const [slugs, realCombos, realCities] = await Promise.all([
    getHospitalSlugs(),
    getRealComboKeys(),
    getRealCitySlugs(),
  ]);
  const realCategories = new Set(Array.from(realCombos).map((k) => k.split("::")[0]));

  // Truncate to midnight UTC: a raw `new Date()` here re-stamps every URL's
  // lastmod on each ISR regeneration, telling crawlers the whole site changed
  // — which drives them to re-fetch every URL (and its OG image) over and
  // over, burning Vercel quota. Prices update once daily anyway.
  const now = new Date(new Date().toISOString().slice(0, 10));

  const specs: PageSpec[] = [
    { path: "", priority: 1.0, changeFrequency: "weekly" },
    // Bare /compare is the canonical executive view; /compare/executive is
    // intentionally omitted because it canonicalizes back to this URL.
    { path: "/compare", priority: 0.9, changeFrequency: "weekly" },
    { path: "/hospital", priority: 0.7, changeFrequency: "weekly" },
    { path: "/guide", priority: 0.75, changeFrequency: "monthly" },
    { path: "/faq", priority: 0.8, changeFrequency: "monthly" },
    { path: "/trends", priority: 0.75, changeFrequency: "daily" },
    { path: "/enquiry", priority: 0.7, changeFrequency: "monthly" },
    { path: "/compare-hospitals", priority: 0.6, changeFrequency: "monthly" },
    { path: "/about", priority: 0.5, changeFrequency: "yearly" },
    // /for-clinics is deliberately noindex (B2B pitch page) — listing a
    // noindexed URL here is a contradictory signal, so it stays out.
    { path: "/privacy", priority: 0.1, changeFrequency: "yearly" },
  ];

  for (const cat of CATEGORIES) {
    // Gate both on real data. Several CATEGORIES entries carry zero packages
    // once fix_all_data.py has redistributed the importers' staging values
    // ("comprehensive" and "age" both end up empty), and submitting a compare
    // page with nothing on it is how a site earns "Crawled – currently not
    // indexed". /compare/executive is additionally skipped because it
    // canonicalises to the bare /compare URL.
    if (!realCategories.has(cat)) continue;
    if (cat !== "executive") {
      specs.push({ path: `/compare/${enc(cat)}`, priority: 0.9, changeFrequency: "weekly" });
    }
    specs.push({ path: `/checkup/${enc(cat)}`, priority: 0.7, changeFrequency: "weekly" });
  }

  // A hospital with no packages renders a real page with nothing on it — the
  // scrapers for a dozen of them are network-only and have not been re-run
  // since the 2026-08 rebuild. Those pages stay reachable and crawlable, they
  // just are not actively submitted; a sitemap full of empty pages is what
  // teaches Google to stop trusting the sitemap.
  const hospitalsWithPackages = new Set(
    Array.from(realCombos).map((k) => k.split("::")[1]),
  );
  for (const slug of slugs) {
    if (!hospitalsWithPackages.has(slug)) continue;
    specs.push({ path: `/hospital/${enc(slug)}`, priority: 0.8, changeFrequency: "weekly" });
  }

  for (const city of CITY_SLUGS) {
    if (!realCities.has(city)) continue;
    specs.push({ path: `/city/${enc(city)}`, priority: 0.85, changeFrequency: "weekly" });
  }

  for (const seg of SEGMENT_SLUGS) {
    specs.push({ path: `/for/${enc(seg)}`, priority: 0.85, changeFrequency: "weekly" });
  }

  for (const guideSlug of GUIDE_SLUGS) {
    specs.push({ path: `/guide/${enc(guideSlug)}`, priority: 0.7, changeFrequency: "monthly" });
  }

  // English-only — see COMBO_LOCALES.
  for (const cat of CATEGORIES) {
    if (!realCategories.has(cat)) continue;
    for (const slug of slugs) {
      if (!realCombos.has(`${cat}::${slug}`)) continue;
      specs.push({
        path: `/checkup/${enc(cat)}/${enc(slug)}`,
        priority: 0.6,
        changeFrequency: "weekly",
        locales: COMBO_LOCALES,
      });
    }
  }

  // NOTE: /saved is intentionally absent — it's a client-side, localStorage-only
  // bookmarks page with no indexable content, and robots.txt disallows
  // "/*/saved". Listing it produced a "blocked by robots.txt" Search Console
  // report.
  const entries: MetadataRoute.Sitemap = [];
  for (const spec of specs) {
    const locales = spec.locales ?? LOCALES;
    // Declaring the locale cluster inline is what stops Google from picking
    // its own canonical among six near-identical URLs — the "Alternate page
    // with proper canonical tag" and "Duplicate, Google chose different
    // canonical" buckets in Search Console are both this.
    const languages: Record<string, string> = {};
    for (const l of locales) languages[l] = `${BASE}/${l}${spec.path}`;
    if (locales.length > 1) languages["x-default"] = `${BASE}/en${spec.path}`;

    for (const l of locales) {
      entries.push({
        url: `${BASE}/${l}${spec.path}`,
        lastModified: now,
        changeFrequency: spec.changeFrequency,
        priority: spec.priority,
        alternates: { languages },
      });
    }
  }

  return entries;
}
