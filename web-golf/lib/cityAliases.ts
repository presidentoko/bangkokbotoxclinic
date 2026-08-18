// 목적지(destination) 별칭 레이어.
//
// master_db 의 city_label 은 스크래퍼가 Google 주소에서 뽑은 값이라 도(道) 이름과
// 관광 목적지 이름이 뒤섞여 있다. 그 결과 골퍼가 실제로 검색하는 이름의 페이지가 비어 있었다:
//
//   /city/hua_hin             코스  1개   ← 검색량 높은 이름
//   /city/prachuap_khiri_khan 코스 26개   ← Black Mountain, Pineapple Valley 가 여기 묻힘
//                                           (골프 맥락에서 이 도 이름을 검색하는 사람은 없다)
//
// 같은 일이 Pattaya(Chon Buri), Koh Samui(Surat Thani), Hat Yai(Songkhla)에서도 일어난다.
//
// master_db 는 스크래퍼가 주기적으로 덮어쓰므로 데이터를 직접 고치면 다음 실행에 날아간다.
// 그래서 앱 레이어에서 해석한다. 배정은 **배타적**이다 — 목적지에 잡힌 코스는 소속 도
// 페이지에서 빠진다. 안 그러면 /city/hua_hin 과 /city/prachuap_khiri_khan 이 거의 같은
// 목록이 되어 중복 콘텐츠가 되고, 지금 고치려는 색인 문제를 그대로 재생산한다.

import type { Course } from "./types";

export type CityDestination = {
  /** URL 슬러그 (course.city 와 같은 형식: 소문자 + 언더스코어) */
  slug: string;
  /** 표시명 */
  label: string;
  /** 주소 / 이름 / 구역 문자열에서 이 목적지를 찾아내는 패턴 */
  pattern: RegExp;
  /**
   * 이 목적지가 코스를 흡수할 수 있는 상위 city_label.
   * 지리적으로 말이 되는 범위로 제한해, 주소에 "Bangkok–Pattaya highway" 같은 문자열이
   * 들어간 방콕 코스가 파타야로 끌려가는 오탐을 막는다.
   */
  parents: string[];
};

export const CITY_DESTINATIONS: CityDestination[] = [
  { slug: "hua_hin",   label: "Hua Hin",   pattern: /hua\s*hin/i, parents: ["Prachuap Khiri Khan"] },
  { slug: "pattaya",   label: "Pattaya",   pattern: /pattaya/i,   parents: ["Chon Buri"] },
  { slug: "koh_samui", label: "Koh Samui", pattern: /samui/i,     parents: ["Surat Thani"] },
  { slug: "hat_yai",   label: "Hat Yai",   pattern: /hat\s*yai/i, parents: ["Songkhla"] },
];

const BY_SLUG = new Map(CITY_DESTINATIONS.map((d) => [d.slug, d]));

export function findDestination(slug: string): CityDestination | undefined {
  return BY_SLUG.get(slug);
}

/** 코스 하나가 해당 목적지에 속하는지. 자기 라벨이거나, 상위 도 + 패턴 일치. */
export function belongsToDestination(c: Course, dest: CityDestination): boolean {
  if (c.city === dest.slug) return true;
  if (!dest.parents.includes(c.city_label)) return false;
  const hay = `${c.address ?? ""} ${c.name ?? ""} ${c.district ?? ""}`;
  return dest.pattern.test(hay);
}

/**
 * 이 코스가 더 구체적인 목적지에 흡수됐는지 — 도(道) 페이지에서 제외할 때 쓴다.
 * 배타 배정을 보장해 도 페이지와 목적지 페이지가 중복 목록이 되는 걸 막는다.
 */
export function claimedByDestination(c: Course): CityDestination | undefined {
  return CITY_DESTINATIONS.find((d) => d.slug !== c.city && belongsToDestination(c, d));
}
