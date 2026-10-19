// Checks lib/vsMetrics.ts against the real dataset, not just hand-picked cases.
//
//   node --test scripts/vs-metrics.test.mjs
//
// Node 24 strips the types from the .ts import, so this runs with no build
// step and no test framework (the project has neither). Kept as .mjs so the
// type checker does not try to resolve the ".ts" extension in the import.

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  adjustedRating,
  summarizeHours,
  formatClock,
  shortName,
  pairNames,
  joinAnd,
  compareVenues,
} from "../lib/vsMetrics.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const NICHES = ["cooking", "coworking", "diving", "muay-thai", "spa", "wellness", "yoga-pilates"];

function allPlaces() {
  const out = [];
  for (const n of NICHES) {
    const db = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "by-niche", `${n}.json`), "utf8"));
    for (const p of db.places) out.push(p);
  }
  return out;
}

const week = (v) => JSON.stringify(Object.fromEntries(
  ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((d) => [d, typeof v === "function" ? v(d) : v]),
));

test("hours: Google's collapsed meridiem and after-midnight closes", () => {
  const h = (s) => summarizeHours(week(s));
  // "3 to 6 PM" is 3 PM-6 PM: 3 hours, not 15
  assert.equal(h("3 to 6 PM").avgHoursPerOpenDay, 3);
  // "7 AM to 1 AM" runs past midnight: 18 h, closes at 25:00
  const late = h("7 AM to 1 AM");
  assert.equal(late.avgHoursPerOpenDay, 18);
  assert.equal(late.latestClose, 1500);
  // "12 PM to 12 AM" is noon to midnight
  assert.equal(h("12 PM to 12 AM").avgHoursPerOpenDay, 12);
  // split day, shared meridiem on the first range: 9-10 AM + 12-3 PM = 4 h
  const split = h("9 to 10 AM, 12 to 3 PM");
  assert.equal(split.avgHoursPerOpenDay, 4);
  assert.equal(split.latestClose, 15 * 60);
  // minutes survive: 11:30 AM-2:30 PM + 5:30-10 PM = 3 + 4.5 h
  assert.equal(h("11:30 AM to 2:30 PM, 5:30 to 10 PM").avgHoursPerOpenDay, 7.5);
  // 24 hours
  const all = h("Open 24 hours");
  assert.equal(all.open24, true);
  assert.equal(all.daysOpen, 7);
});

test("hours: closed days, and a week that cannot be read stays unknown", () => {
  const sundayShut = summarizeHours(week((d) => (d === "Sunday" ? "Closed" : "9 AM to 5 PM")));
  assert.equal(sundayShut.daysOpen, 6);
  assert.equal(sundayShut.opensSunday, false);
  // one unreadable day must void the summary, not produce "open 6 days"
  assert.equal(summarizeHours(week((d) => (d === "Friday" ? "by appointment" : "9 AM to 5 PM"))).known, false);
  assert.equal(summarizeHours(JSON.stringify({ Monday: "9 AM to 5 PM" })).known, false);
  assert.deepEqual(summarizeHours(""), { known: false });
  assert.equal(summarizeHours("not json").known, false);
  assert.equal(summarizeHours(week("Closed")).known, false);
});

test("hours: the parser reads nearly every real record", () => {
  const withHours = allPlaces().filter((p) => p.opening_hours_json && p.opening_hours_json !== "{}");
  let ok = 0;
  const bad = [];
  for (const p of withHours) {
    if (summarizeHours(p.opening_hours_json).known) ok++;
    else if (bad.length < 6) bad.push(p.opening_hours_json.slice(0, 140));
  }
  const rate = ok / withHours.length;
  console.log(`  hours parsed: ${ok}/${withHours.length} (${(rate * 100).toFixed(1)}%)`);
  if (bad.length) console.log("  unparsed examples:", bad);
  assert.ok(rate >= 0.95, `only ${(rate * 100).toFixed(1)}% of real hours parse`);
});

