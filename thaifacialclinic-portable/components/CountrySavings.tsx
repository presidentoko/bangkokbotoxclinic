// Country-to-country price comparison widget. Anchored to a baseline THB price.
// Used on clinic detail (with the clinic's own pricing) or procedure pages.

import type { SiteFocus } from "@/lib/site";

const COUNTRY_MULT: Record<string, { flag: string; name: string; mult: number; note: string }> = {
  kr: { flag: "🇰🇷", name: "Korea",     mult: 1.6,  note: "Seoul Gangnam district" },
  sg: { flag: "🇸🇬", name: "Singapore", mult: 2.4, note: "Orchard / Holland Village" },
  uk: { flag: "🇬🇧", name: "UK",        mult: 3.2, note: "London Harley Street" },
  us: { flag: "🇺🇸", name: "US",        mult: 3.5, note: "California / NY" },
  au: { flag: "🇦🇺", name: "Australia", mult: 2.8, note: "Sydney / Melbourne" },
};

const DEFAULT_BASELINES: Partial<Record<SiteFocus, { proc: string; thb: number }>> = {
  botox:  { proc: "30 units botox (forehead + 11s)",     thb: 6_000 },
  filler: { proc: "1 ml HA filler (lips)",                thb: 15_000 },
  hifu:   { proc: "Single HIFU session (1 area)",         thb: 20_000 },
  facial: { proc: "HydraFacial single session",            thb: 3_500 },
  laser:  { proc: "Pico laser face session",               thb: 4_500 },
  dental: { proc: "Single dental implant (incl. crown)",   thb: 75_000 },
  hair:   { proc: "FUE hair transplant (2,500 grafts)",    thb: 150_000 },
};

function fmt(thb: number): string {
  if (thb >= 1_000_000) return `฿${(thb / 1_000_000).toFixed(1)}M`;
  return `฿${Math.round(thb / 1000)}K`;
}
function usd(thb: number): string {
  // rough: 1 USD = 35 THB (2026)
  const u = thb / 35;
  if (u >= 1000) return `$${(u / 1000).toFixed(1)}K`;
  return `$${u.toFixed(0)}`;
}

export default function CountrySavings({
  focus = "all",
  baselineTHB,
  procedureLabel,
}: {
  focus?: SiteFocus;
  baselineTHB?: number;
  procedureLabel?: string;
}) {
  const def = focus !== "all" ? DEFAULT_BASELINES[focus] : undefined;
  const thb = baselineTHB ?? def?.thb;
  const proc = procedureLabel ?? def?.proc;
  if (!thb || !proc) return null;

  const rows = Object.values(COUNTRY_MULT)
    .map((c) => ({ ...c, price: Math.round(thb * c.mult), saved: Math.round(thb * (c.mult - 1)) }))
    .sort((a, b) => b.mult - a.mult);

  const maxSaved = Math.max(...rows.map((r) => r.saved));

  return (
    <section className="rounded-2xl border-2 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-5 sm:p-6" style={{ borderColor: "#a7f3d0" }}>
      <div className="mb-4">
        <div className="text-xs font-black uppercase tracking-widest text-emerald-700">Medical tourism math</div>
        <h2 className="mt-1 text-xl sm:text-2xl font-black tracking-tight">
          The same {proc} elsewhere
        </h2>
        <p className="mt-1 text-sm text-[rgb(var(--muted))]">
          Bangkok baseline: <strong className="text-[rgb(var(--fg))]">{fmt(thb)}</strong> ({usd(thb)} USD). All other prices are rough public averages — confirm with each clinic.
        </p>
      </div>

      <div className="space-y-2.5">
        <div className="flex items-center gap-3 rounded-xl border-2 border-emerald-400 bg-emerald-50 p-3">
          <span className="text-2xl shrink-0">🇹🇭</span>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm">Thailand · Bangkok</div>
            <div className="text-[11px] text-[rgb(var(--muted))]">You&apos;re here</div>
          </div>
          <div className="text-right shrink-0">
            <div className="font-black tabular-nums text-emerald-900 text-lg">{fmt(thb)}</div>
            <div className="text-[10px] text-emerald-700 font-bold">BASELINE</div>
          </div>
        </div>

        {rows.map((r) => {
          const barPct = (r.saved / maxSaved) * 100;
          return (
            <div key={r.flag} className="flex items-center gap-3 rounded-xl bg-white border p-3" style={{ borderColor: "rgb(var(--border))" }}>
              <span className="text-2xl shrink-0">{r.flag}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2 mb-1">
                  <div className="font-bold text-sm">{r.name}</div>
                  <div className="text-[10px] text-[rgb(var(--muted))]">{r.note}</div>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-rose-400 to-rose-600" style={{ width: `${barPct}%` }} />
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-black tabular-nums">{fmt(r.price)}</div>
                <div className="text-[10px] text-rose-700 font-bold">+{fmt(r.saved)} ({((r.mult - 1) * 100).toFixed(0)}%)</div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-[rgb(var(--muted))] mt-4 leading-relaxed">
        These are not exact quotes — they reflect typical published ranges from 2024–2026. Add flight + hotel: even with ฿40K travel, Bangkok still saves you {fmt(rows[0].saved - 40_000)} vs {rows[0].name}.
      </p>
    </section>
  );
}
