import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const taglines: Record<string, string> = {
    en: "Compare Real Prices · No Ads · 235+ Hospitals",
    zh: "比较真实价格 · 无广告 · 235家以上医院",
    ja: "実際の価格を比較 · 広告なし · 235以上の病院",
    th: "เปรียบเทียบราคาจริง · ไม่มีโฆษณา · โรงพยาบาล 235+",
    ko: "실제 가격 비교 · 광고 없음 · 235개+ 병원",
    ar: "قارن الأسعار الحقيقية · بدون إعلانات · 235+ مستشفى",
  };

  const headings: Record<string, string> = {
    en: "Health Check-Up in Thailand",
    zh: "泰国健康体检套餐对比",
    ja: "タイの健康診断パッケージ比較",
    th: "ตรวจสุขภาพในประเทศไทย",
    ko: "태국 건강검진 패키지 비교",
    ar: "الفحوصات الصحية في تايلاند",
  };

  const heading = headings[locale] || headings.en;
  const tagline = taglines[locale] || taglines.en;

  return new ImageResponse(
    (
      <div style={{
        width: "100%", height: "100%", display: "flex", flexDirection: "column",
        background: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 55%, #3b82f6 100%)",
        padding: "60px 70px",
        justifyContent: "space-between",
      }}>
        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: "14px", padding: "10px 24px" }}>
            <span style={{ color: "white", fontSize: "20px", fontWeight: 800 }}>BangkokCheckup</span>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            {["฿ Real Prices", "0 Ads", "JCI Listed"].map((tag) => (
              <div key={tag} style={{
                background: "rgba(255,255,255,0.12)", borderRadius: "999px",
                padding: "6px 16px", color: "rgba(255,255,255,0.85)", fontSize: "13px", fontWeight: 600,
              }}>{tag}</div>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ color: "white", fontSize: "62px", fontWeight: 800, lineHeight: 1.1, maxWidth: "900px" }}>
            {heading}
          </div>
          <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "26px", fontWeight: 500 }}>
            {tagline}
          </div>
        </div>

        {/* Bottom stats */}
        <div style={{ display: "flex", gap: "32px" }}>
          {[
            { num: "235+", label: "Hospitals" },
            { num: "18", label: "Cities" },
            { num: "6", label: "Languages" },
            { num: "0", label: "Paid rankings" },
          ].map(({ num, label }) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ color: "white", fontSize: "32px", fontWeight: 800 }}>{num}</span>
              <span style={{ color: "rgba(255,255,255,0.65)", fontSize: "14px" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
