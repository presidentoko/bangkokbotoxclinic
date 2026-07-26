import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thaigle.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /{lang}/place/* (~4,941 URLs) was already dropped from sitemap.xml
        // as low-value duplicate content across 6 languages — this crawl
        // volume was showing up as >50% of production requests (recrawl of
        // long-tail business listings), driving Vercel ISR read/origin
        // transfer overage for pages we've already deprioritized.
        disallow: ["/admin", "/api", "/*/place/*"],
      },
      {
        userAgent: "GPTBot",
        allow: "/",
      },
      {
        userAgent: "Claude-Web",
        allow: "/",
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
      },
      {
        userAgent: "anthropic-ai",
        allow: "/",
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/*/place/*"],
      },
    ],
    sitemap: `${SITE}/sitemap.xml`,
  };
}
