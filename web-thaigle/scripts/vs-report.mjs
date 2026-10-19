// Builds the real comparison set and reports on it.
//
//   node --import ./scripts/alias-register.mjs scripts/vs-report.mjs
//
// Used to size the caps in lib/vs.ts from the data rather than from a guess,
// and as an assertion pass: the process exits non-zero if the set breaks a
// rule the pages depend on.
import { NICHES } from "../lib/niches.ts";
import { getVsIndex } from "../lib/vs.ts";
import { compareVenues } from "../lib/vsMetrics.ts";

let total = 0;
let failures = 0;
const fail = (m) => { failures++; console.error("  ✗", m); };
const seen = new Set();
const venues = new Set();
const byGroup = new Map();
const picks = { a: 0, b: 0, none: 0 };
let maxSlug = 0;
const ADULT = /erotic|soapy|nuru|yoni|prostate|色情|happy ending|body to body/i;

for (const n of NICHES) {
  const idx = await getVsIndex(n.slug);
  total += idx.pairs.length;
  const groups = new Map();
  for (const p of idx.pairs) {
    const url = `/activities/${n.slug}/vs/${p.slug}`;
    if (seen.has(url)) fail(`duplicate url ${url}`);
    seen.add(url);
    if (!/^[a-z0-9-]+$/.test(p.slug)) fail(`non-ASCII/odd slug: ${p.slug}`);
    if (/--/.test(p.slug)) fail(`double hyphen: ${p.slug}`);
    maxSlug = Math.max(maxSlug, p.slug.length);
    if (p.a.id === p.b.id) fail(`self-pair ${p.slug}`);
    if (p.a.niche !== n.slug || p.b.niche !== n.slug) fail(`cross-niche ${p.slug}`);
    if (p.a.permanently_closed || p.b.permanently_closed) fail(`closed venue in ${p.slug}`);
    if (ADULT.test(`${p.a.category} ${p.a.name} ${p.b.category} ${p.b.name}`)) fail(`adult venue in ${p.slug}`);
    if (p.a.city !== p.b.city) fail(`pair spans cities ${p.slug}: ${p.a.city} / ${p.b.city}`);
    venues.add(p.a.id); venues.add(p.b.id);
    groups.set(p.group.label, (groups.get(p.group.label) ?? 0) + 1);
    const c = compareVenues(p.a, p.b, { niche: n.slug, nicheLabel: n.label, medianRating: idx.medianRating, scopeLabel: p.group.label });
    picks[c.pick ?? "none"]++;
  }
  byGroup.set(n.slug, groups);
  console.log(`${n.slug.padEnd(14)} ${String(idx.pairs.length).padStart(3)} pairs   ${[...groups].map(([g, c]) => `${g}:${c}`).join("  ")}`);
}

console.log(`\ntotal ${total} pairs across ${venues.size} distinct venues; longest slug ${maxSlug} chars`);
console.log(`overall call: ahead=a ${picks.a}, ahead=b ${picks.b}, too close ${picks.none}`);
if (failures) { console.error(`\n${failures} rule violation(s)`); process.exit(1); }
console.log("all set-level rules hold");
