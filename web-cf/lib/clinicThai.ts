// 태국어 리뷰 원문에서 나온 것 — master_db 와 분리된 별도 파일.
//
// 왜 분리했는가: 토픽을 다시 계산하려면 보통 master_db.json 을 재빌드해야 하는데,
// 그건 모든 스크래퍼의 현재 상태에 의존한다. 그리고 그 토픽은 소스 디렉터리별로
// analyze_reviews() 를 돌린 뒤 병합한 결과라, 빌더 밖에서 충실히 재현하려면 병합
// 로직을 다시 써야 한다 — 실측으로 표본 400곳 중 70곳이 어긋났다. 두 벌로 갈라지는
// 그 패턴은 이 레포에서 이미 조용한 롤백을 낸 적이 있다.
//
// 그래서 data/clinic-reviews.json 과 같은 구조를 쓴다. 클리닉 페이지는
// dynamicParams=false 로 전량 프리렌더되므로 이 파일은 **빌드 타임에 fs 로만**
// 읽히고, scripts/copy-db-assets.mjs 가 Worker 자산으로 복사하지 않는다 →
// 런타임 비용 0, 자산 크기 변화 0.
//
// 내용은 scripts/build_clinic_thai.py 가 만든다.

import { promises as fs } from "node:fs";
import path from "node:path";

const PATH = path.join(process.cwd(), "data", "clinic-thai.json");

export type ThaiQuote = { text: string; rating: number };
export type ThaiEntry = {
  /** 이 클리닉에서 읽은 태국어 리뷰 수 (본문 길이 무관, 별점 있는 전체). */
  n: number;
  /** 별점 분포대로 고른 인용 3개까지. 작성자는 싣지 않는다(2026-10-22 결정). */
  quotes?: ThaiQuote[];
  /** 태국어 원문에서 나온 토픽. master_db 의 것과 더하지 않고 교체한다. */
  topics?: { topic: string; count: number }[];
};

let _cache: Record<string, ThaiEntry> | null | undefined;

/**
 * 클리닉 id → 태국어 리뷰에서 나온 것. 없으면 null.
 *
 * 빈 객체가 아니라 null 인 이유는 clinicReviews.ts 와 같다 — "이 클리닉에
 * 태국어 리뷰가 없다" 와 "파일을 못 읽었다" 를 같은 값으로 돌려주면, 경로가
 * 틀린 배포가 섹션이 사라진 페이지를 조용히 전량 발행한다. 데이터 장애를
 * 콘텐츠 삭제로 바꾸는 그 패턴은 이 레포에서 이미 한 번 사이트를 날렸다.
 */
export async function loadClinicThai(): Promise<Record<string, ThaiEntry> | null> {
  if (_cache !== undefined) return _cache;
  try {
    _cache = JSON.parse(await fs.readFile(PATH, "utf-8")) as Record<string, ThaiEntry>;
  } catch (err) {
    console.warn(`[clinicThai] ${PATH} 를 읽지 못했다 — master_db 로 폴백:`, err);
    _cache = null;
  }
  return _cache;
}
