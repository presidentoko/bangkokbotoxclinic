// /ko/clinic/[id] — Korean locale variant.
// /th/clinic/[id] 패턴과 동일 — 콘텐츠는 이미 다국어 지원 컴포넌트(WikiSummaryCard,
// sample_reviews_ko 등)를 쓰므로 별도 콘텐츠 분기 없이 metadata + hreflang만 분리.
// 한국 의료관광 검색 트래픽 타겟 (2026-07-12 SEO 감사: ko clinic 페이지 부재로
// layout의 ko hreflang 광고와 실제 페이지 존재가 불일치했던 문제 해결).
import type { Metadata } from "next";
import ClinicPage from "../../../clinic/[id]/page";
import { loadMasterDb, getClinicById } from "@/lib/data";
import { getSiteUrl, getSiteConfig, applySiteFilter, resolveOwnerUrl } from "@/lib/site";

const SITE = getSiteUrl();

// route segment config 는 직접 선언 — Turbopack 이 `export { ... } from` 재export 를
// route config 로 인식하지 못해 빌드 실패하므로 부모와 동일 값으로 명시.
export const revalidate = 2592000;
export const dynamicParams = false;

// 2026-08-06: 예전엔 EN 라우트의 generateStaticParams 를 그대로 재export 해서
// 영어와 "완전히 같은" 클리닉 집합을 prerender 했다. /th 도 마찬가지라 배포 1회당
// 클리닉 페이지가 3배로 써졌고(덴탈 1,829×3 + 보톡스 737×3), ISR Writes 가
// 616K/200K 로 초과된 주된 축이었다.
//
// /th 는 유지한다 — 이 사이트의 GSC 상위 검색어가 전부 태국어라 실익이 크다.
// 반면 /ko 는 사이트맵에 홈 1개만 올라가 있었고 트래픽도 미미했다. 그래서
// 상위 KO_PRERENDER 개만 빌드하고 나머지는 dynamicParams=false 에 따라 404 로 둔다
// — 어차피 색인된 적이 없어 잃을 순위가 없고, 봇이 무작위 id 를 두드려도
// ISR write 가 생기지 않는다(그게 dynamicParams=false 를 쓰는 이유다).
const KO_PRERENDER = 200;

export async function generateStaticParams() {
  const db = await loadMasterDb();
  const cfg = getSiteConfig();
  return applySiteFilter(db.clinics, cfg)
    .slice()
    .sort((a, b) => b.trust_score - a.trust_score)
    .slice(0, KO_PRERENDER)
    .map((c) => ({ id: c.id }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
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
export default function KoClinicPage(props: { params: Promise<{ id: string }> }) {
  return ClinicPage({ ...props, lang: "ko" });
}
