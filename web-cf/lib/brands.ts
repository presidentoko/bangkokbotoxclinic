import type { Clinic } from "./types";

/**
 * 멀티지점 브랜드 그룹핑 (2026-09-02).
 *
 * 왜 필요한가: 인플루언서가 말하는 건 "Apex Clinic" 이지 "Apex Clinic 라차요틴점"
 * 이 아니다. 그런데 그 검색어에는 우리 지점 페이지 13개가 서로 경쟁해 전부 순위가
 * 낮다. 실측: 3지점 이상 브랜드 43개, 지점 합계 220곳
 * (deezy dental home 15 · apex clinic 13 · teeth talk 13 · plus dental 11 …).
 *
 * 브랜드 허브 하나가 그 검색을 받고, 지점 페이지들은 허브로 내부링크한다.
 */

/** 지점 표기 앞의 브랜드 부분만 뽑는다. 못 뽑으면 null. */
export function brandKeyOf(name: string): string | null {
  // 라틴 브랜드명 + (하이픈 | 괄호 | 파이프 | "สาขา" | "Branch" | 태국어 시작) 으로 끊는다.
  // 태국어 전용 상호는 대상이 아니다 — 슬러그를 만들 수 없고, 지점 표기가
  // 일정하지 않아 오탐이 많다.
  const m = name.match(
    /^([A-Za-z][A-Za-z0-9&'. ]{2,30}?)(?:\s*[-–—(|]|\s+สาขา|\s+Branch|\s+[\u0E00-\u0E7F])/
  );
  if (!m) return null;
  const k = m[1].replace(/\s+/g, " ").trim().toLowerCase();
  return k.length >= 4 ? k : null;
}

export function brandSlug(key: string): string {
  return key.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/** 브랜드 표시명 — 지점 이름들에서 가장 흔한 대소문자 표기를 고른다. */
function displayFor(key: string, members: Clinic[]): string {
  const counts = new Map<string, number>();
  for (const c of members) {
    const m = c.name.match(
      /^([A-Za-z][A-Za-z0-9&'. ]{2,30}?)(?:\s*[-–—(|]|\s+สาขา|\s+Branch|\s+[\u0E00-\u0E7F])/
    );
    if (!m) continue;
    const v = m[1].replace(/\s+/g, " ").trim();
    counts.set(v, (counts.get(v) ?? 0) + 1);
  }
  let best = key;
  let n = 0;
  for (const [v, c] of counts) if (c > n) { best = v; n = c; }
  return best;
}

export type Brand = {
  key: string;
  slug: string;
  name: string;
  clinics: Clinic[];
  totalReviews: number;
  avgRating: number | null;
};

/** 최소 지점 수 이상인 브랜드만. 소관 필터를 이미 통과한 배열을 넘길 것. */
export function groupBrands(clinics: Clinic[], minBranches = 3): Brand[] {
  const buckets = new Map<string, Clinic[]>();
  for (const c of clinics) {
    const k = brandKeyOf(c.name);
    if (!k) continue;
    const arr = buckets.get(k);
    if (arr) arr.push(c); else buckets.set(k, [c]);
  }
  const out: Brand[] = [];
  for (const [key, members] of buckets) {
    if (members.length < minBranches) continue;
    const rated = members.filter((c) => c.rating && c.total_reviews);
    const totalReviews = rated.reduce((s, c) => s + c.total_reviews, 0);
    // 리뷰수 가중 평균 — 지점 규모 차이를 반영한다. 단순 평균이면 리뷰 3건짜리
    // 신규 지점이 리뷰 5,000건 본점과 같은 무게를 갖는다.
    const avgRating = totalReviews > 0
      ? Math.round((rated.reduce((s, c) => s + c.rating * c.total_reviews, 0) / totalReviews) * 10) / 10
      : null;
    out.push({
      key,
      slug: brandSlug(key),
      name: displayFor(key, members),
      clinics: members.slice().sort((a, b) => b.trust_score - a.trust_score),
      totalReviews,
      avgRating,
    });
  }
  return out.sort((a, b) => b.clinics.length - a.clinics.length);
}

export function findBrand(clinics: Clinic[], slug: string, minBranches = 3): Brand | null {
  return groupBrands(clinics, minBranches).find((b) => b.slug === slug) ?? null;
}
