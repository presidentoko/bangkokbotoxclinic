import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const config: NextConfig = {
  trailingSlash: false,
  async redirects() {
    return [
      // Non-www → www (permanent 301 — consolidates all authority to www)
      {
        source: "/:path*",
        has: [{ type: "host", value: "thailandgolfguide.com" }],
        destination: "https://www.thailandgolfguide.com/:path*",
        permanent: true,
      },
      // 여기 있던 /city/pattaya -> /city/chon_buri 리다이렉트는 제거했다.
      // 붙일 당시엔 맞는 판단이었다 — 파타야 페이지에 코스가 18개뿐이었고 촌부리와
      // 목록이 거의 겹쳐서 중복 콘텐츠였다. lib/cityAliases 의 배타 배정이 들어간 뒤로는
      // 파타야 32개 / 촌부리 61개로 서로 겹치지 않는 목록이 됐다. 중복이 아니라 정상 분할인데
      // 리다이렉트가 남아 "pattaya golf"(촌부리보다 검색량이 훨씬 큰 쿼리)를 도(道) 페이지로
      // 흘려보내고 있었다.
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.googleusercontent.com" },
      { protocol: "https", hostname: "googleusercontent.com" },
      { protocol: "https", hostname: "maps.googleapis.com" },
      { protocol: "https", hostname: "*.ggpht.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "*.naver.com" },
      { protocol: "https", hostname: "*.nstatic.net" },
    ],
  },
  experimental: {
    largePageDataBytes: 4 * 1024 * 1024,
  },
  async headers() {
    return [
      {
        // Cloudflare fronts Vercel on this domain and returns
        // `cf-cache-status: DYNAMIC` for HTML, so every request reaches Vercel
        // and bills an ISR read while `x-vercel-cache` reports HIT. Next's
        // default `public, max-age=0, must-revalidate` reads to a shared cache
        // as "do not store"; `s-maxage` is what makes the edge eligible to
        // hold a copy. An hour is far inside the 7-day `revalidate` most pages
        // here already use, so nothing goes staler than it does today.
        //
        // Half the fix — responses stay DYNAMIC until a Cloudflare Cache Rule
        // marks HTML cacheable.
        source: "/(.*)",
        headers: [
          ...securityHeaders,
          { key: "Cache-Control", value: "public, max-age=0, s-maxage=3600, stale-while-revalidate=604800" },
        ],
      },
      {
        // After the blanket rule so it wins on the duplicate key. /api/contact
        // is a form submission — a shared cache would serve one sender's
        // response to the next and the message would never be delivered.
        source: "/api/(.*)",
        headers: [
          ...securityHeaders,
          { key: "Cache-Control", value: "no-store, must-revalidate" },
        ],
      },
    ];
  },
};

export default config;
