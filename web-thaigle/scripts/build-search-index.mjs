// Regenerates lib/places-search-index.json from lib/places-data.json.
// Run this after places-data.json changes. lib/search.ts (imported by the
// client-side HomeSearch component) reads only this slim file so the home
// page's client bundle doesn't have to ship hero images, i18n receipts,
// and other detail-page-only fields for every place.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const dir = path.dirname(fileURLToPath(import.meta.url));
const srcPath = path.join(dir, "..", "lib", "places-data.json");
const outPath = path.join(dir, "..", "lib", "places-search-index.json");

const places = JSON.parse(readFileSync(srcPath, "utf-8"));
const slim = places.map((p) => ({
  slug: p.slug,
  name: p.name,
  category: p.category,
  subtype: p.subtype,
  area: p.area,
  localsScore: p.localsScore,
}));

writeFileSync(outPath, JSON.stringify(slim));
console.log(`wrote ${slim.length} entries to ${path.relative(process.cwd(), outPath)}`);
