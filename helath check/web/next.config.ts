import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  trailingSlash: false,
  turbopack: { root: __dirname },
  staticPageGenerationTimeout: 120,
  async redirects() {
    return [
      { source: "/", destination: "/en", permanent: false },
      // Legacy compare URLs used ?category= query params, which forced the
      // page into per-request SSR. Categories are now path segments
      // (/compare/[category], SSG). The alternation is the exact CATEGORIES
      // list — junk values fall through to the bare static page, which
      // ignores the query.
      {
        source: "/:locale/compare",
        has: [{
          type: "query",
          key: "category",
          value: "(?<category>comprehensive|executive|standard|cancer|cardiac|heart|women|men|senior|basic|diabetes|eye|liver|kidney|brain|dental)",
        }],
        destination: "/:locale/compare/:category",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        source: "/api/(.*)",
        headers: [
          ...securityHeaders,
          { key: "Cache-Control", value: "public, s-maxage=3600, stale-while-revalidate=86400" },
        ],
      },
    ];
  },
};

export default nextConfig;
