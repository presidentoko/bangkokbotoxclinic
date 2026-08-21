const ITEMS = [
  {
    name: "Pastel de Nata (Portuguese Egg Tart) in Bangkok",
    emoji: "🥮",
    area: "Premium bakeries and specialty pastry shops",
    price: "฿60–120 per tart",
    why: "The Portuguese egg custard tart (pastel de nata) reached Bangkok via Macau and Hong Kong's Portuguese colonial legacy. Flaky, laminated pastry shell with caramelized custard top — similar to Hong Kong egg tarts but more bitter caramel notes. Available at Portuguese-inspired bakeries, some French pâtisseries, and cafés that stock premium pastry items. Not as common as in Macau or Lisbon, but findable.",
    tip: "Pastel de nata in Bangkok is most reliably found at Portuguese-inspired bakeries or cafés that specifically source from pastry-focused kitchens. The defining element is the dark caramel spots on the custard top — if it's uniformly pale, it wasn't baked hot enough. Eat warm for best texture.",
  },
  {
    name: "Portuguese Influence on Thai Desserts",
    emoji: "🍮",
    area: "Traditional Thai dessert shops, especially Old Bangkok",
    price: "฿40–120",
    why: "Portuguese traders and missionaries introduced egg-based sweets to Siam in the 16th–17th century — several Thai desserts trace their origin to Portuguese techniques. Foi thong (golden thread egg dessert), sangkaya (coconut custard), thong yip (petal-shaped egg yolk dessert), and kanom mor gaeng (egg custard tart) all reflect Portuguese culinary influence via the Thai court. Thailand's sweetest tradition has a Portuguese connection.",
    tip: "Kanom mor gaeng (Thai baked egg custard) is the closest Bangkok dessert to Portuguese egg tart tradition — available at traditional Thai dessert shops in Bang Rak and Old Town Bangkok. Foi thong (golden egg threads) is a stunning visual dessert and a unique Bangkok culinary experience from this Portuguese legacy.",
  },
  {
    name: "Portuguese Restaurant Experience",
    emoji: "🍷",
    area: "Very limited; some at Macanese restaurants and European tapas venues",
    price: "Mains ฿350–700",
    why: "Dedicated Portuguese restaurants are extremely rare in Bangkok — unlike other European cuisines, there's no significant Portuguese expat community. The closest experience: Macanese restaurants (Macau-style Chinese-Portuguese cuisine) occasionally appear in Bangkok's fusion dining scene. The Portuguese wine list is available at wine bars that stock European imports. Bacalhau (salt cod) is an indicator of genuine Portuguese cooking.",
    tip: "For genuine Portuguese food in Bangkok, the most realistic option is home cooking from Portuguese expat social media groups or attending organized Portuguese cultural events (Portuguese-Macanese cultural associations). The cuisine remains an Bangkok gap — more accessible via Macau or Lisbon.",
  },
];

export function BangkokPortugueseFood() {
  return (
    <div className="rounded-2xl border border-yellow-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-yellow-700 mb-3">
        🥮 Portuguese influence in Bangkok — pastel de nata, foi thong & culinary history
      </h2>
      <div className="space-y-2">
        {ITEMS.map((i) => (
          <div key={i.name} className="border border-yellow-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{i.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{i.name}</h3>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{i.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{i.why}</div>
            <div className="text-[10px] text-yellow-700">💡 {i.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
