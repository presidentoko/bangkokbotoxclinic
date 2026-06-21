import { ImageResponse } from "next/og";
import { decodePlan, TYPE_LABELS } from "@/lib/planner";
import type { PlanItemType } from "@/lib/planner";
import { getSiteConfig } from "@/lib/site";

export const alt = "방콕 여행 플래너 — Thaigle";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function PlanOG({
  searchParams,
}: {
  searchParams: Promise<{ d?: string }>;
}) {
  const { d } = await searchParams;
  const plan = d ? decodePlan(d) : null;
  const cfg = getSiteConfig();

  const counts = plan
    ? (Object.keys(TYPE_LABELS) as PlanItemType[])
        .map((type) => ({
          label: TYPE_LABELS[type],
          count: plan.items.filter((i) => i.type === type).length,
        }))
        .filter((x) => x.count > 0)
    : [];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "linear-gradient(135deg, #fff7ed 0%, white 60%)",
          padding: "80px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "#ea580c",
            textTransform: "uppercase",
            letterSpacing: 2,
            marginBottom: 16,
          }}
        >
          {cfg.brand} — 방콕 여행 플래너
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 900,
            color: "#0a0a0a",
            lineHeight: 1.1,
            marginBottom: 32,
          }}
        >
          {plan?.title ?? "내 방콕 트립"}
        </div>
        {counts.length > 0 && (
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {counts.map((c) => (
              <div
                key={c.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "#fff7ed",
                  border: "2px solid #fed7aa",
                  borderRadius: 100,
                  padding: "10px 20px",
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#c2410c",
                }}
              >
                {c.label} {c.count}
              </div>
            ))}
          </div>
        )}
        <div
          style={{
            marginTop: "auto",
            fontSize: 20,
            color: "#737373",
            fontWeight: 600,
          }}
        >
          thaigle.com
        </div>
      </div>
    ),
    size
  );
}
