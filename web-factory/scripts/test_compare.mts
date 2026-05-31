import assert from "node:assert";
import { toCompareEntry } from "../lib/compare.ts";
import type { Supplier } from "../lib/types.ts";

function mk(over: Partial<Supplier>): Supplier {
  return {
    id: "x", name: "", city_label: "", district: "", rating: 0, total_reviews: 0,
    categories: [], photos: [],
    ...over,
  } as unknown as Supplier;
}

// Full verification + data.
const s = mk({
  id: "a",
  name: "Acme Co",
  city_label: "Chon Buri",
  district: "Si Racha",
  rating: 4.6,
  total_reviews: 230,
  categories: ["manufacturer", "auto_parts"],
  verified: true,
  halal_certified: true,
  estate_name: "Amata City",
  dbd: { tsic_code: "2811", capital_thb: 50_000_000, registered_date: "2010-01-01", reg_no: "", legal_name: null, purpose: null, address: null, match_score: 0 } as Supplier["dbd"],
});

const e = toCompareEntry(s);

assert.equal(e.id, "a");
assert.equal(e.name, "Acme Co");
assert.equal(e.cityLabel, "Chon Buri");
assert.equal(e.district, "Si Racha");
assert.equal(e.rating, 4.6, "rating passthrough");
assert.equal(e.reviews, 230, "reviews passthrough");
assert.deepEqual(e.categories, ["manufacturer", "auto_parts"], "categories passthrough");

// Verification flags reflect each signal's presence.
assert.deepEqual(e.verifications, { dbd: true, halal: true, estate: true, tsic: true }, "all verifs true");

// Trust is a 0–100 number with a tier string.
assert.equal(typeof e.trust.overall, "number");
assert.ok(e.trust.overall >= 0 && e.trust.overall <= 100, "trust 0–100");
assert.ok(typeof e.trust.tier === "string" && e.trust.tier.length > 0, "tier present");

// Empty supplier → all verifs false, no dbd.
const empty = toCompareEntry(mk({ id: "b" }));
assert.deepEqual(empty.verifications, { dbd: false, halal: false, estate: false, tsic: false }, "empty verifs");

console.log("test_compare: OK");
