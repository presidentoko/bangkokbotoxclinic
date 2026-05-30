import assert from "node:assert";
import { normalizeDistrict, districtSlug } from "../lib/districts.ts";

// 1. Spelling/space variants merge to one canonical (Si Racha).
for (const raw of ["Si Racha District", "Sriracha", "Sri Racha", "Srira", "tungsukla Sriracha"]) {
  const c = normalizeDistrict("chon_buri", raw);
  assert.ok(c, `expected canonical for ${raw}`);
  assert.equal(c!.name, "Si Racha District", `name for ${raw}`);
  assert.equal(c!.slug, "si-racha-district", `slug for ${raw}`);
  assert.equal(c!.citySlug, "chon_buri", `citySlug for ${raw}`);
}

// 2. Thai-script + admin-prefix variants merge (Mueang Samut Sakhon).
for (const raw of ["Mueang Samut Sakhon District", "เมือง", "อำเภอเมือง", "อเมือง", "Muang", "Mueng", "Samutsakorn"]) {
  const c = normalizeDistrict("samut_sakhon", raw);
  assert.ok(c, `expected canonical for ${raw}`);
  assert.equal(c!.name, "Mueang Samut Sakhon District", `name for ${raw}`);
}

// 3. p/ph spelling variants (Phan Thong).
for (const raw of ["Phan Thong District", "Panthong", "Phanthong", "Phantong", "PANTHONG", "Pantong District", "พานทอง"]) {
  const c = normalizeDistrict("chon_buri", raw);
  assert.equal(c?.name, "Phan Thong District", `name for ${raw}`);
}

// 4. Sub-locality rolls up to its parent district (Pattaya -> Bang Lamung).
assert.equal(normalizeDistrict("chon_buri", "Pattaya")?.name, "Bang Lamung District");
assert.equal(normalizeDistrict("chon_buri", "Banglamung")?.name, "Bang Lamung District");

// 5. City mis-file is corrected (Si Racha is chon_buri, not rayong).
assert.equal(normalizeDistrict("rayong", "Si Racha District")?.citySlug, "chon_buri");
assert.equal(normalizeDistrict("chonburi", "Sriracha")?.citySlug, "chon_buri");

// 6. Junk values yield null (no district page).
for (const raw of ["61", "89", "25", "172 หมู่8 ซอยสุขสวัสดิ์72", "Khlong Toei Nuea Subdistrict", "Debaratana Road Bang Na Nuea Sub-district", "Bangkok"]) {
  assert.equal(normalizeDistrict("bangkok", raw), null, `junk ${raw} should be null`);
}

// 7. Unknown-but-plausible small district is preserved as its own canonical.
const ong = normalizeDistrict("nakhon_nayok", "Ongkharak District");
assert.equal(ong?.name, "Ongkharak District");
assert.equal(ong?.slug, "ongkharak-district");

// 8. districtSlug is stable ASCII.
assert.equal(districtSlug("Si Racha District"), "si-racha-district");

console.log("test_districts: OK");
