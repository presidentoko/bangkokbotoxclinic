const SPOTS = [
  {
    name: "Pizza Massilia",
    emoji: "🇮🇹",
    area: "Sukhumvit Soi 53 (Thong Lo BTS)",
    price: "฿350–600",
    type: "Neapolitan wood-fired",
    why: "Bangkok's most acclaimed Italian pizza. Certified Neapolitan technique, imported San Marzano tomatoes, Fior di Latte mozzarella, 900°C wood-fired oven.",
    must: "Margherita DOP, Cacio e Pepe pizza, seasonal burrata starter",
    hours: "Daily 11:30am–2pm, 5:30pm–10pm",
  },
  {
    name: "Peppina",
    emoji: "🍕",
    area: "Sukhumvit Soi 33 (Phrom Phong BTS)",
    price: "฿400–700",
    type: "Roman-style thin & crispy",
    why: "Most loved by Bangkok's Italian expat community. Thin-crust Roman style pizza with excellent wine list. Lively, noisy, authentic Italian trattoria atmosphere.",
    must: "Diavola, Panna e Salmone, Nutella pizza for dessert",
    hours: "Daily noon–3pm, 6pm–midnight",
  },
  {
    name: "Siwilai Food Hall (The Commons Thong Lo)",
    emoji: "🧀",
    area: "The Commons Thong Lo, 4th floor",
    price: "฿250–450",
    type: "New York-style by the slice",
    why: "Best NY-style pizza in Bangkok. Foldable large slices. Good for casual eating. The Commons is a great neighborhood food hall in general.",
    must: "Pepperoni slice, white pizza (bianca) with ricotta",
    hours: "Daily 11am–10pm",
  },
  {
    name: "Thin Crust Society",
    emoji: "✂️",
    area: "Sathorn (Surasak BTS area)",
    price: "฿280–500",
    type: "Thai-fusion thin crust",
    why: "Bangkok pizza with local ingredients. Tom Kha pizza (Thai coconut soup flavors), Pad Thai pizza, Pandan dessert pizza. Creative, delicious, uniquely Bangkok.",
    must: "Tom Kha pizza (their signature), Sriracha honey drizzle, seasonal special",
    hours: "Tue–Sun 5pm–10pm",
  },
];

export function BangkokPizzaGuide() {
  return (
    <div className="rounded-2xl border border-red-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-red-700 mb-3">
        🍕 Bangkok pizza — Neapolitan to Thai-fusion
      </h2>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-red-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.type} · {s.area} · {s.hours}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-orange-600">⭐ Order: {s.must}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
