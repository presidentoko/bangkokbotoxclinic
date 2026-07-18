import { ImageResponse } from "next/og";
import { CONCERNS } from "@/lib/data";
import { quizRecommendations } from "@/lib/quiz";
import { SKIN_LABELS, BUDGET_LABELS, CONCERN_QUIZ_META, VALID_SKINS, VALID_BUDGETS, type SkinType, type Budget } from "@/lib/quiz-config";
import type { Concern } from "@/lib/data";

export const alt = "BangkokFillers — Your perfect skincare match";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
// Recommendations are computed from build-time-bundled data, so they never
// change without a redeploy.
export const revalidate = false;

// Prerender the same combos as the page; unknown params 404 at routing level
// instead of burning a satori render per bot-scanned URL.
export { generateStaticParams } from "./page";
export const dynamicParams = false;

function scoreColor(s: number): string {
  if (s >= 85) return "#16a34a";
  if (s >= 70) return "#d97706";
  return "#e0607e";
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; skin: string; concern: string; budget: string }>;
}) {
  const { locale, skin: skinRaw, concern: concernRaw, budget: budgetRaw } = await params;
  const isTh = locale === "th";

  if (
    !VALID_SKINS.includes(skinRaw as SkinType) ||
    !CONCERNS.includes(concernRaw as Concern) ||
    !VALID_BUDGETS.includes(budgetRaw as Budget)
  ) {
    return new ImageResponse(<div>Not found</div>, { ...size });
  }
  const skin = skinRaw as SkinType;
  const concern = concernRaw as Concern;
  const budget = budgetRaw as Budget;

  const skinLbl = isTh ? SKIN_LABELS[skin].th : SKIN_LABELS[skin].en;
  const concernMeta = CONCERN_QUIZ_META[concern];
  const concernLbl = isTh ? concernMeta?.th : concernMeta?.en;
  const budgetLbl = isTh ? BUDGET_LABELS[budget].th : BUDGET_LABELS[budget].en;
  const products = quizRecommendations({ skin, concern, budget });
  const RANK_COLORS = ["#c9a86a", "#a8a8a8", "#cd7f32"];

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

        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "36px 56px 0" }}>
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

        <div style={{ display: "flex", flexDirection: "column", padding: "20px 56px 0", gap: 12 }}>
          <span style={{ fontFamily: "Georgia, serif", fontSize: 30, fontWeight: 700, color: "#2b2222" }}>
            {isTh ? "สกินแคร์ที่ใช่สำหรับคุณ 🌸" : "Your perfect skincare match 🌸"}
          </span>
          <div style={{ display: "flex", gap: 10 }}>
            {[`${SKIN_LABELS[skin].emoji} ${skinLbl}`, `${concernMeta?.emoji ?? ""} ${concernLbl}`, `💰 ${budgetLbl}`].map((label) => (
              <div
                key={label}
                style={{
                  background: "#fff", border: "1.5px solid #f0d9d5", borderRadius: 999,
                  padding: "8px 18px", fontFamily: "Georgia, serif", fontSize: 18, color: "#c9527a",
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14, padding: "24px 56px" }}>
          {products.slice(0, 3).map((p, i) => {
            const score = Math.round(p.total_score?.[concern] ?? 0);
            const color = scoreColor(score);
            return (
              <div
                key={p.product_id}
                style={{
                  display: "flex", alignItems: "center", gap: 16,
                  background: "white", borderRadius: 16, border: "1px solid #efe1db", padding: "12px 20px",
                }}
              >
                <div
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    width: 32, height: 32, borderRadius: 999, background: RANK_COLORS[i],
                    color: "white", fontFamily: "Georgia, serif", fontSize: 18, fontWeight: 900,
                  }}
                >
                  {i + 1}
                </div>
                <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                  <span style={{ fontFamily: "Georgia, serif", fontSize: 14, color: "#c9a86a", textTransform: "uppercase" }}>{p.brand}</span>
                  <span style={{ fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 700, color: "#2b2222" }}>
                    {p.name.length > 40 ? p.name.slice(0, 37) + "…" : p.name}
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <span style={{ fontFamily: "Georgia, serif", fontSize: 26, fontWeight: 900, color }}>{score}</span>
                  <span style={{ fontFamily: "Georgia, serif", fontSize: 12, color: "#8a7a76" }}>/100</span>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 6, background: "#c9a86a" }} />
      </div>
    ),
    { ...size }
  );
}
