const VILLAS = [
  {
    name: "Sala Rattanakosin",
    emoji: "🏛️",
    area: "Rattanakosin / Old City (Maharat Rd riverside)",
    price: "฿8,000–18,000/night",
    rooms: "15 rooms (boutique)",
    why: "Stunning direct Wat Arun view from every room. Rooftop bar with the best temple view in Bangkok. Walking distance to Grand Palace.",
    highlight: "Rooftop bar sunset watching Wat Arun glow gold — unrepeatable experience.",
    book: "Direct website or agoda.com (often 15% cheaper)",
  },
  {
    name: "137 Pillars Suites Bangkok",
    emoji: "🌟",
    area: "Sukhumvit 39 (Phrom Phong BTS)",
    price: "฿8,500–22,000/night",
    rooms: "34 suites only (no standard rooms)",
    why: "All-suite luxury boutique. Infinity pool overlooks Sukhumvit. Enormous rooms (min 100sqm). Highest service ratio in Bangkok.",
    highlight: "Private butler per suite. Pool terrace suites with personal plunge pool.",
    book: "Direct website for best rate + complimentary amenity",
  },
  {
    name: "Rosewood Bangkok",
    emoji: "🌹",
    area: "Ploenchit BTS",
    price: "฿15,000–60,000/night",
    rooms: "158 rooms and suites",
    why: "Bangkok's best-designed modern luxury hotel. Willowstream Spa outstanding. Penthouse views. Michelin-star dining (NUR) on premise.",
    highlight: "Club level includes multi-time daily food/drink service + panoramic Bangkok views.",
    book: "Rosewood direct for best rates + suite upgrades",
  },
  {
    name: "Anantara Riverside Bangkok Resort",
    emoji: "🌴",
    area: "Charoen Nakhon, West Bank (opposite ICONSIAM)",
    price: "฿6,000–18,000/night",
    rooms: "407 rooms (resort-style)",
    why: "Most garden and space per room in Bangkok. Multiple pools. River-view suites are exceptional value for luxury. Multiple restaurants including Thai elephant polo club.",
    highlight: "Biggest garden of any Bangkok luxury hotel. Saturday Night Fever dinner cruise departs from here.",
    book: "Anantara.com or Agoda for flash sales",
  },
];

export function BangkokPrivateVilla() {
  return (
    <div className="rounded-2xl border border-gold-200 border-yellow-300 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-yellow-700 mb-3">
        ✨ Bangkok luxury boutique hotels — special occasion stays
      </h2>
      <div className="space-y-2">
        {VILLAS.map((v) => (
          <div key={v.name} className="border border-yellow-200 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{v.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{v.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{v.area} · {v.rooms}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{v.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-1 leading-snug">{v.why}</div>
            <div className="text-[10px] text-yellow-700 mb-0.5">⭐ {v.highlight}</div>
            <div className="text-[10px] text-orange-600">📱 {v.book}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
