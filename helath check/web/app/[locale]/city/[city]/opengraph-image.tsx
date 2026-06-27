import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CITY_NAMES: Record<string, string> = {
  "bangkok": "Bangkok", "chiang-mai": "Chiang Mai", "phuket": "Phuket",
  "pattaya": "Pattaya", "hua-hin": "Hua Hin", "ko-samui": "Ko Samui",
  "krabi": "Krabi", "chiang-rai": "Chiang Rai", "hat-yai": "Hat Yai",
  "khon-kaen": "Khon Kaen", "udon-thani": "Udon Thani", "korat": "Korat",
  "koh-chang": "Koh Chang", "ayutthaya": "Ayutthaya",
};

const CITY_EMOJI: Record<string, string> = {
  "bangkok": "🏙️", "chiang-mai": "🌸", "phuket": "🏝️",
  "pattaya": "🌊", "hua-hin": "🏖️", "ko-samui": "🌴",
  "krabi": "⛰️", "chiang-rai": "🍵", "hat-yai": "🦜",
  "khon-kaen": "🌾", "udon-thani": "🏯", "korat": "🦁",
};

export default function Image({ params }: { params: { city: string } }) {
  const cityName = CITY_NAMES[params.city] || params.city.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  const emoji = CITY_EMOJI[params.city] || "🏥";

  return new ImageResponse(
    (
      <div style={{
        width: "100%", height: "100%", display: "flex", flexDirection: "column",
        background: "linear-gradient(135deg, #1d4ed8 0%, #1e40af 50%, #1e3a8a 100%)",
        padding: "60px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
          <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: "12px", padding: "8px 16px" }}>
            <span style={{ color: "white", fontSize: "16px", fontWeight: 700 }}>BangkokCheckup</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "24px" }}>
          <span style={{ fontSize: "72px" }}>{emoji}</span>
          <div>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "22px", marginBottom: "8px" }}>
              Health Check-Up in
            </div>
            <div style={{ color: "white", fontSize: "64px", fontWeight: 800, lineHeight: 1 }}>
              {cityName}
            </div>
          </div>
        </div>
        <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "26px", marginTop: "auto" }}>
          Compare real prices from all hospitals • Real prices, no ads
        </div>
      </div>
    ),
    { ...size }
  );
}
