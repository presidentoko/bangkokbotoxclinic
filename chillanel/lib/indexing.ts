// 검색 색인 대상 장소 판정 (2026-10-26).
//
// 덴탈·보톡스는 2026-08-18 스팸 업데이트(scaled content / programmatic directory)
// 에서 노출 92% 를 잃었다. 칠라넬도 같은 "구글 지도 → 업체 페이지" 구조라서,
// 마사지·스파 가이드가 아닌 업체 페이지까지 색인에 내보내면 "아무거나 긁어 모은
// 디렉토리" 로 읽힌다. 2026-10-26 실측(사이트맵 3,389곳) 중 주제 밖:
//   업종 없음 436 (대부분 호텔·리조트), 네일·미용실·이발 164, 의료·재활 54,
//   성인(에로틱·소피·게이사우나) 91. 합쳐서 최근 클릭 43 중 ~6.
// 페이지는 그대로 열리고 목록·지도에도 남는다 — 색인 요청만 하지 않는다.
//
// place/[id]/page.tsx(robots)·sitemap.ts·PlaceExplore(링크) 가 전부 이 함수를 쓴다.
// 셋이 갈리면 "사이트맵엔 있는데 noindex" 모순이 생긴다.
import type { Place } from "./types";
import { isRelevantCategory } from "./categories";

export const INDEX_MIN_REVIEWS = 50;

const NOT_INDEXED_TYPES = new Set([
  // 업종 없음 — 호텔·리조트·아파트가 대부분
  "",
  // 미용 (마사지·스파 아님)
  "Nail salon", "Hair salon", "Hairdresser", "Barber shop",
  "Hair removal service", "Laser hair removal service", "Waxing hair removal service",
  "Weight loss service", "Yoga studio", "Pilates studio",
  // 의료·재활 — YMYL 이라 디렉토리 페이지로 내보내기 가장 위험한 범주
  "Physical therapist", "Physical therapy clinic", "Chiropractor", "Osteopath",
  "Rehabilitation center", "Acupuncture clinic", "Acupuncturist",
  "Chinese medicine clinic", "Oriental medicine clinic", "Ayurvedic clinic",
  "Alternative medicine practitioner",
  // 성인 — 사이트 전체가 세이프서치 성인 판정을 받으면 일반 검색에서 사라진다
  "Erotic massage", "Erotic Massage", "Erotic Massage Parlour", "Soapy massage", "Gay sauna",
]);

export function isIndexablePlace(p: Place): boolean {
  return (
    isRelevantCategory(p.primaryType) &&
    !NOT_INDEXED_TYPES.has(p.primaryType ?? "") &&
    (p.reviewCount ?? 0) >= INDEX_MIN_REVIEWS &&
    (p.reviews?.length ?? 0) > 0
  );
}
