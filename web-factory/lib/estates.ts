// 산업단지 슬러그가 실제 단지 이름인지 판정한다.
//
// estate_slug/estate_name 은 구글 주소 문자열에서 뽑아낸 값이라, 절반이 단지
// 이름이 아니라 주소 조각이다. 그대로 두면 공개 페이지 32개가 이런 꼴로 생기고
// 전부 사이트맵에 올라간다:
//   /estate/3       "3"
//   /estate/37      "ถนน สุขุมวิท กม 37"   ← 도로 킬로미터 표지
//   /estate/2       "โรจนะ ชลบุรี 2 (บ่อวิน"  ← 괄호가 안 닫힌 잘린 문자열
//   /estate/101-90  "นวนคร 101/90 ถนนพหลโยธิน"
//   /estate/industrial-estate  "Industrial Estate"  ← 이름이 아니라 분류어
// 게다가 SupplierCard 배지에도 "🏘 3", "🏘 ถนน สุขุมวิท กม 37" 로 노출됐다.
//
// 판정 규칙(데이터 전수 확인 후 결정):
//   - 3글자 이상 연속 라틴 문자가 있어야 한다 → 번지수 조각(3, 101-90, 2-890-15) 제외
//   - "industrial-estate" 는 분류어라 제외
//   - "-rd" 로 끝나면 도로명이라 제외 (phatthana-1-rd)
// 현재 데이터 기준 16개 통과 / 16개 제외.
//
// 중복 단지(wha / wha-chonburi / wha-eastern-seaboard)는 일부러 합치지 않는다.
// URL 을 합치면 이미 색인된 주소가 깨진다 — 통합은 스크래퍼 단계에서 할 일이다.

const GENERIC = new Set(["industrial-estate", "industrial-park", "estate"]);

export function isRealEstateSlug(slug: string | null | undefined): boolean {
  if (!slug) return false;
  const s = slug.toLowerCase();
  if (GENERIC.has(s)) return false;
  if (s.endsWith("-rd") || s.endsWith("-road")) return false;
  return /[a-z]{3}/.test(s);
}
