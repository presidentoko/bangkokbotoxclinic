import { ImageResponse } from "next/og";
import { findBestFor, BEST_FOR } from "@/lib/bestFor";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateImageMetadata() {
  return BEST_FOR.map((c) => ({ id: c.slug, alt: c.title }));
}

export default function Image({ params }: { params: { criterion: string } }) {
  const c = findBestFor(params.criterion);
  const title = c?.title ?? params.criterion;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%",
          display: "flex",
          background: "#fff",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Left content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: "64px 56px",
            borderLeft: "10px solid #d97706",
          }}
        >
          {/* Label */}
          <div style={{ display: "flex", marginBottom: 32 }}>
            <div
              style={{
                background: "#fffbeb",
                color: "#92400e",
                fontSize: 20,
                fontWeight: 800,
                letterSpacing: 3,
                padding: "6px 18px",
                borderRadius: 100,
                border: "1.5px solid #fde68a",
              }}
            >
              CURATED LIST
            </div>
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: title.length > 55 ? 44 : 54,
              fontWeight: 900,
              lineHeight: 1.08,
              letterSpacing: -1.5,
              color: "#0a0a0a",
              flex: 1,
              display: "flex",
              alignItems: "center",
            }}
          >
            {title}
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              color: "#737373",
              fontSize: 22,
            }}
          >
            <span style={{ fontWeight: 800, color: "#d97706" }}>thaisupplyhub.com</span>
            <span>DBD-verified · Ranked by trust score</span>
          </div>
        </div>

        {/* Right panel */}
        <div
          style={{
            width: 300,
            background: "linear-gradient(160deg, #d97706 0%, #b45309 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
          }}
        >
          <div style={{ fontSize: 80 }}>🏆</div>
          <div style={{ color: "#fef3c7", fontSize: 18, fontWeight: 700, letterSpacing: 2, textAlign: "center" }}>
            TOP RANKED{"\n"}SUPPLIERS
          </div>
          <div style={{ color: "white", fontSize: 22, fontWeight: 800, textAlign: "center", marginTop: 8 }}>
            Thailand B2B
          </div>
        </div>
      </div>
    ),
    size,
  );
}
