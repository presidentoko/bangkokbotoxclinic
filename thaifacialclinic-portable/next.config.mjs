import fs from "fs";
import path from "path";

const SUPPORTED_LANGS = ["en", "ko", "th", "zh", "ar"];

// data/slug_history.json 을 읽어 옛 슬러그 → 새 슬러그(살아있으면) 또는
// 도시 페이지(문 닫았으면) 301. scripts/build-data.mjs 가 매 빌드마다
// append-only로 채워둔 기록을 여기서 소비. 2026-07-31 감사 전에는 이 파일에
// 아무도 접근하지 않아 클리닉이 개명되거나 사라질 때마다 구글이 색인해둔
// 옛 URL이 조용히 404로 죽었음(예: "warodom clinic reviews" 검색 노출 159,
// 실제 클릭 시 전부 404).
async function staleSlugRedirects() {
  const historyPath = path.join(process.cwd(), "data", "slug_history.json");
  const clinicsPath = path.join(process.cwd(), "public", "data", "clinics.json");
  if (!fs.existsSync(historyPath) || !fs.existsSync(clinicsPath)) return [];

  let history, clinicsData;
  try {
    history = JSON.parse(fs.readFileSync(historyPath, "utf-8"));
    clinicsData = JSON.parse(fs.readFileSync(clinicsPath, "utf-8"));
  } catch {
    return [];
  }

  const currentSlugById = new Map((clinicsData.clinics || []).map((c) => [c.id, c.slug]));
  const citySlug = (city) => (city || "").toLowerCase().trim().replace(/\s+/g, "-");

  const redirects = [];
  for (const [id, entry] of Object.entries(history)) {
    const currentSlug = currentSlugById.get(id);
    for (const oldSlug of entry.slugs) {
      if (oldSlug === currentSlug) continue;
      const destPath =
        entry.active && currentSlug
          ? `/clinic/${currentSlug}/`
          : `/city/${citySlug(entry.city)}/`;
      for (const lang of SUPPORTED_LANGS) {
        redirects.push({
          source: `/${lang}/clinic/${oldSlug}`,
          destination: `/${lang}${destPath}`,
          permanent: true,
        });
      }
    }
  }
  return redirects;
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return staleSlugRedirects();
  },
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
