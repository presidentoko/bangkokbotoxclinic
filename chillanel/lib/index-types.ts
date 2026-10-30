// 색인·비교에서 제외하는 업종 (마사지·스파 가이드의 주제 밖). indexing.ts 와 같은 목록을
// local-reading.ts / area-stats.ts 가 비교 집단에서 빼는 데 쓴다. 의존성 없는 파일로 분리한
// 이유는 scripts/*.test.mjs 가 node 로 직접 import 하기 때문이다.
export const NOT_INDEXED_TYPES = new Set([
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
