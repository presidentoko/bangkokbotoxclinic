/**
 * Generate public/browse-index.json — a slim, sorted array of every supplier
 * used for client-side search typeahead and the homepage/category filter list.
 * Keeps pages from embedding the full ~5,000-supplier database in their HTML.
 *
 * Run:  npx tsx scripts/build_browse_index.mts   (wired into package.json prebuild)
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { toBrowseEntry } from "../lib/browseIndex.ts";
import type { MasterDb } from "../lib/types.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "public", "browse-index.json");
const CITY_OUT = path.join(ROOT, "public", "city-index.json");

async function main() {
  const db: MasterDb = JSON.parse(await fs.readFile(path.join(ROOT, "data", "master_db.json"), "utf-8"));
  const entries = db.suppliers.map(toBrowseEntry).sort((a, b) => b.trust_score - a.trust_score);
  await fs.writeFile(OUT, JSON.stringify(entries));
  console.log(`build_browse_index: wrote ${entries.length} entries to public/browse-index.json`);

  // Cities that actually have a generated /city/{slug} page (app/city/[name]/page.tsx's
  // generateStaticParams is built from these exact keys). Some supplier.city_label
  // values (e.g. "Pattaya", "Phuket") never made it into city_counts and have no page —
  // GlobalSearch uses this list to avoid surfacing those as clickable region results.
  const validCities = Object.keys(db.city_counts).sort();
  await fs.writeFile(CITY_OUT, JSON.stringify(validCities));
  console.log(`build_browse_index: wrote ${validCities.length} entries to public/city-index.json`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
