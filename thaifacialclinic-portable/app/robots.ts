import type { MetadataRoute } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thaifacialclinic.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/dashboard/", "/admin/"],
      },
      {
        userAgent: ["GPTBot", "ChatGPT-User", "OAI-SearchBot",
                    "PerplexityBot", "Claude-Web", "ClaudeBot",
                    "Google-Extended", "Applebot", "cohere-ai",
                    "anthropic-ai", "Gemini-Google"],
        allow: ["/", "/llms.txt", "/en/", "/sitemap.xml"],
        crawlDelay: 5,
      },
    ],
    sitemap: [`${SITE}/sitemap.xml`],
    host: SITE,
  };
}
