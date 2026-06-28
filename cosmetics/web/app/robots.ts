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
    sitemap: [
      `${base}/sitemap/0.xml`,
      `${base}/sitemap/1.xml`,
      `${base}/sitemap/2.xml`,
      `${base}/sitemap/3.xml`,
    ],
    host: base,
  };
}
