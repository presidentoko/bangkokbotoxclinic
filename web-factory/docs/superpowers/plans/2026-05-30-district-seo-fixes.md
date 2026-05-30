# District SEO Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Collapse duplicate/variant district pages into canonical pages, noindex thin district pages, redirect old slugs, and validate footer links — all at build time on a statically-exported Next.js site.

**Architecture:** A single canonical-district module (`lib/districts.ts`) normalizes every `supplier.district` (and corrects mis-filed `supplier.city`) at load time inside `loadMasterDb()`, rebuilding `district_counts`. Because canonical district names are clean ASCII, the existing `name.toLowerCase().replace(/\s+/g,"-")` slug derivation keeps working consistently across the district page, city page, category×district page, and sitemap. Thin pages (<5 suppliers) render but are `noindex,follow` with a canonical to their city. A build-time script writes 301s for old alias slugs into `public/_redirects`. A check script validates footer links.

**Tech Stack:** Next.js 16 (App Router, `output: "export"`), TypeScript, Node.js scripts using `node:assert` (no test framework installed).

---

## Conventions

- **Run commands from** `C:\Users\yn\Desktop\Work\0_main\deliverable\deliverable\web-factory` (PowerShell).
- **Tests are plain Node scripts** run with `node <path>`. They exit non-zero on failure (via `node:assert`). There is no Jest/Vitest.
- **TypeScript test execution:** `lib/districts.ts` is imported by test scripts. To run TS directly under Node without a build step, tests import the compiled logic by requiring a tiny **pure-JS mirror is NOT used** — instead tests are written as `.mjs` that import from a `.mjs`-compatible build. To avoid a toolchain detour, **`lib/districts.ts` must use only syntax that `tsx` can run**, and tests run via `npx tsx <test>`. `tsx` is available through `npx` (downloads on first run). If offline, fall back to `npx ts-node`. Confirm availability in Task 0.

---

## Task 0: Confirm test runner

**Files:** none (environment check)

- [ ] **Step 1: Verify a TS runner is available**

Run: `npx --yes tsx --version`
Expected: prints a version (e.g. `4.x.x`). If it fails, run `npx --yes ts-node --version` and use `ts-node` in place of `tsx` for all later test commands.

- [ ] **Step 2: Note the runner**

Record which runner worked (`tsx` or `ts-node`). All `Run:` commands below assume `tsx`.

---

## Task 1: Canonical district module

**Files:**
- Create: `lib/districts.ts`
- Test: `scripts/test_districts.mts`

- [ ] **Step 1: Write the failing test**

Create `scripts/test_districts.mts`:

```ts
import assert from "node:assert";
import { normalizeDistrict, districtSlug } from "../lib/districts.ts";

// 1. Spelling/space variants merge to one canonical (Si Racha).
for (const raw of ["Si Racha District", "Sriracha", "Sri Racha", "Srira", "tungsukla Sriracha"]) {
  const c = normalizeDistrict("chon_buri", raw);
  assert.ok(c, `expected canonical for ${raw}`);
  assert.equal(c!.name, "Si Racha District", `name for ${raw}`);
  assert.equal(c!.slug, "si-racha-district", `slug for ${raw}`);
  assert.equal(c!.citySlug, "chon_buri", `citySlug for ${raw}`);
}

// 2. Thai-script + admin-prefix variants merge (Mueang Samut Sakhon).
for (const raw of ["Mueang Samut Sakhon District", "เมือง", "อำเภอเมือง", "อเมือง", "Muang", "Mueng", "Samutsakorn"]) {
  const c = normalizeDistrict("samut_sakhon", raw);
  assert.ok(c, `expected canonical for ${raw}`);
  assert.equal(c!.name, "Mueang Samut Sakhon District", `name for ${raw}`);
}

// 3. p/ph spelling variants (Phan Thong).
for (const raw of ["Phan Thong District", "Panthong", "Phanthong", "Phantong", "PANTHONG", "Pantong District", "พานทอง"]) {
  const c = normalizeDistrict("chon_buri", raw);
  assert.equal(c?.name, "Phan Thong District", `name for ${raw}`);
}

// 4. Sub-locality rolls up to its parent district (Pattaya -> Bang Lamung).
assert.equal(normalizeDistrict("chon_buri", "Pattaya")?.name, "Bang Lamung District");
assert.equal(normalizeDistrict("chon_buri", "Banglamung")?.name, "Bang Lamung District");

// 5. City mis-file is corrected (Si Racha is chon_buri, not rayong).
assert.equal(normalizeDistrict("rayong", "Si Racha District")?.citySlug, "chon_buri");
assert.equal(normalizeDistrict("chonburi", "Sriracha")?.citySlug, "chon_buri");

// 6. Junk values yield null (no district page).
for (const raw of ["61", "89", "25", "172 หมู่8 ซอยสุขสวัสดิ์72", "Khlong Toei Nuea Subdistrict", "Debaratana Road Bang Na Nuea Sub-district", "Bangkok"]) {
  assert.equal(normalizeDistrict("bangkok", raw), null, `junk ${raw} should be null`);
}

// 7. Unknown-but-plausible small district is preserved as its own canonical.
const ong = normalizeDistrict("nakhon_nayok", "Ongkharak District");
assert.equal(ong?.name, "Ongkharak District");
assert.equal(ong?.slug, "ongkharak-district");

// 8. districtSlug is stable ASCII.
assert.equal(districtSlug("Si Racha District"), "si-racha-district");

console.log("test_districts: OK");
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx --yes tsx scripts/test_districts.mts`
Expected: FAIL — `Cannot find module '../lib/districts.ts'` (module not created yet).

