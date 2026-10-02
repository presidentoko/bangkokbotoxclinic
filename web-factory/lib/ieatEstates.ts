// IEAT 공식 단지 목록 + 우리가 매칭한 입주사를 합친다.
//
// 왜 (2026-10-02): /estate 는 "입주사가 매칭된 단지" 만 보여줘서 16곳이었다.
// "industrial estate in thailand"(49회 67위) / "thailand industrial park"(42회 76위)
// 는 태국 국내에서 들어오는 상위 쿼리인데, 16곳만 실린 페이지는 그 질문의 답이
// 아니다. 공식 목록(83곳)을 기준으로 깔고, 우리 입주사 데이터를 그 위에 얹는다.
//
// 목록 출처는 IEAT 공식 포털 하나로 고정했다 (scripts/fetch_ieat_estates.py).
// 입주사가 없는 단지도 숨기지 않고 "tenants not mapped yet" 으로 표시한다 —
// 목록의 완전성이 이 페이지의 가치이고, 없는 걸 있는 척하는 것보다 낫다.
import ieat from "../data/ieat_estates.json";
import type { MasterDb, Supplier } from "./types";
import { isRealEstateSlug } from "./estates";

export type IeatEstate = {
  ieat_id: number;
  salesforce_id: string;
  name: string;
  area_rai: number | null;
  operator: string | null;
  province: string | null;
  /** 상세 페이지에서 받은 필드 (scripts/fetch_ieat_estates.py --detail). */
  region?: string | null;
  name_th?: string | null;
  website?: string | null;
  location?: string | null;
  detail_url: string;
  source: string;
};

export type MergedEstate = IeatEstate & {
  /** 우리 디렉토리에서 이 단지로 매칭된 공급사. */
  tenants: Supplier[];
  verifiedTenants: number;
  /** /estate/[slug] 상세 페이지가 있는 경우의 slug. */
  slug: string | null;
};

export const IEAT_META = {
  fetchedAt: (ieat as { fetched_at: string }).fetched_at,
  source: (ieat as { source: string }).source,
  sourceUrl: (ieat as { source_url: string }).source_url,
};

/** 운영사 이름만 알고 단지는 특정 못 한 입주사 묶음. mergeEstates() 가 채운다. */
export const UNRESOLVED: MergedEstate[] = [];

export const IEAT_ESTATES = (ieat as { estates: IeatEstate[] }).estates;

/** 단지명 비교용 키. 공백·표기 차이를 흡수한다 — 우리 데이터는 "Bang Plee",
 *  공식 목록은 "Bangplee Industrial Estate" 처럼 적는다. 단지 번호(숫자)는
 *  의미가 있으므로 남긴다. */
function key(s: string): string {
  return (s || "")
    .toLowerCase()
    .replace(/\(.*?\)/g, " ")
    .replace(/\b(industrial estate|industrial park|estate|park|project|zone|ie)\b/g, " ")
    .replace(/[^a-z0-9]+/g, "");
}

// 이 길이 미만의 키는 포함 매칭을 허용하지 않는다. "wha"(3) 나 "amata"(5) 는
// 단지가 13개·4개씩 있어서 어느 단지인지 특정되지 않는다 — 억지로 붙이면
// 입주사 수가 틀린 단지에 붙는다.
const MIN_CONTAINS_LEN = 6;

// 운영사 이름만 적혀 있어 단지를 특정할 수 없는 라벨.
const OPERATOR_ONLY = /^(wha|hemaraj|amata|rojana|pinthong|navanakorn|navanakorn\d*|saha|tfd)$/;

/**
 * 공식 목록과 우리 입주사 데이터를 합친다.
 *
 * 매칭은 정규화한 이름이 서로를 포함하는지로 본다. 느슨하게 잡으면 엉뚱한 단지에
 * 입주사가 붙어 숫자가 틀리므로, 토큰이 2개 미만인 짧은 이름은 완전일치만 인정한다.
 */
export function mergeEstates(db: MasterDb): MergedEstate[] {
  // 우리 데이터의 단지별 입주사
  const ours = new Map<string, { slug: string; name: string; tenants: Supplier[] }>();
  for (const s of db.suppliers) {
    if (!s.estate_slug || !s.estate_name) continue;
    if (!isRealEstateSlug(s.estate_slug)) continue;
    let e = ours.get(s.estate_slug);
    if (!e) {
      e = { slug: s.estate_slug, name: s.estate_name, tenants: [] };
      ours.set(s.estate_slug, e);
    }
    e.tenants.push(s);
  }

  const used = new Set<string>();
  const merged: MergedEstate[] = IEAT_ESTATES.map((official) => {
    const a = key(official.name);
    let hit: { slug: string; name: string; tenants: Supplier[] } | null = null;
    for (const cand of ours.values()) {
      if (used.has(cand.slug)) continue;
      const b = key(cand.name);
      if (!a || !b || OPERATOR_ONLY.test(b)) continue;
      const shorter = Math.min(a.length, b.length);
      const match = a === b ||
        (shorter >= MIN_CONTAINS_LEN && (a.includes(b) || b.includes(a)));
      if (match) {
        hit = cand;
        break;
      }
    }
    if (hit) used.add(hit.slug);
    const tenants = hit?.tenants ?? [];
    return {
      ...official,
      tenants,
      verifiedTenants: tenants.filter((t) => t.verified).length,
      slug: hit?.slug ?? null,
    };
  });

  // 공식 목록에 없는데 우리에게 입주사가 있는 것 — 두 갈래로 나눈다.
  //
  //   1) 운영사 이름만 적힌 라벨("WHA", "Amata") → 단지가 아니다. 단지로 올리면
  //      "WHA" 와 "WHA Chonburi Industrial Estate" 가 서로 다른 단지처럼 보인다.
  //      별도 묶음으로 돌려 페이지에서 그대로 설명한다.
  //   2) 실제 이름이 있는 민간 단지 → 단지로 올린다 (IEAT 비지정일 수 있다).
  const operatorOnly: MergedEstate[] = [];
  for (const cand of ours.values()) {
    if (used.has(cand.slug)) continue;
    const entry: MergedEstate = {
      ieat_id: -1,
      salesforce_id: "",
      name: cand.name,
      area_rai: null,
      operator: null,
      province: null,
      region: null,
      name_th: null,
      website: null,
      location: null,
      detail_url: "",
      source: "Thai Supply Hub tenant data",
      tenants: cand.tenants,
      verifiedTenants: cand.tenants.filter((t) => t.verified).length,
      slug: cand.slug,
    };
    if (OPERATOR_ONLY.test(key(cand.name))) operatorOnly.push(entry);
    else merged.push(entry);
  }
  UNRESOLVED.length = 0;
  UNRESOLVED.push(...operatorOnly.sort((a, b) => b.tenants.length - a.tenants.length));

  // 입주사 많은 순 → 면적 큰 순 → 이름
  return merged.sort((x, y) =>
    y.tenants.length - x.tenants.length ||
    (y.area_rai ?? 0) - (x.area_rai ?? 0) ||
    x.name.localeCompare(y.name),
  );
}
