// 7-day pre-procedure checklist. Focus-aware.

import type { SiteFocus } from "@/lib/site";

const FOCUS_PREP: Partial<Record<SiteFocus, { day: string; do: string[]; avoid: string[] }[]>> = {
  botox: [
    { day: "7 days before",   do: ["Drink lots of water"], avoid: ["Aspirin, ibuprofen, fish oil, vitamin E (blood thinners)"] },
    { day: "3 days before",   do: ["Eat enough iron-rich food"], avoid: ["Alcohol", "Heavy exercise that flushes face"] },
    { day: "Day of",          do: ["Light breakfast", "Bare clean face"], avoid: ["Makeup", "Coffee/tea right before"] },
  ],
  filler: [
    { day: "7 days before",   do: [], avoid: ["NSAIDs, fish oil, vitamin E, ginkgo (bruising risk)"] },
    { day: "3 days before",   do: ["Hydrate well"], avoid: ["Alcohol"] },
    { day: "Day of",          do: ["Eat light meal", "Avoid wearing lipstick (lip filler)"], avoid: ["Aspirin"] },
  ],
  hifu: [
    { day: "1 week before",   do: ["Keep skin moisturized"], avoid: ["Botox or fillers in same areas (do those after, not before)"] },
    { day: "Day of",          do: ["Clean face, no makeup"], avoid: ["Sunburn or active acne in treatment area"] },
  ],
  facial: [
    { day: "3 days before",   do: [], avoid: ["Strong retinols, exfoliants (BHA/AHA)"] },
    { day: "Day of",          do: ["Bare clean skin"], avoid: ["Sunburn"] },
  ],
  laser: [
    { day: "2 weeks before",  do: ["Daily SPF50 — sun-tanned skin = high risk"], avoid: ["Tanning", "Self-tanner"] },
    { day: "1 week before",   do: [], avoid: ["Retinols, glycolic acid, IPL elsewhere"] },
    { day: "Day of",          do: ["Bare skin"], avoid: ["Makeup, perfume on face"] },
  ],
  dental: [
    { day: "Before flight",   do: ["Send X-ray for pre-assessment if possible"], avoid: [] },
    { day: "24h before",      do: ["Eat normally", "Sleep well"], avoid: ["Alcohol (delays healing)"] },
    { day: "Day of",          do: ["Light breakfast 2h before", "Brush teeth thoroughly"], avoid: [] },
  ],
  hair: [
    { day: "2 weeks before",  do: ["Daily scalp massage"], avoid: ["Minoxidil/finasteride (stop temporarily per surgeon)"] },
    { day: "1 week before",   do: ["Avoid sun on scalp"], avoid: ["Alcohol", "Aspirin, vitamin E", "Tanning"] },
    { day: "Day of",          do: ["Eat full breakfast", "Wear button-up shirt (no over-head removal)"], avoid: ["Caffeine excess", "Hair products"] },
  ],
};

export default function PreOpChecklist({ focus }: { focus: SiteFocus }) {
  const list = FOCUS_PREP[focus];
  if (!list) return null;

  return (
    <section className="rounded-2xl border bg-white p-5 sm:p-6" style={{ borderColor: "rgb(var(--border))" }}>
      <div className="mb-4">
        <div className="text-xs font-black uppercase tracking-widest text-[rgb(var(--muted))]">Prep guide</div>
        <h3 className="text-lg sm:text-xl font-black tracking-tight mt-1">Before your procedure</h3>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((s, i) => (
          <div key={i} className="rounded-xl border bg-slate-50 p-4" style={{ borderColor: "rgb(var(--border))" }}>
            <div className="text-[10px] font-black uppercase tracking-widest text-amber-700 bg-amber-100 inline-block px-2 py-0.5 rounded-full mb-2">{s.day}</div>
            {s.do.length > 0 && (
              <div className="mb-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Do</div>
                <ul className="mt-1 space-y-1">
                  {s.do.map((d, k) => (
                    <li key={k} className="text-xs flex items-start gap-1.5"><span className="text-emerald-600">✓</span><span>{d}</span></li>
                  ))}
                </ul>
              </div>
            )}
            {s.avoid.length > 0 && (
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-rose-700">Avoid</div>
                <ul className="mt-1 space-y-1">
                  {s.avoid.map((a, k) => (
                    <li key={k} className="text-xs flex items-start gap-1.5"><span className="text-rose-600">✕</span><span>{a}</span></li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
      <p className="text-[11px] text-[rgb(var(--muted))] mt-3">
        Specific guidance comes from your clinic — these are common defaults. Always follow your doctor&apos;s personalized prep instructions.
      </p>
    </section>
  );
}