- [ ] **Step 3: Create `lib/districts.ts`**

```ts
// Canonical district normalization — single source of truth for /d, /c/[cat]/[district],
// city pages, and sitemap. Collapses spelling/script/admin-prefix variants, rolls up
// known sub-localities, corrects mis-filed cities, and drops junk values.
//
// Idempotent: re-running on already-canonical input returns the same result, so the
// nightly master_db.json regeneration cannot reintroduce duplicate district pages.

export type CanonicalDistrict = { name: string; slug: string; citySlug: string };

export function districtSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}

// Admin prefixes (Thai + romanized) and the "District" suffix are noise for matching.
const ADMIN_PREFIX = /^(amphoe|amphur|amphur\s|ampur|อำเภอ|อ\.|เขต|ตำบล|tambon|tphanthong\s+a)/i;
const THAI_MUANG = /(เมือง|อเมือง|มือง)/;

// Reduce a raw district string to a comparison key: drop admin words, the "District"
// suffix, all whitespace, punctuation, and lowercase. "Si Racha District" -> "siracha",
// "Banglamung" -> "banglamung".
function stripKey(raw: string): string {
  let s = raw.trim().toLowerCase();
  s = s.replace(/\bdistrict\b/g, " ");
  s = s.replace(/\b(amphoe|amphur|ampur|muang|mueang|mueng)\b/g, " ");
  s = s.replace(/อำเภอ|เขต|ตำบล|อ\./g, " ");
  s = s.replace(/[^a-z0-9ก-๿]+/g, "");
  return s;
}

// Canonical districts that have (or plausibly have) a real page. citySlug is authoritative
// and overrides the supplier's recorded city when they disagree (mis-file correction).
const CANON: { name: string; citySlug: string }[] = [
  // chon_buri
  { name: "Si Racha District", citySlug: "chon_buri" },
  { name: "Bang Lamung District", citySlug: "chon_buri" },
  { name: "Ban Bueng District", citySlug: "chon_buri" },
  { name: "Chon Buri District", citySlug: "chon_buri" },
  { name: "Phan Thong District", citySlug: "chon_buri" },
  { name: "Nong Yai District", citySlug: "chon_buri" },
  { name: "Bo Thong District", citySlug: "chon_buri" },
  { name: "Phanat Nikhom District", citySlug: "chon_buri" },
  { name: "Sattahip District", citySlug: "chon_buri" },
  { name: "Ko Chan District", citySlug: "chon_buri" },
  // samut_sakhon
  { name: "Mueang Samut Sakhon District", citySlug: "samut_sakhon" },
  { name: "Krathum Baen District", citySlug: "samut_sakhon" },
  { name: "Ban Phaeo District", citySlug: "samut_sakhon" },
  // pathum_thani
  { name: "Khlong Luang District", citySlug: "pathum_thani" },
  { name: "Lam Luk Ka District", citySlug: "pathum_thani" },
  { name: "Thanyaburi District", citySlug: "pathum_thani" },
  { name: "Mueang Pathum Thani District", citySlug: "pathum_thani" },
  { name: "Lat Lum Kaeo District", citySlug: "pathum_thani" },
  { name: "Sam Khok District", citySlug: "pathum_thani" },
  { name: "Nong Suea District", citySlug: "pathum_thani" },
  // samut_prakan
  { name: "Bang Phli District", citySlug: "samut_prakan" },
  { name: "Mueang Samut Prakan District", citySlug: "samut_prakan" },
  { name: "Bang Sao Thong District", citySlug: "samut_prakan" },
  { name: "Bang Bo District", citySlug: "samut_prakan" },
  { name: "Phra Pradaeng District", citySlug: "samut_prakan" },
  { name: "Phra Samut Chedi District", citySlug: "samut_prakan" },
  // rayong
  { name: "Pluak Daeng District", citySlug: "rayong" },
  // songkhla
  { name: "Hat Yai District", citySlug: "songkhla" },
  { name: "Mueang Songkhla District", citySlug: "songkhla" },
  // others (own city, small but legit)
  { name: "Ongkharak District", citySlug: "nakhon_nayok" },
  { name: "Sam Phran District", citySlug: "nakhon_pathom" },
];

// Build stripKey(canonicalName) -> canonical lookup.
const CANON_BY_KEY = new Map<string, CanonicalDistrict>();
for (const c of CANON) {
  CANON_BY_KEY.set(stripKey(c.name), { name: c.name, slug: districtSlug(c.name), citySlug: c.citySlug });
}

// Explicit aliases whose stripKey does NOT equal a canonical stripKey (phonetic / partial /
// sub-locality / Thai). Keyed by stripKey(alias) -> canonical name (citySlug from CANON).
const ALIAS_TO_NAME: Record<string, string> = {
  // Si Racha
  srira: "Si Racha District",
  tungsuklasriracha: "Si Racha District",
  ศรราชา: "Si Racha District",
  บวน: "Si Racha District", // อำเภอ บ่อวิน (Bo Win, in Si Racha)
  // Bang Lamung
  pattaya: "Bang Lamung District",
  // Phan Thong (p/ph variants + Thai)
  panthong: "Phan Thong District",
  phanthong: "Phan Thong District",
  phantong: "Phan Thong District",
  pantong: "Phan Thong District",
  พานทอง: "Phan Thong District",
  // Chon Buri (central / Muang)
  chonburi: "Chon Buri District",
  chonburi2: "Chon Buri District",
  city: "Chon Buri District",
  // Phanat Nikhom
  panusnikom: "Phanat Nikhom District",
  // Mueang Samut Sakhon
  samutsakorn: "Mueang Samut Sakhon District",
  muangsamutsakorn: "Mueang Samut Sakhon District",
  // Krathum Baen
  krathumban: "Krathum Baen District",
  krathumbaen: "Krathum Baen District",
  // Khlong Luang
  klongluang: "Khlong Luang District",
  // Thanyaburi (Rangsit sub-area)
  รงสต: "Thanyaburi District",
  // Mueang Pathum Thani
  pathumthani: "Mueang Pathum Thani District",
  // Bang Phli
  bangplee: "Bang Phli District",
  // Bang Sao Thong
  bangsaotong: "Bang Sao Thong District",
  bangsaothong: "Bang Sao Thong District",
  // Mueang Samut Prakan
  preaksa: "Mueang Samut Prakan District",
  เมองสมทรปราการ: "Mueang Samut Prakan District",
  // Phra Pradaeng
  พระประแดง: "Phra Pradaeng District",
};

const NAME_TO_CANON = new Map<string, CanonicalDistrict>();
for (const c of CANON_BY_KEY.values()) NAME_TO_CANON.set(c.name, c);

// Junk: numeric-leading, address/road/subdistrict fragments, or too short to be a district.
const JUNK = /(road|subdistrict|sub-district|tower|ซอย|หมู่|ถนน|^\d|^bangkok$|^thailand$)/i;

function looksPlausible(raw: string): boolean {
  const k = stripKey(raw);
  if (k.length < 3) return false;
  if (JUNK.test(raw.trim())) return false;
  return true;
}

// Title-case a plausible-but-unknown district for use as its own canonical.
function titleCase(raw: string): string {
  return raw.trim().replace(/\s+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function normalizeDistrict(rawCity: string, rawDistrict: string | null | undefined): CanonicalDistrict | null {
  if (!rawDistrict) return null;
  const raw = rawDistrict.trim();
  if (!raw) return null;

  // Hard junk filter first.
  if (JUNK.test(raw)) return null;

  const key = stripKey(raw);

  // 1. Direct canonical-key hit.
  const direct = CANON_BY_KEY.get(key);
  if (direct) return direct;

  // 2. Explicit alias.
  const aliasName = ALIAS_TO_NAME[key];
  if (aliasName) {
    const canon = NAME_TO_CANON.get(aliasName);
    if (canon) return canon;
  }

  // 3. Pure "Muang/Mueang/เมือง" with no place qualifier -> the city's central district,
  //    if that city has exactly one Mueang canonical.
  if (key === "" || THAI_MUANG.test(raw) || /^m(u|ue)e?ang$/i.test(raw.replace(/\s|district/gi, ""))) {
    const central = CANON.find((c) => c.citySlug === rawCity && /^(Mueang|Chon Buri District)/.test(c.name));
    if (central) return NAME_TO_CANON.get(central.name) ?? null;
  }

  // 4. Plausible unknown -> keep as its own thin canonical (will be noindexed downstream).
  if (looksPlausible(raw)) {
    const name = /district$/i.test(raw) ? titleCase(raw) : `${titleCase(raw)} District`;
    return { name, slug: districtSlug(name), citySlug: rawCity };
  }

  // 5. Otherwise drop.
  return null;
}
```

