// 크롤 예산 게이트 — 어떤 필터 페이지를 구글에 내놓을지 한 곳에서 결정한다.
//
// 배경 (GSC Coverage, 2026-08-18): 구글이 아는 742페이지 중 색인은 38개(5.1%)뿐이고
// 10주 동안 68 → 38로 단조 감소했다. 색인 실패 704건의 내역이 원인을 그대로 말해준다:
//   · Crawled – currently not indexed  450건
//   · Excluded by 'noindex'            136건
//   · Not found (404)                  113건
// /c/[category]/[district] 조합 304개 중 203개(66%)가 코스 "1개"만 나열하는 페이지였고,
// 그 1개 코스는 이미 /course/[id] · /c/[category] · /d/[district] · /city/[name]에도
// 실려 있었다. 같은 코스를 다섯 번 우려낸 페이지라 구글이 색인을 거부한 것.
//
// 그래서 게이트는 sitemap / generateStaticParams / 내부링크 세 곳이 반드시 같은 판단을
// 공유해야 한다. 따로 계산하면 한쪽에만 남은 URL이 조용히 404가 되거나(=색인 삭제),
// 반대로 sitemap에서 빠졌는데 링크는 살아 있어 크롤 예산을 계속 먹는다.

import type { Course } from "./types";
import { filterByCuisine, filterByDistrict, filterByCityOrAlias } from "./data";
import { CITY_DESTINATIONS } from "./cityAliases";

// 이 수 미만의 코스를 가진 필터 페이지는 발행하지 않는다.
// 3으로 잡으면 category × district 304개 → 약 50개, /d/ 150개 → 약 50개가 되어
// 크롤 표면이 350페이지 가까이 줄어든다.
export const MIN_DISTRICT_COURSES = 3;

/** 라틴 문자가 없는 슬러그 — 태국어 지역명은 퍼센트 인코딩된 URL이 되고 검색 대상 언어도 아니다. */
function isNonLatinSlug(slug: string): boolean {
  return !/[a-z0-9]/i.test(slug);
}

export function districtSlug(district: string): string {
  return district.toLowerCase().replace(/\s+/g, "-");
}

export type CategoryDistrictCombo = {
  category: string;
  /** 표시용 원본 지역명 (예: "Bang Phli District") */
  district: string;
  /** URL 슬러그 (예: "bang-phli-district") */
  slug: string;
  count: number;
};

/**
 * MIN_DISTRICT_COURSES 이상을 담은 category × district 조합만 반환한다.
 * sitemap · generateStaticParams · /c/[cuisine] 의 지역 링크가 전부 이걸 쓴다.
 */
export function indexableCategoryDistricts(
  courses: Course[],
  categories: string[],
  districts: string[],
): CategoryDistrictCombo[] {
  const out: CategoryDistrictCombo[] = [];
  for (const category of categories) {
    const inCategory = filterByCuisine(courses, category);
    if (inCategory.length === 0) continue;
    for (const district of districts) {
      const slug = districtSlug(district);
      if (isNonLatinSlug(slug)) continue;
      const count = filterByDistrict(inCategory, district).length;
      if (count < MIN_DISTRICT_COURSES) continue;
      out.push({ category, district, slug, count });
    }
  }
  return out;
}

/**
 * 발행할 /d/[district] 목록. 150개 중 68개가 코스 1개, 100개가 2개 이하였고
 * 그 한 코스는 이미 자기 상세 페이지와 도시 페이지에 실려 있다 — 색인될 수 없는 페이지다.
 * 태국어 지역명도 여기서 걸러진다(/d/เมือง 같은 퍼센트 인코딩 URL).
 */
export function indexableDistricts(
  courses: Course[],
  districts: string[],
): { district: string; slug: string; count: number }[] {
  const out: { district: string; slug: string; count: number }[] = [];
  for (const district of districts) {
    const slug = districtSlug(district);
    if (isNonLatinSlug(slug)) continue;
    const count = filterByDistrict(courses, district).length;
    if (count < MIN_DISTRICT_COURSES) continue;
    out.push({ district, slug, count });
  }
  return out;
}

