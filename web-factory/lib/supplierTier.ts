// Supplier 페이지가 검색엔진에 줄 게 있는지 한 곳에서 판정한다.
//
//   A verified   DBD 등기 — 법인명·13자리 등록번호·자본금·설립일·TSIC. Maps 에 없다.
//   B reviews    리뷰 본문 — 우리가 긁어서 언어별로 분류해 둔 것.
//   C site+photo 자사 웹사이트 + 시설 사진. 둘 다 있으면 프로필로서 최소한의 실체.
//   D contact    웹사이트나 이메일만.
//   E photo      사진뿐.
//   F mirror     이름·전화뿐.
//
// 등급은 사이트맵 제출 여부만 정한다. 색인은 막지 않는다.
//
// 2026-08-13 에 E·F 를 noindex 로 돌렸다가 되돌렸다 (2026-09-16). Search Console
// 실측 결과 noindex 가 걸린 페이지 중 218 개가 구글 1~7위에 노출되고 있었다 —
// 노출 905 회, 전체 클릭의 17%. 태국어 상호 검색("บจก. ... อำเภอ...")에서 구글은
// 이름·전화만 있는 소규모 업체 페이지를 기꺼이 올려줬다. 같은 기간 색인 페이지는
// 1,647 → 1,148 로 줄었다.
//
// noindex 는 크롤 대기열도 줄여주지 않는다 — 구글은 noindex 를 확인하려고 어차피
// 크롤한다. 대기열을 결정하는 건 사이트맵과 내부 링크다. 그래서 사이트맵만 좁히고
// 색인 판단은 구글에 맡긴다.
import type { Supplier } from "./types";
import gscDemand from "../data/gsc_demand.json";

export type SupplierTier = "A" | "B" | "C" | "D" | "E" | "F";

const GSC_PAGES = (gscDemand as { pages: Record<string, unknown> }).pages;

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

/** Search Console 에 노출 기록이 있는 페이지인가 (data/gsc_demand.json). */
export function hasSearchDemand(r: Supplier): boolean {
  return `/supplier/${r.id}` in GSC_PAGES;
}

/** 사이트맵에 제출할 가치가 있는가 — A–C, 또는 구글이 이미 노출해준 페이지. */
export function inSitemap(r: Supplier): boolean {
  const t = supplierTier(r);
  return t === "A" || t === "B" || t === "C" || hasSearchDemand(r);
}

/** 색인 허용 여부. 위 설명대로 전 등급 허용. */
export function isIndexable(_r: Supplier): boolean {
  return true;
}
