// Header global search — merges category, region, and supplier matches into one
// ranked result list. Pure functions, no DOM — testable without a browser.
import { CATEGORY_LABELS } from "./types";
import { citySlugFromDisplay } from "./cityNorm";
import { CATEGORY_LABELS_TH, PROVINCE_TH } from "./thaiNames";
import type { BrowseEntry } from "./browseIndex";

const MIN_QUERY_LEN = 2;

// 예전에는 영어 라벨에 질의 전체를 부분일치시켰다. 그래서 "chonburi"(라벨은
// "Chon Buri"), "พลาสติก"(태국어), "plastic chonburi"(업종+지역) 가 전부 0건이었다.
// 태국 바이어는 태국어로, 외국 바이어는 "업종 + 지역" 으로 찾는다.
// compact(): 소문자 + 공백·하이픈·밑줄 제거 + "จังหวัด"/"จ." 접두어 제거.
function compact(s: string): string {
  return s.toLowerCase().replace(/จังหวัด|^จ\./g, "").replace(/[\s\-_.,/&]+/g, "");
}

const STOPWORDS = new Set([
  "the", "and", "for", "near", "thailand", "thai", "company", "ltd",
  "supplier", "suppliers", "best", "top",
]);

function tokensOf(query: string): string[] {
  return query
    .toLowerCase()
    .split(/[\s,]+/)
    .filter((t) => t.length >= 3 && !STOPWORDS.has(t))
    .map(compact)
    .filter(Boolean);
}

/** label 이 질의와 맞는가: 질의 전체 ⊂ 라벨, 토큰 ⊂ 라벨, 또는 라벨 ⊂ 질의
 *  (띄어쓰기 없는 태국어 "โรงงานพลาสติกชลบุรี", 영어 "plastic factories chonburi"). */
function labelHit(label: string, q: string, toks: string[]): boolean {
  const L = compact(label);
  if (L.length < 2) return false;
  if (L.includes(q)) return true;
  if (L.length >= 4 && q.includes(L)) return true;
  return toks.some((t) => L.includes(t));
}

export type SearchResult =
  | { kind: "category"; key: string; label: string; href: string }
  | { kind: "combo"; category: string; region: string; label: string; count: number; href: string }
  | { kind: "region"; label: string; count: number; href: string }
  | { kind: "supplier"; id: string; name: string; cityLabel: string; district: string | null; trustScore: number; href: string };

// 바이어가 실제로 치는 말 중 라벨에 없는 것. 값은 CATEGORY_LABELS 키.
const CATEGORY_SYNONYMS: Record<string, string[]> = {
  warehouse: ["cold storage", "ห้องเย็น", "โกดัง", "storage"],
  logistics: ["freight", "shipping", "transport", "ขนส่ง", "ชิปปิ้ง", "โลจิสติกส์"],
  food_mfg: ["food", "seafood", "frozen", "อาหาร"],
  steel: ["metal", "เหล็ก", "โลหะ"],
  machining: ["cnc", "โรงกลึง", "แม่พิมพ์", "mold", "mould"],
  textile: ["garment", "apparel", "clothing", "สิ่งทอ", "เสื้อผ้า"],
  plastic: ["injection"],
  packaging: ["บรรจุภัณฑ์", "carton", "box"],
  auto_parts: ["automotive", "อะไหล่", "ยานยนต์"],
  chemical: ["เคมี"],
  electronics: ["pcb", "อิเล็กทรอนิกส์"],
  rubber: ["ยาง", "latex"],
  machinery: ["เครื่องจักร"],
  exporter: ["export", "ส่งออก"],
  manufacturer: ["oem", "odm", "ผู้ผลิต"],
};

function categoryKeys(query: string): string[] {
  const q = compact(query);
  if (q.length < MIN_QUERY_LEN) return [];
  const toks = tokensOf(query);
  return Object.keys(CATEGORY_LABELS).filter((key) =>
    [CATEGORY_LABELS[key], CATEGORY_LABELS_TH[key], key, ...(CATEGORY_SYNONYMS[key] ?? [])].some((l) => !!l && labelHit(l, q, toks)),
  );
}

export function matchCategories(query: string): SearchResult[] {
  return categoryKeys(query).map((key) => ({
    kind: "category" as const,
    key,
    label: CATEGORY_LABELS[key],
    href: `/c/${key}`,
  }));
}

/**
 * Group browse-index entries by city_label. Compute once per fetched dataset.
 * When `validCities` is given, labels outside it are dropped — some
 * supplier.city_label values (e.g. "Pattaya", "Phuket") never made it into
 * master_db.json's city_counts and have no generated /city/{slug} page, so
 * surfacing them as a clickable region result would 404.
 */
