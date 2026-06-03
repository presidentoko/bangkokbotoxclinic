// Related-supplier recommendations for the supplier detail page.
// Pure + deterministic; server-rendered (no client JS) so it works under static
// export and adds crawlable internal links. Weighted "industry + region": a true
// same-industry (TSIC) match always outranks a region-only match.

import type { MasterDb, Supplier } from "./types";
import { computeTrustScore } from "./trustScore";
import { normalizeDistrict } from "./districts";

const TSIC_WEIGHT = 100;
const CATEGORY_WEIGHT = 25;
const DISTRICT_WEIGHT = 40;
const CITY_WEIGHT = 20;

function districtKey(s: Supplier): string | null {
  return normalizeDistrict(s.district, s.city)?.key ?? null;
}

function score(target: Supplier, cand: Supplier, targetDistrictKey: string | null): number {
  let n = 0;

  const tsic = target.dbd?.tsic_code;
  if (tsic && cand.dbd?.tsic_code === tsic) n += TSIC_WEIGHT;

  const targetCats = new Set(target.categories ?? []);
  for (const c of cand.categories ?? []) if (targetCats.has(c)) n += CATEGORY_WEIGHT;

  if (targetDistrictKey && districtKey(cand) === targetDistrictKey) n += DISTRICT_WEIGHT;
  if (target.city && cand.city === target.city) n += CITY_WEIGHT;

  return n;
}

/**
 * Suppliers most similar to `supplier` (same industry, nearby region), best first.
 * Excludes `supplier` itself and any candidate with no shared signal.
 */
export function relatedSuppliers(db: MasterDb, supplier: Supplier, limit = 6): Supplier[] {
  const targetDistrictKey = districtKey(supplier);

  const scored = db.suppliers
    .filter((s) => s.id !== supplier.id)
    .map((s) => ({ s, n: score(supplier, s, targetDistrictKey) }))
    .filter((x) => x.n > 0);

  scored.sort((a, b) => {
    if (b.n !== a.n) return b.n - a.n;
    const ta = computeTrustScore(a.s).overall;
    const tb = computeTrustScore(b.s).overall;
    if (tb !== ta) return tb - ta;
    return a.s.id < b.s.id ? -1 : a.s.id > b.s.id ? 1 : 0;
  });

  return scored.slice(0, limit).map((x) => x.s);
}
