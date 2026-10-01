// Thai-locale wrapper around the canonical restaurant page. GSC shows real
// Thai-language branded queries (e.g. "มามะการ์เดน อำเภอบางละมุง") landing on
// the English-only page with zero clicks — the <title>/description a Thai
// searcher sees in the SERP didn't match their query language at all. This
// route reuses the exact same page body (review text is user-generated and
// stays in its original language either way) and only localizes the
// title/description/hreflang, which is what actually renders in search
// results and drives the click.
import type { Metadata } from "next";
import { loadMasterDb, getRestaurantById } from "@/lib/data";
import { deriveLocalityFromAddress } from "@/lib/locality";
import { CUISINE_LABELS } from "@/lib/types";
import RestaurantPage from "@/app/restaurant/[id]/page";

export const dynamic = "force-static";

export async function generateStaticParams() {
  // 2026-10-01: 정적 생성을 중단한다 — 이 라우트는 noindex 다.
  //
  // 사이트맵에서 뺀 건(9/27) 색인 중복만 해결했고, 빌드는 그대로 7,022 페이지를
  // 계속 구웠다. Deployment Storage 가 23.1GB / 10GB (231%) 로 넘쳐서 Vercel 이
  // 프로젝트를 정지시켰는데(DEPLOYMENT_DISABLED, 전 경로 402), 그 절반이 색인도
  // 안 되는 페이지를 굽는 데 쓰이고 있었다.
  //
  // 빈 배열 + dynamicParams(기본 true)이면 요청 시에만 생성된다. 내부 링크로
  // 들어오는 사용자에게는 그대로 보이고, 빌드 산출물에서는 사라진다.
  return [];
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const db = await loadMasterDb();
  const r = getRestaurantById(db.restaurants, id);
  if (!r) return { title: "ไม่พบร้านอาหาร" };
  const cuisines = r.cuisines.map((c) => CUISINE_LABELS[c] ?? c).join(", ");
  const city = r.city_label || "Bangkok";
  const locality = r.district || deriveLocalityFromAddress(r.address);
  const place = locality ? `${locality}, ${city}` : city;
  const title = `${r.name} — รีวิวจริงและ Trust Score | ${place}`;
  const description = `${r.name} ร้าน${cuisines || "อาหาร"}ใน${place} Trust Score ${r.trust_score.toFixed(0)}/100 จาก ${r.total_reviews.toLocaleString()} รีวิว Google จริง — ไม่มีอิทธิพลอินฟลูเอนเซอร์ มีแค่ข้อมูลจริง`;
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
      url: `/th/restaurant/${id}`,
      type: "article",
      siteName: "SNS Stopper",
      locale: "th_TH",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function ThRestaurantDetailPage(props: { params: Promise<{ id: string }> }) {
  return RestaurantPage(props, "th");
}
