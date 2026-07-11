import { ImageResponse } from "next/og";
import { getStatsForHome } from "@/lib/db";

export const runtime = "nodejs";
export const alt = "Health check-up hospitals in Thailand";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CITIES = [
  { name: "Bangkok", count: "150+" },
  { name: "Chiang Mai", count: "25+" },
  { name: "Phuket", count: "20+" },
  { name: "Pattaya", count: "15+" },
  { name: "Hua Hin", count: "8+" },
  { name: "Ko Samui", count: "6+" },
];

export default async function OgImage() {
  let hospitalCount = 235;
  let jciCount = 0;
  try {
    const s = await getStatsForHome();
    if (s.hospitalCount) hospitalCount = s.hospitalCount;
    if (s.jciCount) jciCount = s.jciCount;
  } catch { /* ignore */ }

  return new ImageResponse(
    <div
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #1d4ed8 100%)",
        width: "100%", height: "100%",
        display: "flex", flexDirection: "column",
        justifyContent: "space-between", padding: "60px",
      }}
    >
      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", background: "rgba(255,255,255,0.12)", borderRadius: "8px", padding: "6px 14px", color: "white", fontSize: "13px", fontWeight: "700", letterSpacing: "0.05em" }}>
          BANGKOKTOPCLINIC.COM
        </div>
        <div style={{ display: "flex", color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>
          No ads · No paid rankings
        </div>
      </div>

      {/* Main content */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", color: "rgba(255,255,255,0.6)", fontSize: "18px", marginBottom: "10px" }}>
          🏥 Compare Health Check-Up Hospitals
        </div>
        <div style={{ display: "flex", color: "white", fontSize: "52px", fontWeight: "800", lineHeight: "1.1", marginBottom: "24px" }}>
          {hospitalCount}+ Hospitals Across Thailand
        </div>

        {/* City pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "24px" }}>
          {CITIES.map((c) => (
            <div key={c.name} style={{
              display: "flex",
              background: "rgba(255,255,255,0.12)",
              borderRadius: "8px", padding: "8px 14px",
              color: "white", fontSize: "14px",
            }}>
              <span style={{ display: "flex" }}>{c.name}</span>
              <span style={{ display: "flex", color: "rgba(255,255,255,0.6)", fontSize: "12px", marginLeft: "4px" }}>{c.count}</span>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: "20px" }}>
          {jciCount > 0 && (
            <div style={{ display: "flex", flexDirection: "column", background: "#fbbf24", borderRadius: "10px", padding: "12px 20px", color: "#1e293b" }}>
              <div style={{ display: "flex", fontSize: "26px", fontWeight: "800" }}>{jciCount}</div>
              <div style={{ display: "flex", fontSize: "11px", fontWeight: "600" }}>JCI Accredited</div>
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", background: "rgba(255,255,255,0.12)", borderRadius: "10px", padding: "12px 20px", color: "white" }}>
            <div style={{ display: "flex", fontSize: "26px", fontWeight: "800" }}>18</div>
            <div style={{ display: "flex", fontSize: "11px", opacity: 0.7 }}>Cities</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", background: "rgba(255,255,255,0.12)", borderRadius: "10px", padding: "12px 20px", color: "white" }}>
            <div style={{ display: "flex", fontSize: "26px", fontWeight: "800" }}>6</div>
            <div style={{ display: "flex", fontSize: "11px", opacity: 0.7 }}>Languages</div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div style={{ display: "flex", color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>
        Real prices scraped daily — compare executive, comprehensive, cancer, and cardiac packages
      </div>
    </div>,
    { ...size, headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" } },
  );
}
