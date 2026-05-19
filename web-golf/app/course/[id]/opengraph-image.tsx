// Dynamic OG image per course — Next.js Image Response API. Prerendered at
// build time for every course in master_db. Replaces raw Google photo URLs
// (which can hotlink-break) with our own branded card.

import { ImageResponse } from "next/og";
import { loadMasterDb, getRestaurantById } from "@/lib/data";

export const alt = "Golf course details — Thailand Golf Guide";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  const db = await loadMasterDb();
  return db.restaurants.map((r) => ({ id: r.id }));
}

export default async function CourseOG({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await loadMasterDb();
  const r = getRestaurantById(db.restaurants, id);

  // Sensible fallback if course gone (shouldn't happen — generateStaticParams covers all)
  if (!r) {
    return new ImageResponse(
      (
        <div style={{ width: "100%", height: "100%", display: "flex", background: "white" }} />
      ),
      size
    );
  }

  const trustColor =
    r.trust_score >= 75 ? "#16a34a" :
    r.trust_score >= 60 ? "#059669" :
    "#ca8a04";

  const accent = "#15803d";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "70px 80px",
          background: `linear-gradient(135deg, white 0%, ${accent}10 50%, ${accent}25 100%)`,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Brand row */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "auto" }}>
          <div
            style={{
              width: 52, height: 52, borderRadius: 26,
              background: accent, color: "white",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 28, fontWeight: 800,
            }}
          >⛳</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#262626", display: "flex" }}>
            <span>thailand</span>
            <span style={{ color: accent }}>golf</span>
            <span style={{ color: "#737373" }}>guide</span>
          </div>
          <div style={{ flex: 1 }} />
          {r.is_korean_friendly && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "8px 16px",
                background: "#fff1f2",
                borderRadius: 999,
                fontSize: 18,
                fontWeight: 700,
                color: "#9f1239",
              }}
            >
              🇰🇷 Korean-friendly
            </div>
          )}
        </div>

        {/* Course name */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: -1.5,
            color: "#0a0a0a",
            marginBottom: "20px",
            maxWidth: "1040px",
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          {r.name.length > 50 ? r.name.slice(0, 50) + "…" : r.name}
        </div>

        {/* Location + category */}
        <div style={{ fontSize: 26, color: "#525252", marginBottom: "44px", display: "flex" }}>
          📍 {r.district || r.city_label || "Thailand"} · {r.primary_type}
        </div>

        {/* Trust + Rating row */}
        <div style={{ display: "flex", gap: "28px", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              background: trustColor,
              color: "white",
              padding: "20px 28px",
              borderRadius: 20,
              minWidth: "140px",
            }}
          >
            <div style={{ fontSize: 60, fontWeight: 800, lineHeight: 1 }}>
              {r.trust_score.toFixed(0)}
            </div>
            <div style={{ fontSize: 14, fontWeight: 800, opacity: 0.9, marginTop: 6, letterSpacing: 1 }}>
              TRUST · 100
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ fontSize: 44, fontWeight: 800, color: "#a16207", display: "flex" }}>
              ⭐ {r.rating.toFixed(1)}
            </div>
            <div style={{ fontSize: 22, color: "#525252", display: "flex" }}>
              {r.total_reviews.toLocaleString()} Google reviews
            </div>
          </div>

          {r.holes && (
            <>
              <div style={{ width: 1, height: 80, background: "#d4d4d4" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ fontSize: 44, fontWeight: 800, color: "#0a0a0a", display: "flex" }}>
                  {r.holes}
                </div>
                <div style={{ fontSize: 18, color: "#525252", display: "flex" }}>
                  holes{r.par ? ` · Par ${r.par}` : ""}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: "auto",
            paddingTop: "32px",
            fontSize: 18,
            color: "#737373",
            display: "flex",
            gap: 14,
          }}
        >
          <span>thailandgolfguide.com</span>
          <span>·</span>
          <span>Verified Google review analysis</span>
          <span>·</span>
          <span>No paid placement in organic rank</span>
        </div>
      </div>
    ),
    size
  );
}
