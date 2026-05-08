// ⚠️ AUTO-GENERATED from shared/components/StatsBar.tsx
// DO NOT edit directly — edit shared/components/StatsBar.tsx, then run `python scripts/sync_shared.py`.

// 홈/카테고리 페이지 상단 stats bar — 라이브 카운터 느낌.
// site별 차이는 entityLabel prop ("Clinics" | "Restaurants" | "Courses") 한 단어뿐.

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
  const ago = relativeTimeFromIso(generatedAt);

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
          Updated {ago}
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

function relativeTimeFromIso(iso: string): string {
  const then = new Date(iso).getTime();
  if (isNaN(then)) return "recently";
  const now = Date.now();
  const diff = Math.max(0, now - then);
  const min = Math.floor(diff / 60_000);
  if (min < 1) return "just now";
  if (min < 60) return `${min} min ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  return `${day}d ago`;
}
