import { ImageResponse } from "next/og";
import { QUIZ_RESULTS } from "@/lib/quiz";
import { getSiteConfig } from "@/lib/site";

export const alt = "What Kind of Bangkok Traveler Are You? — Thaigle Quiz";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-dynamic";

export default async function QuizOG({
  searchParams,
}: {
  searchParams: Promise<{ r?: string }> | { r?: string };
}) {
  const resolved = searchParams instanceof Promise ? await searchParams : (searchParams ?? {});
  const result = resolved.r ? QUIZ_RESULTS.find((res) => res.id === resolved.r) : undefined;
  const cfg = getSiteConfig();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: result ? "center" : "flex-start",
          background: "linear-gradient(135deg, #fff7ed 0%, white 60%)",
          padding: "80px",
          fontFamily: "system-ui, sans-serif",
          textAlign: result ? "center" : "left",
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
            display: "flex",
          }}
        >
          {cfg.brand} — Bangkok Traveler Quiz
        </div>
        {result ? (
          <>
            <div style={{ fontSize: 120, marginBottom: 16, display: "flex" }}>{result.emoji}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#737373", marginBottom: 8, display: "flex" }}>
              My Bangkok traveler type is
            </div>
            <div style={{ fontSize: 56, fontWeight: 900, color: "#0a0a0a", lineHeight: 1.1, display: "flex" }}>
              {result.title}
            </div>
          </>
        ) : (
          <div style={{ fontSize: 60, fontWeight: 900, color: "#0a0a0a", lineHeight: 1.15, maxWidth: 900, display: "flex" }}>
            What kind of Bangkok traveler are you?
          </div>
        )}
        <div
          style={{
            marginTop: "auto",
            fontSize: 20,
            color: "#737373",
            fontWeight: 600,
            display: "flex",
          }}
        >
          thaigle.com/quiz
        </div>
      </div>
    ),
    {
      ...size,
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    }
  );
}