> NOTE: The `chonburi2` alias key is unreachable filler kept out — remove it. (See Step 5 self-check.) The `บวน`/Thai keys are best-effort; tests only assert the romanized + high-count cases.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx --yes tsx scripts/test_districts.mts`
Expected: PASS — prints `test_districts: OK`.

- [ ] **Step 5: Remove the unreachable `chonburi2` alias**

Delete the line `chonburi2: "Chon Buri District",` from `ALIAS_TO_NAME` (it can never be produced by `stripKey`). Re-run Step 4 to confirm still green.

- [ ] **Step 6: Commit**

```bash
git add lib/districts.ts scripts/test_districts.mts
git commit -m "feat(districts): canonical district normalization module"
```

---

## Task 2: Normalize at load + rebuild counts

**Files:**
- Modify: `lib/types.ts` (add `district_slug?`)
- Modify: `lib/data.ts:10-29` (`loadMasterDb`)
- Test: `scripts/test_data_normalize.mts`

- [ ] **Step 1: Write the failing test**

Create `scripts/test_data_normalize.mts`:

```ts
import assert from "node:assert";
import { loadMasterDb } from "../lib/data.ts";

const db = await loadMasterDb();

// No district_counts key contains a known junk/variant after normalization.
const keys = Object.keys(db.district_counts);
for (const bad of ["Sriracha", "Banglamung", "Panthong", "เมือง", "อำเภอเมือง", "อเมือง"]) {
  assert.ok(!keys.some((k) => k.endsWith("/" + bad)), `district_counts should not contain ${bad}`);
}

