import type { MetadataRoute } from "next";
import { loadMasterDb } from "@/lib/data";
import { BEST_FOR } from "@/lib/bestFor";
import { CUISINE_LABELS } from "@/lib/types";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://bkkrestaurants.example";
const CUISINES = Object.keys(CUISINE_LABELS);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const db = await loadMasterDb();
  const districts = Array.from(new Set(
    Object.keys(db.district_counts).map((k) => k.split("/")[1])
  ));
  const cities = Object.keys(db.city_counts);
  const updated = new Date(db.generated_at);

  const items: MetadataRoute.Sitemap = [
    { url: SITE, lastModified: updated, changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE}/th`, lastModified: updated, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE}/ko`, lastModified: updated, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE}/about`, lastModified: updated, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE}/contact`, lastModified: updated, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE}/for-restaurants`, lastModified: updated, changeFrequency: "monthly", priority: 0.7 },
  ];

  for (const c of cities) {
    items.push({ url: `${SITE}/city/${c}`, lastModified: updated, changeFrequency: "daily", priority: 0.85 });
  }

  for (const c of CUISINES) {
    items.push({ url: `${SITE}/c/${c}`, lastModified: updated, changeFrequency: "daily", priority: 0.9 });
  }

  for (const c of BEST_FOR) {
    items.push({ url: `${SITE}/best/${c.slug}`, lastModified: updated, changeFrequency: "daily", priority: 0.85 });
  }

  for (const d of districts) {
    const slug = d.toLowerCase().replace(/\s+/g, "-");
    items.push({ url: `${SITE}/d/${slug}`, lastModified: updated, changeFrequency: "weekly", priority: 0.7 });
    for (const c of CUISINES) {
      items.push({ url: `${SITE}/c/${c}/${slug}`, lastModified: updated, changeFrequency: "weekly", priority: 0.8 });
    }
  }

  for (const r of db.restaurants) {
    items.push({
      url: `${SITE}/course/${r.id}`,
      lastModified: updated,
      changeFrequency: "weekly",
      priority: r.trust_score >= 70 ? 0.8 : r.trust_score >= 50 ? 0.6 : 0.4,
    });
  }

  return items;
}
