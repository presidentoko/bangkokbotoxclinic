import type { MetadataRoute } from "next";
import { loadMasterDb } from "@/lib/data";
import { getSlugMap, restaurantUrl } from "@/lib/restaurants";
import { BEST_FOR } from "@/lib/bestFor";
import { CUISINE_LABELS } from "@/lib/types";
import { GUIDES } from "@/lib/guides";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thaigle.com";
const CUISINES = Object.keys(CUISINE_LABELS);

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [db, slugMap] = await Promise.all([loadMasterDb(), getSlugMap()]);
  const cities = Object.keys(db.city_counts);
  const updated = new Date(db.generated_at);

  const items: MetadataRoute.Sitemap = [
    { url: SITE, lastModified: updated, changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE}/th`, lastModified: updated, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE}/ko`, lastModified: updated, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE}/about`, lastModified: updated, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE}/contact`, lastModified: updated, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE}/for-restaurants`, lastModified: updated, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE}/guide`, lastModified: updated, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/restaurants`, lastModified: updated, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE}/clinics`, lastModified: updated, changeFrequency: "weekly", priority: 0.85 },
    { url: `${SITE}/dental`, lastModified: updated, changeFrequency: "weekly", priority: 0.85 },
    { url: `${SITE}/plan`, lastModified: updated, changeFrequency: "monthly", priority: 0.7 },
  ];

  for (const g of GUIDES) {
    items.push({ url: `${SITE}/guide/${g.slug}`, lastModified: new Date(g.updated), changeFrequency: "monthly", priority: 0.85 });
  }

  for (const c of cities) {
    items.push({ url: `${SITE}/restaurants/${c}`, lastModified: updated, changeFrequency: "daily", priority: 0.85 });
    items.push({ url: `${SITE}/restaurants/${c}/hidden-gems`, lastModified: updated, changeFrequency: "weekly", priority: 0.8 });
    items.push({ url: `${SITE}/restaurants/${c}/tourist-traps`, lastModified: updated, changeFrequency: "weekly", priority: 0.8 });
    items.push({ url: `${SITE}/restaurants/${c}/instagram-famous-vs-actually-good`, lastModified: updated, changeFrequency: "weekly", priority: 0.8 });
  }

  for (const c of CUISINES) {
    items.push({ url: `${SITE}/restaurants/cuisine/${c}`, lastModified: updated, changeFrequency: "daily", priority: 0.9 });
  }

  for (const bf of BEST_FOR) {
    items.push({ url: `${SITE}/best/${bf.slug}`, lastModified: updated, changeFrequency: "daily", priority: 0.85 });
  }

  const districtSet = new Set<string>();
  for (const r of db.restaurants) {
    if (r.district) {
      const key = `${r.city}/${r.district.toLowerCase().replace(/\s+/g, "-")}`;
      if (!districtSet.has(key)) {
        districtSet.add(key);
        items.push({
          url: `${SITE}/restaurants/${r.city}/${r.district.toLowerCase().replace(/\s+/g, "-")}`,
          lastModified: updated,
          changeFrequency: "weekly",
          priority: 0.7,
        });
      }
    }
  }

  for (const [id, entry] of Object.entries(slugMap)) {
    const r = db.restaurants.find((x) => x.id === id);
    items.push({
      url: `${SITE}${restaurantUrl(entry)}`,
      lastModified: updated,
      changeFrequency: "weekly",
      priority: r && r.trust_score >= 70 ? 0.8 : r && r.trust_score >= 50 ? 0.6 : 0.4,
    });
  }

  return items;
}
