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
  sriracha: "Si Racha District",
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
  city: "Chon Buri District",
  muangchonburi: "Chon Buri District",
  // Phan Thong (mangled)
  tphanthongaphanthong: "Phan Thong District",
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
  //    Only for ASCII names — unmatched Thai-only values would yield non-ASCII slugs, so
  //    they are dropped (they are always count-1 thin entries anyway).
  if (looksPlausible(raw)) {
    const name = /district$/i.test(raw) ? titleCase(raw) : `${titleCase(raw)} District`;
    const slug = districtSlug(name);
    if (/^[a-z0-9-]+$/.test(slug)) return { name, slug, citySlug: rawCity };
  }

  // 5. Otherwise drop.
  return null;
}
