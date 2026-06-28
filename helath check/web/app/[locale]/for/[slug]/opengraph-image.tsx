import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const SEGMENT_META: Record<string, { icon: string; title: string; subtitle: string }> = {
  "jci-accredited-health-checkup-bangkok":    { icon: "🏆", title: "JCI-Accredited Hospitals", subtitle: "Internationally certified health check-ups in Bangkok" },
  "health-checkup-expats-bangkok":            { icon: "🌍", title: "Health Check-Up for Expats", subtitle: "English service · Insurance accepted · Bangkok" },
  "japanese-health-checkup-bangkok":          { icon: "🗾", title: "Japanese Health Check-Up Bangkok", subtitle: "人間ドック · 日本語対応 · Ningen Dock equivalent" },
  "arabic-health-checkup-bangkok":            { icon: "🌙", title: "Health Check-Up for Arabic Speakers", subtitle: "Arabic interpreters · Halal services · Bangkok" },
  "cancer-screening-bangkok":                 { icon: "🎗️", title: "Cancer Screening Bangkok", subtitle: "Tumour markers · Imaging · Colonoscopy packages" },
  "womens-health-checkup-bangkok":            { icon: "♀️", title: "Women's Health Check-Up Bangkok", subtitle: "Pap smear · Mammogram · HPV · Hormonal panel" },
  "budget-health-checkup-bangkok":            { icon: "💰", title: "Budget Health Check-Up Bangkok", subtitle: "Under ฿3,000 · Best value packages compared" },
  "executive-health-checkup-bangkok":         { icon: "💼", title: "Executive Health Check-Up Bangkok", subtitle: "Premium packages · MRI · CT · Cancer markers" },
  "health-checkup-tourists-thailand":         { icon: "✈️", title: "Health Check-Up for Tourists", subtitle: "Same-day results · No registration needed · All cities" },
  "cardiac-health-checkup-bangkok":           { icon: "❤️", title: "Cardiac Health Check-Up Bangkok", subtitle: "ECG · Echocardiogram · Coronary CT · Cardiologist review" },
  "comprehensive-health-checkup-bangkok":     { icon: "🔬", title: "Comprehensive Health Check-Up Bangkok", subtitle: "Full body screen · Blood · Ultrasound · X-ray · ECG" },
};

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const meta = SEGMENT_META[slug] ?? {
    icon: "🏥",
    title: "Health Check-Up in Bangkok",
    subtitle: "Compare real prices from every hospital",
  };

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200, height: 630,
          background: "linear-gradient(135deg, #0f2044 0%, #1d6fa4 70%, #2196c4 100%)",
          display: "flex", flexDirection: "column",
          padding: "64px 72px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Icon */}
        <div style={{ fontSize: 72, marginBottom: 28 }}>{meta.icon}</div>

        {/* Title */}
        <div style={{ fontSize: 50, fontWeight: 800, color: "white", lineHeight: 1.2, marginBottom: 20 }}>
          {meta.title}
        </div>

        {/* Subtitle */}
        <div style={{ fontSize: 22, color: "rgba(255,255,255,0.72)", flex: 1 }}>
          {meta.subtitle}
        </div>

        {/* Bottom */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: 24,
        }}>
          <div style={{ display: "flex", gap: 32 }}>
            {[["235+", "Hospitals"], ["฿0", "Paid rankings"], ["6", "Languages"]].map(([v, l]) => (
              <div key={l} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 26, fontWeight: 800, color: "white" }}>{v}</span>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>{l}</span>
              </div>
            ))}
          </div>
          <div style={{
            background: "rgba(255,255,255,0.15)", borderRadius: 12,
            padding: "10px 24px", color: "white", fontSize: 15, fontWeight: 700,
          }}>
            bangkoktopclinic.com
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
