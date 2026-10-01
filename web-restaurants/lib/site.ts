// 사이트 config — 도메인 결정 후 NEXT_PUBLIC_BRAND + NEXT_PUBLIC_SITE_URL 만 swap 하면 됨.

/**
 * ko/th 상세 페이지를 만들어 줄 식당의 기준.
 *
 * 식당이 8,625곳이 되면서 상세 페이지가 로케일 3벌로 25,875장이 됐고 Vercel
 * 빌드가 ENOSPC 로 죽었다(functions.tmp 아래 .segment.rsc.func 를 만들다가).
 * 설정은 3,184곳 시절 기준이었다.
 *
 * 영어 상세는 8,625곳 전부 유지한다 — 그게 색인의 본체다. 번역 로케일은
 * 상위 식당만 만든다. 목록·도시·요리 페이지는 로케일별로 그대로 있고,
 * 거기서 식당으로 가는 링크는 원래부터 영어 상세를 가리키므로 내부 링크가
 * 깨지지 않는다.
 *
 * 이 값을 쓰는 곳: app/ko/restaurant/[id], app/th/restaurant/[id],
 * app/sitemap.xml. 사이트맵이 만들지 않은 URL 을 제출하면 404 를 구글에
 * 제출하는 꼴이므로 셋이 같은 기준을 봐야 한다.
 */
export const LOCALE_DETAIL_MIN_TRUST = 85;

export function hasLocaleDetail(r: { trust_score?: number | null }): boolean {
  return (r.trust_score ?? 0) >= LOCALE_DETAIL_MIN_TRUST;
}

export type SiteConfig = {
  brand: string;
  domain: string;
  title: string;
  description: string;
  hero: string;
  heroSub: string;
  themeAccent: string;
};

export function getSiteConfig(): SiteConfig {
  const brand = process.env.NEXT_PUBLIC_BRAND || "SNS Stopper";
  const domain = process.env.NEXT_PUBLIC_SITE_URL || "https://www.snsstopper.com";
  return {
    brand,
    domain,
    title: `${brand} — Bangkok Restaurant Reviews, Not SNS Hype`,
    description:
      "Stop searching restaurants on Instagram. Real Bangkok and Pattaya restaurants ranked by Trust Score from verified Google reviews — no influencer fluff.",
    hero: "Stop searching on SNS. Find restaurants by real reviews.",
    heroSub:
      "Bangkok and Pattaya restaurants ranked from verified Google reviews. No paid influencers. No filters.",
    themeAccent: "#ea580c",
  };
}

/**
 * 제출 기준과 thin 기준 (2026-10-01).
 *
 * 왜 필요한가: GSC 가 "발견됨 - 색인 안 됨" 9,732 건을 보고한다 — 구글이 URL 을
 * 발견하고 **크롤 자체를 거부**하는 상태다. 제출량이 이 사이트에 배정된 크롤
 * 예산을 넘었다는 신호다. 같은 과잉이 Vercel 한도도 터뜨렸다(저장 23.1GB/10,
 * 전송 27.28GB/10, ISR 읽기 3.2M/1M → DEPLOYMENT_DISABLED 로 사이트 정지).
 *
 * trust_score 는 기준으로 못 쓴다 — 8,625곳 중 8,404곳이 70점 이상이라
 * 아무것도 가르지 못한다(사이트맵 priority 가 사실상 전부 0.8 이었다).
 *
 * 실측 분포 (8,625곳 중 사진 없는 곳 6,567):
 *   사진 있음                 2,058
 *   사진없음 & 리뷰 20~50     1,036
 *   사진없음 & 리뷰 50~100    1,638
 *   사진없음 & 리뷰 100~200   1,443
 *   사진없음 & 리뷰 200+      2,450
 *   리뷰 20개 미만              1곳
 *
 * 두 개의 서로 다른 선을 긋는다. 하나로 뭉치면 둘 다 틀린다:
 *
 * 1) isSubstantial — **사이트맵에 제출할 것** (사진 또는 리뷰>=200 → 4,508).
 *    8,625 → 4,508 은 제출량 48% 감축이다. `or` 로 둔 이유: 사진만 요구하면
 *    리뷰 1,000개짜리 유명 식당이 잘리고, 리뷰만 요구하면 사진 있는 신규
 *    가게가 잘린다. 제출에서 빠져도 noindex 가 아니다 — 이미 색인된 페이지는
 *    그대로 남는다. 사이트맵은 우선순위 신호일 뿐이라 되돌리기도 무료다.
 *
 * 2) isThin — **색인을 거부할 것** (사진 없고 리뷰<50 → 1,036).
 *    사진도 없고 리뷰도 50개 미만이면 구글 자체 패널이 이미 보여주는 것 외에
 *    우리가 더할 게 없는 페이지다. 2026-08-18 스팸 업데이트가 형제 사이트를
 *    사이트 단위로 강등시킨 게 정확히 이 종류(대량 생성된 얇은 디렉터리
 *    페이지)였다. 선을 50 으로 낮게 잡은 건 의도된 보수성이다 — 리뷰 150개짜리
 *    실존 식당을 noindex 하는 건 트래픽을 버리는 짓이다.
 *
 * generateStaticParams 는 **건드리지 않는다**(전체 8,625 유지). 이유:
 * dynamicParams=false 라서 목록에 없는 id 는 404 가 된다 — 허브 카드가 링크하는
 * 식당이 404 나면 색인 문제보다 큰 문제다. dynamicParams=true 로 돌리는 건 더
 * 나쁘다: 봇이 가짜 id 를 긁어 ISR 쓰기와 Fluid CPU 를 태우던 게 애초에
 * false 로 잠근 이유다(app/restaurant/[id]/page.tsx 주석 참고).
 *
 * 쓰는 곳: app/sitemap.xml (isSubstantial), app/restaurant/[id] (isThin).
 */
export const SUBSTANTIAL_MIN_REVIEWS = 200;
export const THIN_MAX_REVIEWS = 50;

type Gradable = { total_reviews?: number | null; photos?: unknown[] | null };

export function isSubstantial(r: Gradable): boolean {
  if ((r.photos?.length ?? 0) > 0) return true;
  return (r.total_reviews ?? 0) >= SUBSTANTIAL_MIN_REVIEWS;
}

export function isThin(r: Gradable): boolean {
  if ((r.photos?.length ?? 0) > 0) return false;
  return (r.total_reviews ?? 0) < THIN_MAX_REVIEWS;
}
