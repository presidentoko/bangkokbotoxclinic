import { ImageResponse } from "next/og";
import { getRecentPriceChanges } from "@/lib/db";

export const runtime = "nodejs";
export const alt = "Health checkup price trends in Thailand";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  let topDrop: { hospital: string; pkg: string; pct: number } | null = null;
  let dropCount = 0;

  try {
    const trends = await getRecentPriceChanges(30);
    const drops = trends.filter((t) => t.change_pct < 0).sort((a, b) => a.change_pct - b.change_pct);
    dropCount = drops.length;
    if (drops[0]) {
      topDrop = { hospital: drops[0].hospital_name, pkg: drops[0].package_name, pct: drops[0].change_pct };
    }
  } catch { /* ignore */ }

  return new ImageResponse(
    <div
      style={{
        background: "linear-gradient(135deg, #065f46 0%, #047857 50%, #064e3b 100%)",
        width: "100%", height: "100%",
        display: "flex", flexDirection: "column",
        justifyContent: "space-between", padding: "60px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: "8px", padding: "6px 14px", color: "white", fontSize: "14px", fontWeight: "700", letterSpacing: "0.05em" }}>
          BANGKOKTOPCLINIC.COM
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "18px", marginBottom: "12px" }}>
          📊 Price Trends
        </div>
        <div style={{ color: "white", fontSize: "48px", fontWeight: "800", lineHeight: "1.15", marginBottom: "20px" }}>
          {topDrop
            ? `${topDrop.pkg} at ${topDrop.hospital}`
            : "Health Checkup Price Trends"}
        </div>
        <div style={{ display: "flex", gap: "24px" }}>
          {topDrop && (
            <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: "12px", padding: "14px 24px", color: "white" }}>
              <div style={{ fontSize: "32px", fontWeight: "800" }}>▼ {Math.abs(topDrop.pct)}%</div>
              <div style={{ fontSize: "13px", opacity: 0.8 }}>Price drop</div>
            </div>
          )}
          {dropCount > 0 && (
            <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: "12px", padding: "14px 24px", color: "white" }}>
              <div style={{ fontSize: "32px", fontWeight: "800" }}>{dropCount}</div>
              <div style={{ fontSize: "13px", opacity: 0.8 }}>Packages cheaper this week</div>
            </div>
          )}
        </div>
      </div>

      <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>
        Tracking real hospital prices in Thailand, updated weekly
      </div>
    </div>,
    { ...size, headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" } },
  );
}
