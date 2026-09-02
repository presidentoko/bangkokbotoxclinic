// /th/clinic/[id] — Thai locale variant.
// 동일 데이터/컴포넌트 사용. 차이점은 metadata locale + hreflang annotation.
// 콘텐츠 자체는 이미 양국어 (WikiSummaryCard, sample_reviews_th, Pantip 원문 등)
// 라 별도 콘텐츠 분기 없이 SEO 측면에서 두 URL 분리만 처리.
//
// 미래 확장: ClinicDetailView 서버 컴포넌트로 추출 후 lang prop 으로
// 라벨/우선순위 변경 가능. 지금은 hreflang + locale metadata 만 차이.
import type { Metadata } from "next";
import ClinicPage, { generateStaticParams as parentGSP } from "../../../clinic/[id]/page";
import { loadMasterDb, getClinicById } from "@/lib/data";
import { getSiteUrl, getSiteConfig, applySiteFilter, resolveOwnerUrl, safeEncodeURIComponent } from "@/lib/site";
import { hasKoPage } from "@/lib/ko-cap";

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
  // 2026-08-29: /ko/clinic/{id} 는 상위 200곳만 존재한다(KO_PRERENDER).
  // 없는 페이지를 hreflang 으로 광고하면 구글이 가져가서 404 를 받는다.
  const { id } = await params;
  const koExists = await hasKoPage(id);
  const db = await loadMasterDb();
  const c = getClinicById(db.clinics, id);
  if (!c) return { title: "ไม่พบคลินิก" };
  // 2026-08-14 감사: ", ที่ตั้ง"(위치) 제거 — รีวิว(리뷰)·ราคา(가격) 검색어와
  // 지역명은 유지. TH 클리닉이 60자 초과 최다 그룹(표본 404건)이었다.
  // 2026-09-02: title 에는 정제 이름을 쓴다 — 키워드 나열·잘림이 SERP 에서
  // 스팸처럼 보이는 것을 막는다. H1·JSON-LD 는 원본 c.name 그대로.
  const dispName = c.display_name || c.name;
  const title = `${dispName} — รีวิว & ราคา | ${c.district || c.city_label}`;
  const description = c.address
    ? `${c.name} ใน ${c.district || c.city_label} — คะแนน ${c.rating.toFixed(1)} จาก ${c.total_reviews.toLocaleString()} รีวิว Google. ที่อยู่: ${c.address.slice(0, 80)}.`
    : `${c.name} — คะแนน ${c.rating.toFixed(1)} จาก ${c.total_reviews.toLocaleString()} รีวิว Google.`;

  // EN 페이지와 동일 가드 — parentGSP가 이제 사이트 소관 클리닉만 prerender
  // 하므로(2026-07-17 감사) 실질적으론 도달 불가하지만, 방어적으로 유지.
  const cfg = getSiteConfig();
  const inSite = applySiteFilter([c], cfg).length > 0;
  const ownerUrl = !inSite ? resolveOwnerUrl(c.categories) : null;
  const canonical = ownerUrl ? `${ownerUrl}/th/clinic/${c.id}` : `${SITE}/th/clinic/${c.id}`;

  return {
    // absolute — EN 라우트(app/clinic/[id]/page.tsx)는 이미 이렇게 쓰는데 여기만
    // 빠져 있어서 루트 레이아웃의 title 템플릿이 뒤에 브랜드명을 한 번 더 붙였다.
    // 결과가 "…— รีวิว, ราคา, ที่ตั้ง | Huai Khwang | Bangkok Best Clinic" 118자로
    // 구글 표시 한도를 한참 넘겨 뒤가 잘렸다 (2026-08-06 감사).
    title: { absolute: title },
    description,
    ...(!inSite && { robots: { index: false, follow: true } }),
    alternates: {
      canonical,
      ...(inSite && {
        languages: {
          "en-US": `${SITE}/clinic/${c.id}`,
          "th-TH": `${SITE}/th/clinic/${c.id}`,
          // 캡 밖 클리닉은 ko 페이지가 실재하지 않는다 — 광고하면 404 를 낳는다.
          ...(koExists && { "ko-KR": `${SITE}/ko/clinic/${c.id}` }),
          "x-default": `${SITE}/clinic/${c.id}`,
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
      url: `${SITE}/th/clinic/${c.id}`,
      // 2026-08-14 감사: og:image 누락 1,319건 중 1,166건이 이 라우트였다 —
      // EN 클리닉 페이지(app/clinic/[id]/page.tsx)와 동일한 /api/og 카드.
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
