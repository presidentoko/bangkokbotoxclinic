import { ImageResponse } from "next/og";

export const dynamic = "force-static";

// Separate from app/icon.tsx (the 32x32 favicon) — PWA installability on
// Android specifically checks for a 192x192 and a 512x512 icon in the
// manifest before offering "Add to Home Screen", so those need real routes
// of their own rather than reusing the favicon size.
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
          fontSize: 118,
          fontWeight: 900,
          fontFamily: "sans-serif",
        }}
      >
        c
      </div>
    ),
    { width: 192, height: 192 }
  );
}
