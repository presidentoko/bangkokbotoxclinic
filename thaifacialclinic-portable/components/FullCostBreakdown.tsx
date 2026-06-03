// All-in trip cost: procedure + meds + hotel + flight + visa + buffer. Itemized transparent breakdown.

export default function FullCostBreakdown({
  procedureTHB,
  city = "Seoul",
  flightTHB = 18_000,
}: {
  procedureTHB: number;
  city?: string;
  flightTHB?: number;
}) {
  const items = [
    { label: "Procedure (clinic estimate)",       thb: procedureTHB,        note: "Range — confirm post-consult" },
    { label: "Aftercare meds / supplies",          thb: 2_500,               note: "Antibiotics, painkillers, dressings" },
    { label: "Hotel (5 nights, mid-range)",        thb: 9_000,               note: "Near clinic, walking distance" },
    { label: `Roundtrip flight (${city})`,         thb: flightTHB,           note: "Off-peak average" },
    { label: "Local transport (5 days)",           thb: 1_500,               note: "Grab/MRT, airport pickup if not included" },
    { label: "Food (5 days)",                      thb: 3_000,               note: "Street food + 1-2 nicer meals" },
    { label: "Travel insurance",                   thb: 1_200,               note: "Recommended, covers complications" },
  ];
  const total = items.reduce((s, i) => s + i.thb, 0);

  return (
    <section className="rounded-2xl border-2 bg-white p-5 sm:p-6" style={{ borderColor: "#e2e8f0" }}>
      <div className="mb-4">
        <div className="text-xs font-black uppercase tracking-widest text-[rgb(var(--muted))]">All-in trip cost</div>
        <h3 className="text-lg sm:text-xl font-black tracking-tight mt-1">Total cost — no surprises</h3>
        <p className="text-xs text-[rgb(var(--muted))] mt-1">Typical itemization for a {city} → Bangkok patient.</p>
      </div>

      <ul className="divide-y" style={{ borderColor: "rgb(var(--border))" }}>
        {items.map((it, i) => (
          <li key={i} className="flex items-baseline justify-between gap-3 py-2.5">
            <div className="min-w-0 flex-1">
              <div className="font-bold text-sm">{it.label}</div>
              <div className="text-[11px] text-[rgb(var(--muted))]">{it.note}</div>
            </div>
            <div className="font-bold tabular-nums text-sm shrink-0">฿{it.thb.toLocaleString()}</div>
          </li>
        ))}
      </ul>

      <div className="mt-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 p-4 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Total estimate</div>
          <div className="text-3xl font-black tabular-nums text-emerald-900">฿{total.toLocaleString()}</div>
        </div>
        <div className="text-right text-xs text-emerald-800">
          <div>≈ ${Math.round(total / 35).toLocaleString()} USD</div>
          <div className="text-[10px] mt-0.5">Exchange-rate Apr 2026</div>
        </div>
      </div>
    </section>
  );
}
