import { ImageResponse } from "next/og";
import { catLabel, type Locale } from "@/lib/i18n";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CAT_ICONS: Record<string, string> = {
  comprehensive: "🔬", executive: "💼", cancer: "🎗️",
  cardiac: "❤️", women: "♀️", men: "♂️", basic: "📋", age: "🗓️",
};

const CAT_COLORS: Record<string, [string, string]> = {
  comprehensive: ["#1e3a5f", "#1d6fa4"],
  executive:     ["#1c2b4a", "#2563eb"],
  cancer:        ["#3b0a0a", "#be123c"],
  cardiac:       ["#3b0a0a", "#dc2626"],
  women:         ["#3b0a2b", "#be185d"],
  men:           ["#0a1b3b", "#0284c7"],
  basic:         ["#1e2a3b", "#475569"],
};

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; type: string }>;
}) {
  const { locale, type } = await params;
  // Satori's default font shaper can't render Arabic script — any Arabic
  // text throws "lookupType: 5 - substFormat: 3 is not yet supported" while
  // piping the response (upstream Satori/resvg limitation). Fall back to
  // the English category label for the ar locale's OG image only; the page
  // itself stays fully Arabic.
  const loc = (locale === "ar" ? "en" : locale) as Locale;
  const label = catLabel(loc, type);
  const icon = CAT_ICONS[type] ?? "🏥";
  const [dark, mid] = CAT_COLORS[type] ?? ["#1e3a5f", "#1d6fa4"];

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200, height: 630,
          background: `linear-gradient(135deg, ${dark} 0%, ${mid} 100%)`,
          display: "flex", flexDirection: "column",
          padding: "60px 64px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 72, marginBottom: 24 }}>{icon}</div>

        <div style={{ display: "flex", flexDirection: "column", fontSize: 52, fontWeight: 800, color: "white", lineHeight: 1.2, marginBottom: 20 }}>
          <span style={{ display: "flex" }}>{`${label} Health`}</span>
          <span style={{ display: "flex" }}>Check-Ups in Bangkok</span>
        </div>

        <div style={{ display: "flex", fontSize: 22, color: "rgba(255,255,255,0.75)", marginBottom: "auto" }}>
          Compare real prices from every Bangkok hospital
        </div>

        {/* Bottom bar */}
        <div style={{
          display: "flex", gap: 32, alignItems: "center",
          borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: 28,
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <span style={{ display: "flex", fontSize: 28, fontWeight: 800, color: "white" }}>235+</span>
            <span style={{ display: "flex", fontSize: 12, color: "rgba(255,255,255,0.6)" }}>Hospitals</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <span style={{ display: "flex", fontSize: 28, fontWeight: 800, color: "white" }}>0</span>
            <span style={{ display: "flex", fontSize: 12, color: "rgba(255,255,255,0.6)" }}>Paid rankings</span>
          </div>
          <div style={{
            display: "flex",
            marginLeft: "auto",
            background: "rgba(255,255,255,0.15)",
            borderRadius: 12, padding: "10px 20px",
            color: "white", fontSize: 15, fontWeight: 700,
          }}>
            bangkoktopclinic.com
          </div>
        </div>
      </div>
    ),
    { ...size, headers: { "Cache-Control": "public, s-maxage=31536000, stale-while-revalidate=31536000, immutable" } },
  );
}
