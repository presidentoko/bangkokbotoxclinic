import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

// Cloudflare(OpenNext): edge 런타임 미지원 → 500. nodejs 기본값 사용.

const ACCENT = "#3b82f6";
const BG = "#0f172a";
const SURFACE = "#1e293b";
const MUTED = "#94a3b8";
const WHITE = "#f8fafc";

function TrustBadge({ score, color }: { score: number; color: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 56,
        height: 56,
        borderRadius: 28,
        background: color,
        color: WHITE,
        fontSize: 18,
        fontWeight: 900,
      }}
    >
      {score}
    </div>
  );
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const type = searchParams.get("type") ?? "compare";

  if (type === "compare") {
    const a = searchParams.get("a") ?? "Clinic A";
    const b = searchParams.get("b") ?? "Clinic B";
    const ta = parseInt(searchParams.get("ta") ?? "0", 10);
    const tb = parseInt(searchParams.get("tb") ?? "0", 10);
    const winner = ta > tb ? "a" : ta < tb ? "b" : "tie";

    const colorA = winner === "a" ? "#22c55e" : winner === "b" ? "#ef4444" : ACCENT;
    const colorB = winner === "b" ? "#22c55e" : winner === "a" ? "#ef4444" : ACCENT;

    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            background: BG,
            fontFamily: "sans-serif",
            padding: 40,
            gap: 24,
            alignItems: "center",
          }}
        >
          {/* Left clinic */}
          <div
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
              background: SURFACE,
              borderRadius: 20,
              padding: 28,
              gap: 16,
              border: `2px solid ${colorA}30`,
            }}
          >
            <TrustBadge score={ta} color={colorA} />
            <div style={{ display: "flex", fontSize: 22, fontWeight: 800, color: WHITE, lineHeight: 1.2 }}>
              {a}
            </div>
            <div style={{ display: "flex", fontSize: 13, color: MUTED }}>Trust Score</div>
            {winner === "a" && (
              <div style={{ display: "flex", fontSize: 12, color: "#22c55e", fontWeight: 700 }}>
                ✓ WINNER
              </div>
            )}
          </div>

          {/* VS divider */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div style={{ display: "flex", fontSize: 28, fontWeight: 900, color: WHITE }}>VS</div>
            <div style={{ display: "flex", fontSize: 11, color: MUTED, textAlign: "center" }}>
              Bangkok Clinic
            </div>
            <div style={{ display: "flex", fontSize: 11, color: MUTED, textAlign: "center" }}>
              Comparison
            </div>
          </div>

          {/* Right clinic */}
          <div
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
              background: SURFACE,
              borderRadius: 20,
              padding: 28,
              gap: 16,
              border: `2px solid ${colorB}30`,
            }}
          >
            <TrustBadge score={tb} color={colorB} />
            <div style={{ display: "flex", fontSize: 22, fontWeight: 800, color: WHITE, lineHeight: 1.2 }}>
              {b}
            </div>
            <div style={{ display: "flex", fontSize: 13, color: MUTED }}>Trust Score</div>
            {winner === "b" && (
              <div style={{ display: "flex", fontSize: 12, color: "#22c55e", fontWeight: 700 }}>
                ✓ WINNER
              </div>
            )}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        // Vercel edge CDN 은 s-maxage 없으면 캐시 안 함 — 같은 비교 조합이
        // 재요청될 때마다 매번 새로 렌더링되던 문제 (2026-07-17 감사).
        headers: { "Cache-Control": "public, s-maxage=604800, stale-while-revalidate=86400" },
      }
    );
  }

  // Generic fallback — service or clinic OG
  const title = searchParams.get("title") ?? "Bangkok Clinics — Verified by Trust Score";
  const sub = searchParams.get("sub") ?? "Independent review analysis from real Google data";
  const count = searchParams.get("count");
  // 요청이 실제로 들어온 host 사용 — 하드코딩 시 덴탈/헤어 사이트의 OG/공유
  // 카드에도 "bangkokbotoxclinic.com"이 찍혀서 나감 (2026-07-10 감사).
  const host = req.headers.get("host") ?? "bangkokbotoxclinic.com";

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: BG,
          fontFamily: "sans-serif",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 60,
          gap: 20,
        }}
      >
        {count && (
          <div
            style={{
              display: "flex",
              background: ACCENT,
              color: WHITE,
              fontSize: 16,
              fontWeight: 700,
              padding: "6px 18px",
              borderRadius: 20,
            }}
          >
            {count} clinics verified
          </div>
        )}
        <div style={{ display: "flex", fontSize: 52, fontWeight: 900, color: WHITE, textAlign: "center", lineHeight: 1.15 }}>
          {title}
        </div>
        <div style={{ display: "flex", fontSize: 22, color: MUTED, textAlign: "center" }}>{sub}</div>
        <div style={{ display: "flex", marginTop: 20, fontSize: 14, color: ACCENT, fontWeight: 600 }}>
          {host}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: { "Cache-Control": "public, s-maxage=604800, stale-while-revalidate=86400" },
    }
  );
}
