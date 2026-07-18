import { loadMasterDb, filterByCuisine, filterByDistrict } from "@/lib/data";
import { BEST_FOR } from "@/lib/bestFor";
import { CUISINE_LABELS } from "@/lib/types";
import { GUIDES } from "@/lib/guides";
import { loadAllSlugs } from "@/lib/famous-vs-good";

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

  // /c/[cuisine]/[district] pages notFound() when a cuisine has zero
  // restaurants in a given district — submit only combos with a real match.
  const cuisineRestaurants = new Map(CUISINES.map((c) => [c, filterByCuisine(db.restaurants, c)]));
  for (const d of districts) {
    const slug = d.toLowerCase().replace(/\s+/g, "-");
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
    items.push({
      url: `${SITE}/restaurant/${r.id}`,
      lastModified: updated,
      changeFrequency: "weekly",
      priority: r.trust_score >= 70 ? 0.8 : r.trust_score >= 50 ? 0.6 : 0.4,
    });
  }

  return new Response(xmlFor(items), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
