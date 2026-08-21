const SPOTS = [
  {
    name: "Jeh Oh Chula Tom Yum Noodles",
    emoji: "🍜",
    area: "Chulalongkorn Soi 16 (Hua Lamphong MRT)",
    open: "10pm–5am only",
    price: "฿120–200",
    why: "Bangkok's most famous late-night noodle spot. Queue 30–90min. The tom yum noodle soup at 2am with a group of friends is a Bangkok rite of passage.",
    must: "Tom yum mama (instant noodle upgrade with prawn, pork, egg). Order large.",
    tip: "Google Maps shows open hours. Queue fastest after 2am when it thins out slightly.",
  },
  {
    name: "Yaowarat (Chinatown) Night Eats",
    emoji: "🏮",
    area: "Yaowarat Rd, Bangrak",
    open: "8pm–2am (most stalls)",
    price: "฿80–300",
    why: "Bangkok's best late-night eating street. T&K Seafood, mango sticky rice stalls, shark fin (imitation) noodle soup, oyster omelette stalls.",
    must: "Oyster omelette ฿120, mango sticky rice ฿120, stir-fried noodles with crab ฿200",
    tip: "Busiest 9–11pm Friday-Saturday. Quieter Sunday-Thursday but all same stalls open.",
  },
  {
    name: "Sukhumvit Soi 38 Night Market",
    emoji: "🌃",
    area: "Sukhumvit 38 (Thong Lo BTS)",
    open: "7pm–3am",
    price: "฿60–200",
    why: "Most convenient late-night street food in central Bangkok. Famous for pad thai carts, grilled skewers, fresh fruit.",
    must: "Pad Thai by the cart owner (not the restaurant, the actual old woman cart outside) ฿80, mango sticky rice ฿80.",
    tip: "The famous 'Pad Thai Thong Lo' cart is the one run by the elderly woman — look for the longest queue.",
  },
  {
    name: "Don Breakfast & Other Meals",
    emoji: "🍳",
    area: "Silom Soi 7 / Surasak BTS",
    open: "24 hours (yes, really)",
    price: "฿200–600",
    why: "Bangkok's only 24-hour premium café-restaurant. Full menu, espresso, cocktails, food at 4am. Good eggs Benedict at 3am.",
    must: "Steak and eggs, croque monsieur, espresso, natural wine (night)",
    tip: "Quietest 2–6am. Popular with chefs and service industry workers after their shifts end.",
  },
];

export function BangkokLateNightEats() {
  return (
    <div className="rounded-2xl border border-indigo-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-indigo-700 mb-3">
        🌙 Bangkok late-night food — where to eat after midnight
      </h2>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-indigo-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area} · ⏰ {s.open}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-orange-600 mb-0.5">⭐ Order: {s.must}</div>
            <div className="text-[10px] text-indigo-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
