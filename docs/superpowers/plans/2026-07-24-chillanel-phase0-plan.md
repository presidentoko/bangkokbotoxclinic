# chillanel Phase 0 (Foundation) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the two foundations the rest of the chillanel overhaul depends on: (1) a Playwright screenshot tool so design changes can be visually verified instead of guessed at, and (2) free, local review-mining extractors (service themes, mood keywords, rating distribution, price mentions, district clustering) that turn the 12,569 already-scraped Bangkok reviews into real content instead of an unused text blob.

**Architecture:** Screenshot tooling is a standalone dev script (`scripts/screenshot.mjs`), not part of the Next.js app. Review mining follows the exact pattern already established by `scripts/extract-therapists.mjs`: pure functions taking `{text: string}[]`, tested in isolation, wired into `scripts/build-data.mjs`'s per-place build loop, with results flowing into `lib/types.ts`'s `Place`/`CityData` shapes. No UI changes in this phase — Phase 1 consumes what Phase 0 produces.

**Tech Stack:** Node.js test runner (`node --test`), Playwright (new devDependency), plain regex — no new runtime dependencies, no paid APIs, no LLM calls.

## Global Constraints

- **100% free.** No paid APIs, no LLM calls anywhere in the build pipeline. Confirmed decision (2026-07-24): the massage/spa vertical doesn't need photos, and budget is zero — this phase and Phase 1 must not introduce any per-request or per-build cost.
- **English-only keyword dictionaries.** Verified by sampling 200 of the 734 Bangkok review-CSV files (8,630 reviews with text): 99.8% English, 0.2% non-ASCII-heavy (mostly emoji/isolated non-English reviews, not enough th/ko volume to justify separate dictionaries). Do not build th/ko theme dictionaries in this phase.
- **District coordinates are approximate.** Nearest-centroid clustering at city scale, not survey-grade boundaries — document this in code comments, do not present it as precise in any later UI copy.
- **Must not break existing tests or build.** `npm test` currently passes 10/10 and `npm run build` produces 2231 static pages — both must still pass after this phase.
- **No placeholder logic.** Every extractor must have real regex patterns and real test assertions — no `// TODO: add more keywords later`.
- Standing chillanel constraints (unchanged, apply to any future phase touching deploy/pages): `vercel --prod` must never be run with `--archive=tgz` (bypasses `.vercelignore`, causes bloated/failed uploads — use plain `vercel --prod`); never add `cache: "no-store"` to a Server Component render path (forces the whole route dynamic, breaks SSG). Phase 0 doesn't touch either surface, but they bind any later phase.

---

### Task 1: Playwright screenshot tooling

**Files:**
- Modify: `chillanel/package.json` (add `playwright` devDependency + `screenshot` script)
- Create: `chillanel/scripts/screenshot.mjs`
- Modify: `chillanel/.gitignore` (ignore generated screenshots)

**Interfaces:**
- Consumes: nothing from other tasks.
- Produces: `node scripts/screenshot.mjs [--base-url URL] [--out-dir DIR]` — a standalone CLI tool. Later phases/sessions run this against a running `next start`/`next dev` server and then `Read` the resulting PNG files to visually verify design changes. Not imported by any other file.

- [ ] **Step 1: Add the Playwright devDependency and a screenshot script**

Edit `chillanel/package.json` — add to `"scripts"`:

```json
    "screenshot": "node scripts/screenshot.mjs"
```

Add to `"devDependencies"`:

```json
    "playwright": "^1.48.0"
```

- [ ] **Step 2: Install and fetch the Chromium binary**

```bash
cd chillanel && npm install
npx playwright install chromium
```

Expected: `npm install` completes with no errors; `playwright install chromium` downloads the Chromium browser binary (~150MB, one-time — this is normal, not a failure).

- [ ] **Step 3: Write the screenshot script**

Create `chillanel/scripts/screenshot.mjs`:

