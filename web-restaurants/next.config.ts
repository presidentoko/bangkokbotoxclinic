import type { NextConfig } from "next";

const config: NextConfig = {
  // master_db.json 큰 사이즈 대비 Edge 런타임 안 씀
  experimental: {
    largePageDataBytes: 4 * 1024 * 1024,
  },
};

export default config;
