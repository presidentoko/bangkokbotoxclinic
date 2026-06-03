import assert from "node:assert";
import { relatedSuppliers } from "../lib/related.ts";
import type { MasterDb, Supplier } from "../lib/types.ts";

// Minimal supplier factory — only fields relatedSuppliers reads.
function mk(over: Partial<Supplier> & { id: string }): Supplier {
  return {
    id: over.id,
    categories: [],
    district: "",
    city: "",
    rating: 0,
    total_reviews: 0,
    photos: [],
    ...over,
  } as unknown as Supplier;
}

const self = mk({
  id: "self",
  categories: ["manufacturer"],
  district: "Si Racha",
  city: "chon_buri",
  dbd: { tsic_code: "2811" } as Supplier["dbd"],
});

const sameTsic = mk({ id: "same-tsic", categories: ["logistics"], district: "Bang Phli", city: "samut_prakan", dbd: { tsic_code: "2811" } as Supplier["dbd"] });
const sameRegionOnly = mk({ id: "same-region", categories: ["logistics"], district: "Si Racha", city: "chon_buri" });
const sameCategory = mk({ id: "same-cat", categories: ["manufacturer"], district: "Bang Bo", city: "samut_prakan" });
const unrelated = mk({ id: "unrelated", categories: ["food_mfg"], district: "Nowhere", city: "phuket" });

const db = { suppliers: [self, sameTsic, sameRegionOnly, sameCategory, unrelated] } as unknown as MasterDb;

const out = relatedSuppliers(db, self, 6);
const ids = out.map((s) => s.id);

// 1. Self never appears.
assert.ok(!ids.includes("self"), "self excluded");

// 2. Same-TSIC ranks above a region-only match (+100 TSIC > +40 district + +20 city).
assert.ok(ids.indexOf("same-tsic") < ids.indexOf("same-region"), "same TSIC outranks region-only");

// 3. Zero-signal candidate dropped.
assert.ok(!ids.includes("unrelated"), "unrelated (no shared signal) dropped");

// 4. Limit respected + deterministic.
const limited = relatedSuppliers(db, self, 2);
assert.ok(limited.length <= 2, "limit respected");
const again = relatedSuppliers(db, self, 6);
assert.deepEqual(again.map((s) => s.id), ids, "deterministic across calls");

console.log("test_related: OK");
