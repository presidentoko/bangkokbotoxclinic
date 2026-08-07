import type { NextConfig } from "next";

// Cloudflare Pages 용 — 순수 정적 export.
// 출력: out/ (CF Pages 가 그대로 서빙).
// /icon, /opengraph-image, /llms.txt, /feed.xml 모두 build time 에 pre-render.
const config: NextConfig = {
  output: "export",
  trailingSlash: false,
  images: { unoptimized: true },
  // Pin the workspace root to this directory. Without it Next walks up to
  // deliverable/ (there are package-lock.json files at both levels) and treats
  // that as the root, which it warns about on every build — and, less obviously,
  // makes the "another next build is already running" lock shared across every
  // Next app in the monorepo. A web-thaigle build would block a web-factory
  // build with a message that points at web-factory. Nothing here imports from
  // outside this directory, so scoping the root is safe.
  turbopack: { root: import.meta.dirname },
  experimental: {
    largePageDataBytes: 4 * 1024 * 1024,
  },
};

export default config;
