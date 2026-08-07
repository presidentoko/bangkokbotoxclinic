import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const GUIDE_META: Record<string, { title: string; emoji: string; tag: string }> = {
  "bangkok-health-checkup": { title: "Bangkok Health Check-Up Guide", emoji: "🏙️", tag: "City Guide" },
  "chiang-mai-health-checkup": { title: "Chiang Mai Health Check-Up", emoji: "🌸", tag: "City Guide" },
  "phuket-health-checkup": { title: "Phuket Health Check-Up", emoji: "🏝️", tag: "City Guide" },
  "pattaya-health-checkup": { title: "Pattaya Health Check-Up", emoji: "🌊", tag: "City Guide" },
  "cancer-screening-bangkok": { title: "Cancer Screening in Bangkok", emoji: "🎗️", tag: "Screening Guide" },
  "womens-health-checkup-bangkok": { title: "Women's Health Check-Up Bangkok", emoji: "♀️", tag: "Women's Health" },
  "cardiac-health-checkup-bangkok": { title: "Cardiac Health Check-Up Bangkok", emoji: "❤️", tag: "Cardiac Guide" },
  "jci-hospitals-bangkok": { title: "JCI-Accredited Hospitals Bangkok", emoji: "🏆", tag: "Hospital Guide" },
  "what-is-included-checkup": { title: "What's Included in Each Package?", emoji: "🔬", tag: "Buyer's Guide" },
  "senior-health-checkup-thailand": { title: "Senior Health Check-Up (60+)", emoji: "👴", tag: "Senior Health" },
  "health-checkup-expats-thailand": { title: "Expat Health Check-Up Guide", emoji: "🌍", tag: "Expat Guide" },
};

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meta = GUIDE_META[slug] || {
    title: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    emoji: "📋",
    tag: "Health Guide",
  };

  return new ImageResponse(
    (
      <div style={{
        width: "100%", height: "100%", display: "flex", flexDirection: "column",
        background: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 60%, #2563eb 100%)",
        padding: "60px",
        justifyContent: "space-between",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", background: "rgba(255,255,255,0.15)", borderRadius: "12px", padding: "8px 20px" }}>
            <span style={{ display: "flex", color: "white", fontSize: "18px", fontWeight: 700 }}>BangkokCheckup</span>
          </div>
          <div style={{ display: "flex", background: "rgba(255,255,255,0.2)", borderRadius: "999px", padding: "6px 18px" }}>
            <span style={{ display: "flex", color: "rgba(255,255,255,0.9)", fontSize: "14px", fontWeight: 600 }}>{meta.tag}</span>
          </div>
        </div>

        {/* Body */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", fontSize: "80px", lineHeight: 1 }}>{meta.emoji}</div>
          <div style={{ display: "flex", color: "white", fontSize: "52px", fontWeight: 800, lineHeight: 1.1, maxWidth: "900px" }}>
            {meta.title}
          </div>
          <div style={{ display: "flex", color: "rgba(255,255,255,0.75)", fontSize: "24px" }}>
            2026 · Real prices from 235+ Thailand hospitals
          </div>
        </div>
      </div>
    ),
    { ...size, headers: { "Cache-Control": "public, s-maxage=31536000, stale-while-revalidate=31536000, immutable" } }
  );
}