// Si Racha is filed under chon_buri only (rayong mis-file corrected).
assert.ok(keys.includes("chon_buri/Si Racha District"), "expected chon_buri/Si Racha District");
assert.ok(!keys.some((k) => k === "rayong/Si Racha District"), "rayong Si Racha should be corrected");

// Every supplier with a district now has a clean ASCII district_slug.
for (const s of db.suppliers) {
  if (s.district) {
    assert.ok(/^[a-z0-9-]+$/.test(s.district_slug ?? ""), `bad slug for ${s.district}: ${s.district_slug}`);
  }
}

// Counts are positive and the Si Racha merge absorbed the variants (was 184 + 5 + ...).
assert.ok(db.district_counts["chon_buri/Si Racha District"] >= 184, "Si Racha count should absorb variants");

console.log("test_data_normalize: OK");
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx --yes tsx scripts/test_data_normalize.mts`
Expected: FAIL — assertion error (variants still present / `district_slug` undefined).

- [ ] **Step 3: Add `district_slug` to the Supplier type**

In `lib/types.ts`, inside `export type Supplier`, add after `district: string;` (line 47):

```ts
  district_slug?: string;     // canonical ASCII slug (set at load by lib/districts).
```

- [ ] **Step 4: Normalize inside `loadMasterDb`**

In `lib/data.ts`, add the import at the top (after line 3):

```ts
import { normalizeDistrict } from "./districts";
```

Then, in `loadMasterDb`, replace the photo-merge loop and cache assignment (lines 23-28) with normalization included:

```ts
  for (const s of db.suppliers) {
    if (photos[s.id]) s.hero_image = photos[s.id];

    // Canonicalize district + correct mis-filed city.
    const canon = normalizeDistrict(s.city, s.district);
    if (canon) {
      s.district = canon.name;
      s.district_slug = canon.slug;
      s.city = canon.citySlug;
    } else {
      s.district = "";
      s.district_slug = undefined;
    }
  }

  // Rebuild district_counts from canonical values (key: `${citySlug}/${name}`).
  const counts: Record<string, number> = {};
  for (const s of db.suppliers) {
    if (!s.district) continue;
    const key = `${s.city}/${s.district}`;
    counts[key] = (counts[key] ?? 0) + 1;
  }
  db.district_counts = counts;

  _cache = db;
  return _cache;
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx --yes tsx scripts/test_data_normalize.mts`
Expected: PASS — prints `test_data_normalize: OK`.

- [ ] **Step 6: Re-run Task 1 test (no regression)**

Run: `npx --yes tsx scripts/test_districts.mts`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add lib/types.ts lib/data.ts scripts/test_data_normalize.mts
git commit -m "feat(data): normalize districts + rebuild counts at load"
```

