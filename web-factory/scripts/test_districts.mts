import assert from "node:assert";
import {
  normalizeDistrict,
  buildDistrictIndex,
  districtsForBuild,
  districtsForCity,
  districtBySlug,
  suppliersInDistrict,
  districtRedirects,
  MIN_DISTRICT_SUPPLIERS,
} from "../lib/districts.ts";
import type { MasterDb, Supplier } from "../lib/types.ts";

// --- normalizeDistrict: Mueang/Muang variants collapse to ONE key. ---
const a = normalizeDistrict("Mueang Chon Buri", "chon_buri");
const b = normalizeDistrict("Muang Chonburi", "chonburi"); // misspelled city slug too
const c = normalizeDistrict("Chon Buri", "chon_buri"); // bare province == capital district
assert.ok(a && b && c, "all three resolve");
assert.equal(a!.key, b!.key, "Mueang === Muang key");
assert.equal(a!.key, c!.key, "bare province folds to capital");
assert.equal(a!.key, "mueang-chon-buri", "capital key shape");

// Two provinces' capitals must NOT merge.
const ray = normalizeDistrict("Mueang Rayong", "rayong");
assert.ok(ray && ray.key !== a!.key, "different provinces' capitals stay separate");

// Si Racha transliteration family collapses.
const s1 = normalizeDistrict("Si Racha", "chon_buri");
const s2 = normalizeDistrict("Sriracha", "chon_buri");
assert.equal(s1!.key, s2!.key, "Si Racha === Sriracha");
assert.equal(s1!.key, "si-racha", "si-racha slug");

// Garbage (addresses, sub-districts, numerics) rejected.
assert.equal(normalizeDistrict("123 Moo 4 Soi 5", "chon_buri"), null, "address junk -> null");
assert.equal(normalizeDistrict("", "chon_buri"), null, "empty -> null");

// Pure Thai script: only capital (เมือง) salvageable.
assert.ok(normalizeDistrict("เมือง", "chon_buri"), "Thai capital salvaged");
assert.equal(normalizeDistrict("ตำบลหนองข้าง", "chon_buri"), null, "Thai sub-district -> null");

// --- index / threshold / redirects on a tiny db. ---
function sup(district: string, city = "chon_buri"): Supplier {
  return { id: `${district}-${Math.round(Math.random() * 1e9)}`, district, city, city_label: "Chon Buri" } as unknown as Supplier;
}
// 6 capital-district suppliers (>= threshold) under mixed spellings + 1 thin district.
const suppliers: Supplier[] = [
  sup("Mueang Chon Buri"), sup("Muang Chonburi"), sup("Chon Buri"),
  sup("Mueang Chon Buri"), sup("Muang"), sup("เมือง"),
  sup("Bang Lamung"), // count 1 -> thin, dropped
];
const db = { suppliers, district_counts: {}, city_counts: {}, generated_at: "2026-01-01" } as unknown as MasterDb;

const built = districtsForBuild(db);
const capital = built.find((g) => g.slug === "mueang-chon-buri");
assert.ok(capital, "capital district indexed");
assert.equal(capital!.count, 6, "all 6 spelling variants merged into one count");
assert.ok(!built.some((g) => g.count < MIN_DISTRICT_SUPPLIERS), "thin districts excluded");

assert.equal(suppliersInDistrict(db, "mueang-chon-buri").length, 6, "suppliersInDistrict count");
assert.ok(districtBySlug(db, "mueang-chon-buri"), "lookup hit");
assert.equal(districtBySlug(db, "bang-lamung"), null, "thin district not looked up");
assert.deepEqual(districtsForCity(db, "chon_buri").map((g) => g.slug), ["mueang-chon-buri"], "city districts");

const redirects = districtRedirects(db);
// e.g. "muang-chonburi" (raw slug) -> "mueang-chon-buri" (canonical)
assert.ok(redirects.get("muang-chonburi") === "mueang-chon-buri", "variant 301 -> canonical");
assert.ok(!redirects.has("mueang-chon-buri"), "canonical does not redirect to itself");

console.log("test_districts: OK");
