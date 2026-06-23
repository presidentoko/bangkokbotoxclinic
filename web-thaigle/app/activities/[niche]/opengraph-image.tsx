import { ImageResponse } from "next/og";
import { NICHES } from "@/lib/niches";
import type { NicheSlug } from "@/lib/niches";

export const dynamic = "force-static";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return NICHES.map((n) => ({ niche: n.slug }));
}

export default async function OG({ params }: { params: Promise<{ niche: string }> }) {
  const { niche } = await params;
  const info = NICHES.find((n) => n.slug === niche);
  if (!info) return new Response("not found", { status: 404 });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%",
          display: "flex", flexDirection: "column",
          background: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 50%, #fed7aa 100%)",
          padding: "80px",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "auto" }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#ea580c", display: "flex" }}>Thaigle</div>
          <div style={{ fontSize: 16, color: "#9a3412", background: "#fed7aa", padding: "4px 12px", borderRadius: 20, display: "flex" }}>
            No paid rankings
          </div>
        </div>

        {/* Icon + Title */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ fontSize: 100, display: "flex" }}>{info.icon}</div>
          <div style={{ fontSize: 72, fontWeight: 900, lineHeight: 1.0, letterSpacing: -2, color: "#1a1a1a", display: "flex" }}>
            {`Best ${info.label}`}
          </div>
          <div style={{ fontSize: 36, color: "#525252", fontWeight: 600, display: "flex" }}>
            in Bangkok — Ranked by Real Reviews
          </div>
        </div>

        {/* Bottom */}
        <div style={{ display: "flex", gap: "32px", marginTop: "auto", color: "#92400e", fontSize: 22, fontWeight: 700 }}>
          <span>★ Trust Score</span>
          <span>·</span>
          <span>Real Google Reviews</span>
          <span>·</span>
          <span>No influencer picks</span>
        </div>
      </div>
    ),
    size
  );
}