```javascript
// One-off dev tool: captures PNG screenshots of key pages at desktop and
// mobile viewports so they can be reviewed via the Read tool — this repo's
// agent sessions have no browser/screenshot capability of their own.
//
// Usage (run against an already-running server, this script does not start one):
//   cd chillanel && npx next start -p 3500 &
//   node scripts/screenshot.mjs --base-url http://localhost:3500
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

function argValue(flag, fallback) {
  const i = process.argv.indexOf(flag);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const BASE_URL = argValue("--base-url", "http://localhost:3000");
const OUT_DIR = argValue("--out-dir", path.join(import.meta.dirname, "..", "screenshots"));

function samplePlaceId() {
  const file = path.join(import.meta.dirname, "..", "data", "clinics.bangkok.json");
  if (!fs.existsSync(file)) return null;
  try {
    const data = JSON.parse(fs.readFileSync(file, "utf-8"));
    return data.places?.[0]?.id ?? null;
  } catch {
    return null;
  }
}

const placeId = samplePlaceId();
const ROUTES = [
  { name: "home", path: "/en" },
  { name: "city", path: "/en/city/bangkok" },
  ...(placeId ? [{ name: "place", path: `/en/place/${placeId}` }] : []),
];

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const browser = await chromium.launch();
  try {
    for (const viewport of VIEWPORTS) {
      const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
      for (const route of ROUTES) {
        const url = `${BASE_URL}${route.path}`;
        await page.goto(url, { waitUntil: "networkidle" });
        const outFile = path.join(OUT_DIR, `${route.name}-${viewport.name}.png`);
        await page.screenshot({ path: outFile, fullPage: true });
        console.log(`[screenshot] wrote ${outFile}`);
      }
      await page.close();
    }
  } finally {
    await browser.close();
  }
}

main();
```

- [ ] **Step 4: Ignore generated screenshots**

Edit `chillanel/.gitignore`, add:

```
screenshots/
```

- [ ] **Step 5: Smoke-test against the real site**

```bash
cd chillanel
npx next build
(npx next start -p 3500 &)
sleep 4
node scripts/screenshot.mjs --base-url http://localhost:3500
ls screenshots/
```

Expected: 6 PNG files listed (`home-desktop.png`, `home-mobile.png`, `city-desktop.png`, `city-mobile.png`, `place-desktop.png`, `place-mobile.png`). Stop the server afterward (`taskkill` the launched `next start` process by its scoped PID — never a blanket `taskkill /IM node.exe`, other live node services run in this repo).

- [ ] **Step 6: Commit**

```bash
git add chillanel/package.json chillanel/package-lock.json chillanel/scripts/screenshot.mjs chillanel/.gitignore
git commit -m "chillanel: add Playwright screenshot tool for visual verification"
```

---

### Task 2: Service-theme and mood-keyword extraction

**Files:**
- Create: `chillanel/scripts/extract-themes.mjs`
- Test: `chillanel/scripts/extract-themes.test.mjs`

