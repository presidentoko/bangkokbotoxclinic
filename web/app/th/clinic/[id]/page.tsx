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

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bangkokbotoxclinic.com";

// 동일 클리닉 set 으로 pre-build (top 100 ISR 정책 share)
// route segment config 는 직접 선언 — Turbopack 이 `export { ... } from` 재export 를
// route config 로 인식하지 못해 빌드 실패하므로 부모와 동일 값으로 명시.
export const revalidate = 604800;
export const dynamicParams = true;
export const generateStaticParams = parentGSP;

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const db = await loadMasterDb();
  const c = getClinicById(db.clinics, id);
  if (!c) return { title: "ไม่พบคลินิก" };
  const title = `${c.name} — รีวิว, ราคา, ที่ตั้ง | ${c.district || c.city_label}`;
  const description = c.address
    ? `${c.name} ใน ${c.district || c.city_label} — คะแนน ${c.rating.toFixed(1)} จาก ${c.total_reviews.toLocaleString()} รีวิว Google. ที่อยู่: ${c.address.slice(0, 80)}.`
    : `${c.name} — คะแนน ${c.rating.toFixed(1)} จาก ${c.total_reviews.toLocaleString()} รีวิว Google.`;
  return {
    title,
    description,
    alternates: {
      canonical: `${SITE}/th/clinic/${c.id}`,
      languages: {
        "en-US": `${SITE}/clinic/${c.id}`,
        "th-TH": `${SITE}/th/clinic/${c.id}`,
        "x-default": `${SITE}/clinic/${c.id}`,
      },
    },
    openGraph: {
      type: "website",
      locale: "th_TH",
      title,
      description,
      url: `${SITE}/th/clinic/${c.id}`,
    },
  };
}

// 페이지 컴포넌트 자체는 EN 버전과 동일하게 re-render.
// (콘텐츠는 이미 bilingual — WikiSummaryCard, sample_reviews_th 모두 양국어 노출)
export default ClinicPage;
