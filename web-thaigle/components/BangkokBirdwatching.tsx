const SPOTS = [
  {
    name: "Bang Pu Recreation Area",
    emoji: "🐦",
    distance: "50km south of Bangkok (1 hr)",
    season: "Nov–Mar (migratory birds including sandpipers, gulls, terns)",
    species: "100+ species including Dalmatian Pelican (vulnerable), Pied Kingfisher, egrets, raptors",
    cost: "Entry ฿30. Best with binoculars.",
    tip: "Thailand's best shorebird site within day-trip distance. Arrive at low tide for maximum species count.",
  },
  {
    name: "Lumpini Park (Urban Birding)",
    emoji: "🦜",
    distance: "Central Bangkok — Silom MRT",
    season: "Oct–Apr (migrants arrive)",
    species: "50+ species common: Purple Heron, Indian Roller, Coppersmith Barbet, Crimson Sunbird, Asian Koel",
    cost: "Free",
    tip: "Early morning 6–8am is best. The big monitor lizards are also very photogenic. Bring 300mm lens.",
  },
  {
    name: "Bang Krachao (Green Lung)",
    emoji: "🌿",
    distance: "Boat from Bangkok (15 min)",
    season: "Year-round, best Nov–Feb",
    species: "60+ species. Hornbills, coucals, waterbirds, raptors. Also monitor lizards.",
    cost: "Ferry ฿30 + bike rental ฿50",
    tip: "Most accessible 'mini-wilderness' from Bangkok. Pairs perfectly with cycle tour. Early morning is essential for birds.",
  },
];

export function BangkokBirdwatching() {
  return (
    <div className="rounded-2xl border border-teal-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-teal-700 mb-3">
        🐦 Birdwatching near Bangkok
      </h2>
      <div className="space-y-3">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-teal-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div>
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">📍 {s.distance} · {s.cost}</div>
              </div>
            </div>
            <div className="text-[10px] text-teal-700 mb-0.5">🗓️ Season: {s.season}</div>
            <div className="text-[10px] text-[var(--fg)] mb-1 leading-snug">Species: {s.species}</div>
            <div className="text-[10px] text-orange-600">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
