import type { Course } from "./types";
import { courseFacts, offersForCourse } from "./providers";

// 코스 페이지를 색인 대상으로 내보낼지 한 곳에서 판단한다.
// sitemap 과 코스 페이지의 robots 메타가 반드시 같은 함수를 써야 한다 — 어긋나면
// sitemap 이 noindex 페이지를 가리키거나(구글이 경고를 낸다) 그 반대가 된다.
//
// 근거 (2026-08-19 실측): 코스 페이지의 고유 단어를 전수 측정했더니
//   200+ 단어 318개(49%) / 100-199 229개(35%) / 60-99 83개(12%) / 60미만 11개(1%)
// 로 갈렸고, 가장 얇은 쪽은 예외 없이 "구글 리뷰가 0건"인 코스였다. 리뷰가 없으면
// 별점도 리뷰 분포도 언어 구성도 리뷰 주제도 없다 — 페이지에 쓸 말 자체가 없어서
// 무슨 수를 써도 색인되지 않는다. GSC 의 "Crawled - currently not indexed" 450건이
// 이 부류를 포함한다.
//
// 기존 stub 규칙은 사진·리뷰샘플·토픽이 "전부" 없을 때만 걸러서, 리뷰 0건인데
// 사진 한 장 있다는 이유로 25개가 sitemap 에 남아 있었다.

/** 사진도 리뷰 샘플도 토픽도 전혀 없는 껍데기. */
function isStub(c: Course): boolean {
  return (
    !c.hero_image && !c.top_photo_url && !(c.photos && c.photos.length) &&
    !(c.sample_reviews_en?.length) && !(c.sample_reviews_th?.length) &&
    !(c.sample_reviews_ko?.length) && !(c.scraped_reviews?.length) &&
    !(c.mentioned_topics?.length)
  );
}

/**
 * 이 코스 페이지가 색인될 자격이 있는가.
 *
 * 구글 리뷰가 한 건도 없으면 제외한다. 사진이 있어도 마찬가지다 — 이 사이트가 파는 건
 * 리뷰 분석이고, 분석할 리뷰가 없는 페이지는 사용자에게도 검색엔진에도 줄 게 없다.
 * (페이지는 그대로 200 으로 살아 있다. 링크를 타고 온 사람은 볼 수 있고, 나중에 리뷰가
 * 쌓이면 자동으로 다시 색인 대상이 된다.)
 */
export function isIndexableCourse(c: Course): boolean {
  if ((c.total_reviews ?? 0) === 0) return false;
  if (isStub(c)) return false;
  return !isThin(c);
}

// 2026-10-22 GSC: 색인 1/741, "Crawled - currently not indexed" 487. 색인은 09-22 에
// 배포 없이 37 → 9 로 꺾였다(네트워크 동시 강등과 같은 패턴). 사이트맵 코스 565장 중
// 171장이 구글 리뷰 10건 미만이고 그중 164장은 발행 리뷰 텍스트가 300자 미만이었다 —
// 업장명·주소·지도 말고는 템플릿뿐인 페이지 1/3 이 사이트 품질 평가를 끌어내린다.
// petbkk 의 얇은 사료 429장 색인제외와 같은 처방. 가격·코스 스펙(공급자 페이지에서
// 가져온 고유 데이터)이 있으면 리뷰가 적어도 남긴다.
const THIN_MAX_REVIEWS = 10;
const THIN_MIN_REVIEW_CHARS = 300;

function publishedReviewChars(c: Course): number {
  let n = 0;
  for (const list of [c.sample_reviews_en, c.sample_reviews_th, c.sample_reviews_ko]) {
    for (const r of list ?? []) n += r.text?.length ?? 0;
  }
  return n;
}

function hasProviderData(id: string): boolean {
  if (offersForCourse(id).length > 0) return true;
  const f = courseFacts(id);
  return !!f && (f.holes != null || f.par != null || f.length_yd != null);
}

/** 리뷰 10건 미만 + 발행 리뷰 300자 미만 + 가격/스펙 없음 — 페이지에 고유한 말이 없다. */
function isThin(c: Course): boolean {
  if ((c.total_reviews ?? 0) >= THIN_MAX_REVIEWS) return false;
  if (publishedReviewChars(c) >= THIN_MIN_REVIEW_CHARS) return false;
  return !hasProviderData(c.id);
}
