import type { MetadataRoute } from "next";
import { CONCERNS, allProducts, productSlug, allIngredients, ingredientSlug } from "@/lib/data";
import { LOCALES } from "@/lib/i18n";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://bangkokfillers.com";
  const urls: string[] = [];
  for (const l of LOCALES) {
    urls.push(`${base}/${l}`, `${base}/${l}/methodology`);
    CONCERNS.forEach((c) => urls.push(`${base}/${l}/${c}`));
    allProducts().forEach((p) => urls.push(`${base}/${l}/product/${productSlug(p)}`));
    allIngredients().forEach(([inci]) => urls.push(`${base}/${l}/ingredient/${ingredientSlug(inci)}`));
  }
  return urls.map((url) => ({ url, lastModified: new Date() }));
}
