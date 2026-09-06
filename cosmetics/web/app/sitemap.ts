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
import type { Locale } from "@/lib/i18n";
import { getNoindexLocales } from "@/lib/indexing";

import { currentSaleEvent } from "@/lib/sale";
import { hasTrendingData } from "@/lib/trending";

const BASE = "https://bangkokfillers.com";
const NOW = new Date();

type Freq = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

// Locales this sitemap submits.
//
// This was TH-only from 2026-07 until 2026-09-06, on the reasoning that
// concentrating crawl budget on the primary market would help it. The GSC
// export for 2026-06-06..2026-09-06 says otherwise: /en carried 1,231 of the
// site's 2,529 impressions (48%) and 8 of its 15 clicks at an average position
// of 29.9, against /th's 760 impressions, 3 clicks and position 51.7 — and not
// one /en URL had ever been submitted. Every one of them returns 200 and is
// self-canonical; they were simply invisible to the sitemap. Hreflang alone was
// not getting them crawled.
//
// TH stays first and keeps x-default (see lib/i18n.ts). This adds the locale
// that was already earning, it does not demote the primary one.
const SITEMAP_LOCALES = ["th", "en"] as const satisfies readonly Locale[];

// Products are the exception: /en/product/* 308s to the Thai URL, because
// llm_summary.en is empty for all 1,003 products and the English page would
// repeat the Thai body verbatim (2026-08-17, 96b9f4d). A sitemap must never
// name a redirect, so products stay TH-only until the pipeline produces real
// English summaries — at which point this becomes SITEMAP_LOCALES.
const PRODUCT_LOCALES = ["th"] as const satisfies readonly Locale[];

function entry(
  path: string,
  priority: number,
  changeFrequency: Freq = "weekly"
): MetadataRoute.Sitemap[number] {
  return { url: encodeURI(path), lastModified: NOW, changeFrequency, priority };
}

// Sitemap 0: core pages
function coreEntries(locale: Locale): MetadataRoute.Sitemap {
  const out: MetadataRoute.Sitemap = [];
  const L = `${BASE}/${locale}`;

  // Home
  out.push(entry(L, 1.0, "daily"));

  // Concern pages + their filter slugs
  for (const concern of CONCERNS) {
    out.push(entry(`${L}/${concern}`, 0.9, "daily"));
    for (const filter of CONCERN_FILTER_SLUGS[concern] ?? []) {
      out.push(entry(`${L}/${concern}/${filter}`, 0.8, "weekly"));
    }
  }

  // Static core pages
  out.push(entry(`${L}/quiz`, 0.8, "monthly"));
  // Only submitted while the Pantip collector has something; the page 404s
  // when it does not, and a sitemap entry pointing at a 404 burns crawl budget.
  if (hasTrendingData()) {
    out.push(entry(`${L}/trending`, 0.7, "weekly"));
  }
  out.push(entry(`${L}/brand`, 0.8, "weekly"));
  out.push(entry(`${L}/ingredient`, 0.7, "monthly"));
  out.push(entry(`${L}/methodology`, 0.6, "monthly"));
  out.push(entry(`${L}/media-kit`, 0.5, "monthly"));
  out.push(entry(`${L}/contact`, 0.6, "monthly"));
  out.push(entry(`${L}/about`, 0.5, "monthly"));
  out.push(entry(`${L}/privacy`, 0.3, "yearly"));
  out.push(entry(`${L}/terms`, 0.3, "yearly"));

  // Sale events — all 6 event pages render the identical "best deals now" ranking
  // (no per-event data exists to differentiate them) and self-canonicalize onto
  // whichever one is currently active, so only that one is worth submitting.
  out.push(entry(`${L}/sale/${currentSaleEvent().slug}`, 0.8, "daily"));

  // Budget ranges
  for (const range of ["under-300", "under-500", "under-1000"]) {
    out.push(entry(`${L}/budget/${range}`, 0.7, "weekly"));
  }

  // Makeup categories — only ones with a live ranking page (>=8 listings)
  for (const category of MAKEUP_CATEGORIES) {
    out.push(entry(`${L}/makeup/${category}`, 0.8, "weekly"));
  }

  return out;
}

// Sitemap 1: all products with reviews, sorted by review count
function productEntries(locale: Locale): MetadataRoute.Sitemap {
  return allProducts()
    .filter((p) => p.konvy_review_count > 0)
    .sort((a, b) => b.konvy_review_count - a.konvy_review_count)
    .map((p) => entry(`${BASE}/${locale}/product/${productSlug(p)}`, 0.8, "weekly"));
}

// Sitemap 2: ingredient pages
function ingredientEntries(locale: Locale): MetadataRoute.Sitemap {
  return allIngredients().map(([inci]) =>
    entry(`${BASE}/${locale}/ingredient/${ingredientSlug(inci)}`, 0.7, "monthly")
  );
}

// Sitemap 3: brand pages
function brandEntries(locale: Locale): MetadataRoute.Sitemap {
  return allBrands().map((brand) =>
    entry(`${BASE}/${locale}/brand/${brandSlug(brand)}`, 0.7, "weekly")
  );
}

// Total URL count (core + products + ingredients + brands, over two locales)
// is ~1,700 as of 2026-09 — well under Google's 50,000-URL-per-sitemap limit,
// so this is served as a single sitemap at the conventional /sitemap.xml URL
// rather than split via `generateSitemaps`.
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
  // The admin panel can noindex an entire locale at runtime (lib/indexing.ts,
  // rendered by [locale]/layout.tsx). Submitting a URL we are simultaneously
  // telling Google to drop is a contradictory signal, so the two agree here.
  // kvGet swallows its own errors and returns null, so an unreachable Redis
  // degrades to "nothing is noindexed" — the behaviour before this guard —
  // rather than emptying the sitemap.
  const noindex = await getNoindexLocales();
  const locales = SITEMAP_LOCALES.filter((l) => !noindex.has(l));

  return [
    ...locales.flatMap(coreEntries),
    ...PRODUCT_LOCALES.filter((l) => !noindex.has(l)).flatMap(productEntries),
    ...locales.flatMap(ingredientEntries),
    ...locales.flatMap(brandEntries),
  ];
}
