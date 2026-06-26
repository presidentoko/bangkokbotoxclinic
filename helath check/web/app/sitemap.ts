import type { MetadataRoute } from "next";
import { LOCALES, CATEGORIES } from "@/lib/i18n";

const BASE = "https://www.bangkoktopclinic.com";

async function getHospitalSlugs(): Promise<string[]> {
  try {
    const { getAllHospitalSlugs } = await import("@/lib/db");
    return await getAllHospitalSlugs();
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getHospitalSlugs();
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    // Home
    entries.push({ url: `${BASE}/${locale}`, lastModified: now, changeFrequency: "weekly", priority: 1.0 });
    // Compare
    for (const cat of CATEGORIES) {
      entries.push({ url: `${BASE}/${locale}/compare?category=${cat}`, lastModified: now, changeFrequency: "weekly", priority: 0.9 });
    }
    // Hospitals
    entries.push({ url: `${BASE}/${locale}/hospital`, lastModified: now, changeFrequency: "weekly", priority: 0.7 });
    for (const slug of slugs) {
      entries.push({ url: `${BASE}/${locale}/hospital/${slug}`, lastModified: now, changeFrequency: "weekly", priority: 0.8 });
    }
    // Longtail
    for (const cat of CATEGORIES) {
      entries.push({ url: `${BASE}/${locale}/checkup/${cat}`, lastModified: now, changeFrequency: "weekly", priority: 0.7 });
      for (const slug of slugs) {
        entries.push({ url: `${BASE}/${locale}/checkup/${cat}/${slug}`, lastModified: now, changeFrequency: "weekly", priority: 0.6 });
      }
    }
    // Guides
    for (const guideSlug of ["bangkok-health-checkup", "jci-hospitals-bangkok", "what-is-included-checkup"]) {
      entries.push({ url: `${BASE}/${locale}/guide/${guideSlug}`, lastModified: now, changeFrequency: "monthly", priority: 0.5 });
    }
  }

  return entries;
}
