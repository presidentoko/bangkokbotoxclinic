import type { MetadataRoute } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bangkokbotoxclinic.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/"],
      },
      // AEO crawlers — explicitly allow + slow rate to be polite
      {
        userAgent: ["GPTBot", "ChatGPT-User", "OAI-SearchBot",
                    "PerplexityBot", "ClaudeBot", "Claude-Web", "Google-Extended"],
        allow: "/",
        crawlDelay: 5,
      },
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
