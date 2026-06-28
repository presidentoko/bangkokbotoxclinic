import type { MetadataRoute } from "next";
import { loadMasterDb } from "@/lib/data";
import { getSlugMap, restaurantUrl } from "@/lib/restaurants";
import { BEST_FOR } from "@/lib/bestFor";
import { CUISINE_LABELS } from "@/lib/types";
import { GUIDES } from "@/lib/guides";
import { NICHES, loadNicheDb, topNichePlaces } from "@/lib/niches";
import type { NicheSlug } from "@/lib/niches";
import { allDayPlanParams, AREA_DEFS, THEME_DEFS } from "@/lib/day-plans";
import type { AreaSlug, ThemeSlug } from "@/lib/day-plans";
import { OCCASIONS } from "@/lib/occasions";

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
    { url: `${SITE}/en`, lastModified: updated, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE}/ko`, lastModified: updated, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE}/ja`, lastModified: updated, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE}/ru`, lastModified: updated, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE}/ar`, lastModified: updated, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE}/about`, lastModified: updated, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE}/contact`, lastModified: updated, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE}/terms`, lastModified: updated, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE}/takedown`, lastModified: updated, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE}/for-restaurants`, lastModified: updated, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE}/guide`, lastModified: updated, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/restaurants`, lastModified: updated, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE}/clinics`, lastModified: updated, changeFrequency: "weekly", priority: 0.85 },
    { url: `${SITE}/dental`, lastModified: updated, changeFrequency: "weekly", priority: 0.85 },
    { url: `${SITE}/activities`, lastModified: updated, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE}/plan`, lastModified: updated, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE}/quiz`, lastModified: updated, changeFrequency: "monthly", priority: 0.85 },
    { url: `${SITE}/bingo`, lastModified: updated, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE}/my-trip`, lastModified: updated, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE}/local-tips`, lastModified: updated, changeFrequency: "monthly", priority: 0.82 },
    { url: `${SITE}/for`, lastModified: updated, changeFrequency: "weekly", priority: 0.85 },
    { url: `${SITE}/trending`, lastModified: updated, changeFrequency: "daily", priority: 0.88 },
    ...OCCASIONS.map((o) => ({
      url: `${SITE}/for/${o.slug}`,
      lastModified: updated,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];

  // Place verification pages — all 1,647 real places × 3 langs
  const { getAllPlaceSlugs } = await import("@/lib/places");
  const placeSlugs = getAllPlaceSlugs();
  items.push(
    ...placeSlugs.map(({ lang, slug }) => ({
      url: `${SITE}/${lang}/place/${slug}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly" as const,
      priority: 0.75,
    }))
  );

  const nicheDbs = await Promise.all(
    NICHES.map(async (n) => ({ slug: n.slug, places: topNichePlaces((await loadNicheDb(n.slug as NicheSlug)).places, 80) }))
  );
  items.push({
    url: `${SITE}/activities/first-time-bangkok`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly" as const,
    priority: 0.85,
  });
  items.push({
    url: `${SITE}/activities/halal`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  });
  items.push({
    url: `${SITE}/activities/digital-nomad`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  });
  items.push({
    url: `${SITE}/activities/couples`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  });
  items.push({
    url: `${SITE}/activities/budget`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  });
  items.push({
    url: `${SITE}/activities/wellness-week`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  });
  items.push({
    url: `${SITE}/activities/weekend-in-bangkok`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly" as const,
    priority: 0.85,
  });
  items.push({
    url: `${SITE}/activities/prices-bangkok-2026`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  });
  items.push({
    url: `${SITE}/activities/sukhumvit`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  });
  items.push({
    url: `${SITE}/activities/silom`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  });
  for (const n of NICHES) {
    items.push({ url: `${SITE}/activities/${n.slug}`, lastModified: updated, changeFrequency: "weekly", priority: 0.88 });
  }
  // Top-10 article pages per niche
  for (const n of NICHES) {
    items.push({
      url: `${SITE}/activities/${n.slug}/top-10`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    });
  }
  for (const nd of nicheDbs) {
    for (const p of nd.places) {
      items.push({ url: `${SITE}/activities/${nd.slug}/${p.slug}`, lastModified: updated, changeFrequency: "weekly", priority: 0.75 });
    }
  }

  for (const g of GUIDES) {
    items.push({ url: `${SITE}/guide/${g.slug}`, lastModified: new Date(g.updated), changeFrequency: "monthly", priority: 0.85 });
  }

  const compareUrls = [
    "thai-massage-vs-oil-massage",
    "muay-thai-vs-boxing",
    "yoga-vs-pilates-bangkok",
  ].map((slug) => ({
    url: `${SITE}/activities/compare/${slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
  for (const cu of compareUrls) {
    items.push(cu);
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

  // Day-plan programmatic pages (C1/C2)
  items.push({ url: `${SITE}/day-plan`, lastModified: updated, changeFrequency: "weekly", priority: 0.9 });
  for (const area of Object.keys(AREA_DEFS) as AreaSlug[]) {
    items.push({ url: `${SITE}/day-plan/hub/${area}`, lastModified: updated, changeFrequency: "weekly", priority: 0.8 });
  }
  for (const theme of Object.keys(THEME_DEFS) as ThemeSlug[]) {
    items.push({ url: `${SITE}/day-plan/hub/theme/${theme}`, lastModified: updated, changeFrequency: "weekly", priority: 0.8 });
  }
  for (const { area, theme } of allDayPlanParams()) {
    items.push({ url: `${SITE}/day-plan/${area}/${theme}`, lastModified: updated, changeFrequency: "weekly", priority: 0.75 });
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
