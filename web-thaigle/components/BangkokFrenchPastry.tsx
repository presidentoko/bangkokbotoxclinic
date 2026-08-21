const BAKERIES = [
  {
    name: "Maison Fabre (French bakery chain)",
    emoji: "🥐",
    area: "Multiple branches (EmQuartier, Ari, Thong Lo)",
    price: "Croissant ฿55–75, Lunch set ฿280–420",
    why: "Bangkok's most beloved French bakery. Croissants made with French butter imported weekly. Ham and cheese croissant consistently ranked best in Bangkok. Tarts and eclairs sell out by noon.",
    tip: "Croissants best 7:30–9am warm from oven. Order Millefeuille and seasonal fruit tarts — made daily. Buy 2 croissants minimum — they're smaller than you expect.",
  },
  {
    name: "Paul Café",
    emoji: "🥖",
    area: "Siam Paragon, CentralWorld, multiple malls",
    price: "Baguette ฿75, Set lunch ฿280–450",
    why: "French chain operating in Bangkok since 2005. Authentic French bakery production standards. Best option for consistent quality across multiple mall locations.",
    tip: "Boulangerie section (freshly baked bread) best morning. Quiche Lorraine and croque monsieur lunch favorites. Weekend brunch popular — book table for 2+ at larger branches.",
  },
  {
    name: "Café Tartine",
    emoji: "☕",
    area: "Silom area",
    price: "Pastries ฿80–180, Full brunch ฿380–580",
    why: "Small independent French-run café. True tartine (French open-faced sandwich) done properly. Genuine French feeling — owner is from Lyon. Limited seating, intense regulars.",
    tip: "Opens 8am. Lemon tart and pain au raisins are the signature items. Espresso made with Illy beans. No wifi — deliberate choice to encourage conversation.",
  },
  {
    name: "Baking Soda (Thai-French fusion pastry)",
    emoji: "🍰",
    area: "Ekkamai area",
    price: "Pastries ฿90–220",
    why: "Thai pastry chef trained in Paris creating Thai-French fusion pastries. Pandan croissant, butterfly pea tart, Thai tea eclair. Uniquely Bangkok — not available elsewhere.",
    tip: "Pandan butter croissant is the signature — best eaten within 30 minutes of purchase. Arrives 10am–12pm. Small batch production — follow their Instagram for daily menu.",
  },
];

export function BangkokFrenchPastry() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-amber-700 mb-3">
        🥐 French bakeries & pastries in Bangkok — croissants, tarts & more
      </h2>
      <div className="space-y-2">
        {BAKERIES.map((b) => (
          <div key={b.name} className="border border-amber-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{b.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{b.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{b.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{b.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{b.why}</div>
            <div className="text-[10px] text-amber-700">💡 {b.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
