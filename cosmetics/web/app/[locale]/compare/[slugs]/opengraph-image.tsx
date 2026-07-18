import { ImageResponse } from "next/og";
import type { Locale } from "@/lib/i18n";
import { CONCERNS } from "@/lib/data";
import { parseCompare } from "./page";
import type { Product } from "@/lib/types";

export const alt = "BangkokFillers — Product Comparison";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
// Comparison data is bundled at build time, so it never changes without a redeploy.
export const revalidate = false;

// Prerender the same compare pairs as the page; unknown slugs 404 at routing
// level instead of burning a satori render per bot-scanned URL.
export { generateStaticParams } from "./page";
export const dynamicParams = false;

function scoreColor(s: number): string {
  if (s >= 85) return "#16a34a";
  if (s >= 70) return "#d97706";
  return "#e0607e";
}

function bestScore(p: Product): number {
  return CONCERNS.reduce((best, c) => Math.max(best, p.total_score?.[c] ?? 0), 0);
}

function ProductPanel({ p, side }: { p: Product; side: "A" | "B" }) {
  const score = Math.round(bestScore(p));
  const color = scoreColor(score);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "40%" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 100,
          height: 100,
          borderRadius: 20,
          border: `4px solid ${color}`,
          background: "white",
        }}
      >
        <span style={{ fontFamily: "Georgia, serif", fontSize: 44, fontWeight: 900, color, lineHeight: 1 }}>
          {score}
        </span>
      </div>
      <span style={{ fontFamily: "Georgia, serif", fontSize: 18, fontWeight: 700, color: "#c9a86a", letterSpacing: 1, textTransform: "uppercase" }}>
        {p.brand}
      </span>
      <span style={{ fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 700, color: "#2b2222", textAlign: "center", lineHeight: 1.2 }}>
        {p.name.length > 32 ? p.name.slice(0, 29) + "…" : p.name}
      </span>
      <span style={{ fontFamily: "Georgia, serif", fontSize: 16, color: "#8a7a76" }}>Side {side}</span>
    </div>
  );
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slugs: string }>;
}) {
  const { slugs } = await params;
  const parsed = parseCompare(slugs);
  if (!parsed) return new ImageResponse(<div>Not found</div>, { ...size });
  const { pA, pB } = parsed;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#fbf4f1",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, background: "#c9a86a" }} />

        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "40px 56px 0" }}>
          <div
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: 36, height: 36, borderRadius: 8, border: "2px solid #e0607e", background: "#fbf4f1",
            }}
          >
            <span style={{ fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 700, color: "#e0607e" }}>B</span>
          </div>
          <span style={{ fontFamily: "Georgia, serif", fontSize: 18, color: "#8a7a76" }}>bangkokfillers.com</span>
        </div>

        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 24, padding: "0 40px" }}>
          <ProductPanel p={pA} side="A" />
          <span style={{ fontFamily: "Georgia, serif", fontSize: 40, fontWeight: 900, color: "#e0607e" }}>VS</span>
          <ProductPanel p={pB} side="B" />
        </div>

        <div style={{ display: "flex", justifyContent: "center", paddingBottom: 36 }}>
          <span style={{ fontFamily: "Georgia, serif", fontSize: 18, color: "#c9a86a", fontStyle: "italic" }}>
            Trust data, not influencers
          </span>
        </div>

        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 6, background: "#c9a86a" }} />
      </div>
    ),
    { ...size }
  );
}