test("hours: every parsed week is physically possible", () => {
  for (const p of allPlaces()) {
    const s = summarizeHours(p.opening_hours_json);
    if (!s.known) continue;
    assert.ok(s.daysOpen >= 1 && s.daysOpen <= 7, p.name);
    assert.ok(s.avgHoursPerOpenDay > 0 && s.avgHoursPerOpenDay <= 24, `${p.name}: ${s.avgHoursPerOpenDay}`);
    assert.ok(s.latestClose > 0 && s.latestClose <= 2880, `${p.name}: close ${s.latestClose}`);
  }
});

test("adjusted rating: evidence beats a perfect score on a handful of reviews", () => {
  const prior = 4.6;
  const thin = adjustedRating(4.9, 12, prior);
  const solid = adjustedRating(4.7, 1400, prior);
  assert.ok(solid > thin, `${solid} should beat ${thin}`);
  // barely moves a well-evidenced rating
  assert.ok(Math.abs(adjustedRating(4.7, 1400, prior) - 4.7) < 0.02);
  // no reviews, no rating
  assert.equal(adjustedRating(null, 10, prior), null);
  assert.equal(adjustedRating(4.5, 0, prior), null);
});

test("formatClock", () => {
  assert.equal(formatClock(9 * 60), "9 AM");
  assert.equal(formatClock(22 * 60 + 30), "10:30 PM");
  assert.equal(formatClock(1500), "1 AM (next day)");
  assert.equal(formatClock(1440), "12 AM");
});

test("shortName keeps the branch, drops the category tail, never ends in an ellipsis", () => {
  assert.equal(shortName("Bhu Mhai Spa-ICONSIAM : Spa & Massage : Charoen Nakhon"), "Bhu Mhai Spa-ICONSIAM");
  assert.equal(shortName("Health Land Spa & Massage - Sukhumvit"), "Health Land Spa & Massage - Sukhumvit");
  // long: cut at its own separator, readable Latin segment preferred over the Thai twin
  assert.equal(shortName("กินกับเชฟอั๋น - Gin Restaurant - Since 2014 by Chef Aun Thai Cooking Class"), "Gin Restaurant");
  assert.equal(shortName("Atlas Workspace Asoke - Coworking & Serviced Office in Bangkok Sukhumvit"), "Atlas Workspace Asoke");
  // nothing to split on: cut at a word, no ellipsis
  const long = shortName("Siamese Cookery House Bangkok Thai Cooking Class And Market Tour Experience");
  assert.ok(long.length <= 52 && !long.endsWith("…") && !long.endsWith(" "), long);
});

test("pairNames falls back to full names rather than showing two identical labels", () => {
  const [x, y] = pairNames({ name: "Lotus Spa - Silom" }, { name: "Lotus Spa - Silom" });
  assert.equal(x, "Lotus Spa - Silom");
  assert.equal(y, "Lotus Spa - Silom");
  assert.deepEqual(pairNames({ name: "A Spa" }, { name: "B Spa" }), ["A Spa", "B Spa"]);
});

test("joinAnd", () => {
  assert.equal(joinAnd(["a"]), "a");
  assert.equal(joinAnd(["a", "b"]), "a and b");
  assert.equal(joinAnd(["a", "b", "c"]), "a, b and c");
});

test("compareVenues never leaks NaN / undefined / null into text, on real pairs", () => {
  const BAD = /NaN|undefined|\bnull\b|\[object|Infinity/;
  for (const niche of NICHES) {
    const db = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "by-niche", `${niche}.json`), "utf8"));
    const rated = db.places
      .filter((p) => p.rating != null && (p.review_count ?? 0) >= 60 && !p.permanently_closed)
      .sort((a, b) => b.review_count - a.review_count)
      .slice(0, 24);
    const ctx = { niche, nicheLabel: niche, medianRating: 4.6, scopeLabel: "Bangkok" };
    let n = 0;
    for (let i = 0; i < rated.length; i++) {
      for (let j = i + 1; j < rated.length; j++) {
        const c = compareVenues(rated[i], rated[j], ctx);
        const text = [c.headline, ...c.howToChoose, ...c.faqs.flatMap((f) => [f.q, f.a]), ...c.rows.flatMap((r) => [r.label, r.a, r.b])].join(" | ");
        assert.ok(!BAD.test(text), `${niche}: ${rated[i].name} vs ${rated[j].name}\n${text.match(BAD)}\n${text.slice(0, 400)}`);
        assert.ok(c.rows.length >= 4, "too few rows");
        assert.ok(c.faqs.length >= 4, "too few FAQs");
        for (const r of c.rows) assert.ok(r.a !== "" && r.b !== "", `empty cell in ${r.id}`);
        if (c.pick === null) assert.match(c.headline, /too close to call/);
        else assert.match(c.headline, /comes out ahead/);
        n++;
      }
    }
    console.log(`  ${niche}: ${n} pairs clean`);
  }
});

