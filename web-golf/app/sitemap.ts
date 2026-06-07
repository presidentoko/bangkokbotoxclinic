import type { MetadataRoute } from "next";
import { loadMasterDb } from "@/lib/data";
import { BEST_FOR } from "@/lib/bestFor";
import { CUISINE_LABELS } from "@/lib/types";
import { buildComparePairs } from "@/lib/comparePairs";
import { GUIDES } from "@/lib/guides";
import { GUIDES_KO } from "@/lib/guides_ko";
import { GUIDES_TH } from "@/lib/guides_th";
import { POSTS } from "@/lib/posts";
import { POSTS_KO } from "@/lib/posts_ko";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thailandgolfguide.com";
const CUISINES = Object.keys(CUISINE_LABELS);

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
    { url: SITE, lastModified: updated, changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE}/th`, lastModified: updated, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE}/ko`, lastModified: updated, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE}/about`, lastModified: updated, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE}/contact`, lastModified: updated, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE}/for-courses`, lastModified: updated, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE}/methodology`, lastModified: updated, changeFrequency: "monthly", priority: 0.75 },
    { url: `${SITE}/compare`, lastModified: updated, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE}/price-compare`, lastModified: updated, changeFrequency: "daily", priority: 0.85 },
    { url: `${SITE}/tee-times`, lastModified: updated, changeFrequency: "hourly", priority: 0.9 },
    { url: `${SITE}/conditions`, lastModified: updated, changeFrequency: "hourly", priority: 0.85 },
    { url: `${SITE}/guide`, lastModified: updated, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/blog`, lastModified: updated, changeFrequency: "weekly", priority: 0.85 },
  ];

  for (const p of POSTS) {
    items.push({
      url: `${SITE}/blog/${p.slug}`,
      lastModified: isoNoMs(p.updated ?? p.published),
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  for (const g of GUIDES) {
    items.push({ url: `${SITE}/guide/${g.slug}`, lastModified: isoNoMs(g.updated), changeFrequency: "monthly", priority: 0.85 });
  }
  // Community-content roundups (Naver / Pantip aggregators)
  items.push({ url: `${SITE}/guide/korean-golfer-blogs`, lastModified: updated, changeFrequency: "weekly", priority: 0.8 });
  items.push({ url: `${SITE}/guide/pantip-golf-threads`, lastModified: updated, changeFrequency: "weekly", priority: 0.75 });
  items.push({ url: `${SITE}/ko/guide`, lastModified: updated, changeFrequency: "weekly", priority: 0.8 });
  for (const g of GUIDES_KO) {
    items.push({ url: `${SITE}/ko/guide/${g.slug}`, lastModified: isoNoMs(g.updated), changeFrequency: "monthly", priority: 0.85 });
  }
  // Korean blog — Naver SEO long-tail capture
  items.push({ url: `${SITE}/ko/blog`, lastModified: updated, changeFrequency: "weekly", priority: 0.85 });
  for (const p of POSTS_KO) {
    items.push({
      url: `${SITE}/ko/blog/${p.slug}`,
      lastModified: isoNoMs(p.updated ?? p.published),
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }
  items.push({ url: `${SITE}/th/guide`, lastModified: updated, changeFrequency: "weekly", priority: 0.8 });
  for (const g of GUIDES_TH) {
    items.push({ url: `${SITE}/th/guide/${g.slug}`, lastModified: isoNoMs(g.updated), changeFrequency: "monthly", priority: 0.85 });
  }

  for (const c of cities) {
    items.push({ url: `${SITE}/city/${c}`, lastModified: updated, changeFrequency: "daily", priority: 0.85 });
  }

  for (const c of CUISINES) {
    items.push({ url: `${SITE}/c/${c}`, lastModified: updated, changeFrequency: "daily", priority: 0.9 });
  }

  for (const c of BEST_FOR) {
    items.push({ url: `${SITE}/best/${c.slug}`, lastModified: updated, changeFrequency: "daily", priority: 0.85 });
  }
  // Korean-localized best curation (Naver SEO)
  items.push({ url: `${SITE}/ko/best/korean-friendly`, lastModified: updated, changeFrequency: "weekly", priority: 0.9 });

  // Course head-to-head comparison pages — long-tail commercial intent
  for (const pair of buildComparePairs(db.restaurants)) {
    items.push({
      url: `${SITE}/compare/${pair.slug}`,
      lastModified: updated,
      changeFrequency: "monthly",
      priority: 0.75,
    });
  }

  for (const d of districts) {
    const slug = d.toLowerCase().replace(/\s+/g, "-");
    items.push({ url: `${SITE}/d/${slug}`, lastModified: updated, changeFrequency: "weekly", priority: 0.7 });
    for (const c of CUISINES) {
      items.push({ url: `${SITE}/c/${c}/${slug}`, lastModified: updated, changeFrequency: "weekly", priority: 0.8 });
    }
  }

  for (const r of db.restaurants) {
    // Skip stub courses (no image / reviews / topics) — they are noindexed
    const isStub =
      !r.hero_image && !r.top_photo_url && !(r.photos && r.photos.length) &&
      !(r.sample_reviews_en?.length) && !(r.sample_reviews_th?.length) &&
      !(r.sample_reviews_ko?.length) && !(r.scraped_reviews?.length) &&
      !(r.mentioned_topics?.length);
    if (isStub) continue;
    items.push({
      url: `${SITE}/course/${r.id}`,
      lastModified: updated,
      changeFrequency: "weekly",
      priority: r.trust_score >= 70 ? 0.8 : r.trust_score >= 50 ? 0.6 : 0.4,
    });
  }

  return items;
}
