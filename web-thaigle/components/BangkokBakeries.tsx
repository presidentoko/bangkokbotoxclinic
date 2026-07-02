const BAKERIES = [
  {
    name: "BKK Bread Bar",
    emoji: "🍞",
    area: "Charoen Krung, Bang Rak (near Asiatique)",
    price: "฿80–250/item",
    hours: "Wed–Mon 8am–5pm",
    why: "Bangkok's most talked-about artisan bakery. Naturally-leavened sourdough loaves, seasonal croissants, Danish pastries using French techniques.",
    must: "Country sourdough (฿220 whole loaf), almond croissant (฿110), seasonal fruit Danish",
    tip: "Breads sell out by 11am on weekends. Order online or arrive early.",
  },
  {
    name: "Proof Bakehouse",
    emoji: "🥐",
    area: "Ekkamai Soi 30",
    price: "฿90–200/item",
    hours: "Daily 7am–4pm",
    why: "Instagram's most photographed croissant in Bangkok. Flaky, buttery, properly laminated. Also excellent coffee.",
    must: "Kouign-amann, seasonal mango croissant, pain suisse",
    tip: "Queue outside opens at 7:30am. Best selection before 9am. Their kouign-amann is incomparable.",
  },
  {
    name: "Kanomwan (Thai Pastry / Kanom Thai)",
    emoji: "🟢",
    area: "Any Thai temple market / Or Tor Kor",
    price: "฿20–60/piece",
    hours: "Early morning only (6–10am typically)",
    why: "Traditional Thai sweets — not bakery in Western sense but essential Bangkok morning food. Pandan-coconut rice cakes, cassava cake, sticky rice desserts.",
    must: "Khanom krok (coconut rice pancakes ฿10 for 6 pieces), kanom chan (layered pandan cake), bua loy (rice balls in coconut milk)",
    tip: "Thai temple markets Saturday–Sunday morning have the best selection. Or Tor Kor market daily.",
  },
  {
    name: "Maison Joot",
    emoji: "🏡",
    area: "Sukhumvit 61 (Ekkamai BTS area)",
    price: "฿120–280/item",
    hours: "Wed–Sun 9am–4pm",
    why: "French-Thai fusion pastry. Award-winning croissants with Thai flavors (Thai tea croissant, pandan swirl). Small production, limited daily.",
    must: "Thai milk tea croissant, pandan spiral croissant, seasonal fruit tart",
    tip: "Pre-order via their IG @maisonjoot for guaranteed allocation. Sells out completely by noon.",
  },
];

export function BangkokBakeries() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-amber-700 mb-3">
        🥐 Bangkok bakeries — artisan bread & pastry
      </div>
      <div className="space-y-2">
        {BAKERIES.map((b) => (
          <div key={b.name} className="border border-amber-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{b.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{b.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{b.area} · {b.hours}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{b.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{b.why}</div>
            <div className="text-[10px] text-orange-600 mb-0.5">⭐ Must get: {b.must}</div>
            <div className="text-[10px] text-amber-700">💡 {b.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
