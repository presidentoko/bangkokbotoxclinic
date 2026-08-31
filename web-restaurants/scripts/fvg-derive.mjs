// scripts/fvg-derive.mjs
// Derives data/ig-seed.json from the review corpus we already collected.
// Usage: node scripts/fvg-derive.mjs [--write]
//
// The hand-written seed this replaces held 20 Bangkok cafes, matched a place_id
// for only 15 of them, and asserted an ig_signal ("Frequently tagged on
// Instagram") that came from nowhere checkable — tag_count was null on every
// row because we have never had tag counts.
//
// The reviews do carry a real version of that signal: people say, in their own
// words, that they came because of Instagram or TikTok, or that the hype did
// not survive contact. Every entry this produces keeps the sentence it came
// from, so the claim on the page is quotable rather than asserted.
//
// What is deliberately NOT counted, established by reading samples:
//   - reviewer self-promotion  "Follow @hannahundclemens on Instagram",
//     "YouTube Paopao Studio TikTok Paopao Studio", "IG: @gingunther"
//   - restaurant promotions    "post on IG or Facebook. Otherwise it's 340"
//   - the bare token "IG"      every one of a 5-sample check was a handle or an
//                              admin contact, never a statement about fame
// A count that includes those is not a measure of anything. Filtering them
// takes the yield from an inflated 193 places down to a defensible ~166.

import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dir = dirname(fileURLToPath(import.meta.url));
const root = join(__dir, "..");
const repoRoot = join(root, "..");

const CITIES = [
  { id: "bangkok", dir: join(repoRoot, "bangkok_reviews", "output", "reviews") },
  { id: "pattaya", dir: join(repoRoot, "pattaya", "output", "reviews") },
];

// The reviewer is telling us social media is why they are here.
const DISCOVERY =
  /(found|saw|discovered|came here|came because|went because|heard about|because of)[^.!?]{0,40}\b(instagram|tiktok|tik tok|insta|reels?)\b|\b(instagram|tiktok|tik tok)\b[^.!?]{0,30}\b(famous|viral|hype|trend)|(for|just for|only for)[^.!?]{0,15}\b(the )?(instagram|insta|gram)\b[^.!?]{0,15}(pic|photo|shot|post)|\binstagramm?able\b/i;

// The reviewer is telling us the reputation outran the restaurant.
const HYPE = /not worth the hype|overrated|overhyped|over-hyped|all hype/i;

// Self-promo and promo lines, dropped before either test above runs.
const PROMO =
  /follow (me|us|them|my|our)|IG *: *@?|my (ig|instagram|tiktok)|@\w+ on instagram|subscribe/i;

/** Minimal CSV row reader — review text contains commas, quotes and newlines. */
function parseCsv(text) {
  const rows = [];
  let row = [], field = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else quoted = false;
      } else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else if (c !== "\r") field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows;
}

/**
 * The sentence the match sits in — that is what gets quoted on the page.
 *
 * A one-word sentence is common here ("Overrated. The queue was…"), and on its
 * own it is not evidence of anything, so keep absorbing following sentences
 * until there is enough text to judge by. Always ends on a sentence or word
 * boundary: a quote cut mid-word reads as broken data, not as a quote.
 */
function sentenceAround(text, re) {
  const m = re.exec(text);
  if (!m) return null;
  const start = text.lastIndexOf(".", m.index) + 1;
  let end = text.indexOf(".", m.index + m[0].length);
  if (end === -1) end = text.length - 1;

  // Absorb further sentences while the quote is too short to stand alone.
  while (end - start < 60 && end < text.length - 1) {
    const next = text.indexOf(".", end + 1);
    if (next === -1) { end = text.length - 1; break; }
    end = next;
  }

  const s = text.slice(start, end + 1).replace(/\s+/g, " ").trim();
  return clip(s, 240);
}

/** Trim to a word boundary — a quote cut mid-word reads as broken data. */
function clip(s, max) {
  if (s.length <= max) return s;
  const cut = s.slice(0, max);
  const sp = cut.lastIndexOf(" ");
  return (sp > max * 0.6 ? cut.slice(0, sp) : cut).trimEnd().replace(/[,;:]$/, "") + "…";
}

const db = JSON.parse(readFileSync(join(root, "data", "master_db.json"), "utf-8"));
const byPlaceId = new Map(db.restaurants.map((r) => [r.place_id, r]));

const found = new Map(); // place_id -> record

for (const city of CITIES) {
  if (!existsSync(city.dir)) {
    console.log(`  (no review dir for ${city.id}, skipping)`);
    continue;
  }
  const files = readdirSync(city.dir).filter((f) => f.endsWith("_reviews.csv"));
  console.log(`  ${city.id}: ${files.length} review files`);

  for (const f of files) {
    let rows;
    try {
      rows = parseCsv(readFileSync(join(city.dir, f), "utf-8"));
    } catch {
      continue;
    }
    if (rows.length < 2) continue;
    const head = rows[0];
    const iText = head.indexOf("text");
    const iPid = head.indexOf("place_id");
    const iName = head.indexOf("restaurant_name");
    if (iText < 0 || iPid < 0) continue;

    for (let i = 1; i < rows.length; i++) {
      const text = (rows[i][iText] || "").trim();
      if (!text || PROMO.test(text)) continue;
      const pid = (rows[i][iPid] || "").trim();
      if (!pid) continue;

      const isDiscovery = DISCOVERY.test(text);
      const isHype = HYPE.test(text);
      if (!isDiscovery && !isHype) continue;

      let rec = found.get(pid);
      if (!rec) {
        rec = {
          place_id: pid,
          name: (rows[i][iName] || "").trim(),
          city: city.id,
          discovery: 0,
          hype: 0,
          discoveryQuote: null,
          hypeQuote: null,
        };
        found.set(pid, rec);
      }
      if (isDiscovery) {
        rec.discovery++;
        if (!rec.discoveryQuote) rec.discoveryQuote = sentenceAround(text, DISCOVERY);
      }
      if (isHype) {
        rec.hype++;
        if (!rec.hypeQuote) rec.hypeQuote = sentenceAround(text, HYPE);
      }
    }
  }
}

