import type { NextConfig } from "next";

// WordPress migration: redirect old WP URL patterns → home (301)
const wpRedirects = [
  "/wp-content/:path*",
  "/wp-admin/:path*",
  "/wp-includes/:path*",
  "/wp-json/:path*",
  "/wp-login.php",
  "/wp-cron.php",
  "/xmlrpc.php",
  "/feed/:path*",
  "/comments/feed",
  "/category/:path*",
  "/tag/:path*",
  "/author/:path*",
  "/page/:num",
].map((source) => ({ source, destination: "/", permanent: true }));

// Old WordPress sitemaps → new sitemap index
const sitemapRedirects = [
  { source: "/sitemap_index.xml", destination: "/sitemap-index.xml", permanent: true },
  { source: "/post-sitemap.xml", destination: "/sitemap-priority.xml", permanent: true },
  { source: "/page-sitemap.xml", destination: "/sitemap.xml", permanent: true },
  { source: "/category-sitemap.xml", destination: "/sitemap.xml", permanent: true },
];

const config: NextConfig = {
  // master_db.json 큰 사이즈 대비 Edge 런타임 안 씀
  experimental: {
    largePageDataBytes: 4 * 1024 * 1024,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 604800, // 7일 — clinic photos rarely change, reduces re-optimization count
    deviceSizes: [640, 750, 1080, 1920], // trim default 8 sizes → 4 (mobile-first site)
    imageSizes: [64, 128, 256],
    remotePatterns: [
      // Google Maps place photos (Street View / Places API)
      { protocol: "https", hostname: "**.googleusercontent.com" },
      { protocol: "https", hostname: "maps.googleapis.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
  compress: true,
  poweredByHeader: false,
  async redirects() {
    return [...wpRedirects, ...sitemapRedirects];
  },
};

export default config;
