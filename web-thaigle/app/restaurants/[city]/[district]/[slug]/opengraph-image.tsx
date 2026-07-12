import { ImageResponse } from "next/og";
import { loadMasterDb } from "@/lib/data";
import { getSlugMap, getRestaurantBySlug, getAllRestaurantParams } from "@/lib/restaurants";
import { CUISINE_LABELS } from "@/lib/types";
import { getSiteConfig } from "@/lib/site";

export const alt = "Restaurant — Real Reviews, Not SNS Hype";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Mirror the parent page's static params so this doesn't fall back to an
// on-demand ImageResponse render (invocation + CPU) per social-crawler hit.
export const dynamicParams = false;

export async function generateStaticParams() {
  const slugMap = await getSlugMap();
  return getAllRestaurantParams(slugMap);
}

export default async function RestaurantOG({ params }: { params: Promise<{ city: string; district: string; slug: string }> }) {
  const { city, district, slug } = await params;
  const [db, slugMap] = await Promise.all([loadMasterDb(), getSlugMap()]);
  const r = getRestaurantBySlug(db.restaurants, slugMap, city, district, slug);
  const cfg = getSiteConfig();

  if (!r) {
    return new ImageResponse(
      (
        <div style={{
          width: "100%", height: "100%", background: "white",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 48, color: "#737373", fontFamily: "system-ui, sans-serif",
        }}>
          Restaurant not found
        </div>
      ),
      size
    );
  }

  const cuisines = r.cuisines.slice(0, 3).map((x) => CUISINE_LABELS[x] ?? x).join(" · ");
  const trust = r.trust_score;
  const trustColor = trust >= 75 ? "#10b981" : trust >= 50 ? "#f59e0b" : "#737373";
  const where = [r.district, r.city_label].filter(Boolean).join(", ");

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
            <span>No influencer · No paid review</span>
          </div>
          <div style={{ marginLeft: "auto", fontSize: 22, fontWeight: 700, color: "#525252", display: "flex" }}>
            {cfg.brand}
          </div>
        </div>

        {/* Main */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "60px", flex: 1 }}>
          <div
            style={{
              fontSize: 64, fontWeight: 800, lineHeight: 1.05, letterSpacing: -1,
              color: "#0a0a0a", maxWidth: 1040, display: "flex",
            }}
          >
            {r.name.length > 60 ? r.name.slice(0, 58) + "…" : r.name}
          </div>
          {(where || cuisines) && (
            <div style={{ fontSize: 26, color: "#525252", display: "flex", gap: "10px" }}>
              {where && <span>📍 {where}</span>}
              {where && cuisines && <span>·</span>}
              {cuisines && <span>{cuisines}</span>}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ display: "flex", gap: "40px", alignItems: "center", marginTop: "auto" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <div style={{ fontSize: 48, fontWeight: 800, color: "#0a0a0a", display: "flex", alignItems: "center", gap: "10px" }}>
              {/* Solid-color accent instead of a "★" glyph — that Unicode
                  range isn't in Satori's bundled font and triggers a
                  network fetch to Google Fonts per render, which is too
                  flaky/rate-limited across 3,000+ static-export renders. */}
              <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#f59e0b", display: "flex" }} />
              <span>{r.rating.toFixed(1)}</span>
              <span style={{ fontSize: 22, color: "#737373", fontWeight: 500 }}>
                ({r.total_reviews.toLocaleString()})
              </span>
            </div>
            <div style={{ fontSize: 16, color: "#a3a3a3", textTransform: "uppercase", letterSpacing: 1, display: "flex" }}>
              Google reviews
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <div style={{ fontSize: 48, fontWeight: 800, color: trustColor, display: "flex", alignItems: "baseline", gap: "4px" }}>
              <span>{trust}</span>
              <span style={{ fontSize: 22, color: "#a3a3a3", fontWeight: 500 }}>/100</span>
            </div>
            <div style={{ fontSize: 16, color: "#a3a3a3", textTransform: "uppercase", letterSpacing: 1, display: "flex" }}>
              Trust Score
            </div>
          </div>

          <div
            style={{
              marginLeft: "auto",
              display: "flex", alignItems: "center", gap: "8px",
              background: "#0a0a0a", color: "white",
              padding: "10px 18px", borderRadius: 100,
              fontSize: 16, fontWeight: 700,
            }}
          >
            <span>Real reviews. No SNS hype.</span>
          </div>
        </div>
      </div>
    ),
    size
  );
}
