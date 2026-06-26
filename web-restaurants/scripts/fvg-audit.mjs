// scripts/fvg-audit.mjs
// Step 0 diagnostic: match rate + trust_score distribution for famous-vs-good collections.
// Usage: node scripts/fvg-audit.mjs

import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dir = dirname(fileURLToPath(import.meta.url));
const root = join(__dir, "..");

const seeds = JSON.parse(readFileSync(join(root, "data", "ig-seed.json"), "utf-8"));
const db = JSON.parse(readFileSync(join(root, "data", "master_db.json"), "utf-8"));

function normalize(s) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "").trim();
}

function matchRestaurant(seed, restaurants) {
  if (seed.place_id) {
    const r = restaurants.find((r) => r.place_id === seed.place_id);
    if (r) return r;
  }
  const seedName = normalize(seed.name);
  const cityMatches = restaurants.filter((r) => r.city === seed.city);
  const byName = cityMatches.find((r) => normalize(r.name) === seedName);
  if (byName) return byName;
  if (seed.district) {
    const byDistrict = restaurants.find(
      (r) => normalize(r.name) === seedName && r.district === seed.district
    );
    if (byDistrict) return byDistrict;
  }
  return null;
}

function percentile(sorted, p) {
  const idx = Math.floor((p / 100) * (sorted.length - 1));
  return sorted[idx];
}

function histogram(scores, bins = 10) {
  const min = Math.min(...scores);
  const max = Math.max(...scores);
  const range = max - min || 1;
  const binSize = range / bins;
  const counts = Array(bins).fill(0);
  for (const s of scores) {
    const b = Math.min(bins - 1, Math.floor((s - min) / binSize));
    counts[b]++;
  }
  const maxCount = Math.max(...counts);
  const lines = [];
  for (let i = 0; i < bins; i++) {
    const lo = (min + i * binSize).toFixed(0);
    const hi = (min + (i + 1) * binSize).toFixed(0);
    const bar = "█".repeat(Math.round((counts[i] / maxCount) * 20));
    lines.push(`  ${lo.padStart(3)}–${hi.padStart(3)} | ${bar.padEnd(20)} ${counts[i]}`);
  }
  return lines.join("\n");
}

const categories = [...new Set(seeds.map((s) => s.category))];

for (const slug of categories) {
  const catSeeds = seeds.filter((s) => s.category === slug);
  console.log("\n" + "=".repeat(60));
  console.log(`COLLECTION: ${slug}`);
  console.log("=".repeat(60));
  console.log(`Total seeds : ${catSeeds.length}`);

  const matched = [];
  const unmatched = [];
  for (const seed of catSeeds) {
    const r = matchRestaurant(seed, db.restaurants);
    if (r) matched.push({ seed, restaurant: r });
    else unmatched.push(seed.name);
  }

  console.log(`Matched     : ${matched.length}`);
  console.log(`Unmatched   : ${unmatched.length}`);
  if (unmatched.length) {
    for (const name of unmatched) console.log(`  ✗ ${name}`);
  }

  if (matched.length === 0) {
    console.log("  (no matched entries — skipping distribution)");
    continue;
  }

  const scores = matched.map((m) => m.restaurant.trust_score).sort((a, b) => a - b);
  const p25 = percentile(scores, 25);
  const p50 = percentile(scores, 50);
  const p75 = percentile(scores, 75);

  console.log(`\nTrust Score distribution (n=${scores.length}):`);
  console.log(`  min=${scores[0].toFixed(1)}  p25=${p25.toFixed(1)}  median=${p50.toFixed(1)}  p75=${p75.toFixed(1)}  max=${scores[scores.length - 1].toFixed(1)}`);
  console.log(`\n${histogram(scores)}`);

  // Current thresholds (hardcoded): big_gap<75, holds_up>=85
  const BIG_GAP_CURRENT = 75;
  const HOLDS_UP_CURRENT = 85;
  const bigGap = matched.filter((m) => m.restaurant.trust_score < BIG_GAP_CURRENT);
  const holdsUp = matched.filter((m) => m.restaurant.trust_score >= HOLDS_UP_CURRENT);
  const decent = matched.filter(
    (m) =>
      m.restaurant.trust_score >= BIG_GAP_CURRENT &&
      m.restaurant.trust_score < HOLDS_UP_CURRENT
  );

  console.log(`\nCurrent buckets (big_gap<${BIG_GAP_CURRENT} / holds_up>=${HOLDS_UP_CURRENT}):`);
  console.log(`  big_gap   : ${bigGap.length}`);
  console.log(`  decent    : ${decent.length}`);
  console.log(`  holds_up  : ${holdsUp.length}`);

  // Proposed percentile thresholds
  const tercile1 = percentile(scores, 33);
  const tercile2 = percentile(scores, 67);
  const GUARD_MIN = 80; // never big_gap if >= 80
  const effectiveBigGap = Math.min(tercile1, GUARD_MIN - 0.1);
  const effectiveHoldsUp = Math.max(tercile2, GUARD_MIN);

  const bigGapNew = matched.filter(
    (m) =>
      m.restaurant.trust_score < effectiveBigGap &&
      m.restaurant.trust_score < GUARD_MIN
  );
  const holdsUpNew = matched.filter(
    (m) => m.restaurant.trust_score >= effectiveHoldsUp
  );

  console.log(`\nProposed percentile thresholds (p33/p67 + guardrail >=80 never big_gap):`);
  console.log(`  p33       = ${tercile1.toFixed(1)}  → effective big_gap threshold = ${effectiveBigGap.toFixed(1)}`);
  console.log(`  p67       = ${tercile2.toFixed(1)}  → effective holds_up threshold = ${effectiveHoldsUp.toFixed(1)}`);
  console.log(`  big_gap   : ${bigGapNew.length}`);
  console.log(`  holds_up  : ${holdsUpNew.length}`);
  console.log(`  middle    : ${matched.length - bigGapNew.length - holdsUpNew.length}`);

  console.log("\nMatched venues (name | trust_score | current bucket):");
  for (const { seed, restaurant: r } of matched.sort(
    (a, b) => a.restaurant.trust_score - b.restaurant.trust_score
  )) {
    const bucket =
      r.trust_score < BIG_GAP_CURRENT
        ? "big_gap"
        : r.trust_score >= HOLDS_UP_CURRENT
        ? "holds_up"
        : "decent";
    console.log(
      `  ${r.trust_score.toFixed(1).padStart(5)} | ${bucket.padEnd(10)} | ${r.name}`
    );
  }
}

console.log("\n" + "=".repeat(60));
console.log("AUDIT COMPLETE — review before applying Fix 1 thresholds");
console.log("=".repeat(60));