---

## Task 3: District page — canonical slug + thin-content metadata

**Files:**
- Modify: `app/d/[district]/page.tsx`

- [ ] **Step 1: Use the shared slug helper in `districtFromSlug` and metadata**

In `app/d/[district]/page.tsx`, add import (after line 7):

```ts
import { districtSlug } from "@/lib/districts";
```

Replace `districtFromSlug` (lines 10-13) with:

```ts
function districtFromSlug(slug: string, all: string[]): string | null {
  const target = slug.toLowerCase();
  return all.find((d) => districtSlug(d) === target) ?? null;
}
```

Replace both `generateStaticParams` (line 22) and any `.toLowerCase().replace(/\s+/g, "-")` in this file with `districtSlug(d)`. Specifically line 22 becomes:

```ts
  return districts.map((d) => ({ district: districtSlug(d) }));
```

- [ ] **Step 2: Add thin-content metadata (noindex + canonical to city)**

In `generateMetadata` (lines 25-39), after computing `districtName`, compute the city slug and supplier count, and return thin-aware robots/canonical. Replace the `return { ... }` block with:

```ts
  const filtered = filterByDistrict(db.suppliers, districtName);
  const citySlug = filtered[0]?.city ?? "";
  const thin = filtered.length < 5;
  return {
    title: `Suppliers in ${districtName} — Verified B2B Directory`,
    description: `Manufacturers, warehouses, and industrial operators in ${districtName} with Trust Scores from real Google reviews.`,
    alternates: { canonical: thin && citySlug ? `/city/${citySlug}` : `/d/${district}` },
    robots: thin ? { index: false, follow: true } : { index: true, follow: true },
  };
```

Ensure `filterByDistrict` is imported (it already is, line 2).

- [ ] **Step 3: Use canonical slug for the category-facet links and breadcrumbs in the body**

