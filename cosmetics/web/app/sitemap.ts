import type { MetadataRoute } from "next";
import {
  CONCERNS,
  allProducts,
  productSlug,
  CONCERN_FILTER_SLUGS,
  allIngredients,
  ingredientSlug,
  allBrands,
  brandSlug,
} from "@/lib/data";

import { SALE_EVENTS } from "@/lib/sale";

const BASE = "https://bangkokfillers.com";
const NOW = new Date();

type Freq = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

// Sitemap only submits TH-locale URLs to focus crawl budget on the primary content.
// Hreflang cross-locale signals are handled by <link rel="alternate"> in each page's <head>.
function entry(
  path: string,
  priority: number,
  changeFrequency: Freq = "weekly"
): MetadataRoute.Sitemap[number] {
  return { url: encodeURI(path), lastModified: NOW, changeFrequency, priority };
}

// Sitemap 0: core pages — TH only
function coreEntries(): MetadataRoute.Sitemap {
  const out: MetadataRoute.Sitemap = [];

  // Home
  out.push(entry(`${BASE}/th`, 1.0, "daily"));

  // Concern pages + their filter slugs
  for (const concern of CONCERNS) {
    out.push(entry(`${BASE}/th/${concern}`, 0.9, "daily"));
    for (const filter of CONCERN_FILTER_SLUGS[concern] ?? []) {
      out.push(entry(`${BASE}/th/${concern}/${filter}`, 0.8, "weekly"));
    }
  }

  // Static core pages
  out.push(entry(`${BASE}/th/quiz`, 0.8, "monthly"));
  out.push(entry(`${BASE}/th/brand`, 0.8, "weekly"));
  out.push(entry(`${BASE}/th/methodology`, 0.6, "monthly"));
  out.push(entry(`${BASE}/th/media-kit`, 0.5, "monthly"));
  out.push(entry(`${BASE}/th/contact`, 0.6, "monthly"));

  // Sale events
  for (const ev of SALE_EVENTS) {
    out.push(entry(`${BASE}/th/sale/${ev.slug}`, 0.8, "daily"));
  }

  // Budget ranges
  for (const range of ["under-300", "under-500", "under-1000"]) {
    out.push(entry(`${BASE}/th/budget/${range}`, 0.7, "weekly"));
  }

  return out;
}

// Sitemap 1: all products with reviews, sorted by review count
function productEntries(): MetadataRoute.Sitemap {
  return allProducts()
    .filter((p) => p.konvy_review_count > 0)
    .sort((a, b) => b.konvy_review_count - a.konvy_review_count)
    .map((p) => entry(`${BASE}/th/product/${productSlug(p)}`, 0.8, "weekly"));
}

// Sitemap 2: ingredient pages
function ingredientEntries(): MetadataRoute.Sitemap {
  return allIngredients().map(([inci]) =>
    entry(`${BASE}/th/ingredient/${ingredientSlug(inci)}`, 0.7, "monthly")
  );
}

// Sitemap 3: brand pages
function brandEntries(): MetadataRoute.Sitemap {
  return allBrands().map((brand) =>
    entry(`${BASE}/th/brand/${brandSlug(brand)}`, 0.7, "weekly")
  );
}

export function generateSitemaps() {
  return [{ id: "0" }, { id: "1" }, { id: "2" }, { id: "3" }];
}

export default async function sitemap(props: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  const id = await props.id;
  if (id === "0") return coreEntries();
  if (id === "1") return productEntries();
  if (id === "2") return ingredientEntries();
  if (id === "3") return brandEntries();
  return [];
}
