import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = "https://bangkokfillers.com";
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin"] },
      // Explicitly allow AI answer-engine crawlers for AEO
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Applebot-Extended", allow: "/" },
      { userAgent: "Amazonbot", allow: "/" },
      { userAgent: "YouBot", allow: "/" },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
