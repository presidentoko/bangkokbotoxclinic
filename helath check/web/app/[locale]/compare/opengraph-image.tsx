import { ImageResponse } from "next/og";
import { CATEGORIES, catLabel, type Locale } from "@/lib/i18n";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CAT_ICONS: Record<string, string> = {
  comprehensive: "🔬", executive: "💼", cancer: "🎗️",
  cardiac: "❤️", women: "♀️", men: "♂️", basic: "📋",
};

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const loc = locale as Locale;

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200, height: 630,
          background: "linear-gradient(135deg, #1e3a5f 0%, #1d6fa4 60%, #2196c4 100%)",
          display: "flex", flexDirection: "column",
          padding: "48px 56px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Top badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
          <div style={{
            background: "rgba(255,255,255,0.15)", borderRadius: 100,
            padding: "6px 16px", color: "rgba(255,255,255,0.9)", fontSize: 14, fontWeight: 600,
          }}>
            No paid rankings · Scraped directly from hospital websites
          </div>
        </div>

        {/* Main heading */}
        <div style={{ fontSize: 54, fontWeight: 800, color: "white", lineHeight: 1.15, marginBottom: 24, flex: 1 }}>
          Compare Health Check-Up<br />Prices in Thailand
        </div>

        {/* Category pills */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 40 }}>
          {CATEGORIES.slice(0, 6).map((cat) => (
            <div key={cat} style={{
              background: "rgba(255,255,255,0.18)",
              borderRadius: 8, padding: "8px 16px",
              color: "white", fontSize: 15, fontWeight: 600, display: "flex", alignItems: "center", gap: 6,
            }}>
              {CAT_ICONS[cat] ?? "📋"} {catLabel(loc, cat)}
            </div>
          ))}
        </div>

        {/* Stats bar */}
        <div style={{
          display: "flex", gap: 32,
          borderTop: "1px solid rgba(255,255,255,0.25)", paddingTop: 24,
        }}>
          {[
            { val: "235+", label: "Hospitals" },
            { val: "18", label: "Cities" },
            { val: "6", label: "Languages" },
            { val: "฿0", label: "Paid rankings" },
          ].map(({ val, label }) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 32, fontWeight: 800, color: "white" }}>{val}</span>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.65)" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
