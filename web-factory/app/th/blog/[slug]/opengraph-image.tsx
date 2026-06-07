import { ImageResponse } from "next/og";
import { findPostTh, POSTS_TH } from "@/lib/posts_th";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateImageMetadata() {
  return POSTS_TH.map((p) => ({ id: p.slug, alt: p.title }));
}

export default function Image({ params }: { params: { slug: string } }) {
  const p = findPostTh(params.slug);
  const title = p?.title ?? params.slug;
  const category = p?.category ?? "ซัพพลายเออร์";

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
            borderLeft: "10px solid #059669",
          }}
        >
          {/* Labels */}
          <div style={{ display: "flex", gap: 12, marginBottom: 32, alignItems: "center" }}>
            <div
              style={{
                background: "#ecfdf5",
                color: "#065f46",
                fontSize: 18,
                fontWeight: 800,
                padding: "6px 18px",
                borderRadius: 100,
                border: "1.5px solid #a7f3d0",
              }}
            >
              บล็อก
            </div>
            <div
              style={{
                background: "#f1f5f9",
                color: "#475569",
                fontSize: 16,
                fontWeight: 700,
                padding: "6px 14px",
                borderRadius: 100,
              }}
            >
              {category}
            </div>
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: title.length > 50 ? 38 : title.length > 35 ? 46 : 54,
              fontWeight: 900,
              lineHeight: 1.18,
              letterSpacing: -0.5,
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
            <span style={{ fontWeight: 800, color: "#059669" }}>thaisupplyhub.com</span>
            <span>ข้อมูล B2B ไทย</span>
          </div>
        </div>

        {/* Right panel */}
        <div
          style={{
            width: 300,
            background: "linear-gradient(160deg, #059669 0%, #047857 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
          }}
        >
          <div style={{ fontSize: 80 }}>✍️</div>
          <div style={{ color: "#a7f3d0", fontSize: 18, fontWeight: 700, textAlign: "center" }}>
            บทความ B2B{"\n"}ภาษาไทย
          </div>
          <div style={{ color: "white", fontSize: 22, fontWeight: 800, textAlign: "center", marginTop: 8 }}>
            thaisupplyhub
          </div>
        </div>
      </div>
    ),
    size,
  );
}
