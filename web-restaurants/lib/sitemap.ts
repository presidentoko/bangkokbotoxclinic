// 사이트맵 — 섹션별로 쪼개서 제출한다 (2026-10-01).
//
// 왜 쪼개나: GSC Sitemaps 리포트는 **제출한 사이트맵 파일 단위로** "발견된 URL"
// 과 색인 수를 보여준다. 전부 한 덩어리(5,245개)로 내면 "제출 5,245 / 색인 N"
// 한 줄만 보이고, 색인이 안 된 N 이 식당 상세인지 허브인지 파타야인지 알 수가
// 없다. 2026-08-18 스팸 업데이트 때 커버리지 총량만 보다가 형제 사이트의 붕괴를
// 놓친 게 정확히 이 측정 공백 때문이었다.
//
// 쪼갠 기준은 "따로 망할 수 있는 것끼리" 다:
//   core.xml                 홈·안내·가이드·famous-vs-good·verdict  (사람이 쓴 페이지)
//   hubs.xml                 도시·요리·구·best·요리×구               (대량 생성 허브)
//   restaurants-bangkok.xml  방콕 상세 3,366
//   restaurants-pattaya.xml  파타야 상세 1,142
//
// 방콕/파타야를 나눈 이유: 파타야는 별개 시장인데 데이터가 방콕의 1/3이고 나중에
// 들어왔다. 한 덩어리면 파타야가 아예 색인이 안 돼도 방콕 숫자에 묻힌다.
//
// 50,000 URL 한도 때문이 아니다 — 가장 큰 섹션도 3,366개다. 순전히 측정용 분할이다.

import { loadMasterDb, filterByCuisine, filterByDistrict, slugify } from "@/lib/data";
import { BEST_FOR } from "@/lib/bestFor";
import { VERDICT_HUBS } from "@/lib/verdict";
import { CUISINE_LABELS } from "@/lib/types";
import { GUIDES } from "@/lib/guides";
import { loadAllSlugs } from "@/lib/famous-vs-good";
import { isSubstantial } from "@/lib/site";

export const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.snsstopper.com";
const CUISINES = Object.keys(CUISINE_LABELS);

export type Item = { url: string; lastModified: string; changeFrequency: string; priority: number };

type Db = Awaited<ReturnType<typeof loadMasterDb>>;

export const SITEMAP_HEADERS = {
  "Content-Type": "application/xml; charset=utf-8",
  "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
};

export function urlsetXml(items: Item[]): string {
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

export function sitemapIndexXml(files: string[], lastModified: string): string {
  const entries = files
    .map(
      (f) => `  <sitemap>
    <loc>${SITE}/sitemap/${f}</loc>
    <lastmod>${lastModified}</lastmod>
  </sitemap>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</sitemapindex>`;
}

// master_db 의 식당 레코드에는 city_slug 가 없다 — 슬러그로 쓸 수 있는 값은
// `city`("bangkok"/"pattaya")이고 `city_label` 은 표시용("Bangkok")이다.
// city_counts 의 키도 `city` 와 같은 값이라 허브 URL 과 자연히 맞는다.
function cityKey(r: { city: string }): string {
  return r.city || "other";
}

/** 색인에 올릴 식당이 있는 도시 (사이트맵 파일 하나당 도시 하나). */
export function sitemapCities(db: Db): string[] {
  const seen = new Set<string>();
  for (const r of db.restaurants) {
    if (!isSubstantial(r)) continue;
    seen.add(cityKey(r));
  }
  return Array.from(seen).sort();
}

/** sitemap.xml 인덱스가 가리키는 파일 목록. 라우트의 generateStaticParams 와 공유한다. */
export function sitemapFiles(db: Db): string[] {
  return ["core.xml", "hubs.xml", ...sitemapCities(db).map((c) => `restaurants-${c}.xml`)];
}

export async function coreItems(db: Db): Promise<Item[]> {
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
  for (const slug of await loadAllSlugs()) {
    items.push({ url: `${SITE}/famous-vs-good/${slug}`, lastModified: updated, changeFrequency: "weekly", priority: 0.9 });
  }

  // verdict 허브는 웹의 다른 어디서도 복제할 수 없는 페이지라서 기준 페이지의
  // 0.85 가 아니라 famous-vs-good 과 같은 우선순위를 준다. 대량 생성 허브가 아니라
  // 우리가 쓴 페이지이므로 hubs.xml 이 아니라 core.xml 에 둔다.
  items.push({ url: `${SITE}/verdict`, lastModified: updated, changeFrequency: "weekly", priority: 0.9 });
  for (const h of VERDICT_HUBS) {
    items.push({ url: `${SITE}/verdict/${h.slug}`, lastModified: updated, changeFrequency: "weekly", priority: 0.9 });
  }

  return items;
}

export function hubItems(db: Db): Item[] {
  const updated = new Date(db.generated_at).toISOString();
  const districts = Array.from(new Set(
    Object.keys(db.district_counts).map((k) => k.split("/")[1])
  ));
  const cities = Object.keys(db.city_counts);
  const items: Item[] = [];

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

  // /c/[cuisine]/[district] 는 해당 구에 그 요리 식당이 0곳이면 notFound() 한다 —
  // 실제로 매칭되는 조합만 제출한다.
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

  return items;
}

export function restaurantItems(db: Db, city: string): Item[] {
  const updated = new Date(db.generated_at).toISOString();
  const items: Item[] = [];
  for (const r of db.restaurants) {
    // 제출은 isSubstantial 만 (8,625 → 4,508). 기준과 근거는 lib/site.ts 에 있다.
    // 여기서 빠져도 noindex 가 아니다 — 페이지는 살아 있고 내부 링크도 그대로다.
    //
    // th/ko 상세는 제출하지 않는다(2026-09-26). EN 본문을 그대로 렌더하면서
    // canonical 로 EN 을 가리키고 noindex 이기 때문이다. 본문이 실제로 번역되면
    // 그때 다시 넣는다.
    if (!isSubstantial(r)) continue;
    if (cityKey(r) !== city) continue;
    const priority = (r.photos?.length ?? 0) > 0 ? 0.8 : 0.6;
    items.push({ url: `${SITE}/restaurant/${r.id}`, lastModified: updated, changeFrequency: "weekly", priority });
  }
  return items;
}
