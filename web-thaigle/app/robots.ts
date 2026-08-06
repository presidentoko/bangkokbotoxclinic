import type { MetadataRoute } from "next";
import { BLOCKED_PLACE_PATHS } from "@/lib/placeIndexing";

export const dynamic = "force-static";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thaigle.com";

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
