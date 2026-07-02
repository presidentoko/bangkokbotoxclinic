const STATIONS = [
  {
    station: "Siam (BTS CEN — interchange)",
    emoji: "🏙️",
    highlights: ["Siam Paragon (luxury mall)", "Central World (Bangkok's biggest mall)", "BACC Art Gallery (free)", "Sea Life Ocean World (฿990)", "Siam Square (street fashion)"],
    food: "Siam Paragon food hall + hundreds of restaurants in CentralWorld Groove",
    tip: "Interchange for all Sukhumvit and Silom lines. Free sky bridge connects 5 malls.",
  },
  {
    station: "Asok / Sukhumvit (BTS E4 / MRT interchange)",
    emoji: "🌆",
    highlights: ["Terminal 21 (mall + food court ฿39 som tam)", "Sukhumvit Soi 11 bar strip", "Cowboy entertainment street", "Ambassador Hotel Convention"],
    food: "Pier 21 food court (Terminal 21 Level 5) — Bangkok's best food court",
    tip: "BTS Asok + MRT Sukhumvit = same station, different names. Free transfer connects them.",
  },
  {
    station: "Nana (BTS E3)",
    emoji: "🌙",
    highlights: ["Sukhumvit Soi 3 Arab Street (Middle Eastern food)", "Soi Nana bar area", "Sukhumvit Soi 11 (5 min walk)", "Villa Market supermarket"],
    food: "Arab Street = authentic shawarma, falafel, halal Turkish food ฿80–200",
    tip: "Soi 3 Arab Street is great for halal food and unusually authentic Middle Eastern cuisine.",
  },
  {
    station: "Phrom Phong (BTS E5)",
    emoji: "🌸",
    highlights: ["Emporium + EmQuartier (premium malls)", "Rain Hill outdoor retail", "Sukhumvit Soi 24 (boutique restaurants)", "Benchasiri Park (lunch escape)"],
    food: "Helix Quartier restaurant floors in EmQuartier — 30+ restaurants, Michelin-starred options",
    tip: "Most elevated dining area in Bangkok. Emporium supermarket = best Japanese food import selection.",
  },
  {
    station: "Ari (BTS N5)",
    emoji: "☕",
    highlights: ["Specialty coffee belt (Roots, Factory, etc.)", "Boutique clothing shops", "Soi Ari restaurants (local Thais only)", "Ari weekend market"],
    food: "Bangkok's best local Thai restaurants at Thai prices. No tourist menus.",
    tip: "Most residential-feeling BTS stop. Best café street in Bangkok. Avoid weekday 8–9am (school pickup chaos).",
  },
  {
    station: "Saphan Taksin (BTS S6)",
    emoji: "⛴️",
    highlights: ["Asiatique night market (free shuttle boat)", "Chao Phraya Tourist Boat pier", "Icon Siam ferry (free shuttle)", "Riverside restaurants"],
    food: "Asiatique has River View dining zones — Eat Me, La Dotta",
    tip: "Main jumping-off point for all Chao Phraya river activities. Icon Siam free boat every 30 min.",
  },
];

export function BangkokThingsNearBTS() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        🚉 Things to do near major BTS stations
      </div>
      <div className="space-y-2">
        {STATIONS.map((s) => (
          <details key={s.station} className="border border-[var(--border)] rounded-xl group">
            <summary className="px-3 py-2.5 cursor-pointer flex items-center gap-2 text-xs font-bold text-[var(--fg)] hover:text-blue-700 transition">
              <span className="text-lg">{s.emoji}</span>
              <span className="flex-1">{s.station}</span>
              <span className="text-[var(--muted)] group-open:rotate-180 transition shrink-0 text-sm">⌄</span>
            </summary>
            <div className="px-3 pb-3 space-y-1.5">
              <div className="space-y-0.5">
                {s.highlights.map((h) => (
                  <div key={h} className="text-[10px] flex gap-1.5">
                    <span className="shrink-0 text-blue-500">▸</span>{h}
                  </div>
                ))}
              </div>
              <div className="text-[10px] text-orange-600">🍜 {s.food}</div>
              <div className="text-[10px] text-[var(--muted)]">💡 {s.tip}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
