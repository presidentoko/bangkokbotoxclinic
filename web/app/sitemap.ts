import type { MetadataRoute } from "next";
import { loadMasterDb, getAllDoctors } from "@/lib/data";
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

  // Doctor pages (Sprint 3) — individual specialist profiles + city/specialty filters
  items.push({ url: `${SITE}/doctors`, lastModified: updated, changeFrequency: "daily", priority: 0.85 });
  for (const cityLabel of cities) {
    const slug = cityLabel.toLowerCase().replace(/\s+/g, "-");
    items.push({
      url: `${SITE}/doctors/c/${slug}`,
      lastModified: updated, changeFrequency: "weekly", priority: 0.8,
    });
  }
  for (const s of SERVICES) {
    items.push({
      url: `${SITE}/doctors/s/${s}`,
      lastModified: updated, changeFrequency: "weekly", priority: 0.8,
    });
  }
  const allDoctors = getAllDoctors(db.clinics);
  for (const d of allDoctors) {
    items.push({
      url: `${SITE}/doctor/${d.composite_slug}`,
      lastModified: updated,
      changeFrequency: "weekly",
      priority: d.mentions >= 5 ? 0.75 : 0.55,
    });
  }

  // District-only doctor pages
  const doctorDistricts = new Set<string>();
  for (const d of allDoctors) if (d.clinic.district) doctorDistricts.add(d.clinic.district);
  for (const dist of doctorDistricts) {
    const slug = dist.toLowerCase().replace(/\s+/g, "-");
    items.push({
      url: `${SITE}/doctors/d/${slug}`,
      lastModified: updated, changeFrequency: "weekly", priority: 0.75,
    });
  }

  // District × specialty long-tail pages (≥3 doctors per combo)
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
      lastModified: updated, changeFrequency: "weekly",
      priority: n >= 10 ? 0.85 : 0.7,
    });
  }

  return items;
}
