import { ImageResponse } from "next/og";
import { LOCALES, concernLabel, toBaseLocale, type Locale } from "@/lib/i18n";
import { CONCERNS, getRanking } from "@/lib/data";

export const alt = "BangkokFillers — Ranked by ingredients + real reviews";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    CONCERNS.map((concern) => ({ locale, concern }))
  );
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; concern: string }>;
}) {
  const { locale: localeRaw, concern } = await params;
  const locale = localeRaw as Locale;

  // Satori can't render Arabic/CJK fonts — use base locale (th or en)
  const baseLoc = toBaseLocale(locale);
  const label = concernLabel(baseLoc, concern);
  const productCount = getRanking(concern).length;

  const subtitle =
    baseLoc === "th"
      ? "จัดอันดับด้วยส่วนผสม + รีวิวจริง"
      : "Ranked by ingredients + real reviews";

  const countLine =
    baseLoc === "th"
      ? `${productCount} ผลิตภัณฑ์`
      : `${productCount} products`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
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

        {/* Top row: brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "52px",
              height: "52px",
              background: "#fbf4f1",
              borderRadius: "12px",
              border: "2px solid #e0607e",
            }}
          >
            <span
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "34px",
                fontWeight: "700",
                color: "#e0607e",
                lineHeight: 1,
              }}
            >
              B
            </span>
          </div>
          <span
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "28px",
              fontWeight: "600",
              color: "#2b2222",
            }}
          >
            BangkokFillers
          </span>
        </div>

        {/* Centre: concern label */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "80px",
              fontWeight: "700",
              color: "#2b2222",
              lineHeight: 1,
            }}
          >
            {label}
          </div>
          <div
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "32px",
              color: "#e0607e",
              fontStyle: "italic",
            }}
          >
            {subtitle}
          </div>
        </div>

        {/* Bottom row: product count + tagline */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                background: "#e0607e",
                color: "#fff",
                fontFamily: "Georgia, serif",
                fontSize: "20px",
                fontWeight: "700",
                padding: "8px 20px",
                borderRadius: "24px",
              }}
            >
              {countLine}
            </div>
          </div>
          <div
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "20px",
              color: "#c9a86a",
              fontStyle: "italic",
            }}
          >
            Trust data, not influencers
          </div>
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
