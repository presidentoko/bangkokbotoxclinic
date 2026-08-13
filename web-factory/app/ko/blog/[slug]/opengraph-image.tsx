import { ImageResponse } from "next/og";
import { findPostKo, POSTS_KO } from "@/lib/posts_ko";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "태국 B2B 블로그 — ThaiSupplyHub";

export function generateStaticParams() {
  return POSTS_KO.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = findPostKo(slug);
  const title = p?.title ?? slug;
  const category = p?.category ?? "소싱";

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
              블로그
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
              fontSize: title.length > 40 ? 40 : title.length > 28 ? 48 : 56,
              fontWeight: 900,
              lineHeight: 1.12,
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
            <span>태국 B2B 인사이트</span>
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
          <div style={{ color: "#a7f3d0", fontSize: 18, fontWeight: 700, textAlign: "center" }}>
            태국 B2B 전문 칼럼
          </div>
          <div style={{ color: "white", fontSize: 22, fontWeight: 800, textAlign: "center", marginTop: 8 }}>
            한국어 블로그
          </div>
        </div>
      </div>
    ),
    size,
  );
}
