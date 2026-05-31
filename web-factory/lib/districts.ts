import type { MasterDb, Supplier } from "./types";

/**
 * Canonical district resolution.
 *
 * The source data's `district` strings are extremely noisy: transliteration
 * variants (Si Racha / Sriracha / Sri Racha), Thai script (เมือง), suffix/
 * prefix noise ("District", "Amphoe", "อำเภอ"), and raw addresses dumped into
 * the field. Slugifying them verbatim produced duplicate, thin, and garbage
 * district pages (SEO cannibalization).
 *
 * This module collapses every variant to a single canonical { slug, display }
 * and drops garbage. The page routes, sitemap, indexnow and redirects all
 * derive their district set from here so they stay consistent.
 */

/** A district page must have at least this many suppliers to be worth indexing. */
export const MIN_DISTRICT_SUPPLIERS = 5;

export type DistrictGroup = {
  slug: string;
  display: string;
  citySlug: string;
  cityLabel: string;
  count: number;
};

// Province display names, keyed by the (normalized) city slug.
const PROVINCE_DISPLAY: Record<string, string> = {
  chon_buri: "Chon Buri",
  samut_prakan: "Samut Prakan",
  samut_sakhon: "Samut Sakhon",
  pathum_thani: "Pathum Thani",
  rayong: "Rayong",
  songkhla: "Songkhla",
  nakhon_pathom: "Nakhon Pathom",
  nakhon_nayok: "Nakhon Nayok",
  lopburi: "Lopburi",
  bangkok: "Bangkok",
};

// Collapse duplicate / misspelled city slugs onto a single canonical slug.
const CITY_SLUG_ALIAS: Record<string, string> = {
  chonburi: "chon_buri",
  chonbri: "chon_buri",
};

/** Normalize a raw `supplier.city` slug to its canonical form. */
export function normalizeCitySlug(city: string): string {
  const c = (city || "").toLowerCase().trim();
  return CITY_SLUG_ALIAS[c] ?? c;
}

// Non-capital districts whose transliteration variants don't collapse by
// simple token equality. Keyed by alnum-only, lowercased Latin token.
const DISTRICT_ALIAS: Record<string, { slug: string; display: string }> = {
  // Si Racha
  siracha: { slug: "si-racha", display: "Si Racha" },
  sriracha: { slug: "si-racha", display: "Si Racha" },
  srira: { slug: "si-racha", display: "Si Racha" },
  tungsuklasriracha: { slug: "si-racha", display: "Si Racha" },
  // Phan Thong
  phanthong: { slug: "phan-thong", display: "Phan Thong" },
  panthong: { slug: "phan-thong", display: "Phan Thong" },
  phantong: { slug: "phan-thong", display: "Phan Thong" },
  pantong: { slug: "phan-thong", display: "Phan Thong" },
  tphanthongaphanthong: { slug: "phan-thong", display: "Phan Thong" },
  // Phanat Nikhom
  phanatnikhom: { slug: "phanat-nikhom", display: "Phanat Nikhom" },
  panusnikom: { slug: "phanat-nikhom", display: "Phanat Nikhom" },
  // Krathum Baen
  krathumbaen: { slug: "krathum-baen", display: "Krathum Baen" },
  krathumban: { slug: "krathum-baen", display: "Krathum Baen" },
  // Bang Sao Thong
  bangsaothong: { slug: "bang-sao-thong", display: "Bang Sao Thong" },
  bangsaotong: { slug: "bang-sao-thong", display: "Bang Sao Thong" },
  // Bang Phli
  bangphli: { slug: "bang-phli", display: "Bang Phli" },
  bangplee: { slug: "bang-phli", display: "Bang Phli" },
};

// Address fragments / non-district junk that should never become a page.
const GARBAGE_RE =
  /\d|หมู่|ซอย|ถนน|ตำบล|ซ\.|ถ\.|ต\.|tower|sub-?district|subdistrict|เขต|ตำบล/i;

