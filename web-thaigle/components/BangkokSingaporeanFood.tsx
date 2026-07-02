const SPOTS = [
  {
    name: "Singapore Chicken Rice Specialists",
    emoji: "🍗",
    area: "Various Bangkok food courts and dedicated restaurants",
    price: "Chicken rice set ฿80–220",
    why: "Hainanese chicken rice (Singapore's national dish) has spread throughout Bangkok. Silky poached chicken over fragrant rice cooked in chicken broth, served with chili sauce, ginger paste, dark soy. Several Bangkok restaurants specialize exclusively in this dish.",
    tip: "Best chicken rice in Bangkok comes from Hainanese-Thai family restaurants, not Singaporean chains. Look for pale pink tender flesh (not dry or overcooked). Three sauces always present: chili, ginger, dark soy — use all three together.",
  },
  {
    name: "Laksa Bangkok (Singaporean Curry Noodles)",
    emoji: "🍜",
    area: "Chatuchak area and Singaporean/Malaysian restaurants",
    price: "Laksa bowl ฿150–280",
    why: "Laksa (spicy coconut curry noodle soup) from Singapore is beloved by expats in Bangkok. Thick rice noodles, coconut milk broth, prawn, fish cake, tofu puffs. Several Bangkok restaurants now serve quality versions. Distinct from Thai noodle soups.",
    tip: "Ask for 'Singaporean laksa' specifically vs 'laksa' — Malaysian laksa differs (drier noodles). Prawn is essential ingredient — skip if restaurant says 'we can substitute.' The orange-red color should come from dried shrimp paste, not just chili.",
  },
  {
    name: "Hawker Center-style Food Courts",
    emoji: "🏮",
    area: "MBK, Central World, Terminal 21 food courts",
    price: "Per dish ฿60–180",
    why: "Bangkok's large mall food courts replicate Singapore's hawker center style — multiple stalls, communal seating, cheap varied food. Terminal 21 food court (Asoke) is Bangkok's most diverse and often has Singapore/Malaysian specific stalls.",
    tip: "Terminal 21 food court basement level: look for the 'Asian Food' section — Singaporean-style char kway teow (wok-fried flat noodles with egg, seafood) is often available. MBK Centertainment has the largest number of individual stalls overall.",
  },
];

const DISHES = [
  "Hainanese Chicken Rice: silky poached chicken, fragrant rice, 3 sauces — Singapore's national dish",
  "Laksa: spicy coconut curry soup with thick noodles, prawn, tofu puffs, fish cake",
  "Char Kway Teow: wok-fried flat rice noodles, egg, Chinese sausage, bean sprouts, smoky wok heat",
  "Chili Crab: mud crab in spicy tomato-based sauce — served with fried mantou buns",
  "Kaya Toast: coconut jam on toast with butter + soft-boiled eggs + coffee = Singapore breakfast",
  "Roti Prata: South Indian flatbread, crispy outside, soft inside — with dhal or curry sauce",
];

export function BangkokSingaporeanFood() {
  return (
    <div className="rounded-2xl border border-red-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-red-700 mb-3">
        🇸🇬 Singaporean food in Bangkok — chicken rice, laksa & hawker guide
      </div>
      <div className="space-y-2 mb-3">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-red-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-red-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
      <details className="border border-red-100 rounded-xl overflow-hidden">
        <summary className="px-3 py-2 cursor-pointer text-[10px] font-bold text-red-700 hover:bg-red-50">
          Singaporean dish guide
        </summary>
        <ul className="px-3 pb-3 pt-1 space-y-0.5">
          {DISHES.map((d) => (
            <li key={d} className="text-[10px] text-[var(--fg)] flex items-start gap-1.5">
              <span className="text-red-400 shrink-0">•</span>{d}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