In the default export, the facet links use `href={`/c/${c}/${district}`}` — `district` is the route param (already canonical), leave as-is. No change needed in the body since `district` param is canonical.

- [ ] **Step 4: Verify the build compiles this route**

Run: `npm run build`
Expected: build SUCCEEDS; output shows fewer `/d/*` routes than before (variants gone). Note the `/d` route count from the build summary.

- [ ] **Step 5: Commit**

```bash
git add app/d/[district]/page.tsx
git commit -m "feat(d): canonical slugs + noindex thin district pages"
```

---

## Task 4: Sitemap — canonical districts + threshold 5

**Files:**
- Modify: `app/sitemap.ts:92-110`

- [ ] **Step 1: Replace district sitemap emission with count-gated canonical loop**

In `app/sitemap.ts`, add import (after line 2):

```ts
import { districtSlug } from "@/lib/districts";
```

Replace the district block (lines 102-105, the `for (const d of districts)` loop) with a count-aware version. First, build per-district counts from `db.district_counts` (already canonical after Task 2):

```ts
  // District pages — only those with >= 5 suppliers (thin pages are noindex + omitted).
  for (const [key, n] of Object.entries(db.district_counts)) {
    if (n < 5) continue;
    const name = key.split("/")[1];
    if (!name) continue;
    items.push({
      url: `${SITE}/d/${districtSlug(name)}`,
      lastModified: updated,
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }
```

Also update line 96 (`const dSlug = s.district.toLowerCase().replace(/\s+/g, "-");`) to `const dSlug = districtSlug(s.district);` for consistency in the category×district sitemap counting.

- [ ] **Step 2: Verify build + sitemap generation**

Run: `npm run build`
Expected: build SUCCEEDS. `out/sitemap.xml` exists.

- [ ] **Step 3: Assert no thin/variant `/d/` URLs in sitemap**

Run: `npx --yes tsx scripts/test_sitemap_districts.mts`

Create `scripts/test_sitemap_districts.mts` first:

```ts
import assert from "node:assert";
import { readFile } from "node:fs/promises";

const xml = await readFile("out/sitemap.xml", "utf-8");
// No legacy variant slugs.
for (const bad of ["/d/sriracha<", "/d/banglamung<", "/d/panthong<", "/d/%"]) {
  assert.ok(!xml.includes(bad), `sitemap should not contain ${bad}`);
}
console.log("test_sitemap_districts: OK");
```

Expected: PASS — `test_sitemap_districts: OK`.

- [ ] **Step 4: Commit**

```bash
git add app/sitemap.ts scripts/test_sitemap_districts.mts
git commit -m "feat(sitemap): canonical districts, omit thin (<5) pages"
```

---

## Task 5: City + category×district slug consistency

**Files:**
- Modify: `app/city/[name]/page.tsx:209-216`
- Modify: `app/c/[cuisine]/[district]/page.tsx:12-15,25,49-55`

- [ ] **Step 1: City page — use canonical slug for district chips**

In `app/city/[name]/page.tsx`, add import (after line 6):

```ts
import { districtSlug } from "@/lib/districts";
```

Replace `href={`/d/${d.toLowerCase().replace(/\s+/g, "-")}`}` (line 212) with:

```ts
                href={`/d/${districtSlug(d)}`}
```

- [ ] **Step 2: Category×district page — use shared slug helper**

In `app/c/[cuisine]/[district]/page.tsx`, add import (after line 7):

```ts
import { districtSlug } from "@/lib/districts";
```

Replace `districtFromSlug` body (line 14) to use `districtSlug(d)`:

```ts
  return all.find((d) => districtSlug(d) === target) ?? null;
```

Replace line 25 (`const dSlug = s.district.toLowerCase().replace(/\s+/g, "-");`) with:

```ts
    const dSlug = districtSlug(s.district);
```

Replace line 54 (`s.district.toLowerCase().replace(/\s+/g, "-") === district`) with:

