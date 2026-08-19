import type { MetadataRoute } from "next";
import { loadMasterDb, filterByCityOrAlias, golfOnly } from "@/lib/data";
import { loadPriceMatrix, toPriceRows } from "@/lib/priceMatrix";
import { indexableCategoryDistricts, indexableDistricts, indexableCities } from "@/lib/crawlGate";
import { isIndexableCourse } from "@/lib/indexable";
import { BEST_FOR } from "@/lib/bestFor";
import { CUISINE_LABELS } from "@/lib/types";
import { buildComparePairs } from "@/lib/comparePairs";
import { GUIDES } from "@/lib/guides";
import { GUIDES_KO } from "@/lib/guides_ko";
import { GUIDES_TH } from "@/lib/guides_th";
import { POSTS } from "@/lib/posts";
import { POSTS_KO, findPostKo } from "@/lib/posts_ko";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.thailandgolfguide.com";
const CUISINES = Object.keys(CUISINE_LABELS);

const SLUGS_KO = new Set(GUIDES_KO.map((g) => g.slug));
const SLUGS_TH = new Set(GUIDES_TH.map((g) => g.slug));

export const dynamic = "force-static";

// Strict sitemap: drop sub-second precision from lastmod (some validators —
// Naver included — reject ISO timestamps with fractional seconds).
function isoNoMs(d: Date | string): string {
  const dt = typeof d === "string" ? new Date(d) : d;
  return dt.toISOString().replace(/\.\d+Z$/, "Z");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const db = await loadMasterDb();
  const districts = Array.from(new Set(
    Object.keys(db.district_counts).map((k) => k.split("/")[1])
  ));
  const cities = Object.keys(db.city_counts).map((k) => k.toLowerCase().replace(/\s+/g, "_"));
  const updated = isoNoMs(db.generated_at);

  const items: MetadataRoute.Sitemap = [
    {
      url: SITE, lastModified: updated, changeFrequency: "daily", priority: 1.0,
      alternates: { languages: { "x-default": SITE, "en-US": SITE, "ko-KR": `${SITE}/ko`, "th-TH": `${SITE}/th` } },
    },
    {
      url: `${SITE}/th`, lastModified: updated, changeFrequency: "daily", priority: 0.9,
      alternates: { languages: { "x-default": SITE, "en-US": SITE, "ko-KR": `${SITE}/ko`, "th-TH": `${SITE}/th` } },
    },
    {
      url: `${SITE}/ko`, lastModified: updated, changeFrequency: "daily", priority: 0.9,
      alternates: { languages: { "x-default": SITE, "en-US": SITE, "ko-KR": `${SITE}/ko`, "th-TH": `${SITE}/th` } },
    },
    { url: `${SITE}/about`, lastModified: updated, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE}/contact`, lastModified: updated, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE}/for-courses`, lastModified: updated, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE}/methodology`, lastModified: updated, changeFrequency: "monthly", priority: 0.75 },
    { url: `${SITE}/compare`, lastModified: updated, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE}/price-compare`, lastModified: updated, changeFrequency: "daily", priority: 0.85 },
    { url: `${SITE}/tee-times`, lastModified: updated, changeFrequency: "hourly", priority: 0.9 },
    { url: `${SITE}/conditions`, lastModified: updated, changeFrequency: "hourly", priority: 0.85 },
    {
      url: `${SITE}/guide`, lastModified: updated, changeFrequency: "weekly", priority: 0.8,
      alternates: { languages: { "x-default": `${SITE}/guide`, "en-US": `${SITE}/guide`, "ko-KR": `${SITE}/ko/guide`, "th-TH": `${SITE}/th/guide` } },
    },
    {
      url: `${SITE}/blog`, lastModified: updated, changeFrequency: "weekly", priority: 0.85,
      alternates: { languages: { "x-default": `${SITE}/blog`, "en-US": `${SITE}/blog`, "ko-KR": `${SITE}/ko/blog` } },
    },
  ];

  for (const p of POSTS) {
    const koPost = findPostKo(p.slug);
    items.push({
      url: `${SITE}/blog/${p.slug}`,
      lastModified: isoNoMs(p.updated ?? p.published),
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: {
        languages: {
          "x-default": `${SITE}/blog/${p.slug}`,
          "en-US": `${SITE}/blog/${p.slug}`,
          ...(koPost ? { "ko-KR": `${SITE}/ko/blog/${p.slug}` } : {}),
        },
      },
    });
  }

  for (const g of GUIDES) {
    items.push({
      url: `${SITE}/guide/${g.slug}`,
      lastModified: isoNoMs(g.updated),
      changeFrequency: "monthly",
      priority: 0.85,
      alternates: {
        languages: {
          "x-default": `${SITE}/guide/${g.slug}`,
          "en-US": `${SITE}/guide/${g.slug}`,
          ...(SLUGS_KO.has(g.slug) ? { "ko-KR": `${SITE}/ko/guide/${g.slug}` } : {}),
          ...(SLUGS_TH.has(g.slug) ? { "th-TH": `${SITE}/th/guide/${g.slug}` } : {}),
        },
      },
    });
  }
  // Community-content roundups (Naver / Pantip aggregators)
  items.push({ url: `${SITE}/guide/korean-golfer-blogs`, lastModified: updated, changeFrequency: "weekly", priority: 0.8 });
  items.push({ url: `${SITE}/guide/pantip-golf-threads`, lastModified: updated, changeFrequency: "weekly", priority: 0.75 });
  items.push({
    url: `${SITE}/ko/guide`, lastModified: updated, changeFrequency: "weekly", priority: 0.8,
    alternates: { languages: { "x-default": `${SITE}/guide`, "en-US": `${SITE}/guide`, "ko-KR": `${SITE}/ko/guide`, "th-TH": `${SITE}/th/guide` } },
  });
  for (const g of GUIDES_KO) {
    items.push({
      url: `${SITE}/ko/guide/${g.slug}`,
      lastModified: isoNoMs(g.updated),
      changeFrequency: "monthly",
      priority: 0.85,
      alternates: {
        languages: {
          "x-default": `${SITE}/guide/${g.slug}`,
          "en-US": `${SITE}/guide/${g.slug}`,
          "ko-KR": `${SITE}/ko/guide/${g.slug}`,
          ...(SLUGS_TH.has(g.slug) ? { "th-TH": `${SITE}/th/guide/${g.slug}` } : {}),
        },
      },
    });
  }
  // Korean blog — Naver SEO long-tail capture
  items.push({
    url: `${SITE}/ko/blog`, lastModified: updated, changeFrequency: "weekly", priority: 0.85,
    alternates: { languages: { "x-default": `${SITE}/blog`, "en-US": `${SITE}/blog`, "ko-KR": `${SITE}/ko/blog` } },
  });
  for (const p of POSTS_KO) {
    items.push({
      url: `${SITE}/ko/blog/${p.slug}`,
      lastModified: isoNoMs(p.updated ?? p.published),
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: {
        languages: {
          "x-default": `${SITE}/ko/blog/${p.slug}`,
          "ko-KR": `${SITE}/ko/blog/${p.slug}`,
        },
      },
    });
  }
  items.push({
    url: `${SITE}/th/guide`, lastModified: updated, changeFrequency: "weekly", priority: 0.8,
    alternates: { languages: { "x-default": `${SITE}/guide`, "en-US": `${SITE}/guide`, "ko-KR": `${SITE}/ko/guide`, "th-TH": `${SITE}/th/guide` } },
  });
  for (const g of GUIDES_TH) {
    items.push({
      url: `${SITE}/th/guide/${g.slug}`,
      lastModified: isoNoMs(g.updated),
      changeFrequency: "monthly",
      priority: 0.85,
      alternates: {
        languages: {
          "x-default": `${SITE}/guide/${g.slug}`,
          "en-US": `${SITE}/guide/${g.slug}`,
          ...(SLUGS_KO.has(g.slug) ? { "ko-KR": `${SITE}/ko/guide/${g.slug}` } : {}),
          "th-TH": `${SITE}/th/guide/${g.slug}`,
        },
      },
    });
  }

  // 목적지 별칭(/city/hua_hin 등)을 포함하고, 별칭에 코스를 다 빼앗겨 비어버린 도(道)는 뺀다.
  const citySlugs = indexableCities(db.restaurants, Object.keys(db.city_counts));
  for (const c of citySlugs) {
    items.push({ url: `${SITE}/city/${c}`, lastModified: updated, changeFrequency: "daily", priority: 0.85 });
  }

  // /green-fees/[city] — "hua hin golf green fees" 류의 상업적 의도 쿼리를 노린다.
  // 가격이 실린 코스가 하나도 없는 도시는 그 라우트가 발행하지 않으므로 여기서도 뺀다
  // (조건이 어긋나면 sitemap 이 404 를 가리킨다).
  const priceMatrix = await loadPriceMatrix();
  const pricedIds = new Set(
    toPriceRows(priceMatrix)
      .filter((r) => r.weekday_morning_total !== null || r.weekend_morning_total !== null)
      .map((r) => r.course_id),
  );
  const golf = golfOnly(db.restaurants);
  for (const c of citySlugs) {
    if (!filterByCityOrAlias(golf, c).some((r) => pricedIds.has(r.id))) continue;
    items.push({ url: `${SITE}/green-fees/${c}`, lastModified: updated, changeFrequency: "weekly", priority: 0.8 });
  }

  for (const c of CUISINES) {
    items.push({ url: `${SITE}/c/${c}`, lastModified: updated, changeFrequency: "daily", priority: 0.9 });
  }

  for (const c of BEST_FOR) {
    items.push({ url: `${SITE}/best/${c.slug}`, lastModified: updated, changeFrequency: "daily", priority: 0.85 });
  }
  // Korean-localized best curation (Naver SEO)
  items.push({
    url: `${SITE}/ko/best/korean-friendly`, lastModified: updated, changeFrequency: "weekly", priority: 0.9,
    alternates: { languages: { "x-default": `${SITE}/best/korean-friendly`, "en-US": `${SITE}/best/korean-friendly`, "ko-KR": `${SITE}/ko/best/korean-friendly` } },
  });

  // Course head-to-head comparison pages — long-tail commercial intent
  for (const pair of buildComparePairs(db.restaurants)) {
    items.push({
      url: `${SITE}/compare/${pair.slug}`,
      lastModified: updated,
      changeFrequency: "monthly",
      priority: 0.75,
    });
  }

  // /d/[district] — 150개 중 68개가 코스 1개, 100개가 2개 이하였다. 그 한 코스는 이미
  // 자기 상세 페이지와 도시 페이지에 실려 있어 색인될 수 없었다. 태국어 지역명
  // (/d/เมือง 같은 퍼센트 인코딩 URL)도 여기서 함께 걸러진다.
  for (const d of indexableDistricts(db.restaurants, districts)) {
    items.push({
      url: `${SITE}/d/${d.slug}`,
      lastModified: updated, changeFrequency: "weekly", priority: 0.7,
    });
  }

  // /c/[category]/[district] — 예전엔 "코스가 1개라도 있으면" 제출했더니 304개 중 203개가
  // 코스 1개짜리였고, 구글이 전부 색인 거부(Crawled - currently not indexed)했다.
  // 이제 lib/crawlGate 의 임계치를 넘는 조합만 제출한다. 같은 함수를 그 라우트의
  // generateStaticParams 와 /c/[cuisine] 의 지역 링크도 쓰므로 세 곳이 절대 어긋나지 않는다.
  for (const combo of indexableCategoryDistricts(db.restaurants, CUISINES, districts)) {
    items.push({
      url: `${SITE}/c/${combo.category}/${combo.slug}`,
      lastModified: updated, changeFrequency: "weekly", priority: 0.8,
    });
  }

  // lastmod 는 실제로 바뀐 페이지에만 새 시각을 준다.
  // master_db.generated_at 은 2026-05-13 에 멈춰 있는데 이건 버그가 아니라 사실이다 —
  // 매일 갱신되는 건 price_matrix / tee_times / drainage 이고 리뷰 코퍼스는 그때가 마지막이다.
  // 전 URL 에 빌드 시각을 찍으면 "매일 전부 바뀐다"는 거짓 신호가 되어 구글이 lastmod 자체를
  // 무시하기 시작한다. 그래서 가격이 재수집된 코스만 그 시각을 쓴다.
  const priceScrapedAt = new Map<string, string>();
  for (const e of priceMatrix) {
    if (!e.scraped_at) continue;
    const prev = priceScrapedAt.get(e.course_id);
    if (!prev || e.scraped_at > prev) priceScrapedAt.set(e.course_id, e.scraped_at);
  }

  for (const r of db.restaurants) {
    // 색인 자격은 lib/indexable 에서만 판단한다 — 코스 페이지의 robots 메타도 같은
    // 함수를 쓰므로 sitemap 이 noindex 페이지를 가리키는 일이 생기지 않는다.
    if (!isIndexableCourse(r)) continue;
    items.push({
      url: `${SITE}/course/${r.id}`,
      lastModified: priceScrapedAt.get(r.id) ? isoNoMs(priceScrapedAt.get(r.id)!) : updated,
      changeFrequency: "weekly",
      priority: r.trust_score >= 70 ? 0.8 : r.trust_score >= 50 ? 0.6 : 0.4,
    });
  }

  return items;
}
