const DISTRICTS = [
  {
    area: "Chinatown (Yaowarat)",
    emoji: "🏮",
    bestFor: "Shark fin soup, pad thai, roast duck, mango sticky rice",
    openTime: "5pm–midnight (best after dark)",
    tip: "Walk the whole street — vendors compete. Go hungry.",
    url: "/restaurants/bangkok/chinatown",
  },
  {
    area: "Chatuchak Weekend Market",
    emoji: "🛍️",
    bestFor: "Boat noodles, Thai grilled chicken, fresh coconut, mango shakes",
    openTime: "Saturday & Sunday, 8am–6pm",
    tip: "Section 2/3 has the best food-to-tourist ratio. Arrive before 11am.",
    url: "/restaurants/bangkok",
  },
  {
    area: "Sukhumvit (Soi 11, 38, 55)",
    emoji: "🌃",
    bestFor: "Grilled pork skewers, khao man gai, Northeastern Thai (Isaan)",
    openTime: "Soi 38: 5pm–1am · Soi 11: 6pm–late",
    tip: "Soi 11 food stalls open after 8pm — peak quality, full crowd.",
    url: "/restaurants/bangkok/sukhumvit",
  },
  {
    area: "Or Tor Kor Market",
    emoji: "🌿",
    bestFor: "Premium local produce, durian, pad kra pao, roast pork",
    openTime: "Daily 6am–6pm",
    tip: "Best quality of any market in Bangkok. Locals buy groceries here. Zero tourist markup.",
    url: "/restaurants/bangkok",
  },
  {
    area: "Silom / Bangrak",
    emoji: "🍜",
    bestFor: "Southern Thai curries, boat noodles, roti",
    openTime: "Lunch 11am–2pm strong; dinner 5pm–9pm",
    tip: "Best after office hours when workers swarm the side streets. Satay vendors on Silom Soi 20.",
    url: "/restaurants/bangkok/silom",
  },
];

export function StreetFoodDistrictMap() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        🗺️ Bangkok street food — by district
      </div>
      <div className="space-y-2">
        {DISTRICTS.map((d) => (
          <a key={d.area} href={d.url} className="block border border-[var(--border)] rounded-xl p-3 hover:border-orange-300 hover:shadow-sm transition group">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{d.emoji}</span>
              <span className="font-bold text-xs group-hover:text-orange-700 transition">{d.area}</span>
              <span className="ml-auto text-[10px] text-[var(--muted)] shrink-0">{d.openTime}</span>
            </div>
            <div className="text-[11px] text-[var(--fg)] leading-snug mb-1">
              <span className="font-medium">Must try: </span>{d.bestFor}
            </div>
            <div className="text-[10px] text-orange-600 leading-snug">💡 {d.tip}</div>
          </a>
        ))}
      </div>
      <a
        href="/restaurants/bangkok"
        className="mt-3 block text-center text-xs font-bold text-orange-600 border border-orange-200 bg-orange-50 rounded-full py-1.5 hover:bg-orange-100 transition"
      >
        Browse Bangkok restaurants →
      </a>
    </div>
  );
}
