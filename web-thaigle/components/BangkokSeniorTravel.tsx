const TIPS = [
  {
    title: "Transport — BTS skip the fare gate",
    emoji: "🚊",
    why: "Seniors 65+ ride BTS Skytrain free with Thai ID. Foreigners: reduced senior fare ฿16 flat on production of passport. Elevators at all major stations (not all lines — check app). Grab taxi recommended when tired or carrying bags.",
    practical: "MRT (subway) similar policy. Show passport at ticket office. Off-peak (10am–4pm) is significantly less crowded and more comfortable.",
  },
  {
    title: "Heat management — Bangkok gets genuinely hot",
    emoji: "🌡️",
    why: "Bangkok hits 35–40°C April–June. Heat stroke risk is real for seniors not acclimatized to tropical heat. All malls are very air-conditioned — use them as rest stops. Hydration is essential (8+ glasses daily).",
    practical: "Plan outdoor activities 7–9am or 5–7pm. Umbrellas as sunshades are widely used locally (buy one — ฿80 at 7-Eleven). Coconut water (฿30 at any street stall) is natural electrolyte.",
  },
  {
    title: "Healthcare access — world-class hospitals",
    emoji: "🏥",
    why: "Bangkok has some of Asia's best private hospitals. Bumrungrad International, BNH Hospital, Bangkok Hospital are fully equipped with English-speaking staff. Costs 60–80% less than US/UK for equivalent care.",
    practical: "Walk-in appointments at BNH Hospital take 30–60 minutes. Medical tourism packages available. Bring medication list and prescription copies — pharmacies can refill many prescriptions with doctor letter.",
  },
  {
    title: "Accessibility — mixed but improving",
    emoji: "♿",
    why: "Bangkok is not very wheelchair friendly in older districts (uneven pavements, steps everywhere). Modern malls, hotels, and the BTS Green Line are excellent. Tuk-tuks and older taxis can be difficult to board.",
    practical: "Book hotels near BTS with elevator confirmed. Wheelchair users: hire a driver for day instead of public transport. Modern areas (Sukhumvit 21–55, Silom) are most accessible. Grand Palace has some ramps.",
  },
];

const AREAS = [
  "Sukhumvit (BTS accessible, international hospitals nearby, flat pavements)",
  "Silom (walkable, BTS direct, Lumpini Park nearby for morning walks)",
  "Sathorn (quieter, residential, easy taxis)",
  "Old City (Rattanakosin) — beautiful but uneven streets, best with a guide",
];

export function BangkokSeniorTravel() {
  return (
    <div className="rounded-2xl border border-teal-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-teal-700 mb-3">
        🧓 Senior travel Bangkok — practical guide for 60+ visitors
      </h2>
      <div className="space-y-2 mb-3">
        {TIPS.map((t) => (
          <div key={t.title} className="border border-teal-100 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xl shrink-0">{t.emoji}</span>
              <div className="font-bold text-xs">{t.title}</div>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{t.why}</div>
            <div className="text-[10px] text-teal-700">💡 {t.practical}</div>
          </div>
        ))}
      </div>
      <details className="border border-teal-100 rounded-xl overflow-hidden">
        <summary className="px-3 py-2 cursor-pointer text-[10px] font-bold text-teal-700 hover:bg-teal-50">
          Best areas for seniors to stay
        </summary>
        <ul className="px-3 pb-3 pt-1 space-y-0.5">
          {AREAS.map((a) => (
            <li key={a} className="text-[10px] text-[var(--fg)] flex items-start gap-1.5">
              <span className="text-teal-400 shrink-0">•</span>{a}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
