// 리뷰 본문 — master_db 와 분리된 별도 파일.
//
// 왜 분리했는가: Worker 자산은 파일당 25 MiB 한도고 master_db.json 은 이미
// 24,657,315 바이트다. 여유가 1.5MB 뿐인데 이 데이터가 11.5MB 라 같은 파일에
// 넣으면 배포가 깨진다. 클리닉 페이지는 dynamicParams=false 로 전량 프리렌더
// 되므로 이 파일은 **빌드 타임에 fs 로만** 읽히고, scripts/copy-db-assets.mjs
// 가 Worker 자산으로 복사하지 않는다 → 런타임 비용 0, 자산 크기 변화 0.
//
// 내용은 scripts/build_clinic_reviews.py 가 만든다. 클리닉당 가장 긴 리뷰 8개
// (★4 이상, 80자 이상), master_db 가 이미 발행하는 양보다 많을 때만 수록 —
// 4,490곳 / 29,834개 / 중앙값 478 → 1,805자.

import { promises as fs } from "node:fs";
import path from "node:path";
import type { SampleReview } from "./types";

const PATH = path.join(process.cwd(), "data", "clinic-reviews.json");

let _cache: Record<string, SampleReview[]> | null | undefined;

/**
 * 클리닉 id → 깊은 리뷰 샘플. 없으면 null.
 *
 * null 을 돌려주는 경우 호출부는 master_db 의 sample_reviews_* 로 그대로
 * 폴백한다. 빈 배열이 아니라 null 인 이유는 그 구분이 중요하기 때문이다 —
 * "이 클리닉에 깊은 리뷰가 없다" 와 "파일을 못 읽었다" 를 같은 값으로
 * 돌려주면, 파일 경로가 틀린 배포가 리뷰 섹션이 사라진 페이지를 조용히
 * 전량 발행한다. 데이터 장애를 콘텐츠 삭제로 바꾸는 그 패턴은 이 레포에서
 * 이미 한 번 사이트를 날렸다.
 */
export async function loadDeepReviews(): Promise<Record<string, SampleReview[]> | null> {
  if (_cache !== undefined) return _cache;
  try {
    _cache = JSON.parse(await fs.readFile(PATH, "utf-8")) as Record<string, SampleReview[]>;
  } catch (err) {
    // Worker 런타임에는 파일시스템이 없다. 프리렌더된 경로만 이걸 읽으므로
    // 정상 동작에서는 도달하지 않지만, 도달했다면 폴백이 맞다.
    console.warn(`[clinicReviews] ${PATH} 를 읽지 못했다 — master_db 샘플로 폴백:`, err);
    _cache = null;
  }
  return _cache;
}
