import { ImageResponse } from "next/og";
import { loadMasterDb, getClinicById } from "@/lib/data";
import { getSiteConfig, applySiteFilter, getSiteUrl } from "@/lib/site";
import { buildReportData } from "@/lib/reportData";

export const alt = "Free Clinic Report";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const SITE = getSiteUrl();

export default async function ReportOG(
  { params }: { params: Promise<{ clinicId: string }> },
) {
  const { clinicId } = await params;
  const db = await loadMasterDb();
  const c = getClinicById(db.clinics, clinicId);
  const cfg = getSiteConfig();

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

  const all = applySiteFilter(db.clinics, cfg);
  const r = buildReportData(c, all, cfg, SITE);
  const topPct = Math.max(1, 100 - r.trustPercentile);
  const trustColor = c.trust_score >= 75 ? "#10b981" : c.trust_score >= 50 ? "#f59e0b" : "#ef4444";
  const accent = cfg.themeAccent;

  return new ImageResponse(
    (
      <div style={{
        width: "100%", height: "100%",
        display: "flex", flexDirection: "column",
        background: `linear-gradient(135deg, #ffffff 0%, ${accent}12 100%)`,
        padding: "64px 80px",
        fontFamily: "system-ui, sans-serif",
      }}>
        {/* Brand label */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            background: accent, color: "white", borderRadius: 8,
            padding: "4px 14px", fontSize: 18, fontWeight: 700,
          }}>
            Free Report
          </div>
          <div style={{ fontSize: 18, color: "#737373", display: "flex" }}>
            {cfg.brand}
          </div>
        </div>

        {/* Clinic name */}
        <div style={{
          fontSize: 62, fontWeight: 800, color: "#0a0a0a",
          lineHeight: 1.05, letterSpacing: -1, marginTop: 48,
          maxWidth: 1040,
        }}>
          {c.name.length > 55 ? c.name.slice(0, 53) + "…" : c.name}
        </div>

        {/* Location */}
        <div style={{ fontSize: 24, color: "#737373", marginTop: 16, display: "flex" }}>
          📍 {[c.district, c.city_label].filter(Boolean).join(" · ")}
        </div>

        {/* Score row */}
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
              of {c.city_label} clinics
            </div>
          </div>

          {r.districtRank > 0 && r.districtTotal > 0 && (
            <div style={{
              display: "flex", flexDirection: "column",
              background: "#f0f0f0", borderRadius: 16,
              padding: "16px 28px", gap: 4,
            }}>
              <div style={{ fontSize: 36, fontWeight: 800, color: "#0a0a0a", display: "flex" }}>
                #{r.districtRank}
              </div>
              <div style={{ fontSize: 18, color: "#737373", display: "flex" }}>
                in {c.district || c.city_label}
              </div>
            </div>
          )}
        </div>
      </div>
    ),
    size,
  );
}
