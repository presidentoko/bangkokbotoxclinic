import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = "https://bangkokfillers.com";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /admin plus common vuln-scanner/junk paths that don't exist on
        // this site but get probed constantly — keeping well-behaved
        // crawlers off them cuts wasted crawl budget (dynamicParams=false
        // already 404s these at the routing layer; this just asks nicely).
        disallow: [
          "/admin",
          // Ad-event beacons and the admin CSV are not pages; crawling them
          // wastes budget and, in the beacon's case, is rejected anyway.
          "/api/",
          "/*.php$",
          "/*.env$",
          "/wp-admin",
          "/wp-login*",
          "/wp-content",
          "/xmlrpc.php",
          "/.git",
        ],
      },
      // Explicitly allow AI answer-engine crawlers for AEO
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Applebot-Extended", allow: "/" },
      { userAgent: "Amazonbot", allow: "/" },
      { userAgent: "YouBot", allow: "/" },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
