import { ImageResponse } from "next/og";

export const dynamic = "force-static";

// See app/icon-192/route.tsx for why this exists as its own route.
export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f766e",
          color: "white",
          fontSize: 314,
          fontWeight: 900,
          fontFamily: "sans-serif",
        }}
      >
        c
      </div>
    ),
    { width: 512, height: 512 }
  );
}
