import assert from "node:assert";
import { loadMasterDb } from "../lib/data.ts";

const db = await loadMasterDb();

// No district_counts key contains a known junk/variant after normalization.
const keys = Object.keys(db.district_counts);
for (const bad of ["Sriracha", "Banglamung", "Panthong", "เมือง", "อำเภอเมือง", "อเมือง"]) {
  assert.ok(!keys.some((k) => k.endsWith("/" + bad)), `district_counts should not contain ${bad}`);
}

// Si Racha is filed under chon_buri only (rayong mis-file corrected).
assert.ok(keys.includes("chon_buri/Si Racha District"), "expected chon_buri/Si Racha District");
assert.ok(!keys.some((k) => k === "rayong/Si Racha District"), "rayong Si Racha should be corrected");

// Every supplier with a district now has a clean ASCII district_slug.
for (const s of db.suppliers) {
  if (s.district) {
    assert.ok(/^[a-z0-9-]+$/.test(s.district_slug ?? ""), `bad slug for ${s.district}: ${s.district_slug}`);
  }
}

// Counts are positive and the Si Racha merge absorbed the variants (was 184 + 5 + ...).
assert.ok(db.district_counts["chon_buri/Si Racha District"] >= 184, "Si Racha count should absorb variants");

console.log("test_data_normalize: OK");
