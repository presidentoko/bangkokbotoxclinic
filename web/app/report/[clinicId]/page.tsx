import { notFound } from "next/navigation";
import { loadMasterDb, getClinicById } from "@/lib/data";
import { getSiteConfig, applySiteFilter, getSiteUrl } from "@/lib/site";
import { buildReportData } from "@/lib/reportData";
import type { Metadata } from "next";

// noindex 공유 전용 페이지 — GSP 없이 revalidate(ISR)였을 땐 봇이 두드리는
// clinicId마다 캐시 write 발생 (Hobby 한도 누수, 2026-07-11 감사).
// 트래픽이 거의 없으니 force-dynamic(write 0)이 맞음.
export const dynamic = "force-dynamic";

const SITE = getSiteUrl();

export async function generateMetadata(
  { params }: { params: Promise<{ clinicId: string }> },
): Promise<Metadata> {
  const { clinicId } = await params;
  const db = await loadMasterDb();
  const c = getClinicById(db.clinics, clinicId);
  if (!c) return { title: "Clinic report" };
  return {
    title: `${c.name} — Free Clinic Report`,
    description: `Trust Score ${c.trust_score}/100 · ${c.city_label}`,
    robots: { index: false, follow: false },
  };
}

export default async function ReportPage(
  { params }: { params: Promise<{ clinicId: string }> },
) {
  const { clinicId } = await params;
  const db = await loadMasterDb();
  const c = getClinicById(db.clinics, clinicId);
  if (!c) notFound();

  const cfg = getSiteConfig();
  const all = applySiteFilter(db.clinics, cfg);
  const r = buildReportData(c, all, cfg, SITE);

  const trustColor =
    c.trust_score >= 75 ? "#10b981" : c.trust_score >= 50 ? "#f59e0b" : "#ef4444";
  const topPct = Math.max(1, 100 - r.trustPercentile);

  return (
    <main className="min-h-screen bg-white">
      {/* Thin brand header */}
      <div
        className="px-4 py-3 text-white text-xs font-semibold text-center"
        style={{ background: cfg.themeAccent }}
      >
        {cfg.brand} · Free Clinic Report
      </div>

      <div className="max-w-sm mx-auto px-5 pt-8 pb-12">
        {/* Clinic name */}
        <h1 className="text-2xl font-black tracking-tight leading-tight mb-1">
          {c.name}
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          {[c.city_label, c.district].filter(Boolean).join(" · ")}
        </p>

        {/* Trust Score card */}
        <div className="rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
          <div className="flex items-end justify-between mb-3">
            <div>
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                Trust Score
              </div>
              <div
                className="text-5xl font-black"
                style={{ color: trustColor }}
              >
                {c.trust_score}
                <span className="text-xl text-gray-400 font-normal">/100</span>
              </div>
            </div>
            <div className="text-right">
              <div
                className="text-sm font-bold px-3 py-1 rounded-full"
                style={{
                  background: `${trustColor}18`,
                  color: trustColor,
                }}
              >
                Top {topPct}%
              </div>
              <div className="text-xs text-gray-400 mt-1">
                of {c.city_label} clinics
              </div>
            </div>
          </div>
          {/* Progress bar */}
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${c.trust_score}%`,
                background: trustColor,
              }}
            />
          </div>
        </div>

        {/* Stats pills */}
        <div className="space-y-2 mb-6">
          {r.negativeCount > 0 && (
            <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
              <span className="text-lg">⚠️</span>
              <span className="text-sm font-medium text-amber-800">
                {r.negativeCount} unanswered patient review
                {r.negativeCount > 1 ? "s" : ""}
              </span>
            </div>
          )}
          {r.districtRank > 0 && r.districtTotal > 0 && (
            <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3">
              <span className="text-lg">🏅</span>
              <span className="text-sm font-medium text-indigo-800">
                #{r.districtRank} of {r.districtTotal} clinics in{" "}
                {c.district || c.city_label}
              </span>
            </div>
          )}
          {r.intlPct >= 50 && (
            <div className="flex items-center gap-3 bg-sky-50 border border-sky-100 rounded-xl px-4 py-3">
              <span className="text-lg">🌍</span>
              <span className="text-sm font-medium text-sky-800">
                {r.intlPct}% international patients
              </span>
            </div>
          )}
        </div>

        {/* CTA */}
        <a
          href={r.demoUrl}
          className="block text-center text-white font-bold py-4 rounded-2xl text-base shadow-md active:scale-95 transition-transform"
          style={{ background: cfg.themeAccent }}
        >
          See your full free report →
        </a>
        <p className="text-center text-xs text-gray-400 mt-3">
          Free for clinics · No signup needed
        </p>
      </div>
    </main>
  );
}
