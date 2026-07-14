import assert from "node:assert";
import { globalSearch, regionCounts, matchCategories, matchRegions, matchSuppliers } from "../lib/globalSearch.ts";
import type { BrowseEntry } from "../lib/browseIndex.ts";

const entries: BrowseEntry[] = [
  { id: "a", name: "Acme Auto Parts Co", city_label: "Chon Buri", district: "Si Racha", rating: 4.5, trust_score: 82, categories: ["auto_parts"], dbd: true },
  { id: "b", name: "Best Warehouse Ltd", city_label: "Rayong", district: null, rating: 4.0, trust_score: 60, categories: ["warehouse"], dbd: false },
  { id: "c", name: "Chon Buri Plastics", city_label: "Chon Buri", district: "Mueang", rating: 3.8, trust_score: 45, categories: ["plastic"], dbd: false },
];

// Category match: label substring, case-insensitive.
const catResults = matchCategories("auto");
assert.ok(catResults.some((r) => r.kind === "category" && r.key === "auto_parts"), "matches auto_parts by label");
assert.equal(matchCategories("a").length, 0, "below min length (2) returns nothing");

// Region match: derived from entries, sorted by count desc.
const counts = regionCounts(entries);
assert.equal(counts.get("Chon Buri"), 2);
assert.equal(counts.get("Rayong"), 1);
const regionResults = matchRegions("chon", counts);
assert.equal(regionResults.length, 1);
assert.equal(regionResults[0].label, "Chon Buri");
assert.equal(regionResults[0].count, 2);
assert.equal(regionResults[0].href, "/city/chon_buri");

// Supplier match: name/district/city substring, sorted by trust_score desc.
const supResults = matchSuppliers("chon buri", entries, 8);
assert.equal(supResults.length, 2, "Acme (city) + Chon Buri Plastics (name+city)");
assert.equal(supResults[0].id, "a", "trust_score 82 (Acme) ranks above trust_score 45 (Chon Buri Plastics)");

// Merged search caps at ~12 combined, categories/regions first.
const merged = globalSearch("chon", entries, counts);
assert.ok(merged.length > 0);
assert.equal(merged[0].kind, "region", "region match ranked above supplier matches");

console.log("test_global_search: OK");
