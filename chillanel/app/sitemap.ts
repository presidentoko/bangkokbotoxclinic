import type { MetadataRoute } from "next";
import { SITE, SUPPORTED_LANGS } from "@/lib/site";
import { listCities, getAllPlaces } from "@/lib/data";
import { listGuides } from "@/lib/guides";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const lang of SUPPORTED_LANGS) {
    entries.push({ url: `${SITE.origin}/${lang}`, changeFrequency: "weekly", priority: 1 });
    entries.push({ url: `${SITE.origin}/${lang}/about`, changeFrequency: "monthly", priority: 0.3 });
    entries.push({ url: `${SITE.origin}/${lang}/guide`, changeFrequency: "monthly", priority: 0.5 });

    for (const city of listCities()) {
      entries.push({ url: `${SITE.origin}/${lang}/city/${city}`, changeFrequency: "weekly", priority: 0.8 });
    }
    for (const guide of listGuides()) {
      entries.push({ url: `${SITE.origin}/${lang}/guide/${guide.slug}`, changeFrequency: "monthly", priority: 0.4 });
    }
    for (const { place } of getAllPlaces()) {
      entries.push({ url: `${SITE.origin}/${lang}/place/${place.id}`, changeFrequency: "weekly", priority: 0.6 });
    }
  }

  return entries;
}
