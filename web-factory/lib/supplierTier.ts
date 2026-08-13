// Supplier 페이지가 검색엔진에 줄 게 있는지 한 곳에서 판정한다.
//
// 왜 필요한가 — Search Console (2026-08-13) 기준:
//   색인됨                        ~1,600
//   discovered, currently not indexed  6,989  (증가 추세)
//   사이트맵에 넣던 supplier 페이지     6,233
//
// 구글이 소화하는 양의 4배를 사이트맵으로 밀고 있었다는 뜻이다. 도메인 권위가
// 감당 못 하는 URL 을 계속 제출하면 대기열만 길어지고, 정작 색인돼야 할 카테고리·
// 도시 페이지의 크롤 예산까지 같이 밀린다.
//
// 판정 기준은 하나다: 이 페이지에 Google Maps 를 그대로 열어봐선 알 수 없는 것이
// 있는가. 없으면 우리는 Maps 의 사본이고, 구글이 사본을 색인할 이유가 없다.
//
//   A verified   DBD 등기 — 법인명·13자리 등록번호·자본금·설립일·TSIC. Maps 에 없다.
//   B reviews    리뷰 본문 — 우리가 긁어서 언어별로 분류해 둔 것.
//   C site+photo 자사 웹사이트 + 시설 사진. 둘 다 있으면 프로필로서 최소한의 실체.
//   D contact    웹사이트나 이메일만. 색인은 두되 사이트맵에선 뺀다.
//   E photo      사진뿐.        ─┐ Maps 가 이미 더 잘 보여주는 것들.
//   F mirror     이름·전화뿐.   ─┘ noindex 로 대기열에서 빼낸다.
import type { Supplier } from "./types";

export type SupplierTier = "A" | "B" | "C" | "D" | "E" | "F";

function hasReviewText(r: Supplier): boolean {
  return Boolean(
    r.external_reviews?.length ||
    r.sample_reviews_en?.length ||
    r.sample_reviews_th?.length ||
    r.sample_reviews_ko?.length,
  );
}

export function supplierTier(r: Supplier): SupplierTier {
  if (r.verified) return "A";
  if (hasReviewText(r)) return "B";
  if (r.website && r.hero_image) return "C";
  if (r.website || r.email) return "D";
  if (r.hero_image) return "E";
  return "F";
}

/** 사이트맵에 제출할 가치가 있는가 (A–C). */
export function inSitemap(r: Supplier): boolean {
  const t = supplierTier(r);
  return t === "A" || t === "B" || t === "C";
}

/**
 * 색인 허용 여부 (A–D).
 *
 * noindex 는 붙이되 follow 는 남긴다 — 페이지 자체는 그대로 서빙되고, 즐겨찾기·비교·
 * 검색·related 에서 들어오는 사용자에게는 아무 차이가 없으며, 여기서 나가는 링크의
 * 신호도 계속 흐른다. 달라지는 건 구글이 이 URL 을 색인 대기열에서 뺀다는 것뿐이다.
 *
 * 되돌리려면 이 함수만 true 로 바꾸면 된다 — 반영에는 몇 주가 걸린다.
 */
export function isIndexable(r: Supplier): boolean {
  return supplierTier(r) !== "E" && supplierTier(r) !== "F";
}
