const SPOTS = [
  {
    name: "Vertigo & Moon Bar (Banyan Tree)",
    emoji: "🌙",
    floor: "61F",
    cuisine: "Grilled seafood + steaks",
    pricepp: "฿1,500–2,500",
    hours: "Dinner from 6pm, bar until midnight",
    dress: "Smart casual",
    bookAhead: "2–3 days, essential",
    tip: "Request 'roof view table' when booking. Most dramatic Bangkok skyline you can eat under.",
  },
  {
    name: "Cielo Sky Bar & Restaurant (Sky Walk)",
    emoji: "🌆",
    floor: "46F (State Tower)",
    cuisine: "Thai + international fusion",
    pricepp: "฿1,200–2,000",
    hours: "Daily 5:30pm–midnight",
    dress: "Smart casual",
    bookAhead: "1–2 days weekdays, 3–4 days weekends",
    tip: "Part of the Lebua complex but with better food + lower prices than Mezzaluna downstairs.",
  },
  {
    name: "Penthouse Bar & Grill (MODE Hotel)",
    emoji: "✨",
    floor: "26F",
    cuisine: "Premium steaks + seafood",
    pricepp: "฿1,800–3,000",
    hours: "Daily 5pm–midnight",
    dress: "Business casual",
    bookAhead: "2–3 days",
    tip: "Least-known of the top rooftop restaurants. Smaller capacity = more intimate. Excellent wine selection.",
  },
  {
    name: "Mezzaluna (Lebua Tower)",
    emoji: "🍝",
    floor: "65F — highest restaurant in Bangkok",
    cuisine: "Fine dining Italian — 2 Michelin stars",
    pricepp: "฿4,000–6,500 tasting menu",
    hours: "Dinner only, Tue–Sun 6pm–10pm",
    dress: "Formal (no shorts, no sandals)",
    bookAhead: "1–2 weeks minimum",
    tip: "The only Michelin-starred rooftop restaurant in Bangkok. World-class view + cuisine. Once-in-a-trip splurge.",
  },
];

export function BangkokRooftopRestaurants() {
  return (
    <div className="rounded-2xl border border-indigo-100 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-indigo-700 mb-3">
        🌆 Bangkok rooftop dining — where to eat in the sky
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-indigo-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">Floor {s.floor} · {s.cuisine} · Dress: {s.dress}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono font-black text-green-700">{s.pricepp}/pp</span>
            </div>
            <div className="text-[10px] text-blue-700 mb-0.5">🕐 {s.hours} · 📅 Book: {s.bookAhead}</div>
            <div className="text-[10px] text-orange-600">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
