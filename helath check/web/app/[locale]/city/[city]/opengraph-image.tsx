import { ImageResponse } from "next/og";
import { getPackagesByCity } from "@/lib/db";

export const runtime = "nodejs";
export const alt = "Health check-up packages in this city";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CITY_NAMES: Record<string, string> = {
  "bangkok": "Bangkok",
  "chiang-mai": "Chiang Mai",
  "phuket": "Phuket",
  "pattaya": "Pattaya",
  "hua-hin": "Hua Hin",
  "ko-samui": "Ko Samui",
  "krabi": "Krabi",
  "chiang-rai": "Chiang Rai",
  "hat-yai": "Hat Yai",
  "khon-kaen": "Khon Kaen",
  "koh-chang": "Koh Chang",
  "udon-thani": "Udon Thani",
  "korat": "Korat",
  "ayutthaya": "Ayutthaya",
};

const CITY_EMOJI: Record<string, string> = {
  "Bangkok": "🏙️",
  "Chiang Mai": "🌸",
  "Phuket": "🏝️",
  "Pattaya": "🌊",
  "Hua Hin": "🏖️",
  "Ko Samui": "🌴",
  "Krabi": "⛰️",
  "Chiang Rai": "🍵",
  "Hat Yai": "🦜",
  "Khon Kaen": "🌾",
  "Udon Thani": "🏯",
  "Korat": "🦁",
  "Ayutthaya": "🛕",
};

export default async function OgImage({
  params,
}: {
  params: Promise<{ locale: string; city: string }>;
}) {
  const { city } = await params;
  const cityName = CITY_NAMES[city] || city.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const emoji = CITY_EMOJI[cityName] || "🏥";

  let packageCount = 0;
  let hospitalCount = 0;
  let minPrice = 0;

  try {
    const rows = await getPackagesByCity(cityName);
    packageCount = rows.length;
    hospitalCount = new Set(rows.map((r) => r.hospital_slug)).size;
    const prices = rows.map((r) => parseFloat(r.price ?? "0")).filter(Boolean);
    if (prices.length) minPrice = Math.min(...prices);
  } catch { /* ignore */ }

  return new ImageResponse(
    <div
      style={{
        background: "linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 60%, #2563eb 100%)",
        width: "100%", height: "100%",
        display: "flex", flexDirection: "column",
        justifyContent: "space-between", padding: "60px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ display: "flex", background: "rgba(255,255,255,0.15)", borderRadius: "8px", padding: "6px 14px", color: "white", fontSize: "13px", fontWeight: "700" }}>
          BANGKOKTOPCLINIC.COM
        </div>
        <div style={{ display: "flex", color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>
          Real prices · No ads
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", color: "rgba(255,255,255,0.7)", fontSize: "22px", marginBottom: "10px" }}>
          {`${emoji} Health Check-Up`}
        </div>
        <div style={{ display: "flex", color: "white", fontSize: "58px", fontWeight: "800", lineHeight: "1.1", marginBottom: "24px" }}>
          {cityName}
        </div>
        <div style={{ display: "flex", gap: "16px" }}>
          {hospitalCount > 0 && (
            <div style={{ display: "flex", flexDirection: "column", background: "rgba(255,255,255,0.15)", borderRadius: "12px", padding: "14px 22px", color: "white" }}>
              <div style={{ display: "flex", fontSize: "30px", fontWeight: "800" }}>{hospitalCount}</div>
              <div style={{ display: "flex", fontSize: "12px", opacity: 0.7 }}>Hospitals</div>
            </div>
          )}
          {packageCount > 0 && (
            <div style={{ display: "flex", flexDirection: "column", background: "rgba(255,255,255,0.15)", borderRadius: "12px", padding: "14px 22px", color: "white" }}>
              <div style={{ display: "flex", fontSize: "30px", fontWeight: "800" }}>{packageCount}</div>
              <div style={{ display: "flex", fontSize: "12px", opacity: 0.7 }}>Packages</div>
            </div>
          )}
          {minPrice > 0 && (
            <div style={{ display: "flex", flexDirection: "column", background: "rgba(255,255,255,0.15)", borderRadius: "12px", padding: "14px 22px", color: "white" }}>
              <div style={{ display: "flex", fontSize: "30px", fontWeight: "800" }}>{`from ${minPrice.toLocaleString()} THB`}</div>
              <div style={{ display: "flex", fontSize: "12px", opacity: 0.7 }}>Starting price</div>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "flex", color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>
        Executive - Comprehensive - Cancer - Cardiac - Women&apos;s - Men&apos;s health packages
      </div>
    </div>,
    { ...size, headers: { "Cache-Control": "public, s-maxage=31536000, stale-while-revalidate=31536000, immutable" } },
  );
}
