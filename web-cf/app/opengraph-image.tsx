// Dynamic OG image — Next.js Image Response API. 모든 페이지의 og:image 으로 사용.
import { ImageResponse } from "next/og";
import { getSiteConfig } from "@/lib/site";

// Cloudflare(OpenNext): edge 런타임 미지원 → 500. nodejs 기본값 사용.
export const alt = "Bangkok Clinics — Verified Reviews & Trust Scores";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  const cfg = getSiteConfig();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%",
          display: "flex", flexDirection: "column",
          background: `linear-gradient(135deg, white 0%, ${cfg.themeAccent}10 100%)`,
          padding: "80px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "auto" }}>
          <div
            style={{
              width: 48, height: 48, borderRadius: 24,
              background: cfg.themeAccent, color: "white",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 32, fontWeight: 800,
            }}
          >+</div>
          <div style={{ fontSize: 28, fontWeight: 800, display: "flex" }}>
            <span>bkk</span>
            <span style={{ color: cfg.themeAccent }}>clinics</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.05, letterSpacing: -1.5, color: "#0a0a0a" }}>
            {cfg.hero}
          </div>
          <div style={{ fontSize: 28, color: "#525252", maxWidth: 1000 }}>
            {cfg.heroSub}
          </div>
        </div>

        <div style={{ display: "flex", gap: "24px", marginTop: "auto", color: "#737373", fontSize: 22 }}>
          <span>★ Trust Scores</span>
          <span>·</span>
          <span>Real Google Reviews</span>
          <span>·</span>
          <span>Updated continuously</span>
        </div>
      </div>
    ),
    size
  );
}
