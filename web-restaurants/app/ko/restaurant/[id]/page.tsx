// Korean-locale wrapper around the canonical restaurant page — same rationale
// as app/th/restaurant/[id]/page.tsx (see comment there). Reuses the same
// page body; only the SERP-facing title/description/hreflang are localized.
import type { Metadata } from "next";
import { loadMasterDb, getRestaurantById } from "@/lib/data";
import { deriveLocalityFromAddress } from "@/lib/locality";
import { CUISINE_LABELS } from "@/lib/types";
import RestaurantPage from "@/app/restaurant/[id]/page";

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  const db = await loadMasterDb();
  return db.restaurants.map((r) => ({ id: r.id }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const db = await loadMasterDb();
  const r = getRestaurantById(db.restaurants, id);
  if (!r) return { title: "레스토랑을 찾을 수 없습니다" };
  const cuisines = r.cuisines.map((c) => CUISINE_LABELS[c] ?? c).join(", ");
  const city = r.city_label || "Bangkok";
  const locality = r.district || deriveLocalityFromAddress(r.address);
  const place = locality ? `${locality}, ${city}` : city;
  const title = `${r.name} — 진짜 리뷰와 Trust Score | ${place}`;
  const description = `${r.name}, ${place}의 ${cuisines || "맛집"}. Trust Score ${r.trust_score.toFixed(0)}/100 (실제 구글 리뷰 ${r.total_reviews.toLocaleString()}개 기반) — 인플루언서 편향 없이 데이터로만.`;
  return {
    title,
    description,
    alternates: {
      canonical: `/ko/restaurant/${id}`,
      languages: {
        en: `/restaurant/${id}`,
        th: `/th/restaurant/${id}`,
        ko: `/ko/restaurant/${id}`,
        "x-default": `/restaurant/${id}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `/ko/restaurant/${id}`,
      type: "article",
      siteName: "SNS Stopper",
      locale: "ko_KR",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function KoRestaurantDetailPage(props: { params: Promise<{ id: string }> }) {
  return RestaurantPage(props, "ko");
}
