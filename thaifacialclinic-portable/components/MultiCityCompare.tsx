// Compare clinic's procedure price vs Bangkok / Phuket / Chiang Mai market.
// Patient sees if they're getting a fair deal locally.

import type { SiteFocus } from "@/lib/site";

const CITY_MULT: Record<string, { flag: string; name: string; mult: number; note: string }> = {
  bkk:    { flag: "🇹🇭", name: "Bangkok",      mult: 1.00, note: "Most options, highest competition" },
  phuket: { flag: "🇹🇭", name: "Phuket",       mult: 1.08, note: "Tourist island pricing premium" },
  cm:     { flag: "🇹🇭", name: "Chiang Mai",   mult: 0.92, note: "Quieter, more affordable" },
  pty:    { flag: "🇹🇭", name: "Pattaya",      mult: 0.97, note: "Strong on dental clinics" },
};

const FOCUS_BASELINE: Partial<Record<SiteFocus, { proc: string; thb: number }>> = {
  botox:  { proc: "30u botox (forehead)",   thb: 6_500 },
  filler: { proc: "1ml HA filler",          thb: 16_000 },
  hifu:   { proc: "Single HIFU session",    thb: 22_000 },
  facial: { proc: "HydraFacial",            thb: 3_800 },
  laser:  { proc: "Pico laser face",        thb: 4_800 },
  dental: { proc: "Single dental implant",  thb: 78_000 },
  hair:   { proc: "FUE 2,500 grafts",       thb: 155_000 },
};

function fmt(n: number): string {
  if (n >= 1_000_000) return `฿${(n / 1_000_000).toFixed(1)}M`;
  return `฿${Math.round(n / 1000)}K`;
}

export default function MultiCityCompare({
  focus,
  highlight = "bkk",
  baselineTHB,
}: {
  focus: SiteFocus;
  highlight?: "bkk" | "phuket" | "cm" | "pty";
  baselineTHB?: number;
}) {
  const def = FOCUS_BASELINE[focus];
  const thb = baselineTHB ?? def?.thb;
  if (!thb || !def) return null;

  const rows = Object.entries(CITY_MULT).map(([k, c]) => ({ k, ...c, price: Math.round(thb * c.mult) }));

  return (
    <section className="rounded-2xl border bg-white p-5" style={{ borderColor: "rgb(var(--border))" }}>
      <div className="mb-3">
        <div className="text-xs font-black uppercase tracking-widest text-[rgb(var(--muted))]">Thailand by city</div>
        <h3 className="text-base font-black mt-0.5">{def.proc} across Thai cities</h3>
      </div>
      <ul className="grid gap-2 sm:grid-cols-2">
        {rows.map((r) => (
          <li key={r.k} className={`rounded-lg p-3 border-2 flex items-center gap-3 ${
            r.k === highlight ? "border-emerald-500 bg-emerald-50" : "border-[rgb(var(--border))] bg-slate-50"
          }`}>
            <span className="text-2xl shrink-0">{r.flag}</span>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm">{r.name} {r.k === highlight && <span className="text-emerald-700 text-[10px] ml-1">YOU&apos;RE HERE</span>}</div>
              <div className="text-[11px] text-[rgb(var(--muted))]">{r.note}</div>
            </div>
            <div className="text-right shrink-0">
              <div className="font-black tabular-nums">{fmt(r.price)}</div>
              <div className="text-[10px] text-[rgb(var(--muted))]">{r.mult === 1 ? "baseline" : r.mult > 1 ? `+${((r.mult - 1) * 100).toFixed(0)}%` : `${((r.mult - 1) * 100).toFixed(0)}%`}</div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
