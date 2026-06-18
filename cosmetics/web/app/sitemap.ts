import type { MetadataRoute } from "next";
import {
  CONCERNS,
  allProducts,
  productSlug,
  getRanking,
  getProduct,
  CONCERN_FILTER_SLUGS,
} from "@/lib/data";
import { LOCALES } from "@/lib/i18n";
import { SALE_EVENTS } from "@/lib/sale";

const BASE = "https://bangkokfillers.com";
const NOW = new Date();

type Freq = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

// entry() accepts a /th/ path and builds hreflang alternates for all 4 locales
function entry(
  path: string,
  priority: number,
  changeFrequency: Freq = "weekly"
): MetadataRoute.Sitemap[number] {
  // Derive the locale-agnostic slug from the /th/ path
  const thPrefix = `${BASE}/th/`;
  const thRoot = `${BASE}/th`;
  let slug = "";
  if (path.startsWith(thPrefix)) {
    slug = path.slice(thPrefix.length);
  } else if (path === thRoot) {
    slug = "";
  }

  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    languages[l] = slug ? `${BASE}/${l}/${slug}` : `${BASE}/${l}`;
  }
  languages["x-default"] = languages["th"];

  return { url: path, lastModified: NOW, changeFrequency, priority, alternates: { languages } };
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

// Sitemap 1: top 300 products by konvy_review_count (TH only)
function topProductEntries(): MetadataRoute.Sitemap {
  const products = allProducts()
    .filter((p) => p.konvy_review_count > 0)
    .sort((a, b) => b.konvy_review_count - a.konvy_review_count)
    .slice(0, 300);

  return products.map((p) =>
    entry(`${BASE}/th/product/${productSlug(p)}`, 0.8, "weekly")
  );
}

export function generateSitemaps() {
  return [{ id: "0" }, { id: "1" }];
}

export default async function sitemap(props: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  const id = await props.id;
  if (id === "0") return coreEntries();
  if (id === "1") return topProductEntries();
  return [];
}
