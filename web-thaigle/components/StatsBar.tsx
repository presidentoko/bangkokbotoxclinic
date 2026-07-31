// ⚠️ Normally AUTO-GENERATED from shared/components/StatsBar.tsx — this copy
// was hand-patched (see FreshnessTime import below) because the shared
// source also feeds bangkokbotoxclinic.com/bangkokbestclinic.com, which are
// out of scope here. Re-running scripts/sync_shared.py will overwrite this
// fix; port it to the shared source separately if you want it everywhere.

// 홈/카테고리 페이지 상단 stats bar — 라이브 카운터 느낌.
// site별 차이는 entityLabel prop ("Clinics" | "Restaurants" | "Courses") 한 단어뿐.

import { FreshnessTime } from "@/components/FreshnessTime";

export function StatsBar({
  generatedAt, totalClinics, totalReviews, withScraped,
  entityLabel = "Items",
  label = "Verified",
}: {
  generatedAt: string;
  totalClinics: number;  // legacy prop name. 의미: total entity count (clinic/restaurant/course).
  totalReviews: number;
  withScraped: number;
  entityLabel?: string;  // "Clinics" | "Restaurants" | "Courses" 등
  label?: string;
}) {
  return (
    <div className="border-t border-b border-[var(--border)] bg-white">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4 flex-wrap text-sm">
        <div className="flex items-center gap-5 flex-wrap">
          <Stat label={entityLabel} value={totalClinics.toLocaleString()} />
          <Stat label="Reviews analyzed" value={totalReviews.toLocaleString()} />
          <Stat label={label} value={withScraped.toLocaleString()} />
        </div>
        <span className="text-xs text-[var(--muted)] flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          Updated <FreshnessTime generatedAt={generatedAt} />
        </span>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="font-bold tabular-nums">{value}</span>
      <span className="text-xs text-[var(--muted)]">{label}</span>
    </div>
  );
}
