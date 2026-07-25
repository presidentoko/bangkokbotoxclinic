// OG image for /famous-vs-good/[slug] — the core tension in a shareable card.
// Node runtime only (loadMasterDb uses fs).

import { ImageResponse } from "next/og";
import { loadFamousVsGoodCollection, loadAllSlugs } from "@/lib/famous-vs-good";

export const dynamic = "force-static";
export const dynamicParams = false;
export const alt = "Instagram Famous vs Actually Good — Real Data, Not Hype";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  const slugs = await loadAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function FamousVsGoodOG({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { entries, thresholds } = await loadFamousVsGoodCollection(slug);

  const label = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const matched = entries.filter((e) => e.restaurant !== null);
  const totalReviews = matched.reduce((s, e) => s + (e.restaurant?.total_reviews ?? 0), 0);
  const N = matched.length;
  const M = matched.filter((e) => e.restaurant!.trust_score < thresholds.bigGapThreshold).length;
  const X = Math.round(thresholds.bigGapThreshold);

  // Biggest gap venue for the headline example (lowest trust_score in big_gap bucket)
  const bigGaps = matched
    .filter((e) => e.gap === "big_gap")
    .sort((a, b) => a.restaurant!.trust_score - b.restaurant!.trust_score);
  const headlineVenue = bigGaps[0] ?? matched.sort((a, b) => a.restaurant!.trust_score - b.restaurant!.trust_score)[0];

  const ORANGE = "#ea580c";
  const DARK = "#0a0a0a";
  const MUTED = "#737373";

  // Sanitize to ASCII-safe to avoid satori font lookup failures on Thai/CJK
  // venue names (crashes the whole OG route otherwise — see restaurant/[id]
  // opengraph-image.tsx for the same guard). Fully-Thai/Korean names strip to
  // "" — fall back to the generic "N venues" headline instead of a bare venue.
  const rawHeadlineName = headlineVenue?.restaurant?.name ?? "";
  const safeHeadlineName = rawHeadlineName.replace(/[^\x00-\x7F]/g, "").trim();
  const showHeadlineVenue = headlineVenue && safeHeadlineName.length > 0;

  try {
    return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#fafafa",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Top accent bar */}
        <div style={{ height: 6, background: ORANGE, display: "flex" }} />

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: "48px 72px",
          }}
        >
          {/* Brand + collection */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 40,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: `${ORANGE}18`,
                padding: "8px 18px",
                borderRadius: 100,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  background: ORANGE,
                  display: "flex",
                }}
              />
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: ORANGE,
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                }}
              >
                SNS Stopper
              </span>
            </div>
            <span style={{ fontSize: 18, color: MUTED, fontWeight: 500 }}>
              {label}
            </span>
          </div>

          {/* Core tension headline */}
          <div
            style={{
              display: "flex",
              alignItems: "stretch",
              gap: 0,
              flex: 1,
              marginBottom: 36,
            }}
          >
            {/* LEFT — Instagram Famous */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: "32px 40px",
                background: "linear-gradient(135deg, #fff1f2 0%, #fce7f3 100%)",
                borderRadius: "20px 0 0 20px",
                borderRight: "none",
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#be185d",
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  marginBottom: 16,
                  alignItems: "center",
                  gap: 8,
                }}
              >
                Instagram Famous
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: showHeadlineVenue ? 38 : 32,
                  fontWeight: 800,
                  color: DARK,
                  lineHeight: 1.1,
                  letterSpacing: -0.5,
                }}
              >
                {showHeadlineVenue
                  ? safeHeadlineName.length > 28
                    ? safeHeadlineName.slice(0, 26) + "..."
                    : safeHeadlineName
                  : `${N} venues hyped on social`}
              </div>
              {showHeadlineVenue && headlineVenue?.seed.ig_signal && (
                <div
                  style={{
                    display: "flex",
                    marginTop: 12,
                    fontSize: 15,
                    color: "#9d174d",
                    alignItems: "center",
                  }}
                >
                  {headlineVenue.seed.ig_signal}
                </div>
              )}
            </div>

            {/* CENTER divider */}
            <div
              style={{
                width: 64,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "white",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 900,
                  color: MUTED,
                  letterSpacing: -1,
                  display: "flex",
                }}
              >
                vs
              </div>
            </div>

            {/* RIGHT — Actually Good */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: "32px 40px",
                background: "white",
                border: "2px solid #e5e7eb",
                borderRadius: "0 20px 20px 0",
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#15803d",
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  marginBottom: 16,
                  alignItems: "center",
                }}
              >
                Actually Good?
              </div>
              {showHeadlineVenue ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div
                    style={{
                      display: "flex",
                      fontSize: 72,
                      fontWeight: 900,
                      lineHeight: 1,
                      color:
                        headlineVenue!.restaurant!.trust_score >= 85
                          ? "#16a34a"
                          : headlineVenue!.restaurant!.trust_score >= 75
                          ? "#ca8a04"
                          : "#dc2626",
                    }}
                  >
                    {Math.round(headlineVenue!.restaurant!.trust_score)}
                  </div>
                  <div style={{ display: "flex", fontSize: 16, color: MUTED }}>
                    Trust Score / 100
                  </div>
                  <div style={{ display: "flex", fontSize: 14, color: MUTED }}>
                    {headlineVenue!.restaurant!.total_reviews.toLocaleString()} Google reviews
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", fontSize: 32, fontWeight: 800, color: DARK }}>
                  Data decides
                </div>
              )}
            </div>
          </div>

          {/* Footer stat line */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", fontSize: 16, color: MUTED }}>
              {`${N} venues${M > 0 ? ` · ${M} below ${X} Trust Score` : ""} · ${totalReviews.toLocaleString()} Google reviews`}
            </div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "white",
                background: DARK,
                padding: "8px 16px",
                borderRadius: 100,
                display: "flex",
              }}
            >
              snsstopper.com
            </div>
          </div>
        </div>
      </div>
    ),
      size
    );
  } catch {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%", height: "100%", background: "#0a0a0a",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexDirection: "column", gap: "16px",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <div style={{ display: "flex", fontSize: 48, fontWeight: 800, color: "white" }}>{label}</div>
          <div style={{ display: "flex", fontSize: 22, color: "#737373" }}>Instagram Famous vs Actually Good</div>
        </div>
      ),
      size
    );
  }
}
