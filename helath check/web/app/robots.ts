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
      // /api/prices is a deliberately public read-only JSON API (promoted via
      // /llms.txt for AI crawlers) — every other /api/* route is a functional
      // endpoint (contact form, click tracking, search, saved-packages lookup)
      // with no indexable content, so those stay blocked.
      {
        userAgent: "*",
        allow: ["/", "/api/prices"],
        disallow: ["/api/contact", "/api/track", "/api/search", "/api/packages", "/*/saved"],
      },
    ],
    sitemap: "https://www.bangkoktopclinic.com/sitemap.xml",
  };
}