console.log(`\nplaces with a social-discovery or hype mention: ${found.size}`);

// Only keep places that are actually in the site's database — a seed pointing
// at a restaurant with no page is a broken row, and the old file had five.
const seeds = [];
let unmatched = 0;
for (const rec of found.values()) {
  const r = byPlaceId.get(rec.place_id);
  if (!r) { unmatched++; continue; }

  // Discovery is the stronger claim, so it decides the category when a place
  // has both; the hype quote still rides along as evidence.
  const kind = rec.discovery >= rec.hype ? "social-famous" : "hype-check";
  const quote = kind === "social-famous"
    ? (rec.discoveryQuote || rec.hypeQuote)
    : (rec.hypeQuote || rec.discoveryQuote);
  if (!quote) continue; // never publish an entry we can't show the receipt for

  seeds.push({
    name: r.name,
    // Short, and true of what we actually measured. The reviewer's sentence
    // goes in evidence_quote — ig_signal renders inside a pill and a long
    // quote would wreck it.
    ig_signal: kind === "social-famous"
      ? "Reviewers say they came from Instagram or TikTok"
      : "Reviewers call it overrated",
    // Null on purpose: this field renders as "N tagged posts" and we have no
    // tagged-post data for anything. The review-mention count is its own field.
    tag_count: null,
    evidence_quote: quote,
    mention_count: rec.discovery + rec.hype,
    place_id: rec.place_id,
    district: r.district || null,
    city: rec.city,
    // Categories are split by signal, not by city. Splitting both ways gave
    // four buckets of 9-20 entries, and a hub page that thin is the templated
    // filler this repo already decided not to publish (see VERDICT_HUBS and
    // web-thaigle's PLACE_TREE_INDEXABLE). Two buckets keep each page worth
    // landing on; the city is still on every card and in the copy.
    category: kind,
  });
}

seeds.sort((a, b) => (b.mention_count - a.mention_count) || a.name.localeCompare(b.name));

console.log(`dropped (not in master_db): ${unmatched}`);
console.log(`derived seeds: ${seeds.length}`);

// Keep whatever is already in the file. Those entries back /famous-vs-good/
// bangkok-cafes, a URL that is live and indexed; dropping the category would
// delete the page. Where the review corpus has evidence for one of them, the
// evidence is attached rather than the row being replaced.
let existing = [];
try {
  existing = JSON.parse(readFileSync(join(root, "data", "ig-seed.json"), "utf-8"));
} catch {
  console.log("  (no existing ig-seed.json to merge)");
}

const derivedByPid = new Map(seeds.filter((s) => s.place_id).map((s) => [s.place_id, s]));
const keptPids = new Set();
let enriched = 0;

const merged = existing.map((e) => {
  const d = e.place_id ? derivedByPid.get(e.place_id) : null;
  if (!d) return { ...e, evidence_quote: e.evidence_quote ?? null, mention_count: e.mention_count ?? null };
  keptPids.add(e.place_id);
  enriched++;
  // Curated row keeps its category and its hand-written label; it just gains a
  // receipt.
  return { ...e, evidence_quote: d.evidence_quote, mention_count: d.mention_count };
});

for (const s of seeds) {
  if (s.place_id && keptPids.has(s.place_id)) continue;
  merged.push(s);
}

console.log(`existing seeds kept: ${existing.length} (${enriched} gained a review quote)`);
console.log(`total seeds: ${merged.length}\n`);
seeds.length = 0;
seeds.push(...merged);

const byCat = {};
for (const s of seeds) byCat[s.category] = (byCat[s.category] || 0) + 1;
for (const [c, n] of Object.entries(byCat).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${c.padEnd(24)} ${n}`);
}

console.log("\nTop entries by mention count:");
for (const s of seeds.filter((x) => x.evidence_quote).slice(0, 6)) {
  console.log(
    `  [${s.mention_count} mention${s.mention_count === 1 ? "" : "s"}] ${s.name}` +
    `\n      signal: ${s.ig_signal}` +
    `\n      quote : "${s.evidence_quote}"`
  );
}

if (process.argv.includes("--write")) {
  const out = join(root, "data", "ig-seed.json");
  writeFileSync(out, JSON.stringify(seeds, null, 2) + "\n", "utf-8");
  console.log(`\nwrote ${seeds.length} seeds to data/ig-seed.json`);
} else {
  console.log("\n(dry run — pass --write to update data/ig-seed.json)");
}
