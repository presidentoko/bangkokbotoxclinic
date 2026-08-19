import type { NextConfig } from "next";

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
};

export default config;
