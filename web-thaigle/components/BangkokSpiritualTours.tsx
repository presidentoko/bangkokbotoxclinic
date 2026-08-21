const EXPERIENCES = [
  {
    name: "Alms-giving Ceremony at Wat Mahathat",
    emoji: "🙏",
    area: "Maharaj Pier / Wat Mahathat, Old City",
    time: "Daily 7–9am",
    price: "Free (Alms rice ฿50–100 for donation)",
    why: "Join Thai Buddhist monks receiving morning alms (tak bat). Most authentic Buddhist ritual you can witness. Row of orange-robed monks walking in silence, devotees offering rice, food, flowers. One of Bangkok's most moving experiences.",
    tip: "Arrive before 6:30am. Purchase pre-packaged alms rice from vendors (฿50). Remove shoes before kneeling to offer. Do not touch monks or extend hands above monk's eye level. Silence is essential. Photography from a distance only.",
  },
  {
    name: "Vipassana Meditation at Wat Phra Dhammakaya",
    emoji: "🧘",
    area: "Pathum Thani (30 min from Bangkok center)",
    time: "Weekend retreats, weekday sessions",
    price: "Free (donation-based)",
    why: "Thailand's largest modern Buddhist temple complex. Sunday morning meditation sessions open to international visitors. Massive golden dome, 300,000+ meditation cushions, organized sitting practice. Scale is staggering.",
    tip: "Dress in white if possible — temple provides white shirts on request. Sunday 10am 'International Meditation' session is best for non-Thai speakers. Train + motorcycle taxi from MRT Samrong (about 45 min total).",
  },
  {
    name: "Fortune Telling at Erawan Shrine",
    emoji: "🌸",
    area: "Ratchadamri intersection, BTS Chidlom",
    time: "Open 24 hours, most active 8am–6pm",
    price: "Offerings ฿50–300",
    why: "Bangkok's most famous Hindu-Buddhist shrine. Brahma (four-faced god) statue worshipped by Thai-Chinese community. Traditional Thai classical dancers perform as offerings. Fortune sticks (kau cim) available for reading.",
    tip: "Remove shoes before approaching the shrine. Walk clockwise around the statue three times while praying. Fortune stick reading: shake the cylinder until one stick falls, numbered stick matches a fortune slip (Thai attendants will translate).",
  },
  {
    name: "Spirit House Ceremony (Blessing by Thai Monk)",
    emoji: "⛩️",
    area: "Through your hotel concierge or dedicated tour",
    time: "Flexible booking",
    price: "฿800–2,500 per person (private ceremony)",
    why: "Traditional spirit house blessing ceremony — the animist tradition that exists alongside Thai Buddhism. Monks bless a home/building by chanting and pouring sacred water. Participating gives insight into genuine everyday Thai spiritual life.",
    tip: "Book through legitimate temple-connected guides — not tourist agencies that simulate ceremonies. Best arranged by long-stay expats who know which temples offer authentic participation. Buddhist blessing with real monks is unforgettable.",
  },
];

export function BangkokSpiritualTours() {
  return (
    <div className="rounded-2xl border border-yellow-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-yellow-700 mb-3">
        🙏 Spiritual Bangkok — authentic Buddhist & cultural experiences
      </h2>
      <div className="space-y-2">
        {EXPERIENCES.map((e) => (
          <div key={e.name} className="border border-yellow-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{e.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{e.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{e.time} · {e.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{e.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{e.why}</div>
            <div className="text-[10px] text-yellow-700">💡 {e.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
