import type { NextConfig } from "next";

const config: NextConfig = {
  trailingSlash: false,
  experimental: {
    largePageDataBytes: 4 * 1024 * 1024,
    // 빌드 워커를 명시적으로 묶는다. 이 사이트는 식당 3,184곳 × (en/th/ko 상세
    // + OG 이미지) 로 프리렌더 대상이 14,000장 가까이 되고, 기본값으로 두면
    // Vercel 빌드가 SIGABRT 로 죽는다. memoryBasedWorkersCount 는 워커를 4개
    // 밑으로 내려주지 않으므로 cpus 로 직접 고정해야 한다.
    cpus: 2,
    staticGenerationMaxConcurrency: 4,
  },
};

export default config;