export function regionCounts(entries: BrowseEntry[], validCities?: Set<string>): Map<string, number> {
  const m = new Map<string, number>();
  for (const e of entries) {
    if (!e.city_label) continue;
    if (validCities && !validCities.has(e.city_label)) continue;
    m.set(e.city_label, (m.get(e.city_label) ?? 0) + 1);
  }
  return m;
}

function regionLabels(query: string, counts: Map<string, number>): string[] {
  const q = compact(query);
  if (q.length < MIN_QUERY_LEN) return [];
  const toks = tokensOf(query);
  return Array.from(counts.keys()).filter((label) => {
    const th = PROVINCE_TH[citySlugFromDisplay(label)];
    return labelHit(label, q, toks) || (!!th && labelHit(th, q, toks));
  });
}

export function matchRegions(query: string, counts: Map<string, number>): SearchResult[] {
  return regionLabels(query, counts)
    .map((label) => [label, counts.get(label) ?? 0] as const)
    .sort((a, b) => b[1] - a[1])
    .map(([label, count]) => ({
      kind: "region" as const,
      label,
      count,
      href: `/city/${citySlugFromDisplay(label)}`,
    }));
}

export function matchSuppliers(query: string, entries: BrowseEntry[], limit: number): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (q.length < MIN_QUERY_LEN || limit <= 0) return [];
  const qc = compact(q);
  return entries
    .filter(
      (e) =>
        (e.name && (e.name.toLowerCase().includes(q) || compact(e.name).includes(qc))) ||
        (e.district && e.district.toLowerCase().includes(q)) ||
        (e.city_label && e.city_label.toLowerCase().includes(q)),
    )
    .sort((a, b) => b.trust_score - a.trust_score)
    .slice(0, limit)
    .map(toSupplierResult);
}

function toSupplierResult(e: BrowseEntry): SearchResult {
  return {
    kind: "supplier",
    id: e.id,
    name: e.name,
    cityLabel: e.city_label,
    district: e.district,
    trustScore: e.trust_score,
    href: `/supplier/${e.id}`,
  };
}

const MAX_RESULTS = 12;
const MAX_CATEGORY_RESULTS = 4;
const MAX_REGION_RESULTS = 4;
const MAX_COMBO_RESULTS = 4;

/** "plastic chonburi" / "พลาสติก ชลบุรี" — 업종과 지역이 둘 다 잡히면 그 교집합을
 *  홈 목록 필터(?cat=&city=)로 보내고, 교집합 공급사를 결과 본문으로 쓴다. */
function comboSearch(cats: string[], regions: string[], entries: BrowseEntry[]) {
  const combos: Extract<SearchResult, { kind: "combo" }>[] = [];
  const rows: BrowseEntry[] = [];
  for (const cat of cats) {
    for (const region of regions) {
      const hit = entries.filter((e) => e.city_label === region && e.categories.includes(cat));
      if (!hit.length) continue;
      rows.push(...hit);
      combos.push({
        kind: "combo",
        category: cat,
        region,
        label: `${CATEGORY_LABELS[cat]} in ${region}`,
        count: hit.length,
        href: `/?cat=${encodeURIComponent(cat)}&city=${encodeURIComponent(region)}#suppliers`,
      });
    }
  }
  combos.sort((a, b) => b.count - a.count);
  return { combos: combos.slice(0, MAX_COMBO_RESULTS), rows };
}

/** Category/region matches ranked first (cheap "browse many" wins), then top suppliers by trust. */
export function globalSearch(query: string, entries: BrowseEntry[], counts: Map<string, number>): SearchResult[] {
  const cats = categoryKeys(query);
  const regs = regionLabels(query, counts);
  if (cats.length && regs.length) {
    const { combos, rows } = comboSearch(cats, regs, entries);
    if (combos.length) {
      const seen = new Set<string>();
      const top = rows
        .filter((e) => !seen.has(e.id) && !!seen.add(e.id))
        .sort((a, b) => b.trust_score - a.trust_score)
        .slice(0, MAX_RESULTS - combos.length)
        .map(toSupplierResult);
      return [...combos, ...top];
    }
  }
  const categories = matchCategories(query).slice(0, MAX_CATEGORY_RESULTS);
  const regions = matchRegions(query, counts).slice(0, MAX_REGION_RESULTS);
  const remaining = Math.max(0, MAX_RESULTS - categories.length - regions.length);
  const suppliers = matchSuppliers(query, entries, remaining);
  return [...categories, ...regions, ...suppliers];
}
