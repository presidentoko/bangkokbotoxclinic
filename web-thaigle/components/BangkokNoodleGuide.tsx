const NOODLES = [
  {
    name: "Pad See Ew (ผัดซีอิ้ว)",
    type: "Thai stir-fried wide rice noodle",
    emoji: "🍜",
    price: "฿60–100",
    spice: "None (optional chili flakes)",
    where: "Any Thai restaurant, street stalls",
    desc: "Flat wide rice noodles stir-fried with egg, Chinese broccoli, and soy sauce. Sweet, savory, slightly charred. Thailand's most approachable noodle dish.",
    tip: "Order with pork (moo) for best flavor. Add a squeeze of lime.",
  },
  {
    name: "Boat Noodles (ก๋วยเตี๋ยวเรือ)",
    type: "Thai broth noodle — rich, dark",
    emoji: "🛶",
    price: "฿15–30 per bowl",
    spice: "Medium",
    where: "Victory Monument area (best concentration in BKK)",
    desc: "Small bowls, big flavor. Dark aromatic broth made with pork blood (or without). Originally sold from canal boats. Order 4–6 bowls per person.",
    tip: "Victory Monument BTS then walk 3 min. Row of boat noodle restaurants. Try 4 bowls minimum.",
  },
  {
    name: "Khao Soi (ข้าวซอย)",
    type: "Northern Thai curry noodle",
    emoji: "🍛",
    price: "฿80–150",
    spice: "Medium-low",
    where: "Northern Thai restaurants in BKK. Best: Khao Soi Thip Samai (Silom area)",
    desc: "Northern Thai signature: coconut curry broth, egg noodles, crispy noodle topping, pickled mustard greens, shallots, lime. Rich, fragrant, unique.",
    tip: "Mix in all toppings before eating. Squeeze lime over. Not common at street stalls — look for Northern Thai restaurants.",
  },
  {
    name: "Guay Teow (ก๋วยเตี๋ยว)",
    type: "Thai clear broth noodle soup",
    emoji: "🥣",
    price: "฿50–80",
    spice: "Mild (you add condiments)",
    where: "Everywhere — this is the default Thai noodle soup",
    desc: "Clear or cloudy pork/chicken broth. Your choice of noodle type (sen lek = thin rice, sen yai = wide rice, bami = egg, woon sen = glass). Topped with bean sprouts, green onion.",
    tip: "Customization: specify noodle type + protein. Table condiments: sugar, fish sauce, vinegar, chili flakes — add all four in small amounts.",
  },
  {
    name: "Ramen (Bangkok-style)",
    type: "Japanese-influenced but Bangkok has world-class ramen",
    emoji: "🍣",
    price: "฿200–450",
    spice: "As ordered",
    where: "Menya Musashi (Siam Paragon), Fuunji (Thonglor), Maruichi (multiple), Mendokoro Ramsuke",
    desc: "Bangkok's Japanese expat community means genuine ramen — tonkotsu, shoyu, miso, tsukemen. Not Thai food but Bangkok has 50+ excellent ramen shops.",
    tip: "Fuunji Thonglor: best tsukemen in Thailand. Maruichi: most consistent chain. Ramen season = August–November (rainy season craving).",
  },
];

export function BangkokNoodleGuide() {
  return (
    <div className="rounded-2xl border border-yellow-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-yellow-700 mb-3">
        🍜 Bangkok noodles guide — Thai & regional options
      </div>
      <div className="space-y-2">
        {NOODLES.map((n) => (
          <details key={n.name} className="border border-yellow-100 rounded-xl overflow-hidden group">
            <summary className="px-3 py-2.5 cursor-pointer flex items-center gap-2 hover:bg-yellow-50 transition">
              <span className="text-2xl shrink-0">{n.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{n.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{n.type}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[10px] font-mono text-green-700">{n.price}</div>
                <div className="text-[10px] text-orange-500">🌶 {n.spice}</div>
              </div>
            </summary>
            <div className="px-3 pb-3 border-t border-yellow-100 pt-2 space-y-1">
              <div className="text-[10px] text-[var(--fg)] leading-snug">{n.desc}</div>
              <div className="text-[10px] text-yellow-700">📍 Where: {n.where}</div>
              <div className="text-[10px] text-orange-600">💡 {n.tip}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
