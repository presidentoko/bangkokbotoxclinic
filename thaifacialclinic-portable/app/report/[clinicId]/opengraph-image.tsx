import { ImageResponse } from "next/og";
import { loadClinics, getClinicById } from "@/lib/data";
import { buildReportData } from "@/lib/reportData";

export const alt = "Free Clinic Report";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://thaifacialclinic.com";
const BRAND = "Hair by Thai Facial Clinic";
const ACCENT = "#dcaa4a";

export default async function ReportOG(
  { params }: { params: Promise<{ clinicId: string }> },
) {
  const { clinicId } = await params;
  const c = getClinicById(clinicId);

  if (!c) {
    return new ImageResponse(
      (
        <div style={{ width: "100%", height: "100%", background: "#f5f5f5",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 48, color: "#a3a3a3", fontFamily: "system-ui, sans-serif" }}>
          Clinic not found
        </div>
      ),
      size,
    );
  }

  const { clinics } = loadClinics();
  const r = buildReportData(c, clinics, SITE);
  const topPct = Math.max(1, 100 - r.trustPercentile);
  const trustColor = c.trust_score >= 75 ? "#10b981" : c.trust_score >= 50 ? "#f59e0b" : "#ef4444";

  return new ImageResponse(
    (
      <div style={{
        width: "100%", height: "100%",
        display: "flex", flexDirection: "column",
        background: `linear-gradient(135deg, #ffffff 0%, ${ACCENT}12 100%)`,
        padding: "64px 80px",
        fontFamily: "system-ui, sans-serif",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            background: ACCENT, color: "white", borderRadius: 8,
            padding: "4px 14px", fontSize: 18, fontWeight: 700,
          }}>
            Free Report
          </div>
          <div style={{ fontSize: 18, color: "#737373", display: "flex" }}>
            {BRAND}
          </div>
        </div>

        <div style={{
          fontSize: 62, fontWeight: 800, color: "#0a0a0a",
          lineHeight: 1.05, letterSpacing: -1, marginTop: 48,
          maxWidth: 1040,
        }}>
          {c.name.length > 55 ? c.name.slice(0, 53) + "…" : c.name}
        </div>

        <div style={{ fontSize: 24, color: "#737373", marginTop: 16, display: "flex" }}>
          📍 {c.city}
        </div>

        <div style={{ display: "flex", gap: 48, marginTop: "auto", alignItems: "flex-end" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ fontSize: 72, fontWeight: 800, color: trustColor, display: "flex", alignItems: "baseline", gap: 8 }}>
              {c.trust_score}
              <span style={{ fontSize: 28, color: "#a3a3a3", fontWeight: 400 }}>/100</span>
            </div>
            <div style={{ fontSize: 18, color: "#a3a3a3", textTransform: "uppercase", letterSpacing: 1, display: "flex" }}>
              Trust Score
            </div>
          </div>

          <div style={{
            display: "flex", flexDirection: "column",
            background: `${trustColor}15`, borderRadius: 16,
            padding: "16px 28px", gap: 4,
          }}>
            <div style={{ fontSize: 36, fontWeight: 800, color: trustColor, display: "flex" }}>
              Top {topPct}%
            </div>
            <div style={{ fontSize: 18, color: "#737373", display: "flex" }}>
              of {c.city} clinics
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
