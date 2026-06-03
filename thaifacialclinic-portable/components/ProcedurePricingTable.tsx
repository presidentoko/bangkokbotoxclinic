// Focus-aware procedure pricing table — from-ranges for every common service.
// Builds transparency vs "request a quote" black boxes.

import type { SiteFocus } from "@/lib/site";

type Row = { name: string; from: number; to: number; unit: string };

const FOCUS_TABLE: Partial<Record<SiteFocus, Row[]>> = {
  botox: [
    { name: "Forehead lines",    from: 4_000,  to: 6_500,  unit: "10–15u" },
    { name: "Glabellar (11s)",   from: 3_500,  to: 5_500,  unit: "12u" },
    { name: "Crow's feet",       from: 3_000,  to: 5_000,  unit: "8–12u" },
    { name: "Bunny lines",       from: 1_500,  to: 3_000,  unit: "4–6u" },
    { name: "Masseter (jaw)",    from: 8_000,  to: 14_000, unit: "40–60u" },
    { name: "Brow lift",         from: 2_500,  to: 4_500,  unit: "8u" },
    { name: "Lip flip",          from: 1_500,  to: 3_000,  unit: "4–6u" },
    { name: "Hyperhidrosis",     from: 15_000, to: 25_000, unit: "100u per area" },
  ],
  filler: [
    { name: "Lip enhancement",        from: 12_000, to: 22_000, unit: "1ml" },
    { name: "Cheek volume",           from: 24_000, to: 44_000, unit: "2ml" },
    { name: "Tear-trough",            from: 14_000, to: 22_000, unit: "1ml careful" },
    { name: "Nasolabial folds",       from: 14_000, to: 22_000, unit: "1ml" },
    { name: "Marionette lines",       from: 14_000, to: 22_000, unit: "1ml" },
    { name: "Chin augmentation",      from: 24_000, to: 44_000, unit: "2ml" },
    { name: "Jawline (per side)",     from: 28_000, to: 50_000, unit: "2.5ml" },
    { name: "Nose bridge (nonsurg)",  from: 16_000, to: 26_000, unit: "1ml" },
  ],
  hifu: [
    { name: "Full face",         from: 18_000, to: 35_000, unit: "300+ lines" },
    { name: "Face + neck",       from: 25_000, to: 45_000, unit: "500+ lines" },
    { name: "Eye area only",     from: 8_000,  to: 14_000, unit: "150 lines" },
    { name: "Body (per area)",   from: 15_000, to: 28_000, unit: "200 lines" },
  ],
  facial: [
    { name: "HydraFacial — signature",   from: 3_500,  to: 5_500,  unit: "60min" },
    { name: "HydraFacial — deluxe",      from: 5_500,  to: 8_500,  unit: "75min, boosters" },
    { name: "Deep cleansing facial",     from: 1_800,  to: 3_500,  unit: "45min" },
    { name: "LED light therapy add-on",  from: 800,    to: 1_500,  unit: "15min" },
  ],
  laser: [
    { name: "Pico laser — face",         from: 4_500,  to: 8_500,  unit: "session" },
    { name: "Carbon laser peel",         from: 2_500,  to: 4_500,  unit: "session" },
    { name: "Laser hair removal — face", from: 1_500,  to: 3_500,  unit: "session" },
    { name: "Laser hair — bikini",       from: 2_000,  to: 4_500,  unit: "session" },
    { name: "Laser hair — full legs",    from: 4_500,  to: 9_000,  unit: "session" },
  ],
  dental: [
    { name: "Dental implant (single)",   from: 55_000,  to: 95_000,  unit: "post + crown" },
    { name: "Porcelain veneer",          from: 14_000,  to: 28_000,  unit: "per tooth" },
    { name: "Zirconia crown",            from: 12_000,  to: 22_000,  unit: "per tooth" },
    { name: "Teeth whitening (in-clinic)", from: 4_000,  to: 9_000,   unit: "full mouth" },
    { name: "Root canal (front tooth)",  from: 4_000,  to: 8_000,   unit: "incl. crown extra" },
    { name: "All-on-4 (per arch)",       from: 280_000, to: 480_000, unit: "full arch" },
    { name: "Invisalign full",           from: 110_000, to: 180_000, unit: "12-18 months" },
    { name: "Scaling + polish",          from: 1_200,   to: 2_500,   unit: "session" },
  ],
  hair: [
    { name: "FUE 1,500 grafts",          from: 65_000,  to: 110_000, unit: "incl. all" },
    { name: "FUE 2,500 grafts",          from: 100_000, to: 175_000, unit: "incl. all" },
    { name: "FUE 3,500+ grafts",         from: 140_000, to: 240_000, unit: "incl. all" },
    { name: "DHI per session",           from: 130_000, to: 240_000, unit: "30–50% premium" },
    { name: "Beard transplant",          from: 60_000,  to: 130_000, unit: "1,000–1,500 grafts" },
    { name: "Eyebrow transplant",        from: 40_000,  to: 75_000,  unit: "300–500 grafts" },
    { name: "PRP scalp injection",       from: 4_500,   to: 8_500,   unit: "session" },
    { name: "SMP (scalp micropigment)",  from: 35_000,  to: 75_000,  unit: "full scalp 2–3 sessions" },
  ],
};

function fmt(n: number): string {
  if (n >= 1_000_000) return `฿${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 10_000)    return `฿${Math.round(n / 1000)}K`;
  return `฿${n.toLocaleString()}`;
}

export default function ProcedurePricingTable({ focus }: { focus: SiteFocus }) {
  const rows = FOCUS_TABLE[focus];
  if (!rows) return null;
  return (
    <section className="rounded-2xl border bg-white p-5" style={{ borderColor: "rgb(var(--border))" }}>
      <div className="mb-4">
        <div className="text-xs font-black uppercase tracking-widest text-[rgb(var(--muted))]">Transparent pricing</div>
        <h3 className="text-lg sm:text-xl font-black tracking-tight mt-1">All procedures · from-prices</h3>
        <p className="text-xs text-[rgb(var(--muted))] mt-1">Bangkok market ranges. Final quote after consult.</p>
      </div>
      <div className="overflow-x-auto -mx-2 px-2">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[10px] font-black uppercase tracking-widest text-[rgb(var(--muted))] border-b" style={{ borderColor: "rgb(var(--border))" }}>
              <th className="py-2 pl-1">Procedure</th>
              <th className="py-2 hidden sm:table-cell">Unit</th>
              <th className="py-2 text-right pr-1">From / to</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: "rgb(var(--border))" }}>
            {rows.map((r, i) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="py-2.5 pl-1 font-bold">{r.name}</td>
                <td className="py-2.5 text-xs text-[rgb(var(--muted))] hidden sm:table-cell">{r.unit}</td>
                <td className="py-2.5 text-right tabular-nums font-black pr-1">
                  {fmt(r.from)} – {fmt(r.to)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
