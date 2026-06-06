import Sparkline from "./Sparkline";

type DayPoint = { date: string; count: number };

export default function ProfileViewsChart({
  byDay, total,
}: {
  byDay: DayPoint[];
  total: number;
}) {
  const counts = byDay.map((d) => d.count);
  const last7 = counts.slice(-7).reduce((s, x) => s + x, 0);
  const prev7 = counts.slice(-14, -7).reduce((s, x) => s + x, 0);
  const delta = last7 - prev7;
  const deltaPct = prev7 > 0 ? Math.round((delta / prev7) * 100) : null;

  const max = Math.max(...counts, 1);
  const avg = counts.length ? Math.round(counts.reduce((s, x) => s + x, 0) / counts.length) : 0;

  return (
    <section className="card p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="eyebrow">Profile views</div>
          <h3 className="mt-1 font-display text-2xl font-bold">Last 30 days</h3>
        </div>
        <div className="grid grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider muted">Total</div>
            <div className="font-display text-2xl font-bold tabular-nums">{total.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider muted">Last 7 days</div>
            <div className="font-display text-2xl font-bold tabular-nums">{last7}</div>
            {deltaPct !== null && (
              <div className={`text-[10px] font-bold ${delta >= 0 ? "text-mint-700" : "text-red-600"}`}>
                {delta >= 0 ? "↑" : "↓"} {Math.abs(deltaPct)}% vs prev
              </div>
            )}
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider muted">Daily avg</div>
            <div className="font-display text-2xl font-bold tabular-nums">{avg}</div>
          </div>
        </div>
      </div>

      {/* Sparkline */}
      <div className="mt-5 relative">
        <Sparkline data={counts.length ? counts : [0, 0]} width={800} height={120} stroke="#0ea5e9" />
        <div className="mt-2 flex justify-between text-[10px] muted">
          <span>{byDay[0]?.date.slice(5) || ""}</span>
          <span className="opacity-50">{byDay[Math.floor(byDay.length / 2)]?.date.slice(5) || ""}</span>
          <span>{byDay[byDay.length - 1]?.date.slice(5) || "today"}</span>
        </div>
      </div>

      {/* Daily bars (mini) */}
      <div className="mt-4 flex items-end gap-0.5 h-12">
        {counts.map((c, i) => {
          const h = max > 0 ? (c / max) * 100 : 0;
          return (
            <div key={i} className="group relative flex-1 min-w-[3px]" title={`${byDay[i].date}: ${c}`}>
              <div className="w-full rounded-sm bg-navy-200 dark:bg-navy-700 transition group-hover:bg-navy-700 dark:group-hover:bg-gold-400"
                style={{ height: `${Math.max(h, 4)}%` }} />
            </div>
          );
        })}
      </div>
    </section>
  );
}
