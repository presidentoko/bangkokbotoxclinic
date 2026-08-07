/**
 * Generate lib/dbStats.json — the handful of dataset counts that appear in
 * user-facing copy (meta descriptions, hero subtitles, JSON-LD).
 *
 * These were hardcoded in lib/site.ts and went stale: the description still
 * advertised "3,000+ verified suppliers" months after the dataset passed 8,000,
 * so every search result undersold the site by 5,000 listings. Anything derived
 * from master_db.json now regenerates with it.
 *
 * Note the distinction the old copy got wrong: `total` is how many suppliers are
 * listed, `verified` is how many are cross-checked against the DBD registry.
 * They are not the same number and "verified" must only ever describe the latter.
 *
 * Run:  npx tsx scripts/build_db_stats.mts   (wired into package.json prebuild)
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadMasterDb } from "../lib/data.ts";
import { citySlugFromDisplay } from "../lib/cityNorm.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "lib", "dbStats.json");
const TH_CITIES_OUT = path.join(ROOT, "lib", "thCities.json");

// Minimum suppliers before a province earns a Thai-language page. Below this the
// page is too thin to rank and just spends crawl budget; above it, the Thai page
// competes in a far less contested SERP than its English twin. Search Console
// showed a Thai query (คลังสินค้า ขอนแก่น — Khon Kaen warehouses) taking 63
// impressions against a /th/city/khon_kaen that returned 404, because this list
// was a hand-written 11-city constant that never grew with the dataset.
const TH_CITY_MIN_SUPPLIERS = 30;

// Kept even if they fall under the threshold: si_racha and map_ta_phut are
// districts, not provinces, but they're the two names Thai buyers actually
// search for in the Eastern Seaboard industrial belt.
const TH_CITY_ALWAYS = ["si_racha", "map_ta_phut"];

async function main() {
  process.chdir(ROOT);
  const db = await loadMasterDb();
  const s = db.suppliers;

  const stats = {
    total: s.length,
    verified: s.filter((r) => r.dbd).length,
    withPhone: s.filter((r) => r.phone).length,
    withWebsite: s.filter((r) => r.website).length,
    withReviews: s.filter((r) => (r.scraped_review_count ?? 0) > 0).length,
    provinces: Object.keys(db.city_counts).filter(Boolean).length,
    generatedAt: db.generated_at,
  };

  await fs.writeFile(OUT, JSON.stringify(stats, null, 2) + "\n");
  console.log(
    `build_db_stats: ${stats.total} suppliers, ${stats.verified} DBD-verified, ${stats.provinces} provinces`,
  );

  // Provinces that qualify for a /th/city/{slug} page. Slugs come from
  // citySlugFromDisplay so they match the EN routes exactly — a mismatch here
  // would emit a th-TH hreflang alternate pointing at a 404.
  const thCities = new Set(TH_CITY_ALWAYS);
  for (const [display, n] of Object.entries(db.city_counts)) {
    if (!display || n < TH_CITY_MIN_SUPPLIERS) continue;
    const slug = citySlugFromDisplay(display);
    if (slug) thCities.add(slug);
  }
  const sorted = [...thCities].sort();
  await fs.writeFile(TH_CITIES_OUT, JSON.stringify(sorted, null, 2) + "\n");
  console.log(
    `build_db_stats: ${sorted.length} Thai city pages (>=${TH_CITY_MIN_SUPPLIERS} suppliers)`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
