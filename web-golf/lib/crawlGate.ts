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
import { filterByCuisine, filterByDistrict } from "./data";

// 이 수 미만의 코스를 가진 category × district 페이지는 발행하지 않는다.
// 3으로 잡으면 304개 → 약 50개만 남아 크롤 표면이 250페이지 줄어든다.
export const MIN_DISTRICT_COURSES = 3;

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
      const count = filterByDistrict(inCategory, district).length;
      if (count < MIN_DISTRICT_COURSES) continue;
      out.push({ category, district, slug: districtSlug(district), count });
    }
  }
  return out;
}

/** master_db.district_counts 의 "City/District" 키에서 지역명만 뽑아낸다. */
export function allDistricts(districtCounts: Record<string, number>): string[] {
  return Array.from(new Set(Object.keys(districtCounts).map((k) => k.split("/")[1])));
}
