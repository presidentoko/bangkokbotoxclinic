// Dynamic OG image — restaurant 별 unique 소셜 카드.
// SNS Stopper 브랜드 + anti-influencer voice 그대로.

import { ImageResponse } from "next/og";
import { loadMasterDb, getRestaurantById } from "@/lib/data";
import { CUISINE_LABELS } from "@/lib/types";
import { getSiteConfig } from "@/lib/site";

// Edge runtime 제거 — loadMasterDb 가 fs 사용 (Node only).
export const dynamic = "force-static";
export const alt = "Restaurant — Real Reviews, Not SNS Hype";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  const { loadMasterDb } = await import("@/lib/data");
  const db = await loadMasterDb();
  return db.restaurants.map((r) => ({ id: r.id }));
}

function simpleFallback(label: string, size: { width: number; height: number }) {
  return new ImageResponse(
    (
      <div style={{
        width: "100%", height: "100%", background: "#0a0a0a",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column", gap: "16px",
        fontFamily: "system-ui, sans-serif",
      }}>
        <div style={{ display: "flex", fontSize: 48, fontWeight: 800, color: "white" }}>
          {label.length > 50 ? label.slice(0, 48) + "..." : label}
        </div>
        <div style={{ display: "flex", fontSize: 22, color: "#737373" }}>Real reviews. No SNS hype.</div>
      </div>
    ),
    size
  );
}

export default async function RestaurantOG({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await loadMasterDb();
  const r = getRestaurantById(db.restaurants, id);
  const cfg = getSiteConfig();

  if (!r) return simpleFallback("Restaurant", size);

  // Sanitize name to ASCII-safe to avoid satori font lookup failures on Thai/CJK chars.
  const cuisines = r.cuisines.slice(0, 3).map((x) => CUISINE_LABELS[x] ?? x).join(" - ");
  const where = [r.district, r.city_label].filter(Boolean).map(s => s.replace(/[^\x00-\x7F]/g, "").trim()).filter(Boolean).join(", ");
  // Fully-Thai/Korean names strip to "" — fall back to cuisine+area instead of a bare "Restaurant" card.
  const safeName = r.name.replace(/[^\x00-\x7F]/g, "").trim()
    || (cuisines ? `${cuisines} Restaurant` : null)
    || (where ? `Restaurant in ${where}` : "Restaurant");
  const trust = Math.round(r.trust_score);
  const trustColor = trust >= 75 ? "#10b981" : trust >= 50 ? "#f59e0b" : "#737373";

  try {
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
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                display: "flex", alignItems: "center", gap: "8px",
                background: `${cfg.themeAccent}15`, color: cfg.themeAccent,
                padding: "6px 14px", borderRadius: 100,
                fontSize: 14, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1,
              }}
            >
              <span style={{ width: 7, height: 7, borderRadius: 4, background: cfg.themeAccent, display: "flex" }} />
              <span>No influencer - No paid review</span>
            </div>
            <div style={{ marginLeft: "auto", fontSize: 22, fontWeight: 700, color: "#525252", display: "flex" }}>
              {cfg.brand}
            </div>
          </div>

          {/* Main */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "60px", flex: 1 }}>
            <div style={{ display: "flex", fontSize: 64, fontWeight: 800, lineHeight: 1.05, letterSpacing: -1, color: "#0a0a0a", maxWidth: 1040 }}>
              {safeName.length > 60 ? safeName.slice(0, 58) + "..." : safeName}
            </div>
            {(where || cuisines) && (
              <div style={{ display: "flex", fontSize: 26, color: "#525252", gap: "10px" }}>
                {where && <span>{where}</span>}
                {where && cuisines && <span>-</span>}
                {cuisines && <span>{cuisines}</span>}
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{ display: "flex", gap: "40px", alignItems: "center", marginTop: "auto" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                <span style={{ display: "flex", fontSize: 48, fontWeight: 800, color: "#f59e0b" }}>{r.rating.toFixed(1)}</span>
                <span style={{ display: "flex", fontSize: 22, color: "#737373", fontWeight: 500 }}>/ 5 ({r.total_reviews.toLocaleString()})</span>
              </div>
              <div style={{ display: "flex", fontSize: 16, color: "#a3a3a3", textTransform: "uppercase", letterSpacing: 1 }}>
                Google reviews
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                <span style={{ display: "flex", fontSize: 48, fontWeight: 800, color: trustColor }}>{trust}</span>
                <span style={{ display: "flex", fontSize: 22, color: "#a3a3a3", fontWeight: 500 }}>/100</span>
              </div>
              <div style={{ display: "flex", fontSize: 16, color: "#a3a3a3", textTransform: "uppercase", letterSpacing: 1 }}>
                Trust Score
              </div>
            </div>

            <div
              style={{
                marginLeft: "auto",
                display: "flex", alignItems: "center",
                background: "#0a0a0a", color: "white",
                padding: "10px 18px", borderRadius: 100,
                fontSize: 16, fontWeight: 700,
              }}
            >
              Real reviews. No SNS hype.
            </div>
          </div>
        </div>
      ),
      size
    );
  } catch {
    return simpleFallback(safeName || r.name, size);
  }
}
