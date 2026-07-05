import type { MetadataRoute } from "next";
import { loadMasterDb, filterByCuisine, filterByDistrict } from "@/lib/data";
import { BEST_FOR } from "@/lib/bestFor";
import { CUISINE_LABELS } from "@/lib/types";
import { GUIDES } from "@/lib/guides";
import { loadAllSlugs } from "@/lib/famous-vs-good";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.snsstopper.com";
const CUISINES = Object.keys(CUISINE_LABELS);

export const dynamic = "force-static";

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
    { url: `${SITE}/guide`, lastModified: updated, changeFrequency: "weekly", priority: 0.8 },
  ];

  for (const g of GUIDES) {
    items.push({ url: `${SITE}/guide/${g.slug}`, lastModified: new Date(g.updated), changeFrequency: "monthly", priority: 0.85 });
  }

  // famous-vs-good index
  items.push({ url: `${SITE}/famous-vs-good`, lastModified: updated, changeFrequency: "weekly", priority: 0.9 });
  // famous-vs-good slugs
  const fvgSlugs = await loadAllSlugs();
  for (const slug of fvgSlugs) {
    items.push({ url: `${SITE}/famous-vs-good/${slug}`, lastModified: updated, changeFrequency: "weekly", priority: 0.9 });
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

  // /c/[cuisine]/[district] pages render a 200 "no restaurants matched"
  // empty state (not notFound()) when a cuisine has zero restaurants in a
  // given district, so submit only combos with a real match — a naive
  // cuisine x district cartesian product here soft-404s ~23% of the time.
  const cuisineRestaurants = new Map(CUISINES.map((c) => [c, filterByCuisine(db.restaurants, c)]));
  for (const d of districts) {
    const slug = d.toLowerCase().replace(/\s+/g, "-");
    items.push({ url: `${SITE}/d/${slug}`, lastModified: updated, changeFrequency: "weekly", priority: 0.7 });
    for (const c of CUISINES) {
      const matches = filterByDistrict(cuisineRestaurants.get(c)!, d);
      if (matches.length === 0) continue;
      items.push({ url: `${SITE}/c/${c}/${slug}`, lastModified: updated, changeFrequency: "weekly", priority: 0.8 });
    }
  }

  for (const r of db.restaurants) {
    items.push({
      url: `${SITE}/restaurant/${r.id}`,
      lastModified: updated,
      changeFrequency: "weekly",
      priority: r.trust_score >= 70 ? 0.8 : r.trust_score >= 50 ? 0.6 : 0.4,
    });
  }

  return items;
}
