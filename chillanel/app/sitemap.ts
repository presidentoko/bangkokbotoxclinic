import type { MetadataRoute } from "next";
import { SITE, SUPPORTED_LANGS } from "@/lib/site";
import { listCities, loadCity, getAllPlaces } from "@/lib/data";
import { allThemeAndMoodLabels, isMoodLabel } from "@/lib/theme-stats";
import { listGuides } from "@/lib/guides";
import { slugifyTheme } from "@/lib/theme-labels";
import { allDistricts, slugifyDistrict } from "@/lib/district-labels";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // Google mostly ignores changeFrequency/priority but does use lastModified
  // for crawl scheduling — CityData.generatedAt (set at build-data.mjs time)
  // was already available and simply wasn't being passed through.
  const cityDates = new Map(listCities().map((city) => [city, new Date(loadCity(city).generatedAt)]));

  for (const lang of SUPPORTED_LANGS) {
    entries.push({ url: `${SITE.origin}/${lang}`, changeFrequency: "weekly", priority: 1 });
    entries.push({ url: `${SITE.origin}/${lang}/about`, changeFrequency: "monthly", priority: 0.3 });
    entries.push({ url: `${SITE.origin}/${lang}/guide`, changeFrequency: "monthly", priority: 0.5 });
    entries.push({ url: `${SITE.origin}/${lang}/city`, changeFrequency: "weekly", priority: 0.6 });

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
    // No `lastModified` on the per-place/service/district entries below:
    // cityDates/latestCityDate are the data pipeline's *rebuild* timestamp,
    // which advances on every deploy regardless of whether that specific
    // place actually changed -- Google explicitly warns against a lastmod
    // that doesn't reflect a real per-URL change, since it teaches crawlers
    // to stop trusting the field. The city entries above keep it: a city
    // page's own content (its place listing) does legitimately change
    // whenever any place in it is added/updated, so a city-level rebuild
    // date is an honest signal there in a way it isn't for 7,800 individual
    // place URLs.
    for (const { place } of getAllPlaces()) {
      entries.push({
        url: `${SITE.origin}/${lang}/place/${place.id}`,
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }

    // Mood-keyword pages ("Clean", "Good value", ...) are noindex'd in
    // service/[theme]/page.tsx as thin/duplicate content -- excluded here
    // too so the sitemap doesn't advertise URLs the page itself tells
    // Google not to index.
    const serviceLabels = allThemeAndMoodLabels(getAllPlaces().map(({ place }) => place)).filter(
      (label) => !isMoodLabel(label)
    );
    for (const label of serviceLabels) {
      entries.push({
        url: `${SITE.origin}/${lang}/service/${slugifyTheme(label)}`,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }

    const districts = allDistricts(getAllPlaces().map(({ place }) => place));
    for (const d of districts) {
      entries.push({
        url: `${SITE.origin}/${lang}/district/${slugifyDistrict(d)}`,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  return entries;
}
