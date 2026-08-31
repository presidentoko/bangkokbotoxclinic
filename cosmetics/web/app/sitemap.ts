import type { MetadataRoute } from "next";
import {
  CONCERNS,
  allProducts,
  productSlug,
  CONCERN_FILTER_SLUGS,
  MAKEUP_CATEGORIES,
  allIngredients,
  ingredientSlug,
  allBrands,
  brandSlug,
} from "@/lib/data";

import { currentSaleEvent } from "@/lib/sale";
import { hasTrendingData } from "@/lib/trending";

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
  // Only submitted while the Pantip collector has something; the page 404s
  // when it does not, and a sitemap entry pointing at a 404 burns crawl budget.
  if (hasTrendingData()) {
    out.push(entry(`${BASE}/th/trending`, 0.7, "weekly"));
  }
  out.push(entry(`${BASE}/th/brand`, 0.8, "weekly"));
  out.push(entry(`${BASE}/th/ingredient`, 0.7, "monthly"));
  out.push(entry(`${BASE}/th/methodology`, 0.6, "monthly"));
  out.push(entry(`${BASE}/th/media-kit`, 0.5, "monthly"));
  out.push(entry(`${BASE}/th/contact`, 0.6, "monthly"));
  out.push(entry(`${BASE}/th/about`, 0.5, "monthly"));
  out.push(entry(`${BASE}/th/privacy`, 0.3, "yearly"));
  out.push(entry(`${BASE}/th/terms`, 0.3, "yearly"));

  // Sale events — all 6 event pages render the identical "best deals now" ranking
  // (no per-event data exists to differentiate them) and self-canonicalize onto
  // whichever one is currently active, so only that one is worth submitting.
  out.push(entry(`${BASE}/th/sale/${currentSaleEvent().slug}`, 0.8, "daily"));

  // Budget ranges
  for (const range of ["under-300", "under-500", "under-1000"]) {
    out.push(entry(`${BASE}/th/budget/${range}`, 0.7, "weekly"));
  }

  // Makeup categories — only ones with a live ranking page (>=8 listings)
  for (const category of MAKEUP_CATEGORIES) {
    out.push(entry(`${BASE}/th/makeup/${category}`, 0.8, "weekly"));
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

// Total URL count (core + products + ingredients + brands) is well under
// Google's 50,000-URL-per-sitemap limit (~1,300 URLs as of 2026-07), so this
// is served as a single sitemap at the conventional /sitemap.xml URL rather
// than split via `generateSitemaps`.
//
// NOTE: previously this used `generateSitemaps` to split into /sitemap/0.xml
// .. /sitemap/3.xml. That caused a routing bug in production: Next.js
// reserves the bare /sitemap.xml path for this file (a request for it without
// an `id` doesn't resolve to any of the generated sub-sitemaps), so
// `/sitemap.xml` fell through to the app/[locale] catch-all and was served as
// a normal HTML page (locale="sitemap.xml") instead of XML — which is what
// Google Search Console flagged. Combining everything into one plain
// `sitemap()` export avoids the ambiguity entirely.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    ...coreEntries(),
    ...productEntries(),
    ...ingredientEntries(),
    ...brandEntries(),
  ];
}
