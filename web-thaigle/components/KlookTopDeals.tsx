const DEALS = [
  {
    emoji: "🥊",
    name: "Muay Thai gym day pass",
    category: "Fitness",
    rating: "4.8★",
    reviews: "2,400+",
    from: "฿390",
    url: "https://www.klook.com/en-US/activity/19023-muay-thai-boxing-class-bangkok/?aid=thaigle",
  },
  {
    emoji: "👨‍🍳",
    name: "Bangkok cooking class (market + cook 4 dishes)",
    category: "Food",
    rating: "4.9★",
    reviews: "8,700+",
    from: "฿1,100",
    url: "https://www.klook.com/en-US/activity/2249-cooking-class-bangkok/?aid=thaigle",
  },
  {
    emoji: "💆",
    name: "Traditional Thai massage 90 min",
    category: "Wellness",
    rating: "4.7★",
    reviews: "5,200+",
    from: "฿580",
    url: "https://www.klook.com/en-US/activity/thai-massage-bangkok/?aid=thaigle",
  },
  {
    emoji: "🛺",
    name: "Bangkok night tour (tuk tuk + street food)",
    category: "Tour",
    rating: "4.8★",
    reviews: "3,100+",
    from: "฿890",
    url: "https://www.klook.com/en-US/activity/1065-bangkok-by-night-tuk-tuk/?aid=thaigle",
  },
];

export function KlookTopDeals() {
  return (
    <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4 my-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs font-black uppercase tracking-widest text-orange-700">
          🎟️ Top-booked Bangkok activities (Klook)
        </div>
        <a
          href="https://www.klook.com/en-US/city/2-bangkok-things-to-do/?aid=thaigle"
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="text-[10px] text-orange-500 hover:underline"
        >
          All deals →
        </a>
      </div>
      <div className="space-y-2">
        {DEALS.map((d) => (
          <a
            key={d.name}
            href={d.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="flex items-start gap-3 bg-white rounded-xl p-3 border border-orange-100 hover:border-orange-400 hover:shadow-sm transition group"
          >
            <span className="text-2xl shrink-0">{d.emoji}</span>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-xs group-hover:text-orange-600 transition truncate">{d.name}</div>
              <div className="text-[10px] text-[var(--muted)] mt-0.5">
                {d.category} · {d.rating} ({d.reviews} reviews)
              </div>
            </div>
            <div className="shrink-0 text-right">
              <div className="text-[10px] text-[var(--muted)]">From</div>
              <div className="font-mono font-black text-orange-600 text-xs">{d.from}</div>
            </div>
          </a>
        ))}
      </div>
      <p className="mt-2 text-[10px] text-orange-600 text-center italic">Affiliate links — we earn a commission at no cost to you</p>
    </div>
  );
}
