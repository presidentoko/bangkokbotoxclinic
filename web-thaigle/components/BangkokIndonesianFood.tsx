const RESTAURANTS = [
  {
    name: "Bali Kitchen Bangkok",
    emoji: "🌴",
    area: "Thonglor / Ekkamai area",
    price: "Mains ฿250–450",
    why: "Most-loved Indonesian/Balinese restaurant in Bangkok. Nasi goreng (fried rice), rendang (slow-cooked beef in coconut), gado-gado (peanut sauce salad), satay (grilled skewers). Authentic island atmosphere.",
    tip: "Rendang is a must — slow-cooked 5+ hours, deeply flavorful. Order the 'Nasi Campur' (mixed rice set) to sample 4–5 dishes at once. Spice level can be adjusted — ask for local-spicy if you want authentic heat.",
  },
  {
    name: "Warung Jakarta",
    emoji: "🏝️",
    area: "Silom / Sathorn area",
    price: "Set meals ฿180–320",
    why: "Jakarta-style warung (small restaurant). Nasi padang style — rice with rotating daily curries and sides. Very different from Thai food — warmer spices, coconut milk base, nuttier flavors. Lunch crowd of Indonesian expats is a good sign.",
    tip: "Nasi Padang ordering: you sit down, dishes come to the table automatically, you pay for what you eat. Don't be overwhelmed — point at what you want. Ayam goreng (fried chicken) and tempeh are universally loved.",
  },
  {
    name: "Indonesian Home Cooking (Grab Food delivery)",
    emoji: "📱",
    area: "Delivery via Grab Food / LINE Man",
    price: "Homestyle meals ฿180–350",
    why: "Indonesian home cooks in Bangkok sell on food delivery apps. More authentic than restaurants. Dishes like opor ayam (coconut chicken), soto (herbal broth soup), and klepon (rice cake dessert) are only available this way.",
    tip: "Search 'Indonesian' or 'Masakan Indonesia' in Grab Food. Delivery from community cooks is usually pre-order — same-day or next-day. Payment via LINE Pay or cash on delivery.",
  },
];

const DISHES = [
  "Nasi Goreng — Indonesian fried rice, richer and darker than Thai. The national dish",
  "Rendang — dry beef curry, slow-cooked 5+ hours. UNESCO-listed intangible cultural heritage of food",
  "Gado-Gado — vegetables + boiled egg + peanut sauce. Indonesia's signature salad",
  "Satay — grilled meat skewers, served with peanut sauce + lontong (rice cake)",
  "Tempeh — fermented soybean cake. Nutty, high-protein. More flavorful than tofu",
  "Nasi Padang — rice with multiple curry side dishes. West Sumatra style buffet",
];

export function BangkokIndonesianFood() {
  return (
    <div className="rounded-2xl border border-orange-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-orange-700 mb-3">
        🇮🇩 Indonesian food in Bangkok — nasi goreng, rendang & more
      </div>
      <div className="space-y-2 mb-3">
        {RESTAURANTS.map((r) => (
          <div key={r.name} className="border border-orange-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{r.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{r.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{r.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{r.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{r.why}</div>
            <div className="text-[10px] text-orange-700">💡 {r.tip}</div>
          </div>
        ))}
      </div>
      <details className="border border-orange-100 rounded-xl overflow-hidden">
        <summary className="px-3 py-2 cursor-pointer text-[10px] font-bold text-orange-700 hover:bg-orange-50">
          Indonesian dishes explained
        </summary>
        <ul className="px-3 pb-3 pt-1 space-y-0.5">
          {DISHES.map((d) => (
            <li key={d} className="text-[10px] text-[var(--fg)] flex items-start gap-1.5">
              <span className="text-orange-400 shrink-0">•</span>{d}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
