// Favicon — 동적 SVG. Vercel 자동 출력. 사이트 themeAccent 색깔.

import { ImageResponse } from "next/og";
import { getSiteConfig } from "@/lib/site";

export const dynamic = "force-static";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  const cfg = getSiteConfig();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%",
          background: cfg.themeAccent,
          color: "white",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22, fontWeight: 800,
          borderRadius: 6,
        }}
      >
        +
      </div>
    ),
    size
  );
}
