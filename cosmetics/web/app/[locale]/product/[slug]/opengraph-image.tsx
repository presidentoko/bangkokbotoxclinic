import { ImageResponse } from "next/og";
import type { Locale } from "@/lib/i18n";
import { getProduct, productIdFromSlug } from "@/lib/data";

export const runtime = "edge";
export const alt = "BangkokFillers — Product Score Card";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";


function scoreColor(s: number): string {
  if (s >= 85) return "#16a34a";
  if (s >= 70) return "#d97706";
  return "#e0607e";
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: localeRaw, slug } = await params;
  const locale = localeRaw as Locale;
  const p = getProduct(productIdFromSlug(slug));
  if (!p) return new ImageResponse(<div>Not found</div>, { ...size });

  const concern =
    Array.isArray(p.concern_seeds)
      ? p.concern_seeds[0]
      : String(p.concern_seeds).split("|")[0] || "acne";

  const totalScore = Math.round(p.total_score?.[concern] ?? 0);
  const rating = Number(p.konvy_rating) || 0;
  const starCount = Math.min(5, Math.max(0, Math.round(rating)));
  const stars = "★".repeat(starCount) + "☆".repeat(5 - starCount);
  const soldLabel = locale === "th" ? "สั่งแล้ว" : "sold";
  const reviewLabel = locale === "th" ? "รีวิว" : "reviews";
  const scoreLabel = locale === "th" ? "คะแนน" : "score";

  // Load product image as base64 so it renders inside ImageResponse
  let imgSrc: string | undefined;
  if (p.image_url) {
    try {
      const controller = new AbortController();
      const tid = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(p.image_url, { signal: controller.signal });
      clearTimeout(tid);
      const buf = await res.arrayBuffer();
      const mime = res.headers.get("content-type") || "image/jpeg";
      imgSrc = `data:${mime};base64,${Buffer.from(buf).toString("base64")}`;
    } catch {
      imgSrc = undefined;
    }
  }

  const hasDiscount = p.discount_pct > 0;
  const color = scoreColor(totalScore);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#fbf4f1",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Gold top hairline */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, background: "#c9a86a" }} />

        {/* Left — product image panel */}
        <div
          style={{
            width: "42%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "white",
            padding: "40px 32px",
          }}
        >
          {imgSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imgSrc}
              alt={p.name}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "#e8d5d0", fontSize: 80 }}>
              ✦
            </div>
          )}
        </div>

        {/* Right — info panel */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "52px 56px 44px 48px",
          }}
        >
          {/* Brand + site */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  border: "2px solid #e0607e",
                  background: "#fbf4f1",
                }}
              >
                <span style={{ fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 700, color: "#e0607e" }}>B</span>
              </div>
              <span style={{ fontFamily: "Georgia, serif", fontSize: 18, color: "#8a7a76" }}>bangkokfillers.com</span>
            </div>

            <div style={{ fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 700, color: "#c9a86a", letterSpacing: 2, marginTop: 20, textTransform: "uppercase" }}>
              {p.brand}
            </div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 30, fontWeight: 700, color: "#2b2222", lineHeight: 1.25, marginTop: 6 }}>
              {p.name.length > 55 ? p.name.slice(0, 52) + "…" : p.name}
            </div>
          </div>

          {/* Score badge */}
          <div style={{ display: "flex", alignItems: "flex-end", gap: 16 }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: 130,
                height: 130,
                borderRadius: 24,
                border: `4px solid ${color}`,
                background: "white",
              }}
            >
              <span style={{ fontFamily: "Georgia, serif", fontSize: 56, fontWeight: 900, color, lineHeight: 1 }}>{totalScore}</span>
              <span style={{ fontFamily: "Georgia, serif", fontSize: 14, color: "#8a7a76", marginTop: 2 }}>{scoreLabel}</span>
            </div>

            {/* Stars + reviews */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingBottom: 8 }}>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 28, color: "#f59e0b" }}>{stars}</div>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 18, color: "#2b2222", fontWeight: 700 }}>
                {rating.toFixed(1)} · {(Number(p.konvy_review_count) || 0).toLocaleString()} {reviewLabel}
              </div>
              {p.sold_count > 0 && (
                <div style={{ fontFamily: "Georgia, serif", fontSize: 16, color: "#8a7a76" }}>
                  {p.sold_count.toLocaleString()} {soldLabel}
                </div>
              )}
            </div>
          </div>

          {/* Price row */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontFamily: "Georgia, serif", fontSize: 36, fontWeight: 900, color: "#2b2222" }}>
              ฿{Math.round(p.price_thb).toLocaleString()}
            </span>
            {hasDiscount && (
              <>
                <span style={{ fontFamily: "Georgia, serif", fontSize: 22, color: "#8a7a76", textDecoration: "line-through" }}>
                  ฿{Math.round(p.list_price_thb).toLocaleString()}
                </span>
                <div
                  style={{
                    background: "#e0607e",
                    color: "white",
                    fontFamily: "Georgia, serif",
                    fontSize: 20,
                    fontWeight: 700,
                    padding: "6px 18px",
                    borderRadius: 24,
                  }}
                >
                  -{p.discount_pct}%
                </div>
              </>
            )}
          </div>
        </div>

        {/* Gold bottom hairline */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 6, background: "#c9a86a" }} />
      </div>
    ),
    { ...size }
  );
}
