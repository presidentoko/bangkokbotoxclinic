import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // SEO-tool crawlers hammer all ~4,000 sitemap URLs (plus each page's
      // OG image) and send zero visitor traffic — they were a major driver
      // of the Vercel hobby quota overage (ISR reads/origin transfer).
      // Search engines (Google/Bing/etc.) and AI assistants stay allowed.
      { userAgent: "AhrefsBot", disallow: "/" },
      { userAgent: "SemrushBot", disallow: "/" },
      { userAgent: "MJ12bot", disallow: "/" },
      { userAgent: "DotBot", disallow: "/" },
      { userAgent: "BLEXBot", disallow: "/" },
      { userAgent: "DataForSeoBot", disallow: "/" },
      { userAgent: "serpstatbot", disallow: "/" },
      // Second wave, added 2026-08 after Vercel usage showed 2.9M ISR reads
      // against 145 clicks in three months — the traffic was almost entirely
      // crawlers. These send no visitors to a Thai medical-tourism site and
      // several are known for ignoring crawl-rate etiquette.
      { userAgent: "Bytespider", disallow: "/" },
      { userAgent: "PetalBot", disallow: "/" },
      { userAgent: "Barkrowler", disallow: "/" },
      { userAgent: "ImagesiftBot", disallow: "/" },
      { userAgent: "Sogou web spider", disallow: "/" },
      { userAgent: "SeekportBot", disallow: "/" },
      { userAgent: "magpie-crawler", disallow: "/" },
      { userAgent: "VelenPublicWebCrawler", disallow: "/" },
      // AI assistants (GPTBot, ClaudeBot, PerplexityBot, …) stay allowed on
      // purpose — /llms.txt exists to court them.
      // /api/prices is a deliberately public read-only JSON API (promoted via
      // /llms.txt for AI crawlers) — every other /api/* route is a functional
      // endpoint (contact form, click tracking, search, saved-packages lookup)
      // with no indexable content, so those stay blocked.
      // /*/saved used to be disallowed. It is linked from the header of every
      // page, so blocking it did not stop Google queuing it — it stopped
      // Google reading the `noindex` on it, and the URL sat in "Blocked by
      // robots.txt" (381 pages) indefinitely. A crawlable page carrying
      // noindex gets dropped cleanly instead; the same is true of
      // /for-clinics. Blocking is only right for URLs nothing links to.
      {
        userAgent: "*",
        allow: ["/", "/api/prices"],
        disallow: ["/api/contact", "/api/track", "/api/search", "/api/packages"],
      },
    ],
    sitemap: "https://www.bangkoktopclinic.com/sitemap.xml",
  };
}
