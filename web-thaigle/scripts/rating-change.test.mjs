// Checks lib/ratingChange.ts against the real master_db, not just hand-made cases.
//
//   node --test scripts/rating-change.test.mjs

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  CHANGE,
  ratingChange,
  reliableTrend,
  ratingChangeReport,
  ratingChangeFaqs,
  hasRatingChangePage,
} from "../lib/ratingChange.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const db = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "master_db.json"), "utf8"));
const R = db.restaurants;

const b = (count, avg) => ({ count, avg });
const t = (recent, midterm, old) => ({ recent, midterm, old, trend: "insufficient_data" });

test("a handful of recent reviews is not a trend", () => {
  // The build called this "declining": two recent reviews against 32 old ones.
  assert.equal(ratingChange(t(b(2, 4.5), b(16, 4.94), b(32, 4.78))), null);
  assert.equal(reliableTrend(t(b(2, 4.5), b(16, 4.94), b(32, 4.78))), "insufficient_data");
});

test("falls back to the 3-12 month bucket only when the 1+ year one is too small", () => {
  const c = ratingChange(t(b(25, 3.9), b(30, 4.5), b(5, 4.9)));
  assert.equal(c.earlier.bucket, "midterm");
  assert.equal(c.direction, "down");
  assert.equal(ratingChange(t(b(25, 3.9), b(30, 4.5), b(22, 4.0))).earlier.bucket, "old");
});

test("the threshold is inclusive and the delta is what the page prints", () => {
  const c = ratingChange(t(b(20, 4.1), b(0, null), b(20, 4.5)));
  assert.equal(c.delta, -0.4);
  assert.equal(c.direction, "down");
  assert.equal(ratingChange(t(b(20, 4.2), b(0, null), b(20, 4.5))).direction, "flat");
});

test("every listed mover satisfies the rule, on the real data", () => {
  for (const city of ["bangkok", "pattaya"]) {
    const rep = ratingChangeReport(R, city);
    for (const m of [...rep.down, ...rep.up]) {
      assert.ok(m.change.recent.count >= CHANGE.minRecent, m.r.name);
      assert.ok(m.change.earlier.count >= CHANGE.minEarlier, m.r.name);
      assert.ok(Math.abs(m.change.delta) >= CHANGE.minDelta, m.r.name);
      assert.ok(!/closed/i.test(m.r.business_status || ""), `${m.r.name} is ${m.r.business_status}`);
    }
    assert.equal(rep.flat + rep.down.length + rep.up.length, rep.eligible);
    assert.ok(rep.down.every((m, i) => i === 0 || rep.down[i - 1].change.delta <= m.change.delta), "down sorted");
    assert.ok(rep.up.every((m, i) => i === 0 || rep.up[i - 1].change.delta >= m.change.delta), "up sorted");
    for (const d of rep.districts) assert.ok(d.down + d.up <= d.eligible);
  }
});

test("FAQ answers carry numbers, no NaN/undefined", () => {
  const rep = ratingChangeReport(R, "bangkok");
  const faqs = ratingChangeFaqs(rep, "Bangkok", "21 August 2026");
  assert.ok(faqs.length >= 4);
  for (const f of faqs) assert.ok(!/NaN|undefined|null/.test(f.q + f.a), f.a);
  assert.match(faqs[0].a, new RegExp(String(rep.eligible)));
});

test("report the real-data numbers", () => {
  for (const city of [...new Set(R.map((r) => r.city))]) {
    const rep = ratingChangeReport(R, city);
    const was = R.filter((r) => r.city === city && r.rating_trend.trend === "declining").length;
    console.log(`${city}: open ${rep.total}, comparable ${rep.eligible}, down ${rep.down.length}, up ${rep.up.length}, flat ${rep.flat}, median |Δ| ${rep.medianAbsDelta}, median sample ${rep.medianSample}, districts ${rep.districts.length}, page ${hasRatingChangePage(R, city)} | build-labelled declining ${was}`);
    for (const m of rep.down.slice(0, 3)) console.log(`   ↓ ${m.r.name} (${m.r.district}) ${m.change.earlier.avg}→${m.change.recent.avg} n=${m.change.earlier.count}/${m.change.recent.count}`);
    for (const m of rep.up.slice(0, 3)) console.log(`   ↑ ${m.r.name} (${m.r.district}) ${m.change.earlier.avg}→${m.change.recent.avg} n=${m.change.earlier.count}/${m.change.recent.count}`);
  }
});
