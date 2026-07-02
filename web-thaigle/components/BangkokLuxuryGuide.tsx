const EXPERIENCES = [
  {
    category: "Fine Dining",
    emoji: "🍽️",
    highlights: [
      "Gaggan Anand — Asia's Best Restaurant multiple years. Progressive Indian. ฿6,000–10,000/person. Book 3 months ahead.",
      "Le Normandie (Mandarin Oriental) — Bangkok's most historic fine dining since 1958. French cuisine. ฿3,500–5,500.",
      "Sühring — Twin German chefs, 2 Michelin stars. Modern German. ฿5,000–8,000. Best tasting menu in Bangkok.",
      "Canvas — Bangkok's sustainability-focused tasting menu. Local ingredients. 5+ Michelin stars area overall.",
    ],
    tip: "Bangkok is one of the world's best fine dining cities — cheaper than London/Singapore for equivalent quality.",
  },
  {
    category: "Luxury Hotels",
    emoji: "🏨",
    highlights: [
      "Capella Bangkok — newest 5-star, best new luxury hotel in SE Asia. ฿25,000–50,000/night.",
      "Rosewood Bangkok — 30F glass tower, best city views. ฿15,000–30,000/night.",
      "Mandarin Oriental — legendary since 1876. Author's Wing is Bangkok royalty. ฿20,000–40,000.",
      "The Peninsula — across river, private ferry, white-glove service. ฿18,000–35,000.",
    ],
    tip: "Book Mandarin Oriental afternoon tea (฿1,800/person) as a treat without staying overnight.",
  },
  {
    category: "Private Experiences",
    emoji: "✨",
    highlights: [
      "Private long-tail boat dawn tour of canals — ฿3,000/hr for 1–4 pax",
      "Private muay thai training with ex-champions at Rajadamnern — ฿5,000/person",
      "Thai cooking class in Mandarin Oriental kitchen — private from ฿12,000/couple",
      "Helicopter transfer Bangkok to Koh Samui or Pattaya — from ฿80,000",
    ],
    tip: "Most luxury hotels can arrange private experiences through their concierge. Ask — they know more than any app.",
  },
  {
    category: "Luxury Spa",
    emoji: "💆",
    highlights: [
      "Mandarin Oriental Spa — Bangkok's best. Royal Thai treatments. 2-3hr packages ฿6,000–12,000.",
      "The Peninsula Spa — Thai herbal steam rooms + Siam-inspired treatments. ฿5,000–10,000.",
      "Aman Spa (Aman Nai Lert) — urban wellness sanctuary, smallest capacity. ฿8,000+ package.",
      "Divana Virtue Spa — more accessible luxury. Signature Divana ritual ฿3,500.",
    ],
    tip: "Unlike Western luxury, Bangkok spas offer good value — equivalent London/Paris spas cost 3–4x more.",
  },
];

export function BangkokLuxuryGuide() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-amber-700 mb-3">
        ✨ Bangkok luxury guide — the best money can buy
      </div>
      <div className="space-y-3">
        {EXPERIENCES.map((e) => (
          <div key={e.category} className="border border-amber-100 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{e.emoji}</span>
              <div className="font-bold text-xs">{e.category}</div>
            </div>
            <div className="space-y-1.5 mb-1.5">
              {e.highlights.map((h) => (
                <div key={h} className="text-[10px] flex gap-1.5">
                  <span className="shrink-0 text-amber-600">▸</span>
                  <span className="leading-snug">{h}</span>
                </div>
              ))}
            </div>
            <div className="text-[10px] text-blue-700">💡 {e.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
