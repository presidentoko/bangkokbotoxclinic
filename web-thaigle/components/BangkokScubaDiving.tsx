const SITES = [
  {
    name: "Koh Tao (Island)",
    emoji: "🤿",
    distance: "9-hour overnight train + 90-min ferry from Bangkok",
    why: "World's most popular place to get certified. Budget Open Water courses ฿8,000–12,000. Over 50 dive schools competing = quality and price pressure. Best for beginners.",
    best_dive: "Southwest Pinnacle (advanced), Japanese Gardens (beginners), Shark Island (nurse sharks)",
    visibility: "Best March–May, November–February. July–September rough seas possible.",
    tip: "Don't book cheapest course — check instructor ratings on Trip Advisor. Course takes 3.5 days. Big Blue and Scuba Junction consistently top-rated.",
  },
  {
    name: "Koh Phi Phi & Similan Islands",
    emoji: "🐠",
    distance: "1 hour flight Bangkok–Phuket + transfer",
    why: "Thailand's most spectacular diving — Similan Islands Marine National Park is one of Asia's top 5 dive sites. Whale sharks March–April. Advanced divers only for some sites.",
    best_dive: "Similan Island No. 9 (Christmas Point), No. 8 (Elephant Head Rock), Richelieu Rock for whale sharks",
    visibility: "November–May season only. Best October–April. Park closed May–October.",
    tip: "Similan liveaboard recommended: 4-day trip ฿15,000–25,000 covers 20+ dives at best sites. Koh Phi Phi day diving more accessible — organized from Krabi or Phuket.",
  },
  {
    name: "Pattaya (closest to Bangkok)",
    emoji: "⚓",
    distance: "2 hours south of Bangkok",
    why: "Closest diving to Bangkok. Not Thailand's best visibility but convenient for day trips. Wreck diving at HTMS Khram and Hardeep (sunk intentionally as artificial reef).",
    best_dive: "HTMS Khram wreck (dive school + museum), Koh Rin, Koh Man Wichan",
    visibility: "15–20m visibility when conditions good. Rainy season June–October lowers visibility.",
    tip: "Easy day trip from Bangkok. Marine Visions Pattaya is longest-established operator. Good intro to wreck diving before Similan sites.",
  },
];

const CERTIFICATION = [
  "PADI Open Water Diver — minimum certification needed, 3.5 days, pool + 4 open-water dives",
  "SSI Open Water — equivalent to PADI, sometimes 10–20% cheaper",
  "PADI Advanced Open Water — adds 5 speciality dives (deep, wreck, navigation). 2 days.",
  "Rescue Diver — next step after Advanced. Teaches dive emergency management.",
  "PADI Divemaster — professional level. Most people get certified on Koh Tao.",
];

export function BangkokScubaDiving() {
  return (
    <div className="rounded-2xl border border-cyan-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-cyan-700 mb-3">
        🤿 Scuba diving from Bangkok — best sites & where to get certified
      </div>
      <div className="space-y-2 mb-3">
        {SITES.map((s) => (
          <details key={s.name} className="border border-cyan-100 rounded-xl overflow-hidden group">
            <summary className="px-3 py-2.5 cursor-pointer flex items-center gap-2 hover:bg-cyan-50 transition">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.distance}</div>
              </div>
            </summary>
            <div className="px-3 pb-3 border-t border-cyan-100 pt-2 space-y-1">
              <div className="text-[10px] text-[var(--fg)] leading-snug">{s.why}</div>
              <div className="text-[10px] text-cyan-700">🐠 Best dives: {s.best_dive}</div>
              <div className="text-[10px] text-blue-600">📅 {s.visibility}</div>
              <div className="text-[10px] text-orange-600">💡 {s.tip}</div>
            </div>
          </details>
        ))}
      </div>
      <details className="border border-cyan-100 rounded-xl overflow-hidden">
        <summary className="px-3 py-2 cursor-pointer text-[10px] font-bold text-cyan-700 hover:bg-cyan-50">
          PADI / SSI certification levels explained
        </summary>
        <ul className="px-3 pb-3 pt-1 space-y-0.5">
          {CERTIFICATION.map((c) => (
            <li key={c} className="text-[10px] text-[var(--fg)] flex items-start gap-1.5">
              <span className="text-cyan-400 shrink-0">•</span>{c}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
