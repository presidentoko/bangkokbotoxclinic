// /ko/clinic/[id] — Korean locale variant.
// /th/clinic/[id] 패턴과 동일 — 콘텐츠는 이미 다국어 지원 컴포넌트(WikiSummaryCard,
// sample_reviews_ko 등)를 쓰므로 별도 콘텐츠 분기 없이 metadata + hreflang만 분리.
// 한국 의료관광 검색 트래픽 타겟 (2026-07-12 SEO 감사: ko clinic 페이지 부재로
// layout의 ko hreflang 광고와 실제 페이지 존재가 불일치했던 문제 해결).
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import ClinicPage from "../../../clinic/[id]/page";
import { loadMasterDb, getClinicById } from "@/lib/data";
import { getSiteUrl, getSiteConfig, applySiteFilter, resolveOwnerUrl } from "@/lib/site";
import { KO_PRERENDER } from "@/lib/ko-cap";

const SITE = getSiteUrl();

// route segment config 는 직접 선언 — Turbopack 이 `export { ... } from` 재export 를
// route config 로 인식하지 못해 빌드 실패하므로 부모와 동일 값으로 명시.
export const revalidate = 2592000;

// 2026-08-06: 예전엔 EN 라우트의 generateStaticParams 를 그대로 재export 해서
// 영어와 "완전히 같은" 클리닉 집합을 prerender 했다. /th 도 마찬가지라 배포 1회당
// 클리닉 페이지가 3배로 써졌고(덴탈 1,829×3 + 보톡스 737×3), ISR Writes 가
// 616K/200K 로 초과된 주된 축이었다.
//
// /th 는 유지한다 — 이 사이트의 GSC 상위 검색어가 전부 태국어라 실익이 크다.
// 반면 /ko 는 사이트맵에 홈 1개만 올라가 있었고 트래픽도 미미했다. 그래서
// 상위 KO_PRERENDER 개만 빌드하고 나머지는 요청 시점에 판단한다(아래 참고).

// 2026-08-17 GSC 감사: KO_PRERENDER 밖 클리닉은 실재하는데(영문판 200 정상)
// 404였다 — dynamicParams=true + 요청 시점 redirect()로 고치려 했으나
// 2026-08-18 실측: "렌더 전에 즉시 redirect로 빠지니 ISR 비용 거의 없다"는
// 가정이 틀렸다. redirect() 결과 자체가 ISR 캐시 write 대상이라, 캡 밖 클리닉
// (덴탈 ~1,600 + 보톡스 ~500)마다 봇이 처음 두드릴 때 write가 하나씩 발생 —
// 배포 하루 만에 ISR Writes 가 200K 한도의 955K(4.7배)까지 치솟았고, Hobby
// 플랜이 한도 초과 시 새 write 를 조용히 거부하면서 함수는 "success"로
// 찍히는데 응답은 엉뚱한 폴백(루트 레이아웃 기본 메타)이 404로 나가는
// 사이트 전역 장애로 번졌다. dynamicParams=false 로 되돌려 write 발생을
// 원천 차단 — 캡 밖 ko 클리닉은 다시 플레인 404 (이 감사 이전 상태와 동일,
// 최소한 새로 나빠지진 않는다). 리다이렉트가 필요하면 ISR write 를 거치지
// 않는 middleware 단에서 다시 설계할 것.
export const dynamicParams = false;

export async function generateStaticParams() {
  const db = await loadMasterDb();
  const cfg = getSiteConfig();
  return applySiteFilter(db.clinics, cfg)
    .slice()
    .sort((a, b) => b.trust_score - a.trust_score)
    .slice(0, KO_PRERENDER)
    .map((c) => ({ id: c.id }));
}

async function koCapRedirectTarget(id: string): Promise<string | null> {
  const db = await loadMasterDb();
  const cfg = getSiteConfig();
  const scoped = applySiteFilter(db.clinics, cfg)
    .slice()
    .sort((a, b) => b.trust_score - a.trust_score);
  const inCap = new Set(scoped.slice(0, KO_PRERENDER).map((c) => c.id));
  if (inCap.has(id)) return null; // 정상 렌더 대상
  const stillScoped = scoped.some((c) => c.id === id);
  return stillScoped ? `/clinic/${id}` : null; // 소관 밖/미존재는 아래 getClinicById가 처리
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const redirectTo = await koCapRedirectTarget(id);
  if (redirectTo) redirect(redirectTo);
  const db = await loadMasterDb();
  const c = getClinicById(db.clinics, id);
  if (!c) return { title: "클리닉을 찾을 수 없습니다" };
  const place = c.district || c.city_label;
  const title = `${c.name} — 후기, 가격, 위치 | ${place}`;
  const description = c.address
    ? `${place}에 위치한 ${c.name}. Google 리뷰 ${c.total_reviews.toLocaleString()}건 기준 평점 ${c.rating.toFixed(1)}. 주소: ${c.address.slice(0, 80)}.`
    : `${c.name} — Google 리뷰 ${c.total_reviews.toLocaleString()}건 기준 평점 ${c.rating.toFixed(1)}.`;

  // EN 페이지와 동일 가드 — parentGSP가 이제 사이트 소관 클리닉만 prerender
  // 하므로(2026-07-17 감사) 실질적으론 도달 불가하지만, 방어적으로 유지.
  const cfg = getSiteConfig();
  const inSite = applySiteFilter([c], cfg).length > 0;
  const ownerUrl = !inSite ? resolveOwnerUrl(c.categories) : null;
  const canonical = ownerUrl ? `${ownerUrl}/ko/clinic/${c.id}` : `${SITE}/ko/clinic/${c.id}`;

  return {
    title,
    description,
    ...(!inSite && { robots: { index: false, follow: true } }),
    alternates: {
      canonical,
      ...(inSite && {
        languages: {
          "en-US": `${SITE}/clinic/${c.id}`,
          "th-TH": `${SITE}/th/clinic/${c.id}`,
          "ko-KR": `${SITE}/ko/clinic/${c.id}`,
          "x-default": `${SITE}/clinic/${c.id}`,
        },
      }),
    },
    openGraph: {
      type: "website",
      locale: "ko_KR",
      title,
      description,
      url: `${SITE}/ko/clinic/${c.id}`,
    },
  };
}

// 2026-08-06 감사: 여기만 `export default ClinicPage` 라 lang 이 한 번도 안
// 넘어갔다. 그 결과 canonical 은 /ko/clinic/{id} 인데 JSON-LD 의 url·breadcrumb·
// speakable 은 전부 영어 경로를 뱉어, 같은 문서가 자기 자신을 서로 다른 두 URL
// 이라고 주장했다. /th 는 2026-07-31에 같은 수정을 받았지만 /ko 는 누락됐었다.
export default async function KoClinicPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const redirectTo = await koCapRedirectTarget(id);
  if (redirectTo) redirect(redirectTo);
  return ClinicPage({ ...props, lang: "ko" });
}
