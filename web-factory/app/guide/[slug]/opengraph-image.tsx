import { ImageResponse } from "next/og";
import { findGuide, GUIDES } from "@/lib/guides";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Thailand B2B Buyer Guide — ThaiSupplyHub";

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = findGuide(slug);
  const title = g?.title ?? slug;
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
          {/* Label */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 32,
            }}
          >
            <div
              style={{
                background: "#ecfdf5",
                color: "#065f46",
                fontSize: 20,
                fontWeight: 800,
                letterSpacing: 3,
                padding: "6px 18px",
                borderRadius: 100,
                border: "1.5px solid #a7f3d0",
              }}
            >
              BUYER GUIDE
            </div>
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: title.length > 55 ? 46 : 56,
              fontWeight: 900,
              lineHeight: 1.08,
              letterSpacing: -1.5,
              color: "#0a0a0a",
              flex: 1,
              display: "flex",
              alignItems: "center",
            }}
          >
            {title.replace(/ — .*$/, "").replace(/ \(\d{4}\)$/, "")}
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
            <span>{sections} sections · {faqs} FAQs</span>
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
          <div style={{ color: "#a7f3d0", fontSize: 18, fontWeight: 700, letterSpacing: 2, textAlign: "center" }}>
            SOURCING GUIDE
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
