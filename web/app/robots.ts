import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

const SITE = getSiteUrl();

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/dashboard/", "/onboarding/", "/compare/", "/report/"],
      },
      // AEO crawlers — explicitly allow + slow rate to be polite
      {
        userAgent: [
          "GPTBot", "ChatGPT-User", "OAI-SearchBot",
          "PerplexityBot", "ClaudeBot", "Claude-Web",
          "Google-Extended", "Applebot", "cohere-ai",
          "anthropic-ai", "Gemini-Google",
        ],
        allow: ["/", "/llms.txt", "/llms-full.txt", "/sitemap-index.xml"],
        crawlDelay: 5,
      },
    ],
    sitemap: `${SITE}/sitemap-index.xml`,
    host: SITE,
  };
}
