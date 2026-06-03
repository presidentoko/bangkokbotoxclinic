// 12-month "best time to book" heatmap. Focus-aware (e.g., hair = avoid hot Mar-May; dental = anytime).

import type { SiteFocus } from "@/lib/site";

type Rating = 0 | 1 | 2; // 0=avoid, 1=ok, 2=best
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// Per-focus 12-month suitability rating
const FOCUS_SEASON: Partial<Record<SiteFocus, { rating: Rating[]; legend: string }>> = {
  // hair: avoid hot months (Mar-May) for outdoor sun risk on grafts
  hair:   { rating: [2,2,1,0,0,1,1,1,2,2,2,2], legend: "Cool/dry season (Oct–Feb) is best — easier graft recovery, less sun risk." },
  // dental: anytime, slightly easier off-peak tourist months
  dental: { rating: [2,2,2,2,2,1,1,1,2,2,2,2], legend: "Year-round OK. Cool months slightly more pleasant for multi-day visits." },
  // botox/filler: anytime
  botox:  { rating: [2,2,1,1,1,2,2,2,2,2,2,2], legend: "Year-round, but pre-summer (Mar–May) high sun = more bruising visible." },
  filler: { rating: [2,2,1,1,1,2,2,2,2,2,2,2], legend: "Avoid heat-peaks (Mar–May) — swelling worse in hot weather." },
  // laser: avoid post-tan months
  laser:  { rating: [2,2,1,0,0,1,1,2,2,2,2,2], legend: "Avoid Mar–May (sun-tan risk). Cool/dry season best for pigment treatments." },
  // hifu: anytime, off-peak best
  hifu:   { rating: [2,2,2,1,1,2,2,2,2,2,2,2], legend: "Year-round. Slightly easier in cool months for tourist comfort." },
  // facial: anytime
  facial: { rating: [2,2,2,2,2,2,2,2,2,2,2,2], legend: "Anytime — maintenance is calendar-independent." },
};

const COLOR: Record<Rating, { bg: string; label: string }> = {
  0: { bg: "#fee2e2", label: "Avoid" },
  1: { bg: "#fef3c7", label: "OK" },
  2: { bg: "#d1fae5", label: "Best" },
};

export default function SeasonalBestTime({ focus }: { focus: SiteFocus }) {
  const cfg = FOCUS_SEASON[focus];
  if (!cfg) return null;

  return (
    <section className="rounded-2xl border bg-white p-5" style={{ borderColor: "rgb(var(--border))" }}>
      <div className="mb-3">
        <div className="text-xs font-black uppercase tracking-widest text-[rgb(var(--muted))]">When to come</div>
        <h3 className="text-base font-black mt-0.5">Best months in Bangkok for this procedure</h3>
      </div>

      <div className="grid grid-cols-12 gap-1.5">
        {MONTHS.map((m, i) => {
          const r = cfg.rating[i];
          const c = COLOR[r];
          return (
            <div key={m} className="text-center">
              <div className="aspect-square rounded-md grid place-items-center text-[10px] font-black"
                style={{ background: c.bg, color: r === 0 ? "#991b1b" : r === 1 ? "#92400e" : "#065f46" }}>
                {m.slice(0, 1)}
              </div>
              <div className="text-[9px] text-[rgb(var(--muted))] mt-1">{m}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-[10px] text-[rgb(var(--muted))]">
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded" style={{ background: COLOR[2].bg }} /> Best</span>
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded" style={{ background: COLOR[1].bg }} /> OK</span>
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded" style={{ background: COLOR[0].bg }} /> Avoid</span>
      </div>
      <p className="text-[11px] text-[rgb(var(--muted))] mt-3 leading-relaxed">{cfg.legend}</p>
    </section>
  );
}
