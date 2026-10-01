import { loadMasterDb, filterByCuisine, filterByDistrict, slugify } from "@/lib/data";
import { BEST_FOR } from "@/lib/bestFor";
import { VERDICT_HUBS } from "@/lib/verdict";
import { CUISINE_LABELS } from "@/lib/types";
import { GUIDES } from "@/lib/guides";
import { loadAllSlugs } from "@/lib/famous-vs-good";
import { isSubstantial } from "@/lib/site";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.snsstopper.com";
const CUISINES = Object.keys(CUISINE_LABELS);

export const dynamic = "force-static";

type Item = { url: string; lastModified: string; changeFrequency: string; priority: number };

function xmlFor(items: Item[]): string {
  const urls = items
    .map(
      (it) => `  <url>
    <loc>${it.url}</loc>
    <lastmod>${it.lastModified}</lastmod>
    <changefreq>${it.changeFrequency}</changefreq>
    <priority>${it.priority.toFixed(1)}</priority>
  </url>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

export async function GET() {
  const db = await loadMasterDb();
  const districts = Array.from(new Set(
    Object.keys(db.district_counts).map((k) => k.split("/")[1])
  ));
  const cities = Object.keys(db.city_counts);
  const updated = new Date(db.generated_at).toISOString();

  const items: Item[] = [
    { url: SITE, lastModified: updated, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE}/th`, lastModified: updated, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE}/ko`, lastModified: updated, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE}/about`, lastModified: updated, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE}/contact`, lastModified: updated, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE}/for-restaurants`, lastModified: updated, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE}/guide`, lastModified: updated, changeFrequency: "weekly", priority: 0.8 },
  ];

  for (const g of GUIDES) {
    items.push({ url: `${SITE}/guide/${g.slug}`, lastModified: new Date(g.updated).toISOString(), changeFrequency: "monthly", priority: 0.85 });
  }

  items.push({ url: `${SITE}/famous-vs-good`, lastModified: updated, changeFrequency: "weekly", priority: 0.9 });
  const fvgSlugs = await loadAllSlugs();
  for (const slug of fvgSlugs) {
    items.push({ url: `${SITE}/famous-vs-good/${slug}`, lastModified: updated, changeFrequency: "weekly", priority: 0.9 });
  }

  for (const c of cities) {
    items.push({ url: `${SITE}/city/${c}`, lastModified: updated, changeFrequency: "weekly", priority: 0.85 });
    items.push({ url: `${SITE}/th/city/${c}`, lastModified: updated, changeFrequency: "weekly", priority: 0.75 });
    items.push({ url: `${SITE}/ko/city/${c}`, lastModified: updated, changeFrequency: "weekly", priority: 0.75 });
  }

  for (const c of CUISINES) {
    items.push({ url: `${SITE}/c/${c}`, lastModified: updated, changeFrequency: "weekly", priority: 0.9 });
    items.push({ url: `${SITE}/th/c/${c}`, lastModified: updated, changeFrequency: "weekly", priority: 0.8 });
    items.push({ url: `${SITE}/ko/c/${c}`, lastModified: updated, changeFrequency: "weekly", priority: 0.8 });
  }

  for (const c of BEST_FOR) {
    items.push({ url: `${SITE}/best/${c.slug}`, lastModified: updated, changeFrequency: "weekly", priority: 0.85 });
  }

  // The verdict hubs are the pages nothing else on the web can duplicate, so
  // they get the same priority as famous-vs-good rather than the 0.85 the
  // criterion pages carry.
  items.push({ url: `${SITE}/verdict`, lastModified: updated, changeFrequency: "weekly", priority: 0.9 });
  for (const h of VERDICT_HUBS) {
    items.push({ url: `${SITE}/verdict/${h.slug}`, lastModified: updated, changeFrequency: "weekly", priority: 0.9 });
  }

  // /c/[cuisine]/[district] pages notFound() when a cuisine has zero
  // restaurants in a given district — submit only combos with a real match.
  const cuisineRestaurants = new Map(CUISINES.map((c) => [c, filterByCuisine(db.restaurants, c)]));
  for (const d of districts) {
    const slug = slugify(d);
    items.push({ url: `${SITE}/d/${slug}`, lastModified: updated, changeFrequency: "weekly", priority: 0.7 });
    items.push({ url: `${SITE}/th/d/${slug}`, lastModified: updated, changeFrequency: "weekly", priority: 0.6 });
    items.push({ url: `${SITE}/ko/d/${slug}`, lastModified: updated, changeFrequency: "weekly", priority: 0.6 });
    for (const c of CUISINES) {
      const matches = filterByDistrict(cuisineRestaurants.get(c)!, d);
      if (matches.length === 0) continue;
      items.push({ url: `${SITE}/c/${c}/${slug}`, lastModified: updated, changeFrequency: "weekly", priority: 0.8 });
    }
  }

  for (const r of db.restaurants) {
    // 2026-10-01: 제출은 isSubstantial 만 (8,625 → 4,508).
    //
    // 구글이 "발견됨 - 색인 안 됨" 9,732건을 보고하고 있었다 — 발견은 했는데
    // 크롤을 거부한다는 뜻이고, 제출량이 배정된 크롤 예산을 넘었다는 신호다.
    // 여기서 빠져도 noindex 가 아니다(isThin 만 noindex). 이미 색인된 페이지는
    // 남고 내부 링크도 그대로다 — 우리가 "이걸 먼저 보라"고 말하는 목록만
    // 절반으로 줄인다. 기준은 lib/site.ts 에 있다.
    if (!isSubstantial(r)) continue;
    const priority = (r.photos?.length ?? 0) > 0 ? 0.8 : 0.6;
    items.push({ url: `${SITE}/restaurant/${r.id}`, lastModified: updated, changeFrequency: "weekly", priority });
    // 2026-09-26: th/ko 상세는 사이트맵에서 뺀다.
    //
    // 이 라우트들은 EN 페이지 본문을 그대로 import 해서 렌더하고 title·description
    // 만 번역한다. 3,511곳 × 2 = 7,022 URL 이 서로 거의 동일한데 각자 자기를
    // canonical 로 선언하고 있었다 — 2026-08-18 에 형제 사이트를 사이트 단위로
    // 강등시킨 구성과 같다. 이제 canonical 은 EN 을 가리키고 noindex 다
    // (app/{th,ko}/restaurant/[id]/page.tsx 주석 참고), 그러니 제출도 하지 않는다.
    // 페이지는 그대로 살아 있고 내부 링크도 유지된다 — 색인만 뺀다.
    // 되돌릴 시점: 본문이 실제로 번역되면 그때 다시 넣는다.
  }

  return new Response(xmlFor(items), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
