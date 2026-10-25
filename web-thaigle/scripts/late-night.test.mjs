// Checks lib/lateNight.ts against the real spa / muay-thai data.
//
//   node --import ./scripts/alias-register.mjs --test scripts/late-night.test.mjs

import { test } from "node:test";
import assert from "node:assert/strict";

const { lateReport, hasLatePage, LATE, BUCKETS } = await import("../lib/lateNight.ts");
const { summarizeHours } = await import("../lib/vsMetrics.ts");
const { loadNicheDb, qualifyingNichePlaces } = await import("../lib/niches.ts");
const { AREAS } = await import("../lib/areas.ts");

const week = (v) => JSON.stringify(Object.fromEntries(
  ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((d) => [d, typeof v === "function" ? v(d) : v]),
));

test("a weekend-only late night is counted at its weekday hour", () => {
  const h = summarizeHours(week((d) => (d === "Saturday" ? "10 AM to 2 AM" : "10 AM to 10 PM")));
  assert.equal(h.latestClose, 26 * 60);
  assert.equal(h.earliestClose, 22 * 60);
  const r = lateReport([{ id: "a", slug: "a", name: "A", city: "X", rating: 4.5, review_count: 100, opening_hours_json: week((d) => (d === "Saturday" ? "10 AM to 2 AM" : "10 AM to 10 PM")) }], "X");
  assert.equal(r.midnight.length, 0);
});

test("closed days don't drag the nightly close down", () => {
  const h = summarizeHours(week((d) => (d === "Monday" ? "Closed" : "6 PM to 2 AM")));
  assert.equal(h.earliestClose, 26 * 60);
});

for (const niche of ["spa", "muay-thai"]) {
  test(`${niche}: report is internally consistent on the real data`, async () => {
    const places = qualifyingNichePlaces(niche, (await loadNicheDb(niche)).places);
    for (const city of ["Bangkok", "Phuket", "Chiang Mai", "Pattaya"]) {
      const r = lateReport(places, city);
      assert.equal(r.buckets.reduce((a, b) => a + b, 0) + r.open24.length, r.known);
      for (const v of r.midnight) assert.ok(v.hours.earliestClose >= LATE.midnight && !v.hours.open24, v.p.name);
      assert.ok(r.midnight.every((v, i) => i === 0 || (r.midnight[i - 1].adjusted ?? -1) >= (v.adjusted ?? -1)));
      const areas = city === "Bangkok"
        ? AREAS.map((a) => {
            const ps = r.midnight.filter((v) => a.pattern.test(`${v.p.address ?? ""} ${v.p.name}`));
            return `${a.slug}:${ps.length}`;
          }).join(" ")
        : "";
      console.log(`${niche}/${city}: total ${r.total}, known ${r.known}, midnight ${r.midnight.length}, 1am+ ${r.oneAm}, 24h ${r.open24.length}, prior ${r.prior}, page ${hasLatePage(places, city)}`);
      console.log(`   buckets ${BUCKETS.map((b, i) => `${b.label}=${r.buckets[i]}`).join(", ")}`);
      if (areas) console.log(`   midnight by area ${areas}`);
      console.log(`   top: ${r.midnight.slice(0, 4).map((v) => `${v.p.name} ★${v.p.rating}/${v.p.review_count}`).join(" | ")}`);
      console.log(`   24h: ${r.open24.slice(0, 6).map((v) => v.p.name).join(" | ")}`);
    }
  });
}
