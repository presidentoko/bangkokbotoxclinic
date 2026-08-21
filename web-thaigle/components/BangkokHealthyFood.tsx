const PICKS = [
  {
    name: "Broccoli Revolution",
    emoji: "🥦",
    area: "Sukhumvit Soi 49 (Thong Lo)",
    price: "Bowl / plate ฿250–450, Smoothie ฿180–280",
    why: "Bangkok's gold standard for plant-based healthy eating. 100% plant-based menu — nothing processed or artificial. Acai bowls, grain bowls, raw desserts, smoothies. Opened 2013 and still Bangkok's best.",
    tip: "Rainbow noodle salad and mushroom pho are year-round staples. Kombucha on tap. Tiny space — get there by noon for best selection. Take-away orders available on Grab.",
  },
  {
    name: "Soul Food Mahanakorn",
    emoji: "🍋",
    area: "Ekkamai BTS area",
    price: "Mains ฿280–580",
    why: "Thai street food recipes elevated with organic and locally-sourced ingredients. Not 'health food' per se — full-flavored Thai cooking that happens to use better ingredients. Natural wine list.",
    tip: "This isn't a diet restaurant — it's Thai comfort food made with quality. Best laab and som tam in Bangkok at this quality level. Book ahead on weekends.",
  },
  {
    name: "Veganerie Concept",
    emoji: "🌱",
    area: "Siam Paragon, multiple branches",
    price: "Mains ฿150–350",
    why: "Mid-range fully vegan restaurant chain. Consistent quality across Bangkok locations. Good for vegetarians visiting malls. Extensive menu covering Thai and international dishes.",
    tip: "The most accessible vegan option in central Bangkok malls. Portions generous for price. Mobile ordering available. Tom Kha and green curry are best Thai options.",
  },
  {
    name: "Market Kitchen at Central Embassy",
    emoji: "🥗",
    area: "Ploenchit BTS",
    price: "Bowl concept ฿280–550",
    why: "Upscale healthy food hall concept. Multiple stations: grain bowls, cold-press juices, raw desserts, poke bowls, salad bar. Business-lunch focused but very good quality.",
    tip: "Premium pricing but high quality. Best for business lunch when you need healthy + impressive. Cold-press juice bar a Bangkok standout. All labelled for allergens.",
  },
];

const APPS = [
  "Grab: filter 'healthy' or 'vegan' category — strong selection across Sukhumvit and Ari",
  "Foodpanda: 'salad' or 'bowls' search for delivery from health-focused restaurants",
  "Wongnai (Thai app): most comprehensive local healthy restaurant database",
];

export function BangkokHealthyFood() {
  return (
    <div className="rounded-2xl border border-green-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-green-700 mb-3">
        🥦 Healthy eating in Bangkok — bowls, plant-based & clean food
      </h2>
      <div className="space-y-2 mb-3">
        {PICKS.map((p) => (
          <div key={p.name} className="border border-green-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{p.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{p.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{p.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{p.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{p.why}</div>
            <div className="text-[10px] text-green-700">💡 {p.tip}</div>
          </div>
        ))}
      </div>
      <div className="border border-green-100 rounded-xl p-3">
        <div className="text-[10px] font-bold text-green-700 mb-1.5">Order healthy food delivery:</div>
        <ul className="space-y-0.5">
          {APPS.map((a) => (
            <li key={a} className="text-[10px] text-[var(--fg)] flex items-start gap-1.5">
              <span className="text-green-400 shrink-0">•</span>{a}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
