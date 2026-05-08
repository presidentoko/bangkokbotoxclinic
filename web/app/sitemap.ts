import type { MetadataRoute } from "next";
import { loadMasterDb } from "@/lib/data";
import { BEST_FOR } from "@/lib/bestFor";
import { GUIDES } from "@/lib/guides";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://bangkokbotoxclinic.com";
const SERVICES = ["botox", "filler", "hifu", "facial", "laser", "dental", "hair_transplant", "eye"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const db = await loadMasterDb();
  const districts = Object.keys(db.district_counts);
  const cities = Object.keys(db.city_counts ?? {});
  const updated = new Date(db.generated_at);

  const items: MetadataRoute.Sitemap = [
    { url: SITE, lastModified: updated, changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE}/th`, lastModified: updated, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE}/ko`, lastModified: updated, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE}/about`, lastModified: updated, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE}/contact`, lastModified: updated, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE}/for-clinics`, lastModified: updated, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE}/guide`, lastModified: updated, changeFrequency: "weekly", priority: 0.8 },
  ];

  for (const g of GUIDES) {
    items.push({ url: `${SITE}/guide/${g.slug}`, lastModified: new Date(g.updated), changeFrequency: "monthly", priority: 0.85 });
  }

  for (const s of SERVICES) {
    items.push({
      url: `${SITE}/c/${s}`,
      lastModified: updated,
      changeFrequency: "daily",
      priority: 0.9,
    });
  }

  for (const c of BEST_FOR) {
    items.push({
      url: `${SITE}/best/${c.slug}`,
      lastModified: updated,
      changeFrequency: "daily",
      priority: 0.85,
    });
  }

  // 도시 페이지 (멀티시티 — Bangkok + Pattaya + Phuket + ...)
  for (const cityLabel of cities) {
    const clinic = db.clinics.find((c) => c.city_label === cityLabel);
    const slug = clinic?.city_slug ?? cityLabel.toLowerCase().replace(/\s+/g, "-");
    items.push({
      url: `${SITE}/city/${slug}`,
      lastModified: updated,
      changeFrequency: "daily",
      priority: 0.9,
    });
  }

  for (const d of districts) {
    const slug = d.toLowerCase().replace(/\s+/g, "-");
    items.push({
      url: `${SITE}/d/${slug}`,
      lastModified: updated,
      changeFrequency: "weekly",
      priority: 0.7,
    });
    for (const s of SERVICES) {
      items.push({
        url: `${SITE}/c/${s}/${slug}`,
        lastModified: updated,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  }

  for (const c of db.clinics) {
    items.push({
      url: `${SITE}/clinic/${c.id}`,
      lastModified: updated,
      changeFrequency: "weekly",
      priority: c.trust_score >= 70 ? 0.8 : c.trust_score >= 50 ? 0.6 : 0.4,
    });
  }

  return items;
}
