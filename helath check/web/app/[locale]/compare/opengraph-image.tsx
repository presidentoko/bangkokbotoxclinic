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
  // Satori's default font shaper can't render Arabic script — any Arabic
  // text throws "lookupType: 5 - substFormat: 3 is not yet supported" while
  // piping the response (upstream Satori/resvg limitation). Fall back to
  // English category labels for the ar locale's OG image only; the page
  // itself stays fully Arabic.
  const loc = (locale === "ar" ? "en" : locale) as Locale;

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
            display: "flex",
            background: "rgba(255,255,255,0.15)", borderRadius: 100,
            padding: "6px 16px", color: "rgba(255,255,255,0.9)", fontSize: 14, fontWeight: 600,
          }}>
            No paid rankings · Scraped directly from hospital websites
          </div>
        </div>

        {/* Main heading */}
        <div style={{ display: "flex", flexDirection: "column", fontSize: 54, fontWeight: 800, color: "white", lineHeight: 1.15, marginBottom: 24, flex: 1 }}>
          <span style={{ display: "flex" }}>Compare Health Check-Up</span>
          <span style={{ display: "flex" }}>Prices in Thailand</span>
        </div>

        {/* Category pills */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 40 }}>
          {CATEGORIES.slice(0, 6).map((cat) => (
            <div key={cat} style={{
              background: "rgba(255,255,255,0.18)",
              borderRadius: 8, padding: "8px 16px",
              color: "white", fontSize: 15, fontWeight: 600, display: "flex", alignItems: "center", gap: 6,
            }}>
              <span style={{ display: "flex" }}>{CAT_ICONS[cat] ?? "📋"}</span>
              <span style={{ display: "flex" }}>{catLabel(loc, cat)}</span>
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
              <span style={{ display: "flex", fontSize: 32, fontWeight: 800, color: "white" }}>{val}</span>
              <span style={{ display: "flex", fontSize: 13, color: "rgba(255,255,255,0.65)" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size, headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" } },
  );
}
