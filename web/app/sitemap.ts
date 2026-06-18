import type { MetadataRoute } from "next";
import { loadMasterDb, getAllDoctors } from "@/lib/data";
import { BEST_FOR } from "@/lib/bestFor";
import { GUIDES } from "@/lib/guides";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://bangkokbotoxclinic.com";
const SERVICES = ["botox", "filler", "hifu", "facial", "laser", "dental", "hair_transplant", "eye"];

// /sitemap.xml — hubs + top 200 priority clinics.
// /sitemap-clinics.xml (route handler) — remaining clinic pages.
// /sitemap-index.xml (route handler) — index pointing to both.
// robots.ts → /sitemap-index.xml

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const db = await loadMasterDb();
  const updated = new Date(db.generated_at);

  const districts = Object.keys(db.district_counts);
  const cities = Object.keys(db.city_counts ?? {});
  const allDoctors = getAllDoctors(db.clinics);

  const items: MetadataRoute.Sitemap = [
    { url: SITE, lastModified: updated, changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE}/th`, lastModified: updated, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE}/ko`, lastModified: updated, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE}/about`, lastModified: updated, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE}/contact`, lastModified: updated, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE}/for-clinics`, lastModified: updated, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE}/guide`, lastModified: updated, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/doctors`, lastModified: updated, changeFrequency: "daily", priority: 0.85 },
  ];

  for (const g of GUIDES) {
    items.push({ url: `${SITE}/guide/${g.slug}`, lastModified: new Date(g.updated), changeFrequency: "monthly", priority: 0.85 });
  }
  for (const s of SERVICES) {
    items.push({ url: `${SITE}/c/${s}`, lastModified: updated, changeFrequency: "daily", priority: 0.9 });
  }
  for (const c of BEST_FOR) {
    items.push({ url: `${SITE}/best/${c.slug}`, lastModified: updated, changeFrequency: "daily", priority: 0.85 });
  }
  for (const cityLabel of cities) {
    const clinic = db.clinics.find((c) => c.city_label === cityLabel);
    const slug = clinic?.city_slug ?? cityLabel.toLowerCase().replace(/\s+/g, "-");
    items.push({ url: `${SITE}/city/${slug}`, lastModified: updated, changeFrequency: "daily", priority: 0.9 });
  }
  for (const [d, count] of Object.entries(db.district_counts)) {
    if ((count as number) < 5) continue;
    const slug = d.toLowerCase().replace(/\s+/g, "-");
    items.push({ url: `${SITE}/d/${slug}`, lastModified: updated, changeFrequency: "weekly", priority: 0.7 });
    for (const s of SERVICES) {
      const comboCount = db.clinics.filter(
        (c) =>
          (c.district || "").toLowerCase().replace(/\s+/g, "-") === slug &&
          (c.categories || []).includes(s),
      ).length;
      if (comboCount < 3) continue;
      items.push({ url: `${SITE}/c/${s}/${slug}`, lastModified: updated, changeFrequency: "weekly", priority: 0.8 });
    }
  }

  // Doctor pages
  for (const cityLabel of cities) {
    const slug = cityLabel.toLowerCase().replace(/\s+/g, "-");
    items.push({ url: `${SITE}/doctors/c/${slug}`, lastModified: updated, changeFrequency: "weekly", priority: 0.8 });
  }
  for (const s of SERVICES) {
    items.push({ url: `${SITE}/doctors/s/${s}`, lastModified: updated, changeFrequency: "weekly", priority: 0.8 });
  }
  for (const d of allDoctors) {
    items.push({
      url: `${SITE}/doctor/${d.composite_slug}`,
      lastModified: updated,
      changeFrequency: "weekly",
      priority: d.mentions >= 5 ? 0.75 : 0.55,
    });
  }
  const doctorDistricts = new Set<string>();
  for (const d of allDoctors) if (d.clinic.district) doctorDistricts.add(d.clinic.district);
  for (const dist of doctorDistricts) {
    const slug = dist.toLowerCase().replace(/\s+/g, "-");
    items.push({ url: `${SITE}/doctors/d/${slug}`, lastModified: updated, changeFrequency: "weekly", priority: 0.75 });
  }
  const combos = new Map<string, number>();
  for (const d of allDoctors) {
    if (!d.clinic.district) continue;
    for (const cat of d.clinic.categories) {
      if (!SERVICES.includes(cat)) continue;
      const key = `${d.clinic.district}|${cat}`;
      combos.set(key, (combos.get(key) || 0) + 1);
    }
  }
  for (const [key, n] of combos) {
    if (n < 3) continue;
    const [dist, cat] = key.split("|");
    const slug = dist.toLowerCase().replace(/\s+/g, "-");
    items.push({
      url: `${SITE}/doctors/d/${slug}/${cat}`,
      lastModified: updated,
      changeFrequency: "weekly",
      priority: n >= 10 ? 0.85 : 0.7,
    });
  }

  void districts; // reserved for future district-only sitemap

  return items;
}
