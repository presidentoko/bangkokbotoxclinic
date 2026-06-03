import type { MetadataRoute } from "next";
import { loadClinics } from "@/lib/data";
import { SUPPORTED_LANGS } from "@/lib/i18n";
import { GUIDES } from "@/lib/guides";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thaifacialclinic.com";
const PROCEDURES = ["fue", "dhi", "fut", "prp", "smp", "stem-cell", "eyebrow", "beard", "scalp-care"];

export default function sitemap(): MetadataRoute.Sitemap {
  const { clinics, generated_at } = loadClinics();
  const updated = new Date(generated_at || Date.now());

  const items: MetadataRoute.Sitemap = [
    { url: SITE, lastModified: updated, changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE}/for-clinics`, lastModified: updated, changeFrequency: "monthly", priority: 0.7 },
  ];

  for (const lang of SUPPORTED_LANGS) {
    items.push({ url: `${SITE}/${lang}`, lastModified: updated, changeFrequency: "daily", priority: 0.9 });
    for (const p of PROCEDURES) {
      items.push({ url: `${SITE}/${lang}/c/${p}`, lastModified: updated, changeFrequency: "weekly", priority: 0.8 });
    }
    for (const g of GUIDES) {
      items.push({ url: `${SITE}/${lang}/guide/${g.slug}`, lastModified: updated, changeFrequency: "weekly", priority: 0.7 });
    }
  }

  // English clinic pages priority 0.9, other langs 0.7 (avoid duplicate-content dilution)
  for (const c of clinics) {
    if (!c.is_hair_relevant) continue;
    items.push({ url: `${SITE}/en/clinic/${c.slug}`, lastModified: updated, changeFrequency: "weekly", priority: 0.9 });
    for (const lang of SUPPORTED_LANGS) {
      if (lang === "en") continue;
      items.push({ url: `${SITE}/${lang}/clinic/${c.slug}`, lastModified: updated, changeFrequency: "weekly", priority: 0.6 });
    }
  }

  return items;
}
