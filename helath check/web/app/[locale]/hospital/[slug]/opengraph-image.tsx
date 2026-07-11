import { ImageResponse } from "next/og";
import { getHospital } from "@/lib/db";

export const runtime = "nodejs";
export const alt = "Hospital health check-up packages";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  let name = slug.replace(/-/g, " ");
  let city = "Thailand";
  let minPrice = "";
  let jci = false;
  let packageCount = 0;

  try {
    const h = await getHospital(slug);
    if (h) {
      name = h.name;
      city = h.city || h.area || "Thailand";
      jci = h.jci === 1;
      packageCount = h.package_count;
      if (h.min_price) minPrice = `From ฿${parseFloat(h.min_price).toLocaleString()}`;
    }
  } catch { /* ignore */ }

  return new ImageResponse(
    <div
      style={{
        background: "linear-gradient(135deg, #1d4ed8 0%, #1e40af 50%, #1d3a8c 100%)",
        width: "100%", height: "100%",
        display: "flex", flexDirection: "column",
        justifyContent: "space-between", padding: "60px",
      }}
    >
      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ display: "flex", background: "rgba(255,255,255,0.15)", borderRadius: "8px", padding: "6px 14px", color: "white", fontSize: "14px", fontWeight: "700", letterSpacing: "0.05em" }}>
          BANGKOKTOPCLINIC.COM
        </div>
        {jci && (
          <div style={{ display: "flex", background: "#fbbf24", borderRadius: "6px", padding: "4px 10px", color: "#1e293b", fontSize: "12px", fontWeight: "800" }}>
            JCI ACCREDITED
          </div>
        )}
      </div>

      {/* Main content */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", color: "rgba(255,255,255,0.7)", fontSize: "18px", marginBottom: "12px" }}>
          {`\u{1F4CD} ${city}`}
        </div>
        <div style={{ display: "flex", color: "white", fontSize: "52px", fontWeight: "800", lineHeight: "1.1", marginBottom: "20px" }}>
          {name}
        </div>
        <div style={{ display: "flex", gap: "24px" }}>
          {packageCount > 0 && (
            <div style={{ display: "flex", flexDirection: "column", background: "rgba(255,255,255,0.15)", borderRadius: "12px", padding: "14px 24px", color: "white" }}>
              <div style={{ display: "flex", fontSize: "28px", fontWeight: "800" }}>{packageCount}</div>
              <div style={{ display: "flex", fontSize: "13px", opacity: 0.8 }}>Packages</div>
            </div>
          )}
          {minPrice && (
            <div style={{ display: "flex", flexDirection: "column", background: "rgba(255,255,255,0.15)", borderRadius: "12px", padding: "14px 24px", color: "white" }}>
              <div style={{ display: "flex", fontSize: "28px", fontWeight: "800" }}>{minPrice}</div>
              <div style={{ display: "flex", fontSize: "13px", opacity: 0.8 }}>Starting price</div>
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", background: "rgba(255,255,255,0.15)", borderRadius: "12px", padding: "14px 24px", color: "white" }}>
            <div style={{ display: "flex", fontSize: "28px", fontWeight: "800" }}>Real</div>
            <div style={{ display: "flex", fontSize: "13px", opacity: 0.8 }}>Prices only</div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div style={{ display: "flex", color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>
        Compare health check-up packages — no ads, no paid rankings
      </div>
    </div>,
    { ...size, headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" } },
  );
}
