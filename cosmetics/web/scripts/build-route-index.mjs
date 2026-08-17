// Emits data/route-index.json — a compact list of every product id and brand
// slug that master_db.json currently prerenders.
//
// Why this exists: middleware.ts needs to tell "this product page exists" from
// "this product page used to exist", and it cannot import master_db.json (8.6MB)
// to find out. This file is ~15KB.
//
// Wired to the `prebuild` npm lifecycle so `next build` always regenerates it
// from the master_db.json actually being bundled — it can never drift.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const dataDir = join(here, "..", "data");

// Mirrors slugify() in lib/format.ts — keep the two in sync.
const slugify = (s) =>
  (s || "")
    .toLowerCase()
    .trim()
    .replace(/[()]/g, "")
    .replace(/[^a-z0-9ก-๙]+/gi, "-")
    .replace(/^-+|-+$/g, "");

const db = JSON.parse(readFileSync(join(dataDir, "master_db.json"), "utf8"));
const products = Object.values(db.products);

const productIds = products.map((p) => String(p.product_id)).sort();
const brandSlugs = [...new Set(products.map((p) => slugify(p.brand)))].filter(Boolean).sort();

// Brands with too few products for a real dupe comparison. Their /dupe/ pages
// were already emitting noindex (see dupe/[brand]/page.tsx), so they carried no
// search value while still costing a crawl each — 318 pages across both locales.
// Middleware redirects them to the brand page instead; generateStaticParams no
// longer builds them.
const brandCounts = {};
for (const p of products) {
  const s = slugify(p.brand);
  if (s) brandCounts[s] = (brandCounts[s] ?? 0) + 1;
}
const thinBrandSlugs = Object.entries(brandCounts)
  .filter(([, n]) => n < 3)
  .map(([s]) => s)
  .sort();

// brand slug -> itself, so middleware can answer "is this a live brand page?"
// without re-deriving anything at request time.
const out = { productIds, brandSlugs, thinBrandSlugs };

const target = join(dataDir, "route-index.json");
writeFileSync(target, JSON.stringify(out), "utf8");
console.log(
  `route-index.json: ${productIds.length} products, ${brandSlugs.length} brands, ` +
    `${thinBrandSlugs.length} thin brands ` +
    `(${(JSON.stringify(out).length / 1024).toFixed(1)}KB)`
);
