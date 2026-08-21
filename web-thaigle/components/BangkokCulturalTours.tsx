const TOURS = [
  {
    name: "Golden Triangle Grand Palace Circuit",
    emoji: "🏯",
    duration: "Half-day (5–6 hrs)",
    price: "฿800–2,500 guided; DIY ฿500 total entry fees",
    what: "Bangkok's classic cultural circuit: Grand Palace (Throne Hall, Emerald Buddha), Wat Pho (giant reclining Buddha, massage school), Wat Arun across the river. Bangkok's #1 cultural experience by a significant margin — visited by 10 million people annually.",
    insight: "Grand Palace dress code enforced at gate — shoulders/knees covered, closed shoes. Sarong rentals available at gate (refundable deposit). Go early (8:30am opening) to beat tour groups who arrive 9:30am onward. Wat Pho and Wat Arun are separate entrance fees — both worth doing.",
  },
  {
    name: "Chinatown (Yaowarat) Street Culture Walk",
    emoji: "🏮",
    duration: "3–4 hours (evening walk)",
    price: "฿0 to walk; food adds ฿200–600",
    what: "Bangkok's Chinatown district at evening/night. Yaowarat Road transforms into a seafood and street food parade at 6pm. Dim sum shops open from morning. Gold shops, herbal medicine dispensaries, old Chinese shrines, Chinese-Thai family businesses unchanged for 3 generations.",
    insight: "Chinese New Year and Vegetarian Festival bring the district to a completely different level. Evening walk starts at Hua Lamphong MRT, walk up Yaowarat Road. Key stops: Wat Trimitr (solid gold Buddha), Peng Nguan seafood stall, Tang Hua Seng Department Store (old school Bangkok).",
  },
  {
    name: "Rattanakosin Island Walking Tour",
    emoji: "🛕",
    duration: "Full day (7–8 hours)",
    price: "฿500–800 DIY; ฿2,000–4,000 guided",
    what: "Bangkok's original island capital — 240+ years of history in a 2km walkable zone. Sanam Luang royal grounds, National Museum (Thai history), Lak Muang shrine, Grand Palace complex, Museum of Contemporary Art, old government buildings, Democracy Monument (1939).",
    insight: "Best as a DIY walk with a map. Start at Sanam Luang in the morning, work clockwise around the island. The area is a living government district — Thai officials, monks, tourists, and vendors all coexist. The National Museum is underrated and air-conditioned — good midday refuge.",
  },
  {
    name: "Floating Market Day Tour",
    emoji: "⛵",
    duration: "Half-day or full day",
    price: "฿600–2,500 including transport from Bangkok",
    what: "Thailand's floating market culture — boats selling food, produce, and goods on the canal. Most famous: Damnoen Saduak (1.5 hrs from Bangkok, tourist-oriented), Amphawa (weekend evenings, more local), Khlong Lat Mayom (weekend only, most authentic).",
    insight: "Damnoen Saduak is very tourist-oriented — still worth seeing for the spectacle. Khlong Lat Mayom (weekends only, Bangkok proper) is far more authentic and cheaper. Amphawa is the romantic evening option — stay for firefly watching on the canal after dark.",
  },
];

export function BangkokCulturalTours() {
  return (
    <div className="rounded-2xl border border-yellow-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-yellow-700 mb-3">
        🛕 Bangkok cultural tours — temples, Chinatown & royal history
      </h2>
      <div className="space-y-2">
        {TOURS.map((t) => (
          <div key={t.name} className="border border-yellow-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{t.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{t.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{t.duration}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{t.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{t.what}</div>
            <div className="text-[10px] text-yellow-700">💡 {t.insight}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
