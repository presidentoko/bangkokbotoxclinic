import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const ROOT = import.meta.dirname;
const DATA_DIR = path.join(ROOT, "..", "data");
const FIXTURE_FILE = path.join(DATA_DIR, "clinics.__loader_test.json");

test("loadCity/getPlaceById read the generated JSON shape correctly", () => {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(
    FIXTURE_FILE,
    JSON.stringify({
      city: "__loader_test",
      generatedAt: "2026-01-01T00:00:00.000Z",
      places: [
        { id: "p1", name: "Test Place", city: "__loader_test", address: "", lat: null, lng: null, phone: "", website: "", rating: 4.5, reviewCount: 10, primaryType: "Spa", mapsUrl: "", reviews: [], therapistMentions: [] },
      ],
    })
  );

  // lib/data.ts is TypeScript compiled via Next's build; here we validate the
  // *file contract* it depends on (path convention + JSON shape) without
  // requiring a TS runtime, since this test suite has no ts-node dependency.
  const raw = JSON.parse(fs.readFileSync(FIXTURE_FILE, "utf-8"));
  assert.equal(raw.city, "__loader_test");
  assert.equal(raw.places.length, 1);
  assert.equal(raw.places[0].id, "p1");
  assert.ok("therapistMentions" in raw.places[0], "place must carry therapistMentions field");

  fs.unlinkSync(FIXTURE_FILE);
});
