// Dynamic OG image — clinic 별 unique 소셜 카드.
// Twitter/Facebook/LINE/Slack 공유 시 각 클리닉의 정보가 보임.

import { ImageResponse } from "next/og";
import { loadMasterDb, getClinicById } from "@/lib/data";
import { CATEGORY_LABELS } from "@/lib/types";
import { getSiteConfig } from "@/lib/site";

export const runtime = "edge";
export const alt = "Clinic — Reviews & Trust Score";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function ClinicOG({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await loadMasterDb();
  const c = getClinicById(db.clinics, id);
  const cfg = getSiteConfig();

  if (!c) {
    return new ImageResponse(
      (
        <div style={{
          width: "100%", height: "100%", background: "white",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 48, color: "#737373", fontFamily: "system-ui, sans-serif",
        }}>
          Clinic not found
        </div>
      ),
      size
    );
  }

  const cats = c.categories.slice(0, 3).map((x) => CATEGORY_LABELS[x] ?? x).join(" · ");
  const trust = c.trust_score;
  const trustColor = trust >= 75 ? "#10b981" : trust >= 50 ? "#f59e0b" : "#737373";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%",
          display: "flex", flexDirection: "column",
          background: `linear-gradient(135deg, white 0%, ${cfg.themeAccent}10 100%)`,
          padding: "70px 80px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Header — brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: 36, height: 36, borderRadius: 18,
              background: cfg.themeAccent, color: "white",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 24, fontWeight: 800,
            }}
          >+</div>
          <div style={{ fontSize: 22, fontWeight: 700, display: "flex", color: "#525252" }}>
            <span>bkk</span>
            <span style={{ color: cfg.themeAccent }}>clinics</span>
          </div>
        </div>

        {/* Main — clinic name */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "60px", flex: 1 }}>
          <div
            style={{
              fontSize: 64, fontWeight: 800, lineHeight: 1.05, letterSpacing: -1,
              color: "#0a0a0a", maxWidth: 1040,
            }}
          >
            {c.name.length > 60 ? c.name.slice(0, 58) + "…" : c.name}
          </div>
          {(c.district || cats) && (
            <div style={{ fontSize: 26, color: "#525252", display: "flex", gap: "10px" }}>
              {c.district && <span>📍 {c.district}</span>}
              {c.district && cats && <span>·</span>}
              {cats && <span>{cats}</span>}
            </div>
          )}
        </div>

        {/* Footer — rating + trust */}
        <div style={{ display: "flex", gap: "40px", alignItems: "center", marginTop: "auto" }}>
          {/* Rating */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <div style={{ fontSize: 48, fontWeight: 800, color: "#0a0a0a", display: "flex", alignItems: "baseline", gap: "8px" }}>
              <span style={{ color: "#f59e0b" }}>★</span>
              <span>{c.rating.toFixed(1)}</span>
              <span style={{ fontSize: 22, color: "#737373", fontWeight: 500 }}>
                ({c.total_reviews.toLocaleString()})
              </span>
            </div>
            <div style={{ fontSize: 16, color: "#a3a3a3", textTransform: "uppercase", letterSpacing: 1 }}>
              Google reviews
            </div>
          </div>

          {/* Trust Score */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <div style={{ fontSize: 48, fontWeight: 800, color: trustColor }}>
              {trust}
              <span style={{ fontSize: 22, color: "#a3a3a3", fontWeight: 500 }}>/100</span>
            </div>
            <div style={{ fontSize: 16, color: "#a3a3a3", textTransform: "uppercase", letterSpacing: 1 }}>
              Trust Score
            </div>
          </div>

          {/* Verified badge */}
          <div
            style={{
              marginLeft: "auto",
              display: "flex", alignItems: "center", gap: "8px",
              background: "#10b98115", color: "#047857",
              padding: "10px 18px", borderRadius: 100,
              fontSize: 18, fontWeight: 700,
            }}
          >
            <span>✓</span>
            <span>Verified by reviews</span>
          </div>
        </div>
      </div>
    ),
    size
  );
}
