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
    // 기본값(코어 수 - 1 = 11)이면 워커 하나가 master_db 를 통째로 들고 300MB~1GB 씩
    // 먹는다. 스크래퍼·VPN 이 같이 도는 16GB 머신에서 OOM 으로 빌드가 죽었다(2026-09-16).
    cpus: 5,
  },
};

export default config;
