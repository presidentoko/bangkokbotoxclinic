import type { MetadataRoute } from "next";
import { loadMasterDb } from "@/lib/data";
import { districtsForBuild, suppliersInDistrict } from "@/lib/districts";
import { BEST_FOR } from "@/lib/bestFor";
import { CATEGORY_LABELS } from "@/lib/types";
import { GUIDES } from "@/lib/guides";
import { GUIDES_KO } from "@/lib/guides_ko";
import { GUIDES_TH } from "@/lib/guides_th";
import { POSTS } from "@/lib/posts";
import { POSTS_KO } from "@/lib/posts_ko";
import { POSTS_TH } from "@/lib/posts_th";
import { citySlugFromDisplay } from "@/lib/cityNorm";
import { TH_CATEGORY_VALID, TH_CITY_VALID } from "@/lib/thBuildSets";
import { inSitemap } from "@/lib/supplierTier";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thaisupplyhub.com";
const CATEGORIES = Object.keys(CATEGORY_LABELS);

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const db = await loadMasterDb();
  const seenCities = new Set<string>();
  const cities = Object.keys(db.city_counts)
    .map((k) => citySlugFromDisplay(k))
    .filter((slug) => {
      if (!slug || seenCities.has(slug)) return false;
      seenCities.add(slug);
      return true;
    });
  const updated = new Date(db.generated_at);

  const items: MetadataRoute.Sitemap = [
    { url: SITE, lastModified: updated, changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE}/ko`, lastModified: updated, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE}/th`, lastModified: updated, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE}/about`, lastModified: updated, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE}/trust-score`, lastModified: updated, changeFrequency: "monthly", priority: 0.55 },
    { url: `${SITE}/ko/about`, lastModified: updated, changeFrequency: "monthly", priority: 0.55 },
    { url: `${SITE}/th/about`, lastModified: updated, changeFrequency: "monthly", priority: 0.55 },
    { url: `${SITE}/contact`, lastModified: updated, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE}/for-suppliers`, lastModified: updated, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE}/ko/for-suppliers`, lastModified: updated, changeFrequency: "monthly", priority: 0.65 },
    { url: `${SITE}/th/for-suppliers`, lastModified: updated, changeFrequency: "monthly", priority: 0.65 },
    { url: `${SITE}/for-buyers`, lastModified: updated, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE}/ko/for-buyers`, lastModified: updated, changeFrequency: "monthly", priority: 0.85 },
    { url: `${SITE}/th/for-buyers`, lastModified: updated, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE}/guide`, lastModified: updated, changeFrequency: "weekly", priority: 0.85 },
    { url: `${SITE}/ko/guide`, lastModified: updated, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/th/guide`, lastModified: updated, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/blog`, lastModified: updated, changeFrequency: "weekly", priority: 0.85 },
    { url: `${SITE}/ko/blog`, lastModified: updated, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/th/blog`, lastModified: updated, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/community`, lastModified: updated, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE}/community/pantip`, lastModified: updated, changeFrequency: "weekly", priority: 0.55 },
    { url: `${SITE}/community/naver`, lastModified: updated, changeFrequency: "weekly", priority: 0.55 },
    { url: `${SITE}/community/youtube`, lastModified: updated, changeFrequency: "weekly", priority: 0.55 },
    { url: `${SITE}/community/cafe`, lastModified: updated, changeFrequency: "weekly", priority: 0.5 },
    { url: `${SITE}/community/reddit`, lastModified: updated, changeFrequency: "weekly", priority: 0.5 },
  ];

  for (const p of POSTS) {
    items.push({ url: `${SITE}/blog/${p.slug}`, lastModified: new Date(p.updated ?? p.published), changeFrequency: "monthly", priority: 0.8 });
  }
  for (const p of POSTS_KO) {
    items.push({ url: `${SITE}/ko/blog/${p.slug}`, lastModified: new Date(p.updated ?? p.published), changeFrequency: "monthly", priority: 0.78 });
  }
  for (const p of POSTS_TH) {
    items.push({ url: `${SITE}/th/blog/${p.slug}`, lastModified: new Date(p.updated ?? p.published), changeFrequency: "monthly", priority: 0.78 });
  }

  for (const g of GUIDES) {
    items.push({ url: `${SITE}/guide/${g.slug}`, lastModified: new Date(g.updated), changeFrequency: "monthly", priority: 0.9 });
  }
  for (const g of GUIDES_KO) {
    items.push({ url: `${SITE}/ko/guide/${g.slug}`, lastModified: new Date(g.updated), changeFrequency: "monthly", priority: 0.85 });
  }
  for (const g of GUIDES_TH) {
    items.push({ url: `${SITE}/th/guide/${g.slug}`, lastModified: new Date(g.updated), changeFrequency: "monthly", priority: 0.85 });
  }

  // Was a second hand-written copy of the Thai city list, which drifted from
  // lib/thBuildSets.ts. One source now: whatever /th/city/[name] actually builds.
  for (const c of cities) {
    items.push({ url: `${SITE}/city/${c}`, lastModified: updated, changeFrequency: "daily", priority: 0.85 });
    items.push({ url: `${SITE}/ko/city/${c}`, lastModified: updated, changeFrequency: "daily", priority: 0.8 });
    if (TH_CITY_VALID.has(c)) {
      items.push({ url: `${SITE}/th/city/${c}`, lastModified: updated, changeFrequency: "daily", priority: 0.8 });
    }
  }

  for (const c of CATEGORIES) {
    items.push({ url: `${SITE}/c/${c}`, lastModified: updated, changeFrequency: "daily", priority: 0.9 });
    items.push({ url: `${SITE}/ko/c/${c}`, lastModified: updated, changeFrequency: "daily", priority: 0.85 });
  }
  // 태국어 카테고리 — /th/c/[cuisine] 가 실제로 빌드하는 목록과 동일 소스.
  for (const c of TH_CATEGORY_VALID) {
    items.push({ url: `${SITE}/th/c/${c}`, lastModified: updated, changeFrequency: "daily", priority: 0.85 });
  }

  items.push({ url: `${SITE}/best`, lastModified: updated, changeFrequency: "weekly", priority: 0.9 });
  for (const c of BEST_FOR) {
    items.push({ url: `${SITE}/best/${c.slug}`, lastModified: updated, changeFrequency: "daily", priority: 0.85 });
  }

  // Industrial estate index + 페이지별 — DBD-verified 차별화 surface
  items.push({ url: `${SITE}/estate`, lastModified: updated, changeFrequency: "weekly", priority: 0.85 });
  const estateSlugs = new Set<string>();
  for (const s of db.suppliers) if (s.estate_slug) estateSlugs.add(s.estate_slug);
  for (const slug of estateSlugs) {
    items.push({ url: `${SITE}/estate/${slug}`, lastModified: updated, changeFrequency: "weekly", priority: 0.8 });
  }

  // 디스트릭트 — canonical (Mueang/Muang 등 병합, supplier 5+ 만). page.tsx 와 동일 소스.
  for (const g of districtsForBuild(db)) {
    items.push({ url: `${SITE}/d/${g.slug}`, lastModified: updated, changeFrequency: "weekly", priority: 0.7 });
    // (canonical district × category) 중 supplier 7+ 만 — page.tsx generateStaticParams 와 일치.
    const catCounts = new Map<string, number>();
    for (const s of suppliersInDistrict(db, g.slug)) {
      for (const cat of s.categories) {
        if (!CATEGORY_LABELS[cat]) continue; // route only prerenders known categories
        catCounts.set(cat, (catCounts.get(cat) ?? 0) + 1);
      }
    }
    for (const [cat, n] of catCounts) {
      if (n < 7) continue;
      items.push({ url: `${SITE}/c/${cat}/${g.slug}`, lastModified: updated, changeFrequency: "weekly", priority: 0.75 });
    }
  }

  // Supplier pages — quality-gated by lib/supplierTier.ts (A–C only).
  //
  // Every supplier is still built as a static page; the gate only decides what we
  // ask Google to crawl. Two earlier gates both collapsed into no-ops — first
  // "phone OR website OR verified OR score>=8" (a later dead-lead pass on
  // master_db meant every survivor cleared it), then "dbd OR verified OR website
  // OR scraped_review_count>0", which still let 6,233 of 9,056 through because
  // `website` alone qualifies 3,873 of them.
  //
  // Search Console on 2026-08-13: ~1,600 indexed, 6,989 discovered-but-not-
  // indexed and climbing. Submitting 4x what Google will crawl doesn't get more
  // pages indexed, it just puts the category and city pages behind a queue of
  // Maps mirrors. supplierTier() draws the line at "has something Maps doesn't".
  for (const r of db.suppliers) {
    if (!inSitemap(r)) continue;
    const score = r.b2b_score ?? r.trust_score ?? 0;
    items.push({
      url: `${SITE}/supplier/${r.id}`,
      lastModified: updated,
      changeFrequency: "weekly",
      priority: r.verified ? 0.85 : (score >= 8 ? 0.65 : 0.55),
    });
  }

  return items;
}
