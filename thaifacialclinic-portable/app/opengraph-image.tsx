import { ImageResponse } from "next/og";

export const alt = "Bangkok Hair Transplant Clinics — FUE, DHI & Verified Reviews";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ACCENT = "#dcaa4a";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div style={{
        width: "100%", height: "100%",
        display: "flex", flexDirection: "column", justifyContent: "center",
        background: `linear-gradient(135deg, #0a1929 0%, #142a42 100%)`,
        padding: "64px 80px",
        fontFamily: "system-ui, sans-serif",
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          background: `${ACCENT}22`, borderRadius: 999,
          padding: "8px 20px", width: "auto",
          border: `1px solid ${ACCENT}55`,
        }}>
          <div style={{ width: 10, height: 10, borderRadius: 999, background: ACCENT, display: "flex" }} />
          <div style={{ fontSize: 20, color: ACCENT, fontWeight: 700, letterSpacing: 1, display: "flex" }}>
            THAI FACIAL CLINIC
          </div>
        </div>

        <div style={{
          fontSize: 64, fontWeight: 800, color: "#ffffff",
          lineHeight: 1.1, letterSpacing: -1, marginTop: 36,
          maxWidth: 1000, display: "flex",
        }}>
          Bangkok Hair Transplant Clinics
        </div>

        <div style={{ fontSize: 26, color: "#b8c4d4", marginTop: 20, display: "flex" }}>
          FUE · DHI · SMP — Verified Reviews, Trust Score Ranked
        </div>
      </div>
    ),
    size,
  );
}
