import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Health check-up guides for Thailand";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const GUIDE_TOPICS = [
  { icon: "📋", label: "Bangkok Guide" },
  { icon: "🎗️", label: "Cancer Screening" },
  { icon: "❤️", label: "Cardiac Health" },
  { icon: "♀️", label: "Women's Health" },
  { icon: "🏆", label: "JCI Hospitals" },
  { icon: "🏝️", label: "Phuket Guide" },
  { icon: "🌸", label: "Chiang Mai" },
  { icon: "👴", label: "Senior Health" },
  { icon: "🌍", label: "Expat Health" },
];

export default async function OgImage() {
  return new ImageResponse(
    <div
      style={{
        background: "linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)",
        width: "100%", height: "100%",
        display: "flex", flexDirection: "column",
        justifyContent: "space-between", padding: "60px",
      }}
    >
      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ display: "flex", background: "rgba(255,255,255,0.15)", borderRadius: "8px", padding: "6px 14px", color: "white", fontSize: "13px", fontWeight: "700", letterSpacing: "0.05em" }}>
          BANGKOKTOPCLINIC.COM
        </div>
        <div style={{ display: "flex", color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>
          Expert Guides
        </div>
      </div>

      {/* Main content */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", color: "rgba(255,255,255,0.7)", fontSize: "20px", marginBottom: "12px" }}>
          {"\u{1F4DA} Health Check-Up Knowledge Base"}
        </div>
        <div style={{ display: "flex", flexDirection: "column", color: "white", fontSize: "50px", fontWeight: "800", lineHeight: "1.1", marginBottom: "28px" }}>
          <span style={{ display: "flex" }}>29 Expert Guides to</span>
          <span style={{ display: "flex" }}>Thai Medical Tourism</span>
        </div>

        {/* Topic pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {GUIDE_TOPICS.map((g) => (
            <div key={g.label} style={{
              background: "rgba(255,255,255,0.15)",
              borderRadius: "8px", padding: "8px 16px",
              color: "white", fontSize: "14px",
              display: "flex", alignItems: "center", gap: "6px",
            }}>
              <span style={{ display: "flex" }}>{g.icon}</span>
              <span style={{ display: "flex" }}>{g.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div style={{ display: "flex", color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>
        Bangkok · Chiang Mai · Phuket · Pattaya · Hua Hin — free, no registration
      </div>
    </div>,
    { ...size, headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" } },
  );
}
