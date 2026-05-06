import type { NextConfig } from "next";

// Cloudflare Pages 용 — 순수 정적 export.
// 출력: out/ (CF Pages 가 그대로 서빙).
// /icon, /opengraph-image, /llms.txt, /feed.xml 모두 build time 에 pre-render.
const config: NextConfig = {
  output: "export",
  trailingSlash: false,
  images: { unoptimized: true },
  experimental: {
    largePageDataBytes: 4 * 1024 * 1024,
  },
};

export default config;
