// OG image for /famous-vs-good index page.

import { ImageResponse } from "next/og";
import { loadMasterDb } from "@/lib/data";

export const dynamic = "force-static";
export const alt = "Instagram Famous vs Actually Good — Bangkok Restaurant Data";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function FamousVsGoodIndexOG() {
  const db = await loadMasterDb();
  const totalReviews = db.restaurants.reduce((s, r) => s + r.total_reviews, 0);

  const ORANGE = "#ea580c";
  const DARK = "#0a0a0a";
  const MUTED = "#737373";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#fafafa",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div style={{ height: 6, background: ORANGE, display: "flex" }} />

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "60px 80px",
          }}
        >
          {/* Brand pill */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: `${ORANGE}18`,
              padding: "8px 18px",
              borderRadius: 100,
              marginBottom: 44,
              alignSelf: "flex-start",
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: 4, background: ORANGE, display: "flex" }} />
            <span style={{ display: "flex", fontSize: 14, fontWeight: 700, color: ORANGE, textTransform: "uppercase", letterSpacing: 1 }}>
              SNS Stopper
            </span>
          </div>

          {/* Headline */}
          <div style={{ display: "flex", flexDirection: "column", marginBottom: 24 }}>
            <span style={{ display: "flex", fontSize: 72, fontWeight: 900, lineHeight: 1.05, letterSpacing: -2, color: DARK }}>
              Instagram Famous
            </span>
            <span style={{ display: "flex", fontSize: 72, fontWeight: 900, lineHeight: 1.05, letterSpacing: -2, color: ORANGE }}>
              vs Actually Good
            </span>
          </div>

          {/* Sub */}
          <div style={{ display: "flex", flexWrap: "wrap", fontSize: 24, color: MUTED, marginBottom: 48, maxWidth: 700 }}>
            <span style={{ display: "flex" }}>Social media picks by aesthetics. We rank by&nbsp;</span>
            <span style={{ display: "flex", color: DARK, fontWeight: 700 }}>{db.total_restaurants.toLocaleString()}</span>
            <span style={{ display: "flex" }}>&nbsp;Google reviews.</span>
          </div>

          {/* Stat pills */}
          <div style={{ display: "flex", gap: 16 }}>
            {[
              `${db.total_restaurants.toLocaleString()} restaurants`,
              `${(totalReviews / 1_000_000).toFixed(1)}M reviews`,
              "Bangkok · Pattaya",
            ].map((s) => (
              <div
                key={s}
                style={{
                  display: "flex",
                  padding: "10px 22px",
                  background: "white",
                  border: "1.5px solid #e5e7eb",
                  borderRadius: 100,
                  fontSize: 16,
                  fontWeight: 600,
                  color: DARK,
                }}
              >
                {s}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            padding: "16px 80px",
            background: DARK,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ display: "flex", color: "#a3a3a3", fontSize: 15 }}>
            Real data. No influencers. No paid reviews.
          </span>
          <span style={{ display: "flex", color: "white", fontSize: 15, fontWeight: 700 }}>
            snsstopper.com
          </span>
        </div>
      </div>
    ),
    size
  );
}
