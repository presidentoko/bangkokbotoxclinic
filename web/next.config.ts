import type { NextConfig } from "next";
import { loadMasterDb } from "./lib/data";
import { applySiteFilter, getSiteConfig, resolveOwnerUrl, FOCUS_VALID } from "./lib/site";

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

// 2026-07-31 감사: /c/[service] (dynamicParams:false, VALID 8개 전부 정적 생성)는
// 사이트 소관 밖 서비스에서 notFound()로 끝났고, /clinic/[id]는 애초에 소관
// 클리닉만 generateStaticParams에 들어가 dynamicParams:false 때문에 라우팅
// 단계에서 그냥 404 — 페이지 컴포넌트까지 요청이 닿지도 않았다. 두 경우 다
// "존재하지 않는 URL"이 아니라 "다른 도메인 소관"이라 redirects()에서 실제
// 소유 도메인으로 301 — dynamicParams는 그대로 false로 둬서 bangkokfillers
// 2026-07-10 사고(봇이 무작위 id 두드릴 때마다 ISR write 소진) 재발 방지는
// 유지한다. redirects()는 next build 시점에 한 번 계산되는 정적 라우팅
// 테이블이라 요청당 비용이 전혀 없다.
const ALL_SERVICES = ["botox", "filler", "hifu", "facial", "laser", "dental", "hair_transplant", "eye"];

async function offFocusServiceRedirects() {
  const cfg = getSiteConfig();
  const focusValid = FOCUS_VALID[cfg.focus];
  if (!focusValid) return []; // "all" 허브는 전부 유효, 리다이렉트 불필요
  const offFocus = ALL_SERVICES.filter((s) => !focusValid.has(s));
  return offFocus.flatMap((service) => {
    const ownerUrl = resolveOwnerUrl([service]);
    if (!ownerUrl) return [];
    return [
      { source: `/c/${service}`, destination: `${ownerUrl}/c/${service}`, permanent: true },
      // [district] 라우트는 generateStaticParams에서 focusValid로 이미 걸러져
      // dynamicParams:false와 맞물려 있음 — 와일드카드 하나로 모든 지역 커버.
      { source: `/c/${service}/:district`, destination: `${ownerUrl}/c/${service}/:district`, permanent: true },
    ];
  });
}

async function offScopeClinicRedirects() {
  const cfg = getSiteConfig();
  if (cfg.focus === "all") return [];
  const db = await loadMasterDb();
  const scopedIds = new Set(applySiteFilter(db.clinics, cfg).map((c) => c.id));
  const out: { source: string; destination: string; permanent: boolean }[] = [];
  for (const c of db.clinics) {
    if (scopedIds.has(c.id)) continue;
    const ownerUrl = resolveOwnerUrl(c.categories);
    // resolveOwnerUrl이 null이면(카테고리 미분류 등) 소유 도메인을 특정할 수
    // 없어 지금처럼 404로 둔다 — 잘못된 도메인으로 보내는 것보다 안전.
    if (!ownerUrl) continue;
    out.push({ source: `/clinic/${c.id}`, destination: `${ownerUrl}/clinic/${c.id}`, permanent: true });
  }
  return out;
}

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
    const [serviceRedirects, clinicRedirects] = await Promise.all([
      offFocusServiceRedirects(),
      offScopeClinicRedirects(),
    ]);
    return [
      ...wpRedirects,
      ...sitemapRedirects,
      // Legacy /clinic-images/* URLs (Google-indexed, cached HTML, hotlinkers)
      // → Cloudflare R2. public/clinic-images/ no longer ships in the deploy
      // (see .vercelignore), so this is the only thing standing between old
      // links and a 404 (2026-07-28 audit).
      {
        source: "/clinic-images/:path*",
        destination: "https://img.bangkokbestclinic.com/clinic-images/:path*",
        permanent: true,
      },
      ...serviceRedirects,
      ...clinicRedirects,
    ];
  },
};

export default config;
