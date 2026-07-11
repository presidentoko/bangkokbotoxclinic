import { ImageResponse } from "next/og";
import { getSiteConfig } from "@/lib/site";

export const dynamic = "force-static";
export const contentType = "image/png";

export async function GET() {
  const cfg = getSiteConfig();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: cfg.themeAccent,
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 110,
          fontWeight: 800,
        }}
      >
        +
      </div>
    ),
    { width: 192, height: 192 }
  );
}
