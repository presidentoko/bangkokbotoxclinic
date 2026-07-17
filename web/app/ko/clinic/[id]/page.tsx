// /ko/clinic/[id] — Korean locale variant.
// /th/clinic/[id] 패턴과 동일 — 콘텐츠는 이미 다국어 지원 컴포넌트(WikiSummaryCard,
// sample_reviews_ko 등)를 쓰므로 별도 콘텐츠 분기 없이 metadata + hreflang만 분리.
// 한국 의료관광 검색 트래픽 타겟 (2026-07-12 SEO 감사: ko clinic 페이지 부재로
// layout의 ko hreflang 광고와 실제 페이지 존재가 불일치했던 문제 해결).
import type { Metadata } from "next";
import ClinicPage, { generateStaticParams as parentGSP } from "../../../clinic/[id]/page";
import { loadMasterDb, getClinicById } from "@/lib/data";
import { getSiteUrl, getSiteConfig, applySiteFilter, resolveOwnerUrl } from "@/lib/site";

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

// 페이지 컴포넌트 자체는 EN/TH 버전과 동일하게 re-render.
// (콘텐츠는 이미 다국어 지원 — WikiSummaryCard, sample_reviews_ko 등)
export default ClinicPage;
