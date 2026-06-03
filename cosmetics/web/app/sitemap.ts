import type { MetadataRoute } from "next";
import { CONCERNS, allProducts, productSlug, allIngredients, ingredientSlug } from "@/lib/data";
import { LOCALES } from "@/lib/i18n";

const BASE = "https://bangkokfillers.com";
const NOW = new Date();

type Freq = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

function entry(
  path: string,
  priority: number,
  changeFrequency: Freq = "weekly"
): MetadataRoute.Sitemap[number] {
  // hreflang alternates: every path is locale-prefixed, swap locale segment
  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    // replace first path segment (the locale) with l
    const segments = path.replace(BASE + "/", "").split("/");
    languages[l] = `${BASE}/${l}/${segments.slice(1).join("/")}`;
  }
  return { url: path, lastModified: NOW, changeFrequency, priority, alternates: { languages } };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const out: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    // Home
    out.push(entry(`${BASE}/${locale}`, 1.0, "daily"));

    // Concern hubs — highest crawl priority after home
    for (const concern of CONCERNS) {
      out.push(entry(`${BASE}/${locale}/${concern}`, 0.9, "daily"));
    }

    // Product pages
    for (const p of allProducts()) {
      out.push(entry(`${BASE}/${locale}/product/${productSlug(p)}`, 0.8, "weekly"));
    }

    // Ingredient pages
    for (const [inci] of allIngredients()) {
      out.push(entry(`${BASE}/${locale}/ingredient/${ingredientSlug(inci)}`, 0.7, "monthly"));
    }

    // Methodology
    out.push(entry(`${BASE}/${locale}/methodology`, 0.5, "monthly"));
  }

  return out;
}
