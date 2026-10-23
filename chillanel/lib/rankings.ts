// 우리 리뷰 집계(place.insights)로 만드는 도시별 순위 (2026-10-23).
// 구글 별점 정렬이 아니라 "리뷰가 실제로 무엇을 말하는가"로 줄 세운다 —
// 다른 사이트가 베낄 수 없는, 이 사이트에만 있는 데이터다.
import type { AspectKey, Place } from "./types";
import { isRelevantCategory } from "./categories";
import { loadCity } from "./data";

export const RANKING_TOPICS = [
  "korean-favorites",
  "cleanest",
  "best-value",
  "most-skilled",
  "friendliest",
  "improving",
] as const;
export type RankingTopic = (typeof RANKING_TOPICS)[number];

const ASPECT_OF: Partial<Record<RankingTopic, AspectKey>> = {
  cleanest: "cleanliness",
  "best-value": "value",
  "most-skilled": "skill",
  friendliest: "staff",
};

// 한 순위에 이보다 적게 남으면 페이지를 만들지 않는다 (얇은 페이지 방지).
export const MIN_ENTRIES = 5;
const MAX_ENTRIES = 30;
const MIN_ASPECT_MENTIONS = 8;
const MIN_KO_REVIEWS = 3;

export type RankEntry = {
  place: Place;
  /** 화면에 보여줄 핵심 숫자 */
  pct?: number;        // 긍정 비율
  mentions?: number;   // 해당 항목 언급 수
  koReviews?: number;
  recentAvg?: number;
  beforeAvg?: number;
  recentN?: number;
};

// Wilson score 하한 (95%) — "3건 중 3건 칭찬" 이 "200건 중 190건" 을 이기지 않게.
function wilson(pos: number, n: number): number {
  if (n === 0) return 0;
  const z = 1.96;
  const p = pos / n;
  return (p + (z * z) / (2 * n) - z * Math.sqrt((p * (1 - p) + (z * z) / (4 * n)) / n)) / (1 + (z * z) / n);
}

export function rankPlaces(places: Place[], topic: RankingTopic): RankEntry[] {
  const pool = places.filter((p) => p.insights && isRelevantCategory(p.primaryType));
  const aspect = ASPECT_OF[topic];
  if (aspect) {
    return pool
      .map((place) => {
        const a = place.insights!.aspects[aspect];
        const n = a.pos + a.neg;
        return { place, n, pos: a.pos, score: wilson(a.pos, n) };
      })
      .filter((x) => x.n >= MIN_ASPECT_MENTIONS && x.pos / x.n >= 0.8)
      .sort((a, b) => b.score - a.score || (b.place.rating ?? 0) - (a.place.rating ?? 0))
      .slice(0, MAX_ENTRIES)
      .map((x) => ({ place: x.place, pct: Math.round((100 * x.pos) / x.n), mentions: x.n }));
  }
  if (topic === "korean-favorites") {
    return pool
      .map((place) => ({ place, ko: place.insights!.languages.ko ?? 0 }))
      .filter((x) => x.ko >= MIN_KO_REVIEWS && (x.place.rating ?? 0) >= 4)
      .sort((a, b) => b.ko - a.ko || (b.place.rating ?? 0) - (a.place.rating ?? 0))
      .slice(0, MAX_ENTRIES)
      .map((x) => ({ place: x.place, koReviews: x.ko }));
  }
  // improving
  return pool
    .map((place) => ({ place, t: place.insights!.trend }))
    .filter((x) => x.t && x.t.recentN >= 10 && x.t.recentAvg - x.t.beforeAvg >= 0.3 && x.t.recentAvg >= 4.3)
    .sort((a, b) => b.t!.recentAvg - b.t!.beforeAvg - (a.t!.recentAvg - a.t!.beforeAvg) || b.t!.recentN - a.t!.recentN)
    .slice(0, MAX_ENTRIES)
    .map((x) => ({ place: x.place, recentAvg: x.t!.recentAvg, beforeAvg: x.t!.beforeAvg, recentN: x.t!.recentN }));
}

/** 전체 리뷰 분석 건수 — 페이지 문구의 "리뷰 n건 분석" 용. */
export function analysedReviewCount(places: Place[]): number {
  return places.reduce((s, p) => s + (p.insights?.analysed ?? 0), 0);
}

/** 이 도시에서 페이지를 낼 만큼 항목이 있는 순위들. 페이지·링크·사이트맵이 같이 쓴다. */
export function topicsWithEnoughEntries(city: string): RankingTopic[] {
  const places = loadCity(city).places;
  return RANKING_TOPICS.filter((topic) => rankPlaces(places, topic).length >= MIN_ENTRIES);
}
