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
import { hasKoPage } from "@/lib/ko-cap";

const SITE = getSiteUrl();

// 동일 클리닉 set 으로 pre-build (top 100 ISR 정책 share)
// route segment config 는 직접 선언 — Turbopack 이 `export { ... } from` 재export 를
// route config 로 인식하지 못해 빌드 실패하므로 부모와 동일 값으로 명시.
// 2026-10-23: 2592000(30일 ISR) → false(완전 정적). 데이터는 배포 때만 바뀌는데
// ISR 로 두면 (1) 배포마다 프리렌더 전량이 ISR Write 로 잡혀 배포 1회 ~13만 건
// (Hobby 한도 20만/30일)이고 (2) 배포 30일 뒤 일제히 stale 이 되어 방문마다
// 재생성 write 가 터진다. 정적이면 둘 다 0 이고 CDN 에서 바로 나가 ISR Read 도 없다.
export const revalidate = false;
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
  const c = getClinicByRouteKey(db.clinics, id);
  if (!c) return { title: "ไม่พบคลินิก" };
  // 2026-08-14 감사: ", ที่ตั้ง"(위치) 제거 — รีวิว(리뷰)·ราคา(가격) 검색어와
  // 지역명은 유지. TH 클리닉이 60자 초과 최다 그룹(표본 404건)이었다.
  // 2026-09-02: title 에는 정제 이름을 쓴다 — 키워드 나열·잘림이 SERP 에서
  // 스팸처럼 보이는 것을 막는다. H1·JSON-LD 는 원본 c.name 그대로.
  const dispName = c.display_name || c.name;
  const title = `${dispName} — รีวิว & ราคา | ${c.district || c.city_label}`;
  const lic = getClinicLicense(c.id);
  const licBit = lic ? ` เลขที่ใบอนุญาตสถานพยาบาล ${lic.license_no}.` : "";
  const description = c.address
    ? `${c.name} ใน ${c.district || c.city_label} — คะแนน ${c.rating.toFixed(1)} จาก ${c.total_reviews.toLocaleString()} รีวิว Google.${licBit} ที่อยู่: ${c.address.slice(0, 70)}.`
    : `${c.name} — คะแนน ${c.rating.toFixed(1)} จาก ${c.total_reviews.toLocaleString()} รีวิว Google.${licBit}`;

  // EN 페이지와 동일 가드 — parentGSP가 이제 사이트 소관 클리닉만 prerender
  // 하므로(2026-07-17 감사) 실질적으론 도달 불가하지만, 방어적으로 유지.
  const cfg = getSiteConfig();
  const inSite = applySiteFilter([c], cfg).length > 0;
  const ownerUrl = !inSite ? resolveOwnerUrl(c.categories) : null;
  // 2026-09-15 에는 "영어판과 본문 99% 동일(태국어 글자 15%) — 번역이 아니라
  // 복제본" 이라서 영어판으로 canonical 을 모으고 색인에서 뺐다.
  //
  // 2026-10-26: 덴탈(web-cf 3280f7d → d4a2352)과 같은 현지화를 이 앱에 이식한 뒤
  // 다시 쟀다. 로컬 dev(NEXT_PUBLIC_SITE_FOCUS=botox), sitemap-clinics 에서 고르게
  // 뽑은 9쌍, <main> 텍스트 기준:
  //
  //   태국어 글자 비율      EN 중앙값 7.8%  →  TH 중앙값 60.3% (최소 54.9%)
  //   TH 페이지에만 있는 텍스트              중앙값 63.6% (최소 55.2%)
  //   30% 미만인 쌍                          0건
  //
  // 덴탈이 색인을 연 기준(TH 전용 중앙값 ≥~50%, 태국어 ≥~45%, 30% 미만 0)을 넘는다.
  // 남은 영어는 대부분 리뷰 원문이다 — 보톡스 소관 1,918곳 중 태국어 샘플 리뷰가 있는
  // 곳은 145곳뿐이라 영어 리뷰를 그대로 보여 준다(번역해서 지어내지 않는다).
  // 그래서 소관 내 /th 는 자기 자신을 canonical 로 삼고 색인에 들어간다.
  // 소관 밖 클리닉은 그대로 상대 도메인 영어판으로 보낸다 — 그쪽에 태국어 페이지가
  // 있다고 보장할 수 없다.
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
      // /ko 는 클러스터에서 뺀다 — /ko/clinic 은 noindex 이고 상위 200곳만 있다.
      // 색인에서 빠진 페이지를 가리키는 클러스터는 상호참조가 안 돼 버려진다(덴탈과 동일).
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