```ts
      districtSlug(s.district) === district
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: build SUCCEEDS, no type errors.

- [ ] **Step 4: Commit**

```bash
git add app/city/[name]/page.tsx app/c/[cuisine]/[district]/page.tsx
git commit -m "refactor: use shared districtSlug across city + category routes"
```

---

## Task 6: Redirect generator for old alias slugs

**Files:**
- Create: `scripts/gen_district_redirects.mjs`
- Modify: `public/_redirects`
- Modify: `package.json:6-9` (build script)

- [ ] **Step 1: Write the generator**

Create `scripts/gen_district_redirects.mjs`:

```js
// Generate 301 redirects from every PRE-normalization district slug to its canonical slug,
// written into a marked block in public/_redirects (manual entries preserved).
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const REDIRECTS = path.join(ROOT, "public", "_redirects");
const BEGIN = "# BEGIN district-redirects (generated)";
const END = "# END district-redirects (generated)";

// Re-implement normalization import via tsx-free dynamic import of the TS module is not
// possible in a plain .mjs; instead we shell to the compiled logic through a JSON dump.
// Simplest robust path: read raw master_db (pre-normalization) and the canonical module
// by importing the .ts via the project's runtime is unavailable here — so we duplicate the
// minimal slug derivation and rely on lib/districts for mapping through a tsx subprocess.
const { execFileSync } = await import("node:child_process");
const out = execFileSync("npx", ["--yes", "tsx", path.join("scripts", "dump_district_map.mts")], {
  cwd: ROOT, encoding: "utf-8",
});
const pairs = JSON.parse(out); // [{ from: "sriracha", to: "si-racha-district" }, ...]

const lines = [BEGIN];
const seen = new Set();
for (const { from, to } of pairs) {
  if (from === to || seen.has(from)) continue;
  seen.add(from);
  lines.push(`/d/${from} /d/${to} 301`);
}
lines.push(END);

let content = await readFile(REDIRECTS, "utf-8");
if (content.includes(BEGIN)) {
  content = content.replace(new RegExp(`${BEGIN}[\\s\\S]*?${END}`), lines.join("\n"));
} else {
  content = content.trimEnd() + "\n\n" + lines.join("\n") + "\n";
}
await writeFile(REDIRECTS, content);
console.log(`gen_district_redirects: wrote ${seen.size} redirects`);
```

- [ ] **Step 2: Write the map-dump helper**

Create `scripts/dump_district_map.mts`:

```ts
// Emit [{from, to}] for every raw district slug -> canonical slug, from raw master_db.
import { readFile } from "node:fs/promises";
import { normalizeDistrict, districtSlug } from "../lib/districts.ts";

const raw = JSON.parse(await readFile("data/master_db.json", "utf-8"));
const out: { from: string; to: string }[] = [];
const seen = new Set<string>();
for (const s of raw.suppliers) {
  if (!s.district) continue;
  const from = districtSlug(s.district);
  if (!from || seen.has(from)) continue;
  seen.add(from);
  const canon = normalizeDistrict(s.city, s.district);
  if (!canon) continue;
  if (canon.slug !== from) out.push({ from, to: canon.slug });
}
process.stdout.write(JSON.stringify(out));
```

- [ ] **Step 3: Run the generator**

Run: `node scripts/gen_district_redirects.mjs`
Expected: prints `gen_district_redirects: wrote N redirects` (N ≥ 10). `public/_redirects` now contains a `# BEGIN district-redirects` block with lines like `/d/sriracha /d/si-racha-district 301`.

- [ ] **Step 4: Verify the block in `_redirects`**

Run: `Select-String -Path public/_redirects -Pattern "si-racha-district"`
Expected: at least one match (e.g. `/d/sriracha /d/si-racha-district 301`).

- [ ] **Step 5: Wire into build**

In `package.json`, change the `build` script (line 7) from:

```json
    "build": "next build",
```

to:

```json
    "build": "node scripts/gen_district_redirects.mjs && next build",
```

- [ ] **Step 6: Full build sanity**

Run: `npm run build`
Expected: redirect generator runs first, then build SUCCEEDS. `out/_redirects` contains the generated block.

- [ ] **Step 7: Commit**

```bash
git add scripts/gen_district_redirects.mjs scripts/dump_district_map.mts public/_redirects package.json
git commit -m "feat(redirects): 301 old district slugs to canonical at build"
```

---

## Task 7: Footer link validation

