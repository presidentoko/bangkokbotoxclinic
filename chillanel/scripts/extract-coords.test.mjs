import { test } from "node:test";
import assert from "node:assert/strict";
import { parseCoordsFromMapsUrl } from "./extract-coords.mjs";

// Real URLs sampled from the live Bangkok dataset.
const REAL_URL_1 =
  "https://www.google.com/maps/place/Sabaikay+Head+%26+Skin+%E2%80%93+Head+Spa+%28ICONSIAM%29/data=!4m7!3m6!1s0x30e299004239fe13:0xf7ebafcadf06a51a!8m2!3d13.7290061!4d100.5086793!16s%2Fg%2F11vt5_ktc6!19sChIJE_45QgCZ4jARGqUG38qv6_c?authuser=0&hl=en&rclk=1";
const REAL_URL_2 =
  "https://www.google.com/maps/place/Sabaikay+Head+Massage+%E2%80%93+Pratunam/data=!4m7!3m6!1s0x30e29f007a3a70b1:0xd1637677beafef7e!8m2!3d13.7509602!4d100.5374534!16s%2Fg%2F11xnr6w272!19sChIJsXA6egCf4jARfu-vvnd2Y9E?authuser=0&hl=en&rclk=1";

test("parses lat/lng from a real Google Maps share URL", () => {
  assert.deepEqual(parseCoordsFromMapsUrl(REAL_URL_1), { lat: 13.7290061, lng: 100.5086793 });
});

test("parses a second real URL correctly (not just the first fixture)", () => {
  assert.deepEqual(parseCoordsFromMapsUrl(REAL_URL_2), { lat: 13.7509602, lng: 100.5374534 });
});

test("returns null for an empty string", () => {
  assert.equal(parseCoordsFromMapsUrl(""), null);
});

test("returns null for null/undefined", () => {
  assert.equal(parseCoordsFromMapsUrl(null), null);
  assert.equal(parseCoordsFromMapsUrl(undefined), null);
});

test("returns null for a URL with no !3d!4d segment", () => {
  assert.equal(parseCoordsFromMapsUrl("https://www.google.com/maps/place/Some+Place/"), null);
});

test("handles negative coordinates (southern/western hemisphere, general correctness)", () => {
  assert.deepEqual(parseCoordsFromMapsUrl("...!3d-33.8688!4d151.2093..."), { lat: -33.8688, lng: 151.2093 });
});
