import type { MetadataRoute } from "next";
import { loadMasterDb } from "@/lib/data";
import { BEST_FOR } from "@/lib/bestFor";
import { CATEGORY_LABELS } from "@/lib/types";
import { GUIDES } from "@/lib/guides";
import { GUIDES_KO } from "@/lib/guides_ko";
import { GUIDES_TH } from "@/lib/guides_th";
import { POSTS } from "@/lib/posts";
import { POSTS_KO } from "@/lib/posts_ko";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thaisupplyhub.com";
const CATEGORIES = Object.keys(CATEGORY_LABELS);

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const db = await loadMasterDb();
  const districts = Array.from(new Set(
    Object.keys(db.district_counts).map((k) => k.split("/")[1]).filter(Boolean)
  ));
  const cities = Object.keys(db.city_counts).map((k) => k.toLowerCase().replace(/\s+/g, "_"));
  const updated = new Date(db.generated_at);

  const items: MetadataRoute.Sitemap = [
    { url: SITE, lastModified: updated, changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE}/ko`, lastModified: updated, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE}/th`, lastModified: updated, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE}/about`, lastModified: updated, changeFrequency: "monthly", priority: 0.6 },
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
  ];

  for (const p of POSTS) {
    items.push({ url: `${SITE}/blog/${p.slug}`, lastModified: new Date(p.updated ?? p.published), changeFrequency: "monthly", priority: 0.8 });
  }
  for (const p of POSTS_KO) {
    items.push({ url: `${SITE}/ko/blog/${p.slug}`, lastModified: new Date(p.updated ?? p.published), changeFrequency: "monthly", priority: 0.78 });
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

  const TH_CITY_CORE = new Set(["chon_buri", "rayong", "pathum_thani", "samut_sakhon", "samut_prakan", "bangkok", "phra_nakhon_si_ayutthaya", "songkhla"]);
  for (const c of cities) {
    items.push({ url: `${SITE}/city/${c}`, lastModified: updated, changeFrequency: "daily", priority: 0.85 });
    items.push({ url: `${SITE}/ko/city/${c}`, lastModified: updated, changeFrequency: "daily", priority: 0.8 });
    if (TH_CITY_CORE.has(c)) {
      items.push({ url: `${SITE}/th/city/${c}`, lastModified: updated, changeFrequency: "daily", priority: 0.8 });
    }
  }

  for (const c of CATEGORIES) {
    items.push({ url: `${SITE}/c/${c}`, lastModified: updated, changeFrequency: "daily", priority: 0.9 });
    items.push({ url: `${SITE}/ko/c/${c}`, lastModified: updated, changeFrequency: "daily", priority: 0.85 });
  }
  // 태국어 카테고리 — 핵심 7개만
  for (const c of ["manufacturer", "auto_parts", "industrial_estate", "warehouse", "logistics", "packaging", "food_mfg"]) {
    items.push({ url: `${SITE}/th/c/${c}`, lastModified: updated, changeFrequency: "daily", priority: 0.85 });
  }

  for (const c of BEST_FOR) {
    items.push({ url: `${SITE}/best/${c.slug}`, lastModified: updated, changeFrequency: "daily", priority: 0.85 });
  }

  // 디스트릭트별 — supplier 5+ 있는 (cat × district) 만 (page.tsx 와 일치)
  const catDistrictCounts = new Map<string, number>();
  for (const s of db.suppliers) {
    if (!s.district) continue;
    const dSlug = s.district.toLowerCase().replace(/\s+/g, "-");
    for (const cat of s.categories) {
      const key = `${cat}|${dSlug}`;
      catDistrictCounts.set(key, (catDistrictCounts.get(key) ?? 0) + 1);
    }
  }
  for (const d of districts) {
    const slug = d.toLowerCase().replace(/\s+/g, "-");
    items.push({ url: `${SITE}/d/${slug}`, lastModified: updated, changeFrequency: "weekly", priority: 0.7 });
  }
  for (const [pair, n] of catDistrictCounts) {
    if (n < 7) continue;
    const [cat, slug] = pair.split("|");
    items.push({ url: `${SITE}/c/${cat}/${slug}`, lastModified: updated, changeFrequency: "weekly", priority: 0.75 });
  }

  // Supplier 페이지 — trust >= 55 만 (supplier/[id] generateStaticParams 와 일치)
  for (const r of db.suppliers) {
    if (r.trust_score < 55) continue;
    items.push({
      url: `${SITE}/supplier/${r.id}`,
      lastModified: updated,
      changeFrequency: "weekly",
      priority: r.trust_score >= 70 ? 0.8 : r.trust_score >= 50 ? 0.6 : 0.5,
    });
  }

  return items;
}