// ── the rule that decides who is "ahead" ─────────────────────────────────────

const venue = (over) => ({
  id: "x", slug: "x", niche: "spa", name: "V", address: "1 Road, Bangkok", city: "Bangkok",
  rating: 4.6, review_count: 300, trust_score: 80, price_min_thb: 0, price_unit: "unknown",
  is_beginner_friendly: false, languages: { th: true }, reviews_sample: [],
  opening_hours_json: week("10 AM to 8 PM"),
  ...over,
});
const CTX = { niche: "spa", nicheLabel: "Spa", medianRating: 4.6, scopeLabel: "Silom" };

test("pick: staying open later and more days never makes a venue 'ahead' on its own", () => {
  const early = venue({ id: "a", name: "Early Spa", opening_hours_json: week((d) => (d === "Sunday" ? "Closed" : "10 AM to 6 PM")) });
  const late = venue({ id: "b", name: "Late Spa", opening_hours_json: week("10 AM to 2 AM") });
  const c = compareVenues(early, late, CTX);
  // identical on every quality signal, so the call must be "too close" ...
  assert.equal(c.pick, null);
  assert.match(c.headline, /too close to call/);
  // ... while the convenience gap is still reported to the reader
  assert.ok(c.rows.find((r) => r.id === "close")?.edge === "b");
  assert.ok(c.rows.find((r) => r.id === "days")?.edge === "b");
});

test("pick: a real quality gap is called, its reasons are quality only, and convenience is reported separately", () => {
  const strong = venue({ id: "a", name: "Strong Spa", rating: 4.9, review_count: 1200, trust_score: 90, opening_hours_json: week("10 AM to 6 PM") });
  const weak = venue({ id: "b", name: "Weak Spa", rating: 4.5, review_count: 80, trust_score: 70, opening_hours_json: week("10 AM to 2 AM") });
  const c = compareVenues(strong, weak, CTX);
  assert.equal(c.pick, "a");
  assert.match(c.headline, /Strong Spa comes out ahead of Weak Spa/);
  const [ahead, rest] = c.headline.split("On convenience:");
  assert.ok(!/opening hours|weekly availability/.test(ahead), `convenience leaked into the reasons: ${ahead}`);
  assert.match(rest ?? "", /Weak Spa has later opening hours/);
});

test("rows: a venue with unreadable hours drops the hours rows rather than guessing", () => {
  const ok = venue({ id: "a" });
  const broken = venue({ id: "b", opening_hours_json: week("by appointment") });
  const ids = compareVenues(ok, broken, CTX).rows.map((r) => r.id);
  for (const id of ["days", "daylen", "close", "sunday"]) assert.ok(!ids.includes(id), `${id} should be absent`);
  assert.ok(ids.includes("rating"));
});

test("rows: price appears only when both venues list one, in the same unit", () => {
  const ids = (a, b) => compareVenues(a, b, CTX).rows.map((r) => r.id);
  assert.ok(!ids(venue({ id: "a", price_min_thb: 400, price_unit: "hour" }), venue({ id: "b" })).includes("price"));
  const both = compareVenues(
    venue({ id: "a", price_min_thb: 400, price_unit: "hour" }),
    venue({ id: "b", price_min_thb: 900, price_unit: "hour" }), CTX);
  assert.equal(both.rows.find((r) => r.id === "price").edge, "a");
  // different units are shown but never ranked
  const mixed = compareVenues(
    venue({ id: "a", price_min_thb: 400, price_unit: "hour" }),
    venue({ id: "b", price_min_thb: 9000, price_unit: "day" }), CTX);
  assert.equal(mixed.rows.find((r) => r.id === "price").edge, null);
});
