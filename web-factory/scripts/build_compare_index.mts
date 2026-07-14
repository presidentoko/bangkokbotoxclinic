/**
 * Generate public/compare-index.json — a slim per-supplier record keyed by id,
 * used by the client /compare page (static export can't query the DB at runtime).
 *
 * Run:  npx tsx scripts/build_compare_index.mts   (wired into package.json prebuild)
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { toCompareEntry, type CompareIndex } from "../lib/compare.ts";
import { loadMasterDb } from "../lib/data.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "public", "compare-index.json");

async function main() {
  // loadMasterDb() (not a raw fs.readFile+JSON.parse) so city_label gets the
  // same normalization browse-index.json's build script uses — reading the
  // file raw here previously let compare-index.json ship duplicate city
  // spellings ("Chon Buri" vs "Chonburi") that browse-index.json didn't.
  process.chdir(ROOT);
  const db = await loadMasterDb();
  const index: CompareIndex = {};
  for (const s of db.suppliers) index[s.id] = toCompareEntry(s);
  await fs.writeFile(OUT, JSON.stringify(index));
  console.log(`build_compare_index: wrote ${Object.keys(index).length} entries to public/compare-index.json`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
