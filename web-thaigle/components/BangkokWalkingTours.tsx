const TOURS = [
  {
    name: "Chinatown Walking Food Tour",
    emoji: "🥢",
    area: "Yaowarat Road and surrounding sois",
    duration: "3–4 hours (evening 5:30–9pm)",
    price: "DIY: free + food ฿200–400. Guided: ฿800–1,500/person",
    route: ["Ratchawong pier arrival", "Nai Mong Hoi Thod (crispy oyster)", "Yaowarat Road gold shops & mooncake sellers", "T&K Seafood (giant prawns)", "Soi Nana rooftop views", "Poh Teck Tung Shrine"],
    why: "Bangkok's most atmospheric evening walk. Glowing neon, seafood stalls, gold jewelry shops. Can DIY or join Airbnb Experience guide for context.",
    tip: "Best 6–9pm for full atmosphere. Eat multiple small dishes rather than one big meal. Seafood prices 2× Chinatown, but quality justifies it.",
  },
  {
    name: "Rattanakosin Old City Walk",
    emoji: "🏛️",
    area: "Grand Palace area — Old Bangkok",
    duration: "Half-day (3–5 hours, 8am–noon)",
    price: "DIY: free + temple entries ฿50–500. Guided: ฿1,000–2,000/person",
    route: ["Grand Palace + Wat Phra Kaew", "Thammasat University riverside", "Sanam Luang park", "Wat Mahathat", "Bangkok National Museum", "Tha Maharaj riverside food"],
    why: "Bangkok's most historically rich walking area. Everything built before 1900 in one compact district. Best on foot — BTS doesn't reach here.",
    tip: "Start at 8am when palace opens and cool. Hire bicycle from near Tha Chang pier (฿80/day) to cover more ground. Avoid weekday school groups 10am–noon.",
  },
  {
    name: "Bang Rak / Charoen Krung Art Walk",
    emoji: "🎨",
    area: "Charoen Krung Road from Bang Rak to ASIATIQUE",
    duration: "2–3 hours (afternoon–evening)",
    price: "Free (gallery entries mostly free)",
    route: ["TCDC Design Center (free)", "Warehouse 30 art space", "The Jam Factory galleries", "Charoenkrung 28 street", "Artist studios and independent galleries", "Sunset at riverside"],
    why: "Bangkok's arts district is increasingly vibrant. Mix of international and Thai contemporary artists. Great for art lovers not interested in historical temples.",
    tip: "Friday–Saturday evenings have galleries open late. First Saturday of month: gallery walk with food trucks and live music. Walking is the only way — area is too dense for vehicles.",
  },
];

export function BangkokWalkingTours() {
  return (
    <div className="rounded-2xl border border-teal-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-teal-700 mb-3">
        🚶 Bangkok walking tours — self-guided routes & what to see
      </div>
      <div className="space-y-2">
        {TOURS.map((t) => (
          <details key={t.name} className="border border-teal-100 rounded-xl overflow-hidden group">
            <summary className="px-3 py-2.5 cursor-pointer flex items-center gap-2 hover:bg-teal-50 transition">
              <span className="text-2xl shrink-0">{t.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{t.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{t.duration} · {t.price}</div>
              </div>
            </summary>
            <div className="px-3 pb-3 border-t border-teal-100 pt-2 space-y-1.5">
              <div className="text-[10px] text-[var(--fg)] leading-snug">{t.why}</div>
              <ul className="space-y-0.5">
                {t.route.map((stop) => (
                  <li key={stop} className="text-[10px] text-teal-700 flex items-start gap-1.5">
                    <span className="shrink-0">→</span>{stop}
                  </li>
                ))}
              </ul>
              <div className="text-[10px] text-orange-600">💡 {t.tip}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
