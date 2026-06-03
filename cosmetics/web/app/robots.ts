import type { MetadataRoute } from "next";

// AEO/SEO: allow all crawlers (incl. AI answer-engine bots) and point to the sitemap.
export default function robots(): MetadataRoute.Robots {
  const base = "https://bangkokfillers.com";
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
