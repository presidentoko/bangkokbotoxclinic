const GETAWAYS = [
  {
    destination: "Kanchanaburi",
    emoji: "🌊",
    distance: "2.5 hours by bus from Victory Monument",
    cost: "Budget: ฿1,500–2,000/person all-in (transport + guesthouse + food)",
    highlights: ["Bridge on the River Kwai", "JEATH War Museum", "Erawan National Park waterfall swim", "River Kwai Jungle Rafts (floating resort)"],
    when: "Year-round. Erawan waterfall: bring aqua shoes. Dry season (Nov–Feb) for clearest water.",
    why: "Thailand's most meaningful historical destination from Bangkok. WWII Death Railway, POW cemeteries, and stunning natural parks. 2-night minimum recommended.",
  },
  {
    destination: "Khao Yai National Park",
    emoji: "🦜",
    distance: "2.5 hours by bus from Mo Chit BTS",
    cost: "Budget: ฿2,000–3,000/person 2 days (tour or self-drive with national park entry ฿400)",
    highlights: ["Wildlife night safari (elephants, deer, owls)", "Haew Narok waterfall", "Vineyard tours (PB Valley, GranMonte)", "Horseback riding"],
    when: "Nov–Mar for dry weather and best wildlife spotting. Rainy season for lush jungle (June–Sept).",
    why: "UNESCO World Heritage park. Thailand's closest proper wildlife destination from Bangkok. Excellent chance to see wild elephants, gibbons, hornbills, and occasionally tigers (rare).",
  },
  {
    destination: "Hua Hin",
    emoji: "🏖️",
    distance: "2.5–3 hours by train (scenic) or bus from Southern Bus Terminal",
    cost: "Mid-range: ฿2,500–4,000/person per night (train ฿300, guesthouse ฿800–2,000/night)",
    highlights: ["Beach (calmer than Pattaya)", "Cicada Night Market", "Hua Hin Railway Station (most beautiful in Thailand)", "Day Spa resort culture"],
    when: "Year-round. May–Oct less crowded, monsoon showers. Nov–Feb peak season with excellent weather.",
    why: "Thailand's original royal beach resort (King's summer palace). Less party-oriented than Pattaya. Good for couples and families. Night market scene excellent.",
  },
  {
    destination: "Ayutthaya",
    emoji: "🏛️",
    distance: "1.5 hours by train from Hualamphong or Bangkokian station",
    cost: "Very budget: ฿600–1,000/person day trip (train ฿15–45, bicycle rental ฿80, temple entries ฿50–100 each)",
    highlights: ["Buddha head in tree roots (Wat Mahathat)", "Wat Phra Sri Sanphet", "Bicycle touring the ruins", "River boat tour (sunset ฿300)"],
    when: "Year-round. Nov–Feb has pleasant weather. Boat flooding in Oct occasionally closes some ruins.",
    why: "Thailand's former capital — one of Asia's greatest historical sites. UNESCO World Heritage. 400+ temples, some over 700 years old. Most impactful day trip from Bangkok.",
  },
];

export function BangkokWeekendGetaways() {
  return (
    <div className="rounded-2xl border border-green-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-green-700 mb-3">
        🚌 Weekend getaways from Bangkok — best destinations 2–3 hours out
      </h2>
      <div className="space-y-2">
        {GETAWAYS.map((g) => (
          <details key={g.destination} className="border border-green-100 rounded-xl overflow-hidden group">
            <summary className="px-3 py-2.5 cursor-pointer flex items-center gap-2 hover:bg-green-50 transition">
              <span className="text-2xl shrink-0">{g.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{g.destination}</div>
                <div className="text-[10px] text-[var(--muted)]">{g.distance} · {g.cost}</div>
              </div>
            </summary>
            <div className="px-3 pb-3 border-t border-green-100 pt-2 space-y-1.5">
              <div className="text-[10px] text-[var(--fg)] leading-snug">{g.why}</div>
              <ul className="space-y-0.5">
                {g.highlights.map((h) => (
                  <li key={h} className="text-[10px] text-green-700 flex items-start gap-1.5">
                    <span className="shrink-0">•</span>{h}
                  </li>
                ))}
              </ul>
              <div className="text-[10px] text-orange-600">📅 Best time: {g.when}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
