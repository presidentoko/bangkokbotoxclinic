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
  const { loadMasterDb } = await import("@/lib/data");
  const { hasLocaleDetail } = await import("@/lib/site");
  const db = await loadMasterDb();
  // 전량이 아니라 상위 식당만 — lib/site.ts 의 주석 참고.
  return db.restaurants.filter(hasLocaleDetail).map((r) => ({ id: r.id }));
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
    // 2026-09-26: canonical 을 en 으로 돌리고 이 로케일은 색인에서 뺀다.
    //
    // 이 라우트는 "태국어 브랜드 쿼리가 영어 제목 페이지에 착지해 클릭 0" 이라는
    // 관찰에서 만들어졌는데, 실측해보니 근거가 구조적으로 약하다:
    // 로케일 상세가 생성되는 3,511곳 중 상호에 태국어가 있는 건 1,069곳(30%)뿐이고,
    // 그 30%는 EN 제목도 r.name 을 쓰므로 태국어 상호가 이미 EN 제목에 들어 있다.
    // 남은 70%는 로마자 상호라 태국어로 검색해도 이 이름으로는 안 걸린다.
    //
    // 반대편 위험은 구체적이다: 본문은 EN 페이지를 그대로 import 해서 렌더하므로
    // 3,511곳 × th/ko = 7,022개가 서로 거의 동일한데 각자 자기를 canonical 로
    // 선언하고 있었다. 이 구성이 2026-08-18 에 형제 사이트(bangkokbestclink)를
    // 사이트 단위로 강등시킨 그 구성이다.
    //
    // 사용자에게는 그대로 보인다 — 링크를 끊지 않고 색인만 뺀다. 되돌릴 시점:
    // 본문이 실제로 번역되면 canonical 을 자기 자신으로 돌리고 색인에 넣는다.
    alternates: { canonical: `/restaurant/${id}` },
    robots: { index: false, follow: true },
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
