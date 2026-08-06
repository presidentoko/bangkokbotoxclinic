import { NextResponse } from "next/server";
import { loadMasterDb } from "@/lib/data";
import { getSiteConfig, applySiteFilter } from "@/lib/site";

// 헤드리스 검색 색인. SearchBar 는 클라이언트 컴포넌트라, 여기 담긴 배열을
// props 로 넘기면 통째로 RSC 페이로드(self.__next_f)에 직렬화돼서 그 페이지를
// 여는 모든 방문자가 검색을 쓰든 안 쓰든 내려받게 된다. 2026-08-06 실측으로
// bangkokbestclinic 홈 HTML 1,083 KB 중 801 KB(73%)가 이 페이로드였고,
// HeroSearch 가 SearchBar 를 데스크톱/모바일 두 번 렌더해 같은 배열이 두 벌
// 실려 있었다. 정적 JSON 으로 분리하면 CDN 캐시를 타고, 검색창을 실제로
// 누른 방문자에게만 전송된다.
//
// force-static + 일 1회 revalidate — 데이터는 배포 때 갱신되므로 그 이상 자주
// 만들 이유가 없고, ISR Writes 한도(200K/월)도 아껴야 한다.
export const dynamic = "force-static";
export const revalidate = 86400;

export async function GET() {
  const db = await loadMasterDb();
  const cfg = getSiteConfig();
  const scoped = applySiteFilter(db.clinics, cfg);

  // SearchableEntity 와 같은 모양. 필드를 더 넣으면 그대로 전송량이 된다.
  const index = scoped.map((c) => ({
    id: c.id,
    name: c.name,
    district: c.district,
    city_label: c.city_label,
    rating: c.rating,
    trust_score: c.trust_score,
  }));

  return NextResponse.json(index, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      // 앞단 Cloudflare 와 Vercel 엣지 양쪽에서 오래 캐시되도록.
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
