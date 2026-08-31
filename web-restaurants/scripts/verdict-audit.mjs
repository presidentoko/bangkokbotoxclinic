// scripts/verdict-audit.mjs
// Verifies lib/verdict.ts against the real master_db before any of it ships.
// Usage: node scripts/verdict-audit.mjs
//
// The classifier makes a public, named claim about real businesses ("its recent
// reviews average lower"), so this asserts the guardrails rather than just
// printing a histogram. Non-zero exit = do not ship.

import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dir = dirname(fileURLToPath(import.meta.url));
const root = join(__dir, "..");

const db = JSON.parse(readFileSync(join(root, "data", "master_db.json"), "utf-8"));
const restaurants = db.restaurants;

// Kept in sync with lib/verdict.ts by the assertions below; this script is a
// plain .mjs so it can't import the .ts module directly.
const MIN_TREND_BUCKET = 8;
const MIN_TREND_DROP = 0.25;
const MIN_ANALYSED_REVIEWS = 15;
const STRONG_TRUST = 88;
const SOLID_TRUST = 78;
const GEM_MAX_REVIEWS = 400;

const src = readFileSync(join(root, "lib", "verdict.ts"), "utf-8");
const failures = [];

function check(name, ok, detail = "") {
  if (ok) {
    console.log(`  ok   ${name}`);
  } else {
    console.log(`  FAIL ${name}${detail ? ` — ${detail}` : ""}`);
    failures.push(name);
  }
}

// ── The constants here must match the module ──────────────────────────────────
console.log("\nConstants in sync with lib/verdict.ts");
for (const [name, want] of [
  ["MIN_TREND_BUCKET", MIN_TREND_BUCKET],
  ["MIN_TREND_DROP", MIN_TREND_DROP],
  ["MIN_ANALYSED_REVIEWS", MIN_ANALYSED_REVIEWS],
]) {
  const m = src.match(new RegExp(`${name} = ([\\d.]+)`));
  check(`${name} = ${want}`, m && Number(m[1]) === want, m ? `module says ${m[1]}` : "not found");
}

function classify(r) {
  const analysed = r.scraped_review_count ?? 0;
  if (analysed < MIN_ANALYSED_REVIEWS) return "thin_data";
  const recent = r.rating_trend?.recent;
  const old = r.rating_trend?.old;
  const comparable =
    !!recent?.avg && !!old?.avg &&
    recent.count >= MIN_TREND_BUCKET && old.count >= MIN_TREND_BUCKET;
  if (comparable && old.avg - recent.avg >= MIN_TREND_DROP) return "slipping";
  if (r.trust_score >= STRONG_TRUST && r.total_reviews < GEM_MAX_REVIEWS) return "hidden_gem";
  if (r.trust_score >= STRONG_TRUST) return "holds_up";
  if (r.trust_score >= SOLID_TRUST) return "solid";
  return "mixed";
}

const tagged = restaurants.map((r) => ({ r, kind: classify(r) }));
const counts = {};
for (const { kind } of tagged) counts[kind] = (counts[kind] || 0) + 1;

