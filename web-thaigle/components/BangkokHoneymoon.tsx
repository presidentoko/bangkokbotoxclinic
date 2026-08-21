const IDEAS = [
  {
    name: "Luxury Hotel Suite — Mandarin Oriental Bangkok",
    emoji: "🌹",
    category: "5-star iconic hotel",
    price: "Suites from ฿18,000/night, Oriental Suite from ฿120,000+",
    why: "Bangkok's most legendary hotel since 1879. Chao Phraya river views, historic Authors' Wing, private butler, in-room champagne service. The setting for countless honeymoon films and novels. Nothing in Bangkok is more romantic.",
    tip: "Book the 'Honeymoon Package' — adds flowers, cake, champagne, and river cruise to any stay. Couples get complimentary fruit platter at check-in when package booked. Reserve directly for best rates + inclusions.",
  },
  {
    name: "Sunset Chao Phraya Private Dinner Cruise",
    emoji: "🛥️",
    category: "Private river dining",
    price: "฿3,500–8,000 per couple (varies by package)",
    why: "Exclusive 2-hour private dinner cruise at sunset. Just you, a personal server, Thai/Western cuisine, Chao Phraya river breeze. Temples lit up at night while you eat. Genuinely romantic, genuinely Bangkok.",
    tip: "Book Manohra Cruise or Yok Yor Marina private packages. Sunset departures 6pm are best. Proposal on the boat? Inform the cruise company in advance — they'll arrange flowers and champagne moment at golden hour.",
  },
  {
    name: "Koh Samui Island Escape (2 hours from Bangkok)",
    emoji: "🏝️",
    category: "Tropical island extension",
    price: "Flight ฿2,000–4,000 return, villa from ฿6,000/night",
    why: "Many couples combine Bangkok city + Koh Samui beach for a complete Thailand honeymoon. Bangkok's sophisticated food and culture, then Samui's luxury pool villa + turquoise water. Perfect two-island combination.",
    tip: "Bangkok Airways operates BKK–Samui direct (1 hr 20 min). Book a private villa with pool rather than hotel — the morning swim in your own pool is the honeymoon experience. Samui best September–April.",
  },
  {
    name: "Couples Thai Spa Day (Four Seasons Spa)",
    emoji: "💆",
    category: "Luxury wellness",
    price: "Couples package ฿6,000–12,000 per couple",
    why: "Four Seasons Bangkok and Capella Hotel have Asia's best couples spa suites. Side-by-side treatment tables, jacuzzi, personal attendant, champagne. The afternoon spent at a world-class Thai spa is deeply restorative.",
    tip: "Book 'Couples Journey' package — usually 3-hour experience including Thai massage, body scrub, and private bath with flower petals. Combine with romantic dinner reservation at the same hotel. Most include spa suite access all day.",
  },
];

export function BangkokHoneymoon() {
  return (
    <div className="rounded-2xl border border-pink-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-pink-700 mb-3">
        💑 Bangkok honeymoon guide — the most romantic experiences in the city
      </h2>
      <div className="space-y-2">
        {IDEAS.map((i) => (
          <div key={i.name} className="border border-pink-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{i.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{i.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{i.category}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{i.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{i.why}</div>
            <div className="text-[10px] text-pink-700">💡 {i.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
