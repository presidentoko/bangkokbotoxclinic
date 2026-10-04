import type { MetadataRoute } from "next";
import { BLOCKED_PLACE_PATHS } from "@/lib/placeIndexing";

export const dynamic = "force-static";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.thaigle.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /{lang}/place/* is 1,647 places × 3 langs = 4,941 URLs. The blanket
        // "/*/place/*" block added 2026-07-26 was justified by ISR read +
        // origin transfer overage, but that route is now force-static with
        // dynamicParams=false — it performs no ISR writes at all, so the cost
        // argument no longer holds while the traffic loss does.
        //
        // Reopening only the English third: /en is the x-default of this
        // cluster's hreflang, so it's the version worth indexing, and 1,647
        // URLs is a third of the crawl volume that caused the original
        // problem. th/ko stay blocked (listed explicitly rather than via a
        // wildcard so there's no Allow-vs-Disallow precedence ambiguity).
        disallow: ["/admin", "/api", ...BLOCKED_PLACE_PATHS],
      },
      {
        // Answer engines, named explicitly.
        //
        // Functionally these inherit nothing from the "*" group — a crawler
        // that finds its own user-agent listed obeys only that group — so the
        // disallows are repeated here. That is also the reason to list them at
        // all: "*" already allows everything, but naming them means a future
        // blanket Disallow cannot quietly take the site out of AI answers, and
        // this site's whole differentiator (a verdict with its reasons stated)
        // is the kind of thing an answer engine cites.
        //
        // Claude-Web and anthropic-ai are the retired names; ClaudeBot is the
        // current one. OAI-SearchBot indexes for ChatGPT search while GPTBot
        // crawls for training and ChatGPT-User fetches a page a person asked
        // about — three different jobs, three user-agents. Google-Extended is
        // not a crawler at all: it is the opt-out switch for Gemini, read off
        // the same robots.txt Googlebot already fetched.
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "ClaudeBot",
          "Claude-User",
          "Claude-SearchBot",
          "Claude-Web",
          "anthropic-ai",
          "PerplexityBot",
          "Perplexity-User",
          "Google-Extended",
          "Applebot-Extended",
          "meta-externalagent",
          "MistralAI-User",
        ],
        allow: "/",
        disallow: ["/admin", "/api", ...BLOCKED_PLACE_PATHS],
      },
      {
        // Googlebot obeys only its own group, so this has to repeat the rules
        // above rather than inherit them.
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin", "/api", ...BLOCKED_PLACE_PATHS],
      },
    ],
    sitemap: `${SITE}/sitemap.xml`,
  };
}
