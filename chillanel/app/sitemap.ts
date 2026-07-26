import type { MetadataRoute } from "next";
import { SITE, SUPPORTED_LANGS } from "@/lib/site";
import { listCities, loadCity, getAllPlaces } from "@/lib/data";
import { allThemeAndMoodLabels } from "@/lib/theme-stats";
import { listGuides } from "@/lib/guides";
import { slugifyTheme } from "@/lib/theme-labels";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // Google mostly ignores changeFrequency/priority but does use lastModified
  // for crawl scheduling — CityData.generatedAt (set at build-data.mjs time)
  // was already available and simply wasn't being passed through.
  const cityDates = new Map(listCities().map((city) => [city, new Date(loadCity(city).generatedAt)]));
  const latestCityDate = [...cityDates.values()].reduce(
    (latest, d) => (d > latest ? d : latest),
    new Date(0)
  );

  for (const lang of SUPPORTED_LANGS) {
    entries.push({ url: `${SITE.origin}/${lang}`, changeFrequency: "weekly", priority: 1 });
    entries.push({ url: `${SITE.origin}/${lang}/about`, changeFrequency: "monthly", priority: 0.3 });
    entries.push({ url: `${SITE.origin}/${lang}/guide`, changeFrequency: "monthly", priority: 0.5 });

    for (const city of listCities()) {
      entries.push({
        url: `${SITE.origin}/${lang}/city/${city}`,
        lastModified: cityDates.get(city),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
    for (const guide of listGuides()) {
      entries.push({ url: `${SITE.origin}/${lang}/guide/${guide.slug}`, changeFrequency: "monthly", priority: 0.4 });
    }
    for (const { city, place } of getAllPlaces()) {
      entries.push({
        url: `${SITE.origin}/${lang}/place/${place.id}`,
        lastModified: cityDates.get(city),
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }

    const serviceLabels = allThemeAndMoodLabels(getAllPlaces().map(({ place }) => place));
    for (const label of serviceLabels) {
      entries.push({
        url: `${SITE.origin}/${lang}/service/${slugifyTheme(label)}`,
        lastModified: latestCityDate,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  return entries;
}
