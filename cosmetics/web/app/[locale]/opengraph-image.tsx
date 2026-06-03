import { ImageResponse } from "next/og";

export const alt = "BangkokFillers — เชื่อข้อมูล ไม่ใช่อินฟลูเอนเซอร์";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const tagline =
    locale === "en"
      ? "Trust data, not influencers"
      : "เชื่อข้อมูล ไม่ใช่อินฟลูเอนเซอร์";

  const subTagline =
    locale === "en"
      ? "Thai skincare — ranked by ingredients + real reviews"
      : "Trust data, not influencers";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#fbf4f1",
          padding: "60px 80px",
          position: "relative",
        }}
      >
        {/* Gold top hairline */}
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            right: "0",
            height: "6px",
            background: "#c9a86a",
          }}
        />

        {/* Brand mark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "80px",
            height: "80px",
            background: "#fbf4f1",
            borderRadius: "18px",
            border: "2px solid #e0607e",
            marginBottom: "32px",
          }}
        >
          <span
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "52px",
              fontWeight: "700",
              color: "#e0607e",
              lineHeight: 1,
            }}
          >
            B
          </span>
        </div>

        {/* Site name */}
        <div
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "72px",
            fontWeight: "700",
            color: "#2b2222",
            letterSpacing: "-1px",
            lineHeight: 1,
            marginBottom: "24px",
          }}
        >
          BangkokFillers
        </div>

        {/* Primary tagline — locale-aware */}
        <div
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "28px",
            color: "#e0607e",
            fontStyle: "italic",
            marginBottom: "8px",
          }}
        >
          {tagline}
        </div>

        {/* Secondary tagline */}
        <div
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "22px",
            color: "#c9a86a",
          }}
        >
          {subTagline}
        </div>

        {/* Gold bottom hairline */}
        <div
          style={{
            position: "absolute",
            bottom: "0",
            left: "0",
            right: "0",
            height: "6px",
            background: "#c9a86a",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