console.log("\nVerdict distribution");
for (const [k, n] of Object.entries(counts).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${k.padEnd(12)} ${String(n).padStart(5)}  ${((n / restaurants.length) * 100).toFixed(1)}%`);
}

// ── Guardrail assertions ──────────────────────────────────────────────────────
console.log("\nGuardrails");

const slipping = tagged.filter((t) => t.kind === "slipping").map((t) => t.r);

const thinBaseline = slipping.filter(
  (r) => r.rating_trend.old.count < MIN_TREND_BUCKET || r.rating_trend.recent.count < MIN_TREND_BUCKET
);
check(
  `no "slipping" call rests on fewer than ${MIN_TREND_BUCKET} reviews per bucket`,
  thinBaseline.length === 0,
  thinBaseline.length ? `${thinBaseline.length} offenders, e.g. ${thinBaseline[0].name}` : ""
);

const smallDrop = slipping.filter(
  (r) => r.rating_trend.old.avg - r.rating_trend.recent.avg < MIN_TREND_DROP
);
check(
  `every "slipping" call has a drop of at least ${MIN_TREND_DROP}★`,
  smallDrop.length === 0,
  smallDrop.length ? `${smallDrop.length} offenders` : ""
);

const underAnalysed = tagged.filter(
  (t) => t.kind !== "thin_data" && t.r.scraped_review_count < MIN_ANALYSED_REVIEWS
);
check(
  "no verdict is issued without enough analysed reviews",
  underAnalysed.length === 0,
  underAnalysed.length ? `${underAnalysed.length} offenders` : ""
);

// A hub page needs enough entries to be worth indexing, and no bucket should
// swallow the database (a label everything shares says nothing).
console.log("\nBucket sanity");
for (const kind of ["slipping", "hidden_gem", "holds_up", "mixed"]) {
  const n = counts[kind] || 0;
  check(`${kind} has enough entries for a hub page (>=25)`, n >= 25, `${n} entries`);
}
const biggest = Math.max(...Object.values(counts));
check(
  "no single verdict covers more than half the database",
  biggest <= restaurants.length / 2,
  `largest bucket is ${biggest} of ${restaurants.length}`
);

// ── Title length ──────────────────────────────────────────────────────────────
//
// A verdict that Google truncates away is a verdict nobody reads, and the
// verdict clause sits at the END of the title (the venue name has to lead,
// because the name is the query). So headline length is load-bearing, not
// cosmetic. The first draft of these phrasings put 74% of titles over the
// limit; this keeps that from creeping back.
console.log("\nTitle length (SERP renders ~60 chars)");
const SERP_LIMIT = 60;
function headline(r) {
  const t = r.trust_score.toFixed(0);
  const kind = classify(r);
  if (kind === "thin_data") return `${r.name} — too few recent reviews to judge`;
  if (kind === "slipping") return `${r.name} — recent reviews are lower`;
  if (kind === "hidden_gem") return `${r.name} — under the radar, ${t}/100`;
  if (kind === "holds_up") return `${r.name} — holds up, ${t}/100`;
  if (kind === "solid") return `${r.name} — worth it? ${t}/100`;
  return `${r.name} — mixed reviews, ${t}/100`;
}
const titles = restaurants.map(headline);
const over = titles.filter((t) => t.length > SERP_LIMIT);
const lens = titles.map((t) => t.length).sort((a, b) => a - b);
console.log(
  `  p50 ${lens[Math.floor(lens.length * 0.5)]} · p90 ${lens[Math.floor(lens.length * 0.9)]} · over ${SERP_LIMIT}: ${over.length} (${((over.length / titles.length) * 100).toFixed(0)}%)`
);
check(
  `at most 20% of titles exceed ${SERP_LIMIT} chars`,
  over.length / titles.length <= 0.2,
  `${((over.length / titles.length) * 100).toFixed(0)}% over — shorten the headlines in lib/verdict.ts`
);
// Long venue names we can't shorten; a verdict clause we can.
const clauseTooLong = titles.filter((t) => t.length - (t.indexOf(" — ") + 3) > 32);
check(
  "no verdict clause is longer than 32 chars",
  clauseTooLong.length === 0,
  clauseTooLong.length ? `e.g. "${clauseTooLong[0].slice(clauseTooLong[0].indexOf(" — ") + 3)}"` : ""
);

// ── Spot-check the claims we'd actually publish ────────────────────────────────
console.log("\nSample slipping claims (these become <title> text)");
for (const r of slipping.slice(0, 5)) {
  const t = r.rating_trend;
  console.log(
    `  ${r.name}\n    Google ${r.rating.toFixed(1)}★ · recent ${t.recent.avg.toFixed(2)} (n=${t.recent.count}) vs old ${t.old.avg.toFixed(2)} (n=${t.old.count})`
  );
}

console.log(
  failures.length === 0
    ? "\nAll verdict guardrails hold.\n"
    : `\n${failures.length} guardrail(s) FAILED — do not ship.\n`
);
process.exit(failures.length === 0 ? 0 : 1);
