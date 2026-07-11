import { ImageResponse } from "next/og";
import { catLabel, type Locale } from "@/lib/i18n";
import { getPackage } from "@/lib/db";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; type: string; hospital: string }>;
}) {
  const { locale, type, hospital } = await params;
  // Satori's default font shaper can't render Arabic script — any Arabic
  // text throws "lookupType: 5 - substFormat: 3 is not yet supported" while
  // piping the response (upstream Satori/resvg limitation). Fall back to
  // the English category label for the ar locale's OG image only; the page
  // itself stays fully Arabic.
  const loc = (locale === "ar" ? "en" : locale) as Locale;
  const label = catLabel(loc, type);
  let hospitalName = hospital.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  let price = "";
  let jci = false;

  try {
    const pkg = await getPackage(type, hospital);
    if (pkg) {
      hospitalName = pkg.hospital_name;
      jci = pkg.jci === 1;
      if (pkg.price) price = `฿${parseFloat(pkg.price).toLocaleString()}`;
    }
  } catch { /* ignore */ }

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200, height: 630,
          background: "linear-gradient(135deg, #1c2b4a 0%, #2563eb 100%)",
          display: "flex", flexDirection: "column",
          padding: "60px 64px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div style={{ display: "flex", background: "rgba(255,255,255,0.15)", borderRadius: 8, padding: "6px 14px", color: "white", fontSize: 14, fontWeight: 700, letterSpacing: "0.05em" }}>
            BANGKOKTOPCLINIC.COM
          </div>
          {jci && (
            <div style={{ display: "flex", background: "#fbbf24", borderRadius: 6, padding: "4px 10px", color: "#1e293b", fontSize: 12, fontWeight: 800 }}>
              JCI ACCREDITED
            </div>
          )}
        </div>

        <div style={{ display: "flex", fontSize: 22, color: "rgba(255,255,255,0.7)", marginBottom: 12 }}>
          {`${label} Health Check-Up`}
        </div>
        <div style={{ display: "flex", fontSize: 52, fontWeight: 800, color: "white", lineHeight: 1.2, marginBottom: "auto" }}>
          {`at ${hospitalName}`}
        </div>

        {price && (
          <div style={{
            display: "flex", alignItems: "baseline", gap: 16,
            borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: 28,
          }}>
            <span style={{ display: "flex", fontSize: 56, fontWeight: 800, color: "white" }}>{price}</span>
            <span style={{ display: "flex", fontSize: 18, color: "rgba(255,255,255,0.7)" }}>real scraped price</span>
          </div>
        )}
      </div>
    ),
    { ...size, headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" } },
  );
}
