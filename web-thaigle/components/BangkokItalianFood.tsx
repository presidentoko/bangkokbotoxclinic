const RESTAURANTS = [
  {
    name: "L'Atelier de Joël Robuchon",
    tier: "Michelin",
    cuisine: "French-Italian haute cuisine",
    price: "฿4,000–8,000",
    area: "Mahanakhon Cube, Bang Rak",
    why: "Bangkok's best European fine dining. Counter seating facing the open kitchen — spectacular show.",
    tip: "Lunch menu is best value — 3 courses ฿2,500.",
  },
  {
    name: "Il Bolognese",
    tier: "Mid-range",
    cuisine: "Northern Italian (Bologna-style)",
    price: "฿600–1,500",
    area: "Sukhumvit Soi 8",
    why: "Authentic hand-rolled pasta from fresh egg. Real bolognese — not the Thai-ified version. Best Italian pasta in Bangkok.",
    tip: "Pasta is made fresh daily — come Tue–Fri for full menu availability.",
  },
  {
    name: "Rossano Osteria",
    tier: "Mid-range",
    cuisine: "Southern Italian / Neapolitan",
    price: "฿500–1,200",
    area: "Ekkamai Soi 10",
    why: "Neapolitan-trained chef. Real wood-fired oven. Best Margherita in Bangkok at ฿350.",
    tip: "Pizza Margherita + Burrata + house tiramisu = perfect meal under ฿800.",
  },
  {
    name: "Portofino",
    tier: "Value",
    cuisine: "Italian-American",
    price: "฿350–800",
    area: "Silom / Bangrak + multiple locations",
    why: "Reliable Italian-American comfort food. Affordable linguine vongole (฿290). Good pasta, large portions.",
    tip: "Not gourmet but consistently good. Business lunch set is excellent value at ฿380.",
  },
];

export function BangkokItalianFood() {
  return (
    <div className="rounded-2xl border border-red-100 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-red-700 mb-3">
        🍝 Italian restaurants in Bangkok — pasta, pizza, and wine
      </div>
      <div className="space-y-2">
        {RESTAURANTS.map((r) => (
          <div key={r.name} className="border border-red-100 rounded-xl p-3">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div>
                <div className="font-bold text-xs">{r.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{r.cuisine} · {r.area}</div>
              </div>
              <div className="flex flex-col items-end shrink-0 gap-0.5">
                <span className="text-[9px] font-bold bg-red-50 text-red-700 px-1.5 py-0.5 rounded">{r.tier}</span>
                <span className="text-[10px] font-mono text-green-700">{r.price}</span>
              </div>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{r.why}</div>
            <div className="text-[10px] text-orange-600">💡 {r.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
