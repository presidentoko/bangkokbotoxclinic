// Apple touch icon — iOS home-screen bookmarks & share sheets. Vercel auto-emits the <link> tag.

import { ImageResponse } from "next/og";
import { getSiteConfig } from "@/lib/site";

export const dynamic = "force-static";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  const cfg = getSiteConfig();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%",
          background: cfg.themeAccent,
          color: "white",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 100, fontWeight: 800,
        }}
      >
        +
      </div>
    ),
    size
  );
}