**Interfaces:**
- Consumes: `{text: string}[]` review arrays — same shape `extract-therapists.mjs`'s `extractMentionsFromReviews` already consumes.
- Produces (used by Task 5):
  - `SERVICE_THEMES: Record<string, RegExp[]>` — exported dictionary.
  - `MOOD_KEYWORDS: Record<string, RegExp[]>` — exported dictionary.
  - `extractThemeCounts(reviews, dictionary): {label: string, count: number}[]` — sorted descending by count, `count` = number of reviews mentioning that label at least once (not total occurrences — one gushing review shouldn't dominate the ranking).
  - `sumThemeCounts(perPlaceCounts: {label: string, count: number}[][]): {label: string, count: number}[]` — merges per-place theme-count arrays into one aggregate, sorted descending. Task 5 uses this for the city-wide aggregate.

- [ ] **Step 1: Write the failing tests**

Create `chillanel/scripts/extract-themes.test.mjs`:

```javascript
import { test } from "node:test";
import assert from "node:assert/strict";
import { extractThemeCounts, sumThemeCounts, SERVICE_THEMES, MOOD_KEYWORDS } from "./extract-themes.mjs";

test("counts a service theme once per review even if mentioned twice in the same review", () => {
  const reviews = [
    { text: "Great foot massage, the foot massage technique was excellent." },
    { text: "Loved the oil massage here." },
  ];
  const counts = extractThemeCounts(reviews, SERVICE_THEMES);
  const foot = counts.find((c) => c.label === "Foot massage");
  assert.equal(foot.count, 1);
});

test("counts multiple distinct themes across reviews, sorted by frequency desc", () => {
  const reviews = [
    { text: "Best foot massage in town." },
    { text: "The foot massage was so relaxing." },
    { text: "Really good oil massage." },
  ];
  const counts = extractThemeCounts(reviews, SERVICE_THEMES);
  assert.equal(counts[0].label, "Foot massage");
  assert.equal(counts[0].count, 2);
  assert.equal(counts.find((c) => c.label === "Oil massage").count, 1);
});

test("mood keywords match synonyms under the same label", () => {
  const reviews = [
    { text: "The room was spotless and hygienic." },
    { text: "Very clean overall." },
  ];
  const counts = extractThemeCounts(reviews, MOOD_KEYWORDS);
  assert.equal(counts.find((c) => c.label === "Clean").count, 2);
});

test("handles empty/whitespace/null review text without throwing", () => {
  const reviews = [{ text: "" }, { text: "   " }, { text: null }];
  assert.doesNotThrow(() => extractThemeCounts(reviews, SERVICE_THEMES));
  assert.equal(extractThemeCounts(reviews, SERVICE_THEMES).length, 0);
});

test("sumThemeCounts merges per-place counts into a city-wide total", () => {
  const perPlace = [
    [{ label: "Clean", count: 2 }, { label: "Friendly staff", count: 1 }],
    [{ label: "Clean", count: 3 }],
  ];
  const total = sumThemeCounts(perPlace);
  assert.equal(total.find((t) => t.label === "Clean").count, 5);
  assert.equal(total.find((t) => t.label === "Friendly staff").count, 1);
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd chillanel && node --test scripts/extract-themes.test.mjs
```

Expected: FAIL — `Cannot find module './extract-themes.mjs'`.

- [ ] **Step 3: Write the implementation**

Create `chillanel/scripts/extract-themes.mjs`:

```javascript
// Frequency-counts predefined service/mood themes across a place's reviews.
// Same "regex dictionary, pure function" approach as extract-therapists.mjs.
// English-only: sampling 200 of 734 Bangkok review-CSV files (8,630 reviews
// with text) found 99.8% English — not enough th/ko volume to justify
// separate dictionaries yet (checked 2026-07-24).

export const SERVICE_THEMES = {
  "Foot massage": [/\bfoot massage\b/i, /\breflexology\b/i],
  "Oil massage": [/\boil massage\b/i],
  "Thai massage": [/\bthai massage\b/i],
  "Aromatherapy": [/\baroma(?:therapy)?\b/i],
  "Deep tissue": [/\bdeep tissue\b/i],
  "Hot stone": [/\bhot stone\b/i],
  "Facial": [/\bfacial\b/i],
  "Body scrub": [/\bbody scrub\b/i, /\bscrub\b/i],
};

export const MOOD_KEYWORDS = {
  "Clean": [/\bclean\b/i, /\bspotless\b/i, /\bhygienic\b/i],
  "Quiet & relaxing": [/\bquiet\b/i, /\brelaxing\b/i, /\bpeaceful\b/i],
  "Strong pressure": [/\bstrong pressure\b/i, /\bfirm pressure\b/i, /\bdeep pressure\b/i],
  "Gentle": [/\bgentle\b/i, /\blight pressure\b/i],
  "Friendly staff": [/\bfriendly\b/i, /\bwelcoming\b/i],
  "Good value": [/\bgood value\b/i, /\baffordable\b/i, /\breasonably priced\b/i, /\bcheap\b/i],
  "Walk-in friendly": [/\bwalk[- ]?in\b/i],
};

/**
 * @param {{text: string}[]} reviews
 * @param {Record<string, RegExp[]>} dictionary
 * @returns {{label: string, count: number}[]} sorted desc; count = number of
 *   reviews mentioning that label at least once (not total occurrences).
 */
export function extractThemeCounts(reviews, dictionary) {
  const counts = new Map();
  for (const review of reviews ?? []) {
    const text = review?.text;
    if (!text || typeof text !== "string") continue;
    const mentionedThisReview = new Set();
    for (const [label, patterns] of Object.entries(dictionary)) {
      for (const pattern of patterns) {
        pattern.lastIndex = 0;
        if (pattern.test(text)) {
          mentionedThisReview.add(label);
          break;
        }
      }
    }
    for (const label of mentionedThisReview) {
      counts.set(label, (counts.get(label) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Sums per-place theme-count arrays into one city-wide total — used for the
 * site-wide "what reviewers say most" aggregate.
 * @param {{label: string, count: number}[][]} perPlaceCounts
 * @returns {{label: string, count: number}[]} sorted desc
 */
export function sumThemeCounts(perPlaceCounts) {
  const totals = new Map();
  for (const counts of perPlaceCounts) {
    for (const { label, count } of counts) {
      totals.set(label, (totals.get(label) ?? 0) + count);
    }
  }
  return [...totals.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
cd chillanel && node --test scripts/extract-themes.test.mjs
```

Expected: `# pass 5`, `# fail 0`.

- [ ] **Step 5: Commit**

```bash
git add chillanel/scripts/extract-themes.mjs chillanel/scripts/extract-themes.test.mjs
git commit -m "chillanel: add service-theme and mood-keyword frequency extraction"
```

---

### Task 3: Price mention extraction

**Files:**
- Create: `chillanel/scripts/extract-price.mjs`
- Test: `chillanel/scripts/extract-price.test.mjs`

**Interfaces:**
- Consumes: `{text: string}[]` review arrays.
- Produces (used by Task 5): `extractPriceMentions(reviews): number[]` — all detected Thai Baht amounts across all reviews for a place, sorted ascending. Bounded to 50–20000 to reject implausible matches (phone numbers, years, etc. that happen to sit next to an unrelated "baht"/currency word).

- [ ] **Step 1: Write the failing tests**

Create `chillanel/scripts/extract-price.test.mjs`:

```javascript
import { test } from "node:test";
import assert from "node:assert/strict";
import { extractPriceMentions } from "./extract-price.mjs";

test("extracts a baht amount with symbol prefix", () => {
  const reviews = [{ text: "Paid ฿500 for a 1-hour massage, worth it." }];
  assert.deepEqual(extractPriceMentions(reviews), [500]);
});

test("extracts a baht amount with word suffix", () => {
  const reviews = [{ text: "Only 300 baht for foot massage, great value." }];
  assert.deepEqual(extractPriceMentions(reviews), [300]);
});

test("extracts multiple mentions across reviews, sorted ascending", () => {
  const reviews = [
    { text: "600 THB for oil massage." },
    { text: "Foot massage was 250 baht." },
  ];
  assert.deepEqual(extractPriceMentions(reviews), [250, 600]);
});

test("does not match a bare number with no currency marker", () => {
  const reviews = [{ text: "Called them 5 times, never picked up." }];
  assert.deepEqual(extractPriceMentions(reviews), []);
});

test("handles empty/null review text without throwing", () => {
  const reviews = [{ text: "" }, { text: null }];
  assert.doesNotThrow(() => extractPriceMentions(reviews));
  assert.deepEqual(extractPriceMentions(reviews), []);
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd chillanel && node --test scripts/extract-price.test.mjs
```

Expected: FAIL — `Cannot find module './extract-price.mjs'`.

- [ ] **Step 3: Write the implementation**

Create `chillanel/scripts/extract-price.mjs`:

```javascript
// Extracts Thai Baht price mentions from review text — a rough signal only.
// The clinics CSV's own price_level field is populated for just 16/734
// Bangkok places, not enough to rely on, so this fills the gap from review
// text instead.

const PRICE_PATTERNS = [
  /(?:฿|thb)\s?(\d{2,5})/gi,
  /(\d{2,5})\s?(?:฿|baht|thb)\b/gi,
];

const MIN_PLAUSIBLE_BAHT = 50;
const MAX_PLAUSIBLE_BAHT = 20000;

/**
 * @param {{text: string}[]} reviews
 * @returns {number[]} all detected baht amounts across all reviews, sorted ascending
 */
export function extractPriceMentions(reviews) {
  const amounts = [];
  for (const review of reviews ?? []) {
    const text = review?.text;
    if (!text || typeof text !== "string") continue;
    for (const pattern of PRICE_PATTERNS) {
      pattern.lastIndex = 0;
      let m;
      while ((m = pattern.exec(text)) !== null) {
        const n = parseInt(m[1], 10);
        if (Number.isFinite(n) && n >= MIN_PLAUSIBLE_BAHT && n <= MAX_PLAUSIBLE_BAHT) {
          amounts.push(n);
        }
      }
    }
  }
  return amounts.sort((a, b) => a - b);
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
cd chillanel && node --test scripts/extract-price.test.mjs
```

Expected: `# pass 5`, `# fail 0`.

- [ ] **Step 5: Commit**

```bash
git add chillanel/scripts/extract-price.mjs chillanel/scripts/extract-price.test.mjs
git commit -m "chillanel: add Thai Baht price-mention extraction from reviews"
```

---

### Task 4: District clustering

**Files:**
- Create: `chillanel/scripts/extract-district.mjs`
- Test: `chillanel/scripts/extract-district.test.mjs`

**Interfaces:**
- Consumes: `lat: number | null, lng: number | null` — same fields already on every `Place`.
- Produces (used by Task 5): `nearestDistrict(lat, lng): string | null` — nearest of 8 fixed Bangkok district centroids, or `null` if too far from all of them (outside greater Bangkok) or if either coordinate is missing.

- [ ] **Step 1: Write the failing tests**

Create `chillanel/scripts/extract-district.test.mjs`:

```javascript
import { test } from "node:test";
import assert from "node:assert/strict";
import { nearestDistrict } from "./extract-district.mjs";

test("assigns a coordinate at a known centroid to that district", () => {
  assert.equal(nearestDistrict(13.7248, 100.5296), "Silom & Sathorn");
});

test("assigns a different coordinate to its own nearest district", () => {
  assert.equal(nearestDistrict(13.7398, 100.5645), "Sukhumvit");
});

test("returns null when either coordinate is missing", () => {
  assert.equal(nearestDistrict(null, 100.53), null);
  assert.equal(nearestDistrict(13.72, null), null);
});

test("returns null for coordinates far outside greater Bangkok", () => {
  assert.equal(nearestDistrict(14.5, 101.5), null);
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd chillanel && node --test scripts/extract-district.test.mjs
```

Expected: FAIL — `Cannot find module './extract-district.mjs'`.

- [ ] **Step 3: Write the implementation**

Create `chillanel/scripts/extract-district.mjs`:

```javascript
// Assigns each place to the nearest of a fixed set of Bangkok district
// centroids — nearest-centroid clustering at city scale, not precise
// boundary polygons or a real geocoder. Coordinates are approximate; do not
// present this as survey-grade in any UI copy that consumes it.
const DISTRICTS = [
  { name: "Sukhumvit", lat: 13.7398, lng: 100.5645 },
  { name: "Silom & Sathorn", lat: 13.7248, lng: 100.5296 },
  { name: "Siam & Pathumwan", lat: 13.7466, lng: 100.5347 },
  { name: "Thonglor & Ekkamai", lat: 13.7307, lng: 100.5827 },
  { name: "Khao San & Old Town", lat: 13.759, lng: 100.4977 },
  { name: "Chinatown", lat: 13.7398, lng: 100.5088 },
  { name: "Chatuchak", lat: 13.8018, lng: 100.5537 },
  { name: "Ari", lat: 13.7797, lng: 100.5448 },
];

// Places farther than this from every centroid aren't confidently in any
// named district (e.g. outer suburbs) — left unassigned rather than forced
// into whichever centroid happens to be nearest.
const MAX_DIST_SQ = 0.04; // ~0.2 degrees, generous outer bound for greater Bangkok

/**
 * @param {number | null} lat
 * @param {number | null} lng
 * @returns {string | null}
 */
export function nearestDistrict(lat, lng) {
  if (lat == null || lng == null) return null;
  let best = null;
  let bestDistSq = Infinity;
  for (const d of DISTRICTS) {
    const distSq = (d.lat - lat) ** 2 + (d.lng - lng) ** 2;
    if (distSq < bestDistSq) {
      bestDistSq = distSq;
      best = d.name;
    }
  }
  return bestDistSq <= MAX_DIST_SQ ? best : null;
}

export { DISTRICTS };
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
cd chillanel && node --test scripts/extract-district.test.mjs
```

Expected: `# pass 4`, `# fail 0`.

- [ ] **Step 5: Commit**

```bash
git add chillanel/scripts/extract-district.mjs chillanel/scripts/extract-district.test.mjs
git commit -m "chillanel: add nearest-centroid Bangkok district clustering"
```

---

### Task 5: Wire extractors into build-data.mjs and lib/types.ts

**Files:**
- Modify: `chillanel/lib/types.ts`
- Modify: `chillanel/scripts/build-data.mjs`
- Modify: `chillanel/scripts/build-data.test.mjs`

**Interfaces:**
- Consumes: `extractThemeCounts`/`sumThemeCounts`/`SERVICE_THEMES`/`MOOD_KEYWORDS` (Task 2), `extractPriceMentions` (Task 3), `nearestDistrict` (Task 4).
- Produces: `Place` gains `serviceThemes: ThemeCount[]`, `moodKeywords: ThemeCount[]`, `ratingDistribution: RatingDistribution`, `priceMentions: number[]`, `district: string | null`. `CityData` gains `themeAggregate: ThemeCount[]`, `moodAggregate: ThemeCount[]`. These are the exact field names Phase 1's UI components will read.

- [ ] **Step 1: Add the new types**

Edit `chillanel/lib/types.ts` — add near the top, after the existing type exports, and extend `Place`/`CityData`:

```typescript
export type TherapistMention = {
  name: string;
  count: number;
  quotes: string[];
};

export type Review = {
  id: string;
  rating: number | null;
  text: string;
  authorName: string;
  relativeDate: string;
};

export type ThemeCount = { label: string; count: number };

export type RatingDistribution = { 5: number; 4: number; 3: number; 2: number; 1: number };

export type Place = {
  id: string;
  name: string;
  city: string;
  address: string;
  lat: number | null;
  lng: number | null;
  phone: string;
  website: string;
  rating: number | null;
  reviewCount: number;
  primaryType: string;
  mapsUrl: string;
  reviews: Review[];
  therapistMentions: TherapistMention[];
  serviceThemes: ThemeCount[];
  moodKeywords: ThemeCount[];
  ratingDistribution: RatingDistribution;
  priceMentions: number[];
  district: string | null;
};

export type CityData = {
  city: string;
  generatedAt: string;
  places: Place[];
  themeAggregate: ThemeCount[];
  moodAggregate: ThemeCount[];
};
```

(This replaces the entire current file content — same types, five new fields.)

- [ ] **Step 2: Write the failing test for the new fields**

Edit `chillanel/scripts/build-data.test.mjs` — add a second test after the existing one:

```javascript
test("build-data pipeline: wires theme/mood/rating/price/district extractors into output", () => {
  execFileSync(
    process.execPath,
    [
      path.join(ROOT, "build-data.mjs"),
      "--clinics-csv", path.join(ROOT, "__fixtures__", "clinics.csv"),
      "--reviews-dir", path.join(ROOT, "__fixtures__", "reviews"),
      "--city", "__fixture_test",
      "--out", OUT_FILE,
    ],
    { stdio: "pipe" }
  );

  const data = JSON.parse(fs.readFileSync(OUT_FILE, "utf-8"));
  const place = data.places[0];

  // Fixture reviews ("Ask for Nong, she's amazing." x2) contain no theme/mood/
  // price keywords, so these should be present but empty — this test verifies
  // wiring (field exists, right shape), not extraction correctness (covered
  // by each extractor's own unit tests).
  assert.deepEqual(place.serviceThemes, []);
  assert.deepEqual(place.moodKeywords, []);
  assert.deepEqual(place.priceMentions, []);

  // Both fixture reviews are rating=5.
  assert.deepEqual(place.ratingDistribution, { 5: 2, 4: 0, 3: 0, 2: 0, 1: 0 });

  // Fixture coords (13.75, 100.53) are nearest "Siam & Pathumwan" (13.7466, 100.5347).
  assert.equal(place.district, "Siam & Pathumwan");

  // City-level aggregates must exist even when empty.
  assert.deepEqual(data.themeAggregate, []);
  assert.deepEqual(data.moodAggregate, []);

  fs.unlinkSync(OUT_FILE);
});
```

- [ ] **Step 3: Run tests to verify the new one fails**

```bash
cd chillanel && node --test scripts/build-data.test.mjs
```

Expected: FAIL — `place.serviceThemes` is `undefined`, not `[]` (field doesn't exist yet).

- [ ] **Step 4: Wire the extractors into build-data.mjs**

Edit `chillanel/scripts/build-data.mjs` — add imports after the existing `extractMentionsFromReviews` import:

```javascript
import { extractThemeCounts, sumThemeCounts, SERVICE_THEMES, MOOD_KEYWORDS } from "./extract-themes.mjs";
import { extractPriceMentions } from "./extract-price.mjs";
import { nearestDistrict } from "./extract-district.mjs";
```

Add this function after `reviewsForPlace`:

```javascript
function ratingDistribution(reviews) {
  const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  for (const r of reviews) {
    const rounded = r.rating != null ? Math.round(r.rating) : null;
    if (rounded >= 1 && rounded <= 5) dist[rounded] += 1;
  }
  return dist;
}
```

Replace the `.map((r) => { ... })` body inside `buildPlaces()`:

```javascript
    .map((r) => {
      const reviews = reviewsForPlace(r.place_id);
      const therapistMentions = extractMentionsFromReviews(reviews);
      const lat = num(r.latitude, null);
      const lng = num(r.longitude, null);
      return {
        id: r.place_id.replace(/:/g, "_"),
        name: r.name,
        city: CITY,
        address: (r.formatted_address || "").trim(),
        lat,
        lng,
        phone: r.phone || "",
        website: r.website || "",
        rating: num(r.rating, null),
        reviewCount: num(r.total_reviews, 0) || 0,
        primaryType: r.primary_type || "",
        mapsUrl: r.maps_url || "",
        reviews: reviews.slice(0, 20),
        therapistMentions,
        serviceThemes: extractThemeCounts(reviews, SERVICE_THEMES),
        moodKeywords: extractThemeCounts(reviews, MOOD_KEYWORDS),
        ratingDistribution: ratingDistribution(reviews),
        priceMentions: extractPriceMentions(reviews),
        district: nearestDistrict(lat, lng),
      };
    })
```

Replace the final write block (from `const places = buildPlaces();` to the end of the file):

```javascript
const places = buildPlaces();
const themeAggregate = sumThemeCounts(places.map((p) => p.serviceThemes));
const moodAggregate = sumThemeCounts(places.map((p) => p.moodKeywords));
fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
fs.writeFileSync(
  OUT_FILE,
  JSON.stringify(
    { city: CITY, generatedAt: new Date().toISOString(), places, themeAggregate, moodAggregate },
    null,
    2
  ),
  "utf-8"
);
console.log(`[build-data] wrote ${places.length} places → ${OUT_FILE}`);
console.log(`[build-data] places with therapist mentions: ${places.filter((p) => p.therapistMentions.length > 0).length}`);
console.log(`[build-data] top service themes: ${themeAggregate.slice(0, 5).map((t) => `${t.label}(${t.count})`).join(", ")}`);
console.log(`[build-data] top mood keywords: ${moodAggregate.slice(0, 5).map((t) => `${t.label}(${t.count})`).join(", ")}`);
```

Also update the earlier empty-stub fallback (the block before `const places = buildPlaces();` that fires when the CSV doesn't exist) so it matches the new `CityData` shape:

```javascript
if (!fs.existsSync(CLINICS_CSV)) {
  console.warn(`[build-data] clinics CSV not found: ${CLINICS_CSV}`);
  if (fs.existsSync(OUT_FILE)) {
    console.warn(`[build-data] keeping existing ${OUT_FILE} (no regen).`);
    process.exit(0);
  }
  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(
    OUT_FILE,
    JSON.stringify(
      { city: CITY, generatedAt: new Date().toISOString(), places: [], themeAggregate: [], moodAggregate: [] },
      null,
      2
    )
  );
  console.warn(`[build-data] no existing output either — wrote empty stub.`);
  process.exit(0);
}
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
cd chillanel && node --test scripts/build-data.test.mjs
```

Expected: both tests pass, `# pass 2`, `# fail 0`.

- [ ] **Step 6: Run the full test suite and typecheck**

```bash
cd chillanel
node --test scripts/*.test.mjs
npx tsc --noEmit
```

Expected: all tests pass (12/12 total now — 10 existing + the new one, since Tasks 2-4 added 5+5+4=14 of their own... note: full count will be 10 (original) + 5 (Task 2) + 5 (Task 3) + 4 (Task 4) + 1 (Task 5's new test) = 25). `tsc --noEmit` produces no output (clean).

- [ ] **Step 7: Commit**

```bash
git add chillanel/lib/types.ts chillanel/scripts/build-data.mjs chillanel/scripts/build-data.test.mjs
git commit -m "chillanel: wire theme/mood/rating/price/district extractors into build-data pipeline"
```

---

### Task 6: Verify against real Bangkok data

**Files:** none created/modified — verification only.

**Interfaces:**
- Consumes: everything from Tasks 1-5.
- Produces: nothing — this task's job is to confirm the pipeline works end-to-end against the live 734-place dataset before Phase 1 starts building UI on top of it.

- [ ] **Step 1: Run the real build**

```bash
cd chillanel && node scripts/build-data.mjs
```

Expected output includes lines like:
```
[build-data] wrote 734 places → .../data/clinics.bangkok.json
[build-data] places with therapist mentions: 29
[build-data] top service themes: Foot massage(N), Thai massage(N), ...
[build-data] top mood keywords: Clean(N), Quiet & relaxing(N), ...
```
(Exact counts will differ from any example numbers — record whatever the real run prints.)

- [ ] **Step 2: Spot-check the output shape**

```bash
cd chillanel && node -e "
const data = JSON.parse(require('fs').readFileSync('data/clinics.bangkok.json', 'utf-8'));
console.log('themeAggregate:', data.themeAggregate.slice(0, 5));
console.log('moodAggregate:', data.moodAggregate.slice(0, 5));
const withDistrict = data.places.filter(p => p.district).length;
const withPrice = data.places.filter(p => p.priceMentions.length > 0).length;
console.log('places with district assigned:', withDistrict, '/', data.places.length);
console.log('places with a price mention:', withPrice, '/', data.places.length);
console.log('sample place ratingDistribution:', data.places[0].ratingDistribution);
"
```

Expected: `themeAggregate`/`moodAggregate` non-empty with plausible labels; `withDistrict` is a large majority of 734 (most Bangkok places should land within the 0.2°-radius bound of at least one of the 8 centroids — if this is suspiciously low, e.g. under 500, stop and investigate the centroid coordinates before proceeding to Phase 1, since Phase 1's district pages depend on this).

- [ ] **Step 3: Confirm the full project build still succeeds**

```bash
cd chillanel && npm run build 2>&1 | tail -20
```

Expected: same as before this phase — `Compiled successfully`, all 2231 pages generated, no new errors (Phase 0 doesn't touch any `app/` route, so this build should be identical in page count to the pre-Phase-0 build; if it isn't, something in Task 5 broke the existing `lib/data.ts` contract).

- [ ] **Step 4: Report findings**

No code changes in this step — write up (in the task report, not a new file) the real counts observed in Steps 1-2, and flag explicitly if `withDistrict` came back low (see Step 2's threshold) or if any theme/mood label never appeared across all 734 places (dead dictionary entry — worth noting for Phase 1, not necessarily fixing now).

---

## Self-Review Notes

- **Spec coverage:** roadmap's Phase 0-1 (screenshot tool) → Task 1. Phase 0-2's six bullets (service themes, mood keywords, rating distribution, price mentions, district clustering, city-wide aggregation) → Tasks 2, 3, 4, and 5 (rating distribution + aggregation are simple enough to fold directly into Task 5 rather than their own modules — no test coverage lost, `ratingDistribution` is a 6-line pure function tested via Task 5's integration test, and `sumThemeCounts` has its own dedicated unit tests in Task 2).
- **Global constraints check:** no paid APIs/LLM calls anywhere in Tasks 1-6 — confirmed, everything is local regex/arithmetic plus Playwright (free, local browser automation). English-only dictionaries — confirmed, Task 2's file header documents the 99.8%-English sampling finding. District coordinates flagged as approximate in both the module docstring and the roadmap.
- **Type consistency check:** `ThemeCount`/`RatingDistribution` defined once in Task 5's `lib/types.ts` edit, and the exact field names (`serviceThemes`, `moodKeywords`, `ratingDistribution`, `priceMentions`, `district`, `themeAggregate`, `moodAggregate`) are what Task 5's `build-data.mjs` writes and what Phase 1 will read from `lib/data.ts` — no drift between what's written and what's typed.
- **Known scope boundary, not silently dropped:** this plan does not touch `app/` or `components/` — Phase 1 (a separate plan) is where `serviceThemes`/`moodKeywords`/`ratingDistribution`/`priceMentions`/`district`/`themeAggregate`/`moodAggregate` actually render as UI. Phase 0 only produces the data.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-07-24-chillanel-phase0-plan.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