const STRIP_SUFFIX_RE = /\b(district|amphoe|amphur|ampur)\b/gi;
const THAI_PREFIX_RE = /^(อำเภอ|อ\.|อ)\s*/;

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function titleCase(s: string): string {
  return s.replace(/\b\w/g, (m) => m.toUpperCase());
}

// Matches the central "Amphoe Mueang" district across spellings: mueang,
// muang, mueng, and embedded forms (muangchonburi, muangsamutsakorn).
const MUEANG_RE = /m(ue?|eu)?ang|mueng/;

/**
 * Resolve a raw district string + its (raw) city slug to a canonical grouping
 * key + display name, or `null` if the value is garbage / unusable.
 *
 * The `key` is the merge identity (variants that share a `key` become one
 * district); the final URL slug is derived from the best display among a
 * group's members in {@link buildDistrictIndex}.
 */
export function normalizeDistrict(
  raw: string,
  citySlug: string,
): { key: string; display: string } | null {
  const s = (raw || "").trim();
  if (!s) return null;

  const province = PROVINCE_DISPLAY[normalizeCitySlug(citySlug)];
  const hasLatin = /[a-z]/i.test(s);

  // Pure Thai-script values: only the capital district ("เมือง") is salvageable;
  // everything else is a count-1 oddity already covered by its Latin spelling.
  if (!hasLatin) {
    if (/เมือง/.test(s) && province) {
      return { key: `mueang-${slugify(province)}`, display: `Mueang ${province}` };
    }
    return null;
  }

  if (GARBAGE_RE.test(s)) return null;

  // Strip suffixes/prefixes and reduce to an alnum-only Latin token.
  const cleaned = s
    .toLowerCase()
    .replace(THAI_PREFIX_RE, "")
    .replace(STRIP_SUFFIX_RE, "")
    .replace(/[^a-z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!cleaned) return null;

  const token = cleaned.replace(/[^a-z]/g, "");
  if (!token) return null;

  // Known transliteration families take priority (e.g. "Mueang Si Racha" must
  // resolve to Si Racha, not the provincial capital).
  if (DISTRICT_ALIAS[token]) {
    const a = DISTRICT_ALIAS[token];
    return { key: a.slug, display: a.display };
  }

  const provinceToken = province ? province.toLowerCase().replace(/[^a-z]/g, "") : "";

  // Capital district: explicit "Mueang/Muang" spellings, or the bare province
  // name used as a district (Google labels Amphoe Mueang as just the province).
  // Province-qualified key so two provinces' capitals never merge.
  if (province && (MUEANG_RE.test(token) || token === provinceToken)) {
    return { key: `mueang-${slugify(province)}`, display: `Mueang ${province}` };
  }

  // Fallback: the alnum token is the merge key (so "Bang Lamung" and
  // "Banglamung" unify); the spaced form provides a readable display.
  return { key: token, display: titleCase(cleaned) };
}

type IndexEntry = DistrictGroup & {
  key: string;
  displays: Map<string, number>;
  rawKeys: Set<string>;
};

function pickDisplay(displays: Map<string, number>): string {
  // Prefer the most common spelling; break ties toward the spaced (more
  // readable) and then longer form.
  let best = "";
  let bestScore = -Infinity;
  for (const [d, n] of displays) {
    const score = n * 100 + (d.includes(" ") ? 10 : 0) + d.length;
    if (score > bestScore) {
      bestScore = score;
      best = d;
    }
  }
  return best;
}

let _indexCache: { db: MasterDb; index: Map<string, IndexEntry> } | null = null;

/**
 * Build the canonical district index: final URL slug -> merged group.
 * Every supplier with a usable district contributes to exactly one group.
 */
export function buildDistrictIndex(db: MasterDb): Map<string, IndexEntry> {
  if (_indexCache && _indexCache.db === db) return _indexCache.index;

  // Phase 1: group raw districts by canonical merge key.
  const byKey = new Map<string, IndexEntry>();
  for (const s of db.suppliers) {
    const canon = normalizeDistrict(s.district, s.city);
    if (!canon) continue;
    let entry = byKey.get(canon.key);
    if (!entry) {
      entry = {
        key: canon.key,
        slug: "", // assigned in phase 2
        display: "",
        citySlug: normalizeCitySlug(s.city),
        cityLabel: s.city_label,
        count: 0,
        displays: new Map(),
        rawKeys: new Set(),
      };
      byKey.set(canon.key, entry);
    }
    entry.count += 1;
    entry.displays.set(canon.display, (entry.displays.get(canon.display) ?? 0) + 1);
    entry.rawKeys.add(s.district);
  }

  // Phase 2: choose display + slug, re-key by final slug.
  const index = new Map<string, IndexEntry>();
  for (const entry of byKey.values()) {
    entry.display = pickDisplay(entry.displays);
    entry.slug = slugify(entry.display);
    index.set(entry.slug, entry);
  }

  _indexCache = { db, index };
  return index;
}

function plain(g: IndexEntry): DistrictGroup {
  const { key: _k, displays: _d, rawKeys: _r, ...rest } = g;
  return rest;
}

/** Canonical districts that meet the indexing threshold, busiest first. */
export function districtsForBuild(db: MasterDb): DistrictGroup[] {
  return [...buildDistrictIndex(db).values()]
    .filter((g) => g.count >= MIN_DISTRICT_SUPPLIERS)
    .map(plain)
    .sort((a, b) => b.count - a.count);
}

/** Indexed canonical districts belonging to a given (raw) city slug, busiest first. */
export function districtsForCity(db: MasterDb, citySlug: string): DistrictGroup[] {
  const norm = normalizeCitySlug(citySlug);
  return [...buildDistrictIndex(db).values()]
    .filter((g) => g.count >= MIN_DISTRICT_SUPPLIERS && g.citySlug === norm)
    .map(plain)
    .sort((a, b) => b.count - a.count);
}

/** Look up a canonical district group by slug (only if it meets threshold). */
export function districtBySlug(db: MasterDb, slug: string): DistrictGroup | null {
  const g = buildDistrictIndex(db).get(slug);
  if (!g || g.count < MIN_DISTRICT_SUPPLIERS) return null;
  return plain(g);
}

/** All suppliers belonging to a canonical district slug. */
export function suppliersInDistrict(db: MasterDb, slug: string): Supplier[] {
  const entry = buildDistrictIndex(db).get(slug);
  if (!entry) return [];
  return db.suppliers.filter((s) => {
    const canon = normalizeDistrict(s.district, s.city);
    return canon?.key === entry.key;
  });
}

/**
 * Legacy variant slug -> canonical slug, for 301 redirects. Includes any raw
 * district slug whose canonical target differs from itself and resolves to an
 * indexed (>= threshold) district. Both `/d/<slug>` and `/c/<cat>/<slug>` use it.
 */
export function districtRedirects(db: MasterDb): Map<string, string> {
  const index = buildDistrictIndex(db);
  // canonical merge key -> final slug, for indexed districts only.
  const keyToSlug = new Map<string, string>();
  for (const e of index.values()) {
    if (e.count >= MIN_DISTRICT_SUPPLIERS) keyToSlug.set(e.key, e.slug);
  }

  const out = new Map<string, string>();
  const seen = new Set<string>();
  for (const s of db.suppliers) {
    const raw = s.district;
    if (!raw || seen.has(raw)) continue;
    seen.add(raw);
    const canon = normalizeDistrict(raw, s.city);
    if (!canon) continue;
    const targetSlug = keyToSlug.get(canon.key);
    if (!targetSlug) continue;
    const rawSlug = raw.toLowerCase().replace(/\s+/g, "-");
    if (rawSlug && rawSlug !== targetSlug && !out.has(rawSlug)) {
      out.set(rawSlug, targetSlug);
    }
  }
  return out;
}
