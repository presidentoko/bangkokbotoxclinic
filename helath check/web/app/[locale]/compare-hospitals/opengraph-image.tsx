import { ImageResponse } from "next/og";
import { getHospital } from "@/lib/db";

export const runtime = "nodejs";
export const alt = "Compare hospital health check-up packages";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({
  searchParams,
}: {
  searchParams?: Promise<{ a?: string; b?: string }>;
}) {
  const { a, b } = (await searchParams) ?? {};
  let nameA = a ? a.replace(/-/g, " ") : "";
  let nameB = b ? b.replace(/-/g, " ") : "";

  try {
    if (a && b) {
      const [hospA, hospB] = await Promise.all([getHospital(a), getHospital(b)]);
      if (hospA) nameA = hospA.name;
      if (hospB) nameB = hospB.name;
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
      <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: "8px", padding: "6px 14px", color: "white", fontSize: "14px", fontWeight: "700", letterSpacing: "0.05em", alignSelf: "flex-start" }}>
        BANGKOKTOPCLINIC.COM
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "28px" }}>
        <div style={{ color: "white", fontSize: nameA.length > 20 ? "36px" : "48px", fontWeight: 800, textAlign: "right", flex: 1, lineHeight: 1.15 }}>
          {nameA || "Hospital A"}
        </div>
        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "32px", fontWeight: 700 }}>vs</div>
        <div style={{ color: "white", fontSize: nameB.length > 20 ? "36px" : "48px", fontWeight: 800, textAlign: "left", flex: 1, lineHeight: 1.15 }}>
          {nameB || "Hospital B"}
        </div>
      </div>

      <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", textAlign: "center" }}>
        Side-by-side price and inclusion comparison — real prices, no ads
      </div>
    </div>,
    { ...size, headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" } },
  );
}
