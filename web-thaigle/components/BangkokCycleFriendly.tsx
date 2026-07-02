const ROUTES = [
  {
    name: "Bang Krachao Loop",
    emoji: "🌿",
    distance: "12km loop",
    difficulty: "Easy (mostly flat)",
    duration: "2–3 hours",
    howToStart: "Ferry from Khlongtoey pier (฿5), rent bike at pier (฿50–100/half day)",
    highlights: "Dense mangrove forest, quiet canals, orchid gardens, floating market, Bangkok Garden",
    best: "Weekday morning. Cool season Oct–Feb.",
    why: "Bangkok's Green Lung. Most serene cycling in Thailand. Feels like a different country 15 min from city center.",
  },
  {
    name: "Rattanakosin Historical Tour",
    emoji: "🏛️",
    distance: "6–8km circuit",
    difficulty: "Easy (very flat, dense traffic though)",
    duration: "2–4 hours (with stops)",
    howToStart: "Rent near Khao San Road (฿100/day). Start at Democracy Monument.",
    highlights: "Grand Palace walls, Tha Tien pier, Pak Klong Talad, Wat Pho, Wat Arun view from pier",
    best: "6am–9am before traffic builds. Or sunset from Tha Tien.",
    why: "See all Old City temples in one loop. Early morning — almost no cars, monks collecting alms.",
  },
  {
    name: "Asiatique Riverside Path",
    emoji: "🌊",
    distance: "3–5km (one way)",
    difficulty: "Easy (flat riverside)",
    duration: "1–2 hours",
    howToStart: "Bike share (Pun Pun stations along route) or rent near Saphan Taksin BTS",
    highlights: "Chao Phraya riverside, warehouses, community piers, evening market at Asiatique",
    best: "Late afternoon 4–7pm (golden hour river photos).",
    why: "Charoen Krung creative district along the way. Casual riverside roll with evening market end point.",
  },
];

export function BangkokCycleFriendly() {
  return (
    <div className="rounded-2xl border border-lime-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-lime-700 mb-3">
        🚴 Cycling in Bangkok — best routes
      </div>
      <div className="space-y-2.5">
        {ROUTES.map((r) => (
          <div key={r.name} className="border border-lime-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{r.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{r.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{r.distance} · {r.difficulty} · ⏱️ {r.duration}</div>
              </div>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-1 leading-snug">{r.why}</div>
            <div className="text-[10px] mb-0.5"><span className="font-bold">Highlights:</span> {r.highlights}</div>
            <div className="text-[10px] text-lime-700 mb-0.5">🚲 Start: {r.howToStart}</div>
            <div className="text-[10px] text-orange-600">💡 Best time: {r.best}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
