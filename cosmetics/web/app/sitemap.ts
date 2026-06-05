import type { MetadataRoute } from "next";
import { CONCERNS, allProducts, productSlug, allIngredients, ingredientSlug, allBrands, brandSlug, getRanking, getProduct, CONCERN_FILTER_SLUGS } from "@/lib/data";
import { LOCALES } from "@/lib/i18n";

const BASE = "https://bangkokfillers.com";
const NOW = new Date();

type Freq = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

function entry(
  path: string,
  priority: number,
  changeFrequency: Freq = "weekly"
): MetadataRoute.Sitemap[number] {
  const segments = path.replace(BASE + "/", "").split("/");
  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    languages[l] = `${BASE}/${l}/${segments.slice(1).join("/")}`;
  }
  // x-default points to /th (primary market)
  languages["x-default"] = languages["th"] ?? path;
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
      // Filter sub-pages
      for (const filter of CONCERN_FILTER_SLUGS[concern] ?? []) {
        out.push(entry(`${BASE}/${locale}/${concern}/${filter}`, 0.8, "weekly"));
      }
    }

    // Product pages
    for (const p of allProducts()) {
      out.push(entry(`${BASE}/${locale}/product/${productSlug(p)}`, 0.8, "weekly"));
    }

    // Ingredient pages
    for (const [inci] of allIngredients()) {
      out.push(entry(`${BASE}/${locale}/ingredient/${ingredientSlug(inci)}`, 0.7, "monthly"));
    }

    // Brand pages
    for (const b of allBrands()) {
      out.push(entry(`${BASE}/${locale}/brand/${brandSlug(b)}`, 0.75, "weekly"));
    }

    // Brand index
    out.push(entry(`${BASE}/${locale}/brand`, 0.8, "weekly"));

    // Quiz
    out.push(entry(`${BASE}/${locale}/quiz`, 0.7, "monthly"));

    // Media kit
    out.push(entry(`${BASE}/${locale}/media-kit`, 0.6, "monthly"));

    // Methodology
    out.push(entry(`${BASE}/${locale}/methodology`, 0.5, "monthly"));

    // Compare pages — top 3 pairs per concern
    const compareAdded = new Set<string>();
    for (const concern of CONCERNS) {
      const top = getRanking(concern).slice(0, 4);
      for (let i = 0; i < top.length - 1; i++) {
        const pA = getProduct(top[i].product_id);
        const pB = getProduct(top[i + 1].product_id);
        if (!pA || !pB) continue;
        const key = [top[i].product_id, top[i + 1].product_id].sort().join("~");
        if (compareAdded.has(key)) continue;
        compareAdded.add(key);
        const slugs = `${productSlug(pA)}-vs-${productSlug(pB)}`;
        out.push(entry(`${BASE}/${locale}/compare/${slugs}`, 0.65, "weekly"));
      }
    }
  }

  return out;
}
