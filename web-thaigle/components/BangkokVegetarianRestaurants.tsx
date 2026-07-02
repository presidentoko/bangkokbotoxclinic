const RESTAURANTS = [
  {
    name: "May Veggie Home",
    emoji: "🌿",
    area: "Asok / Sukhumvit 12",
    price: "฿80–200",
    type: "Thai vegetarian / Buddhist cuisine",
    must: "Pad Thai without egg, green curry with tofu, mushroom larb",
    why: "One of Bangkok's best-kept secrets. Buddhist vegetarian cooking with deep umami from mushrooms. Lunch only.",
    hours: "Mon–Sat 8am–3pm only",
  },
  {
    name: "Broccoli Revolution",
    emoji: "🥦",
    area: "Sukhumvit 49",
    price: "฿200–500",
    type: "Modern vegan / plant-based",
    must: "Green bowl, vegan burgers, plant-based pad Thai, fresh juices",
    why: "Most international-friendly vegan restaurant. English menu. Huge portions. Very popular with expats.",
    hours: "Daily 11am–9:30pm",
  },
  {
    name: "Ethos Restaurant",
    emoji: "☯️",
    area: "Banglamphu / Khao San Road area",
    price: "฿120–350",
    type: "Vegan / vegetarian fusion",
    must: "Full English vegan breakfast (฿220), daily curry, smoothie bowls",
    why: "Best vegan spot in Banglamphu / backpacker area. Relaxed atmosphere, communal tables. Digital nomad crowd.",
    hours: "Daily 8am–9pm",
  },
  {
    name: "Samyan Market (Vegetarian Stalls)",
    emoji: "🏪",
    area: "Samyan / Silom MRT",
    price: "฿40–80",
    type: "Street food stalls",
    must: "Morning glory (ผัดผักบุ้ง), stir-fried vegetables, tofu som tam, vegetarian khao man gai",
    why: "Every market stall in Samyan has vegetarian options — just ask 'kin je' (eat vegetarian) or 'mai sai nuea' (no meat). Cheapest and most authentic.",
    hours: "7am–2pm (morning market best)",
  },
];

export function BangkokVegetarianRestaurants() {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-emerald-700 mb-3">
        🌿 Vegetarian & vegan restaurants in Bangkok
      </div>
      <div className="text-[10px] bg-emerald-50 rounded-xl p-2.5 mb-3 text-emerald-800">
        <strong>Thai tip:</strong> Say <strong>"gin jay"</strong> (กินเจ) for Buddhist-style vegan (no animal products, garlic or onion). Say <strong>"gin mangsawirat"</strong> (กินมังสวิรัติ) for vegetarian with eggs/dairy OK.
      </div>
      <div className="space-y-2">
        {RESTAURANTS.map((r) => (
          <div key={r.name} className="border border-emerald-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{r.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{r.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{r.type} · {r.area} · {r.hours}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{r.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{r.why}</div>
            <div className="text-[10px] text-orange-600">⭐ Order: {r.must}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
