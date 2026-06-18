import type { MetadataRoute } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.thailandgolfguide.com";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/"],
      },
      // Naver / Daum — Korean SEO. Explicit allow + no crawl delay so they
      // pick up new pages quickly. Yeti is Naver's primary crawler.
      {
        userAgent: ["Yeti", "NaverBot", "Daum", "Daumoa"],
        allow: "/",
      },
      // AEO crawlers — explicitly allow + slow rate to be polite
      {
        userAgent: ["GPTBot", "ChatGPT-User", "OAI-SearchBot",
                    "PerplexityBot", "ClaudeBot", "Claude-Web", "Google-Extended"],
        allow: "/",
        crawlDelay: 5,
      },
    ],
    sitemap: [
      `${SITE}/sitemap.xml`,
      `${SITE}/image-sitemap.xml`,
      `${SITE}/video-sitemap.xml`,
    ],
    host: SITE,
  };
}
