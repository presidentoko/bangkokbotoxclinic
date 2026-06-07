import { ImageResponse } from "next/og";
import { findGuideKo, GUIDES_KO } from "@/lib/guides_ko";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateImageMetadata() {
  return GUIDES_KO.map((g) => ({ id: g.slug, alt: g.title }));
}

export default function Image({ params }: { params: { slug: string } }) {
  const g = findGuideKo(params.slug);
  const title = g?.title ?? params.slug;
  const sections = g?.sections.length ?? 0;
  const faqs = g?.faqs.length ?? 0;

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
                letterSpacing: 2,
                padding: "6px 18px",
                borderRadius: 100,
                border: "1.5px solid #a7f3d0",
              }}
            >
              바이어 가이드
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
              한국어
            </div>
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: title.length > 40 ? 44 : 54,
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: -1,
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
            <span>{sections}개 섹션 · FAQ {faqs}개</span>
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
          <div style={{ fontSize: 80 }}>📖</div>
          <div style={{ color: "#a7f3d0", fontSize: 18, fontWeight: 700, letterSpacing: 1, textAlign: "center" }}>
            태국 B2B{"\n"}소싱 가이드
          </div>
          <div style={{ color: "white", fontSize: 22, fontWeight: 800, textAlign: "center", marginTop: 8 }}>
            한국어 가이드
          </div>
        </div>
      </div>
    ),
    size,
  );
}