/**
 * 발행할 /city/[name] 목록 — 목적지 별칭(hua_hin 등)을 포함하고,
 * 별칭에 코스를 빼앗겨 비어버린 도(道)는 제외한다. (예: songkhla 3 → 0)
 * 도시는 실제 검색 대상이라 임계치를 1로 두되, 0개짜리 빈 페이지만은 반드시 막는다.
 */
export function indexableCities(courses: Course[], cityLabels: string[]): string[] {
  const slugs = new Set<string>();
  for (const label of cityLabels) {
    slugs.add(label.toLowerCase().replace(/\s+/g, "_"));
  }
  for (const d of CITY_DESTINATIONS) slugs.add(d.slug);
  return Array.from(slugs)
    .filter((s) => !isNonLatinSlug(s))
    .filter((s) => filterByCityOrAlias(courses, s).length > 0)
    .sort();
}

// ── 게이트에 걸려 내려간 URL 의 행선지 ─────────────────────────────────────────
// 2026-10-22 GSC: 404 114건, 검증 "Failed". 사이트맵 1,008장은 전부 200 이었고 남은 404 는
// 08-18 게이트가 내린 /d/[district] · /c/[category]/[district] 였다(/d/doi-lo-district 등).
// 구글은 그 URL 을 계속 기억하고 다시 찔러본다. 내려간 페이지가 나열하던 코스는 전부 상위
// 페이지에 그대로 있으므로 404 대신 그 상위로 308 한다 — 링크 신호가 버려지지 않고 404 가 닫힌다.
// 행선지는 반드시 발행 중인 페이지여야 한다(리다이렉트가 404 로 착지하면 안 된다).

export type RetiredRoute = { slug: string; destination: string };

/** 코스가 1개 이상이지만 게이트 미달로 내려간 /d/[district] → 그 코스들이 가장 많이 실린 도시 페이지. */
export function retiredDistricts(
  courses: Course[],
  districts: string[],
  cityLabels: string[],
): (RetiredRoute & { district: string })[] {
  const live = new Set(indexableDistricts(courses, districts).map((d) => d.slug));
  const cities = indexableCities(courses, cityLabels);
  const cityMembers = new Map(cities.map((s) => [s, new Set(filterByCityOrAlias(courses, s).map((c) => c.id))]));
  const out: (RetiredRoute & { district: string })[] = [];
  for (const district of districts) {
    const slug = districtSlug(district);
    if (isNonLatinSlug(slug) || live.has(slug)) continue;
    const inDistrict = filterByDistrict(courses, district);
    if (inDistrict.length === 0) continue;
    let best: string | null = null;
    let bestN = 0;
    for (const [city, ids] of cityMembers) {
      const n = inDistrict.filter((c) => ids.has(c.id)).length;
      if (n > bestN) { best = city; bestN = n; }
    }
    // 실린 도시 페이지가 없으면 404 로 둔다 — 홈으로 보내면 구글은 soft 404 로 읽는다.
    if (!best) continue;
    out.push({ district, slug, destination: `/city/${best}` });
  }
  return out;
}

/** 게이트 미달로 내려간 /c/[category]/[district] → /c/[category]. */
export function retiredCategoryDistricts(
  courses: Course[],
  categories: string[],
  districts: string[],
): (RetiredRoute & { category: string; district: string })[] {
  const live = new Set(
    indexableCategoryDistricts(courses, categories, districts).map((c) => `${c.category}/${c.slug}`),
  );
  const out: (RetiredRoute & { category: string; district: string })[] = [];
  for (const category of categories) {
    const inCategory = filterByCuisine(courses, category);
    if (inCategory.length === 0) continue;
    for (const district of districts) {
      const slug = districtSlug(district);
      if (isNonLatinSlug(slug) || live.has(`${category}/${slug}`)) continue;
      if (filterByDistrict(inCategory, district).length === 0) continue;
      out.push({ category, district, slug, destination: `/c/${category}` });
    }
  }
  return out;
}

/** master_db.district_counts 의 "City/District" 키에서 지역명만 뽑아낸다. */
export function allDistricts(districtCounts: Record<string, number>): string[] {
  return Array.from(new Set(Object.keys(districtCounts).map((k) => k.split("/")[1])));
}
