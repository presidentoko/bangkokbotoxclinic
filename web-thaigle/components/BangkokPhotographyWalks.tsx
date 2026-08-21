const WALKS = [
  {
    name: "Talad Noi — Street Art + Colonial Architecture",
    emoji: "🎨",
    area: "Chinatown / Bangrak (15 min walk from Saphan Taksin BTS)",
    bestTime: "7–10am (golden hour + no crowds)",
    distance: "1.5km circuit",
    highlights: ["Historic Hok Hokien building facades", "Sam Peng Lane murals", "Peranakan shophouses", "Tha Si Phraya river wharf", "Hidden temple courtyards"],
    tip: "Bring wide + 35mm. Narrow lanes limit telephoto. Ask locals permission for portraits — usually they say yes if you smile.",
  },
  {
    name: "Arun-Maharaj Riverside Loop",
    emoji: "🌅",
    area: "Rattanakosin / Old City",
    bestTime: "6:30am (sunrise) or golden hour 5:30–6:30pm",
    distance: "2km",
    highlights: ["Wat Arun spires from Tha Tien pier", "Tha Chang pier fishing boats", "Grand Palace wall reflections", "Local life at Pak Klong Talad (flower market, midnight–5am)"],
    tip: "Come twice: sunrise (empty, blue tones) AND sunset (warm gold, boats running). Two very different photos.",
  },
  {
    name: "Ekkamai + Phra Khanong — Modern Bangkok Life",
    emoji: "☕",
    area: "East Sukhumvit (Ekkamai BTS)",
    bestTime: "Weekday 9–11am or 3–5pm",
    distance: "3km walk or bike",
    highlights: ["Container coffee shops with greenery", "Street vendors on Ekamai Soi 10", "Local fresh market 7–9am", "Makkasan rail yards (for permit photography)"],
    tip: "Ekkamai is Bangkok for Bangkok people. Most authentic 'modern Thai life' shots. Café owners welcome photography.",
  },
  {
    name: "Yaowarat Night — Chinatown Neon",
    emoji: "🏮",
    area: "Yaowarat Road / Chinatown",
    bestTime: "6–9pm (peak neon + stall activity)",
    distance: "1km stretch + side sois",
    highlights: ["Neon signage reflections on wet streets", "Gold shop window displays", "Seafood tank stalls with LED lighting", "Waving sparkler food carts"],
    tip: "Shoot in RAW. Neon is very challenging for JPEG. Post-rain evenings are best — road reflections triple visual impact.",
  },
];

export function BangkokPhotographyWalks() {
  return (
    <div className="rounded-2xl border border-indigo-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-indigo-700 mb-3">
        📸 Bangkok photography walks — best spots + timing
      </h2>
      <div className="space-y-3">
        {WALKS.map((w) => (
          <details key={w.name} className="border border-indigo-100 rounded-xl group">
            <summary className="px-3 py-2.5 cursor-pointer flex items-center gap-2 text-xs font-bold text-[var(--fg)] hover:text-indigo-700 transition">
              <span className="text-lg shrink-0">{w.emoji}</span>
              <span className="flex-1">{w.name}</span>
              <span className="text-[var(--muted)] group-open:rotate-180 transition text-sm shrink-0">⌄</span>
            </summary>
            <div className="px-3 pb-3">
              <div className="text-[10px] text-[var(--muted)] mb-2">{w.area} · {w.distance} · Best: {w.bestTime}</div>
              <div className="flex flex-wrap gap-1 mb-2">
                {w.highlights.map((h) => (
                  <span key={h} className="text-[9px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded-full">{h}</span>
                ))}
              </div>
              <div className="text-[10px] text-orange-600">💡 {w.tip}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
