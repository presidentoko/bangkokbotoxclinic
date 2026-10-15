// /th/clinic/[id] — Thai locale variant.
// 동일 데이터/컴포넌트 사용. 차이점은 metadata locale + hreflang annotation.
// 콘텐츠 자체는 이미 양국어 (WikiSummaryCard, sample_reviews_th, Pantip 원문 등)
// 라 별도 콘텐츠 분기 없이 SEO 측면에서 두 URL 분리만 처리.
//
// 미래 확장: ClinicDetailView 서버 컴포넌트로 추출 후 lang prop 으로
// 라벨/우선순위 변경 가능. 지금은 hreflang + locale metadata 만 차이.
import type { Metadata } from "next";
import { getClinicLicense } from "@/lib/licenses";
import ClinicPage, { generateStaticParams as parentGSP } from "../../../clinic/[id]/page";
import { loadMasterDb, getClinicByRouteKey } from "@/lib/data";
import { getSiteUrl, getSiteConfig, applySiteFilter, resolveOwnerUrl, safeEncodeURIComponent } from "@/lib/site";

const SITE = getSiteUrl();

// 동일 클리닉 set 으로 pre-build (top 100 ISR 정책 share)
// route segment config 는 직접 선언 — Turbopack 이 `export { ... } from` 재export 를
// route config 로 인식하지 못해 빌드 실패하므로 부모와 동일 값으로 명시.
export const revalidate = 2592000;
export const dynamicParams = false;
export const generateStaticParams = parentGSP;

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const db = await loadMasterDb();
  const c = getClinicByRouteKey(db.clinics, id);
  if (!c) return { title: "ไม่พบคลินิก" };
  // 2026-08-14 감사: ", ที่ตั้ง"(위치) 제거 — รีวิว·ราคา 검색어와 지역명 유지.
  // TH 클리닉이 60자 초과 최다 그룹. (web/ 원본과 동기)
  // 2026-09-02: title 에는 정제 이름을 쓴다 — 키워드 나열·잘림이 SERP 에서
  // 스팸처럼 보이는 것을 막는다. H1·JSON-LD 는 원본 c.name 그대로.
  const dispName = c.display_name || c.name;
  const title = `${dispName} — รีวิว & ราคา | ${c.district || c.city_label}`;
  const lic = getClinicLicense(c.id);
  const licBit = lic ? ` เลขที่ใบอนุญาตสถานพยาบาล ${lic.license_no}.` : "";
  const description = c.address
    ? `${c.name} ใน ${c.district || c.city_label} — คะแนน ${c.rating.toFixed(1)} จาก ${c.total_reviews.toLocaleString()} รีวิว Google.${licBit} ที่อยู่: ${c.address.slice(0, 80)}.`
    : `${c.name} — คะแนน ${c.rating.toFixed(1)} จาก ${c.total_reviews.toLocaleString()} รีวิว Google.${licBit}`;

  // EN 페이지와 동일 가드 — parentGSP가 이제 사이트 소관 클리닉만 prerender
  // 하므로(2026-07-17 감사) 실질적으론 도달 불가하지만, 방어적으로 유지.
  const cfg = getSiteConfig();
  const inSite = applySiteFilter([c], cfg).length > 0;
  const ownerUrl = !inSite ? resolveOwnerUrl(c.categories) : null;
  // 2026-09-15 에는 "영어판과 본문 99% 동일(태국어 글자 15%) — 번역이 아니라
  // 복제본" 이라서 영어판으로 canonical 을 모으고 색인에서 뺐다. 그 전제는
  // /th 현지화(커밋 3280f7d) 이후 더 이상 사실이 아니다. 2026-10-15 라이브
  // 실측, 사이트맵에서 고르게 뽑은 14쌍:
  //
  //   TH 페이지에만 있는 텍스트   중앙값 57%  (최소 48%, 최대 69%)
  //   태국어 글자 비율            중앙값 55%  (최소 45%, 최대 66%)
  //   30% 미만인 쌍               0건
  //
  // 제목·설명·주소·요약·판정문이 전부 태국어로 렌더된다. 중복이 아니라
  // 번역본이므로 자기 자신을 canonical 로 삼고 색인에 들어간다.
  //
  // 그리고 수요가 거기 있다. 2026-10-15 내보내기에서 태국어 쿼리가 노출
  // 37%(11,765/31,759)로 클릭 62%(219/353)를 벌었고 CTR 1.86% 대 영어 0.67%,
  // "ใกล้ฉัน" 묶음은 1.9~3.1위다. 그 수요를 영어 페이지로 받고 있었고 태국어
  // 페이지 1,625장은 noindex 로 0을 벌고 있었다.
  //
  // 소관 밖 클리닉은 그대로 상대 도메인 영어판으로 보낸다 — 그쪽에 태국어
  // 페이지가 있다고 보장할 수 없다.
  const canonical = ownerUrl
    ? `${ownerUrl}/clinic/${c.url_slug}`
    : `${SITE}/th/clinic/${c.url_slug}`;

  return {
    // absolute — EN 라우트(app/clinic/[id]/page.tsx)는 이미 이렇게 쓰는데 여기만
    // 빠져 있어서 루트 레이아웃의 title 템플릿이 뒤에 브랜드명을 한 번 더 붙였다.
    // 결과가 "…— รีวิว, ราคา, ที่ตั้ง | Huai Khwang | Bangkok Best Clinic" 118자로
    // 구글 표시 한도를 한참 넘겨 뒤가 잘렸다 (2026-08-06 감사).
    title: { absolute: title },
    description,
    // 소관 밖일 때만 noindex. 소관 내 태국어 페이지는 색인 대상이다.
    ...(!inSite && { robots: { index: false, follow: true } }),
    alternates: {
      canonical,
      // /ko 는 클러스터에서 뺀다 — 같은 내보내기에서 한국어 쿼리 1건·노출 2회
      // 뿐이고 /ko/clinic 은 noindex 다. 색인에서 빠진 페이지를 가리키는
      // 클러스터는 신호를 버리는 것이고, 상호참조가 안 되는 클러스터는 구글이
      // 통째로 버린다.
      ...(inSite && {
        languages: {
          en: `${SITE}/clinic/${c.url_slug}`,
          th: `${SITE}/th/clinic/${c.url_slug}`,
          "x-default": `${SITE}/clinic/${c.url_slug}`,
        },
      }),
    },
    openGraph: {
      // 2026-09-02: 페이지가 openGraph 를 정의하면 루트 layout 의 siteName 이
      // 통째로 사라진다(Next 는 객체 단위 교체). 실측: og:site_name 태그 부재.
      siteName: cfg.brand,
      type: "website",
      locale: "th_TH",
      title,
      description,
      url: `${SITE}/th/clinic/${c.url_slug}`,
      // 2026-08-14 감사: og:image 누락 대부분이 이 라우트 — EN 과 동일한 /api/og
      // 카드. (web/ 원본과 동기)
      images: [{
        url: `${SITE}/api/og?title=${safeEncodeURIComponent(c.name.slice(0, 50))}&sub=${safeEncodeURIComponent(`★${c.rating} · ${c.total_reviews.toLocaleString()} รีวิว · ${c.district ?? c.city_label ?? "Bangkok"}`)}&count=${c.total_reviews}`,
        width: 1200,
        height: 630,
        alt: c.name,
      }],
    },
  };
}

// 2026-07-31 감사: EN 컴포넌트를 그대로 re-export만 해서 lang이 한 번도
// 전달 안 됐음 — WikiSummaryCard가 항상 기본값 "en"으로 렌더돼 태국어
// wiki_summaries 1,301개(전체의 태국어 요약 보유분)가 /th 페이지에서도
// 영어로 나오고 있었다. lang="th"만 명시적으로 넘겨주면 됨.
export default function ThClinicPage(props: { params: Promise<{ id: string }> }) {
  return ClinicPage({ ...props, lang: "th" });
}
