// 도(province) × 업종 페이지의 단일 판정 소스.
//
// 왜 필요한가 (2026-09-26): 지역 페이지가 구(district) 단위밖에 없었다.
// /c/warehouse/bang-phli 같은 구 단위 조합은 실제로 1~3위를 찍는데, 정작
// 사람들이 더 많이 쓰는 도 단위 표현에는 페이지가 없었다 —
// "คลังสินค้า ขอนแก่น"(도 이름) 54회 노출 70위, "warehouse chonburi" 류도 같다.
// /city/[name] 은 업종이 섞여 있어 그 쿼리의 답이 아니고, /c/[cat] 은 전국이라
// 지역이 빠진다. 그 사이의 빈칸을 메운다.
//
// 구 단위 기준(3곳)을 낮춰 페이지를 늘리는 선택은 하지 않는다 — 얇은 페이지를
// 대량 생성하는 건 구글이 실제로 제재하는 패턴(scaled content abuse)이다.
// 여기서는 공급사 10곳 이상인 조합만 만든다.
import type { MasterDb, Supplier } from "./types";
import { normalizeCity } from "./cityNorm";

/** 이 수 미만이면 페이지를 만들지 않는다. 도 단위는 구 단위보다 높게 잡는다. */
export const MIN_CITY_CATEGORY_SUPPLIERS = 10;

/**
 * 태국어 페이지는 기준을 낮춘다.
 *
 * 태국어 쪽은 지역 수요가 실측으로 확인됐다 — "คลังสินค้า ขอนแก่น" 54회 노출 70위.
 * 그런데 ขอนแก่น 의 창고는 5곳뿐이라 10 기준에서는 페이지가 안 생긴다. 그 도에
 * 있는 창고가 정말 5곳이면 5곳을 다 보여주는 게 그 검색의 완전한 답이지 얇은
 * 페이지가 아니다. 영어 쪽은 같은 수요 근거가 없으므로 10 을 유지한다.
 */
export const MIN_CITY_CATEGORY_SUPPLIERS_TH = 5;

export type CityCategoryPair = {
  citySlug: string;
  cityLabel: string;
  category: string;
  count: number;
};

function cityLabelOf(suppliers: Supplier[], slug: string): string {
  for (const s of suppliers) {
    if (normalizeCity(s.city) === slug && s.city_label) return s.city_label;
  }
  return slug.replace(/_/g, " ");
}

/** 빌드 대상 (도 × 업종) 전체. min 을 낮춰 태국어용 목록도 같은 함수로 얻는다. */
export function cityCategoryPairs(
  db: MasterDb,
  min: number = MIN_CITY_CATEGORY_SUPPLIERS,
): CityCategoryPair[] {
  const counts = new Map<string, number>();
  for (const s of db.suppliers) {
    const city = normalizeCity(s.city);
    if (!city) continue;
    for (const c of s.categories) {
      const k = `${city}|${c}`;
      counts.set(k, (counts.get(k) ?? 0) + 1);
    }
  }
  const out: CityCategoryPair[] = [];
  for (const [k, count] of counts) {
    if (count < min) continue;
    const [citySlug, category] = k.split("|");
    out.push({ citySlug, category, count, cityLabel: cityLabelOf(db.suppliers, citySlug) });
  }
  return out.sort((a, b) => b.count - a.count);
}

/** 이 조합의 페이지가 존재하는가 — 다른 페이지가 링크를 걸기 전에 확인한다. */
export function hasCityCategoryPage(db: MasterDb, citySlug: string, category: string): boolean {
  let n = 0;
  for (const s of db.suppliers) {
    if (normalizeCity(s.city) !== citySlug) continue;
    if (s.categories.includes(category)) n++;
  }
  return n >= MIN_CITY_CATEGORY_SUPPLIERS;
}

export function suppliersInCityCategory(db: MasterDb, citySlug: string, category: string): Supplier[] {
  return db.suppliers.filter(
    (s) => normalizeCity(s.city) === citySlug && s.categories.includes(category),
  );
}
