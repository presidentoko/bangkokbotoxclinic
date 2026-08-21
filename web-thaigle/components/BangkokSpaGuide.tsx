const SPAS = [
  {
    name: "Divana Spa",
    emoji: "🌸",
    tier: "Premium boutique",
    area: "Sukhumvit Soi 25",
    price: "฿1,500–4,000",
    hours: "Daily 11am–11pm",
    why: "Bangkok's most awarded boutique spa. Garden setting. Thai herbal treatments with imported organic products. Celebrity clientele.",
    best: "Divana Sacred Ritual (3.5 hrs, ฿3,800) — the ultimate Bangkok spa experience. Book 2 weeks ahead.",
  },
  {
    name: "Oasis Spa",
    emoji: "🌊",
    tier: "Mid-range luxury",
    area: "Sukhumvit 31 / 51 (multiple)",
    price: "฿1,200–3,000",
    hours: "Daily 10am–10pm",
    why: "Best consistent quality across all locations. Great for couples. Private rooms available. Staff training is excellent.",
    best: "Oasis Wrap & Ritual (2.5 hrs, ฿2,200) or couples room booking on weekends.",
  },
  {
    name: "Wat Pho Thai Massage School",
    emoji: "🛕",
    tier: "Traditional / cultural",
    area: "Adjacent to Wat Pho temple, Old City",
    price: "฿300/hr (Thai), ฿400/hr (oil)",
    hours: "Daily 8am–5pm",
    why: "The original Thai massage school — founded 1962. Serious practitioners, not tourist fluff. Historic setting in old Bangkok.",
    best: "1-hour Thai massage at ฿300 is exceptional value. Arrive 30min early on weekends.",
  },
  {
    name: "Chi Spa at Shangri-La",
    emoji: "✨",
    tier: "5-star hotel spa",
    area: "Bangrak (near Saphan Taksin BTS)",
    price: "฿3,500–8,000",
    hours: "Daily 10am–10pm",
    why: "Most indulgent setting in Bangkok. River-facing treatment rooms. Butler service. Airport transfer included in day packages.",
    best: "The Chi Heritage Journey (4 hrs, ฿6,800) with river suite. Best anniversary/honeymoon spa experience in Bangkok.",
  },
  {
    name: "Health Land",
    emoji: "🌿",
    tier: "Value / local favorite",
    area: "Multiple locations (Asok best)",
    price: "฿600–1,200",
    hours: "Daily 9am–11pm",
    why: "Bangkok's most popular local spa chain. Authentic traditional Thai massage without tourist markup. No-frills, high skill.",
    best: "2-hour Thai massage (฿720) + foot massage (฿360) combo. Walk-ins welcome but booking saves 30-min wait.",
  },
];

export function BangkokSpaGuide() {
  return (
    <div className="rounded-2xl border border-rose-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-rose-700 mb-3">
        🌸 Bangkok spas — from budget to luxury
      </h2>
      <div className="space-y-2">
        {SPAS.map((s) => (
          <div key={s.name} className="border border-rose-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.tier} · {s.area} · {s.hours}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-orange-600">⭐ Best: {s.best}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
