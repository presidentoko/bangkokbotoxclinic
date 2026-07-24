import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f766e 0%, #134e4a 100%)",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 88, fontWeight: 900, color: "white", letterSpacing: "-2px" }}>
          chillanel
        </div>
        <div style={{ display: "flex", fontSize: 40, fontWeight: 700, color: "#5eead4", marginTop: 24 }}>
          It&apos;s not the spa. It&apos;s the hands.
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#ccfbf1", marginTop: 32, maxWidth: 900 }}>
          Bangkok massage &amp; spa guide, built from real Google reviews.
        </div>
      </div>
    ),
    { ...size }
  );
}