**Files:**
- Create: `scripts/check_footer_links.mjs`
- Modify: `app/layout.tsx` (only if broken links are found)

- [ ] **Step 1: Write the checker**

Create `scripts/check_footer_links.mjs`:

```js
// Validate every internal href in the footer (app/layout.tsx) resolves to a generated
// route under out/. Run AFTER `npm run build`. Exits non-zero if any link 404s.
import { readFile, access } from "node:fs/promises";
import path from "node:path";

const layout = await readFile("app/layout.tsx", "utf-8");
const footer = layout.slice(layout.indexOf("<footer"));
const hrefs = [...footer.matchAll(/href="(\/[^"]*)"/g)].map((m) => m[1]);

async function exists(route) {
  // Map a clean route to its static output file.
  if (route === "/") return true; // index.html always emitted
  const clean = route.replace(/^\//, "").replace(/\/$/, "");
  for (const candidate of [`out/${clean}.html`, `out/${clean}/index.html`, `out/${clean}`]) {
    try { await access(path.normalize(candidate)); return true; } catch {}
  }
  return false;
}

const broken = [];
for (const h of [...new Set(hrefs)]) {
  // Skip dynamic/known-special routes served as files.
  if (h.startsWith("/sitemap")) continue;
  if (!(await exists(h))) broken.push(h);
}

if (broken.length) {
  console.error("BROKEN footer links:\n" + broken.map((b) => "  " + b).join("\n"));
  process.exit(1);
}
console.log(`check_footer_links: OK (${new Set(hrefs).size} links)`);
```

- [ ] **Step 2: Run the checker against the built output**

Run: `npm run build` then `node scripts/check_footer_links.mjs`
Expected: either `check_footer_links: OK (N links)` OR a list of BROKEN links.

- [ ] **Step 3: Fix any broken links**

If broken links are reported, fix each in `app/layout.tsx`:
- If the target page does not exist, point the link to the nearest valid page (e.g. a missing `/best/auto-parts` → verify the real slug in `lib/bestFor.ts` and use it).
- Re-run Step 2 until it prints `check_footer_links: OK`.

If Step 2 was already OK, no edit is needed — record that the footer passed.

- [ ] **Step 4: Commit**

```bash
git add scripts/check_footer_links.mjs app/layout.tsx
git commit -m "test(footer): validate footer links resolve to built routes"
```

---

## Task 8: Final verification

**Files:** none

- [ ] **Step 1: Run all unit tests**

Run each, expect each to print `OK`:
```
npx --yes tsx scripts/test_districts.mts
npx --yes tsx scripts/test_data_normalize.mts
npx --yes tsx scripts/test_sitemap_districts.mts
```

- [ ] **Step 2: Clean build + footer check**

Run: `npm run build` then `node scripts/check_footer_links.mjs`
Expected: build SUCCEEDS; footer check prints OK.

- [ ] **Step 3: Confirm page-count reduction**

Run: `(Get-ChildItem -Recurse out/d -Filter *.html | Measure-Object).Count`
Expected: the `/d` HTML page count is meaningfully lower than the pre-change count (variants collapsed). Record the number.

- [ ] **Step 4: Update memory / done**

No commit needed. Report the before/after `/d` page count and the number of redirects written.

---

## Self-Review Notes (author)

- **Spec coverage:** Dedup (Tasks 1,2,5), canonical slugs everywhere (3,4,5), thin-content noindex+canonical (3) + sitemap omit (4), redirects (6), footer audit (7), tests (1,2,4,8). City mis-file correction (2, via `citySlug` in CANON). All spec sections mapped.
- **Type consistency:** `normalizeDistrict`, `districtSlug`, `CanonicalDistrict`, `district_slug` used identically across tasks.
- **Known risk:** Thai-script alias keys in `ALIAS_TO_NAME` are best-effort (`stripKey` keeps Thai chars but exact byte-matching may miss some). Tests only assert romanized + high-count merges, which are the SEO-material ones. Thai-only thin entries that miss the alias fall through to rule 4 (plausible → own thin canonical) or junk → null; either way they are noindex/absent, so SEO impact is contained.
```
