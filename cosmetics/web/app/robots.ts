import type { MetadataRoute } from "next";

// AEO/SEO: allow all crawlers (incl. AI answer-engine bots) and point to the sitemap.
// /sitemap.xml is intercepted by [locale] route, so we reference sub-sitemaps directly.
export default function robots(): MetadataRoute.Robots {
  const base = "https://bangkokfillers.com";
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin"] }],
    sitemap: [
      `${base}/sitemap-0.xml`,
      `${base}/sitemap-1.xml`,
    ],
    host: base,
  };
}
