/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Google Maps / Places photos
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "lh4.googleusercontent.com" },
      { protocol: "https", hostname: "lh5.googleusercontent.com" },
      { protocol: "https", hostname: "lh6.googleusercontent.com" },
      { protocol: "https", hostname: "maps.googleapis.com" },
      // Bookimed CDN
      { protocol: "https", hostname: "cdn.bookimed.com" },
      { protocol: "https", hostname: "bookimed.com" },
      // Allow any subdomain of googleusercontent as fallback
      { protocol: "https", hostname: "**.googleusercontent.com" },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  trailingSlash: true,
  typedRoutes: false,
  async headers() {
    return [
      {
        // Long-lived cache for all static assets in /public
        source: "/:path*\\.(ico|svg|png|jpg|jpeg|webp|avif|woff|woff2|ttf|otf|gif|mp4|webm)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
