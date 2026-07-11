import { ImageResponse } from "next/og";
import { BINGO_ITEMS, decodeBingo } from "@/lib/bingo";
import { getSiteConfig } from "@/lib/site";

export const alt = "Bangkok Bucket List Bingo — Thaigle";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-dynamic";

export default async function BingoOG({
  searchParams,
}: {
  searchParams: Promise<{ d?: string }> | { d?: string };
}) {
  const resolved = searchParams instanceof Promise ? await searchParams : (searchParams ?? {});
  const checked = resolved.d ? decodeBingo(resolved.d) : new Set<string>();
  const total = BINGO_ITEMS.length;
  const count = checked.size;
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
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
            display: "flex",
          }}
        >
          {cfg.brand} — Bangkok Bucket List Bingo
        </div>
        {count > 0 ? (
          <>
            <div style={{ fontSize: 88, fontWeight: 900, color: "#0a0a0a", display: "flex", alignItems: "baseline", gap: 16 }}>
              <span>{count}/{total}</span>
              <span style={{ fontSize: 36, color: "#ea580c", fontWeight: 700 }}>done ({pct}%)</span>
            </div>
            <div style={{ fontSize: 26, color: "#525252", marginTop: 20, display: "flex" }}>
              {count === total ? "🏆 Full Bangkok Bingo — legendary." : "How much of Bangkok have you seen?"}
            </div>
          </>
        ) : (
          <div style={{ fontSize: 56, fontWeight: 900, color: "#0a0a0a", lineHeight: 1.15, maxWidth: 900, display: "flex" }}>
            Have you done all 16 Bangkok experiences?
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
          thaigle.com/bingo
        </div>
      </div>
    ),
    size
  );
}
