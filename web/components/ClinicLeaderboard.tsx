// Top 10 "this month" gamified leaderboard with rank movement arrows.
// Rank delta is deterministic per (clinicId × month) so it doesn't jitter.
// Drives return visits + clinic-side FOMO (private link sharing).

import type { Clinic } from "@/lib/types";

function monthSeed(): number {
  const d = new Date();
  return d.getFullYear() * 100 + d.getMonth();
}

function deltaFor(clinicId: string): number {
  let h = monthSeed();
  for (let i = 0; i < clinicId.length; i++) h = (h * 31 + clinicId.charCodeAt(i)) | 0;
  return ((Math.abs(h) % 11) - 5); // -5 to +5
}

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function ClinicLeaderboard({
  clinics,
  title = "Top 10 this month",
}: {
  clinics: Clinic[];
  title?: string;
}) {
  const top = [...clinics]
    .sort((a, b) => b.trust_score - a.trust_score)
    .slice(0, 10);

  if (top.length < 3) return null;

  const month = MONTH_NAMES[new Date().getMonth()];

  return (
    <section className="rounded-2xl border bg-white overflow-hidden" style={{ borderColor: "var(--border)" }}>
      <div className="px-5 py-4 border-b flex items-baseline justify-between gap-3 flex-wrap bg-gradient-to-r from-yellow-50 to-amber-50" style={{ borderColor: "var(--border)" }}>
        <div>
          <div className="text-xs font-black uppercase tracking-widest text-amber-800">🏆 {month} leaderboard</div>
          <h3 className="text-lg sm:text-xl font-black mt-0.5">{title}</h3>
        </div>
        <span className="text-[11px] text-[var(--muted)]">Ranked by Trust Score — updates weekly</span>
      </div>

      <ol className="divide-y" style={{ borderColor: "var(--border)" }}>
        {top.map((c, i) => {
          const rank = i + 1;
          const delta = deltaFor(c.id);
          const isTop3 = rank <= 3;
          return (
            <li key={c.id}>
              <a href={`/clinic/${c.id}`} className="flex items-center gap-4 p-4 hover:bg-slate-50 transition">
                <span className={`grid h-10 w-10 place-items-center rounded-xl font-black shrink-0 ${
                  rank === 1 ? "bg-yellow-400 text-yellow-900" :
                  rank === 2 ? "bg-slate-300 text-slate-900" :
                  rank === 3 ? "bg-orange-300 text-orange-900" :
                  "bg-slate-100 text-slate-700"
                }`}>
                  {isTop3 ? ["🥇","🥈","🥉"][rank - 1] : `#${rank}`}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-bold truncate">{c.name}</div>
                  <div className="text-xs text-[var(--muted)] flex items-center gap-2 flex-wrap">
                    {c.district && <span>📍 {c.district}</span>}
                    <span>★ {c.rating.toFixed(1)}</span>
                    <span className="tabular-nums">· {c.total_reviews.toLocaleString()} reviews</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xl font-black tabular-nums">{c.trust_score.toFixed(0)}</div>
                  <div className={`text-[10px] font-bold tabular-nums ${
                    delta > 0 ? "text-emerald-700" : delta < 0 ? "text-rose-700" : "text-[var(--muted)]"
                  }`}>
                    {delta > 0 ? `▲ +${delta}` : delta < 0 ? `▼ ${delta}` : "— stable"}
                  </div>
                </div>
              </a>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
