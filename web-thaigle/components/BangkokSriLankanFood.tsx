const ITEMS = [
  {
    name: "Sri Lankan Restaurants in Bangkok",
    emoji: "🌿",
    area: "Silom, Sukhumvit, and Indian community areas",
    price: "Rice & curry meals ฿150–300",
    why: "Sri Lankan cuisine shares some overlap with South Indian food but uses distinct spice profiles, more coconut, and Sri Lanka's signature black curry (from roasted coconut). Bangkok's South Asian community includes Sri Lankan expats who support a small number of authentic restaurants. Sri Lankan curry is often spicier and more complex than North Indian curry.",
    tip: "Sri Lankan rice and curry (rice with 4–6 small curries, chutneys, and papadums) is the defining meal experience. The black curry (made from dark roasted coconut and spices) is uniquely Sri Lankan — nothing like it in Thai or Indian restaurants. Ask specifically for it.",
  },
  {
    name: "Key Sri Lankan Dishes to Order",
    emoji: "🥘",
    area: "Any Sri Lankan or South Asian restaurant",
    price: "฿120–250 per dish",
    why: "Sri Lanka's signature dishes: hoppers (bowl-shaped crispy rice pancakes, sweet or egg variety), string hoppers (steamed rice noodle discs eaten with curry), kottu roti (chopped roti stir-fried with vegetables/egg/meat — distinctive clanking metal sound), pol sambol (fresh coconut chili condiment), dhal curry (lentil).",
    tip: "Hoppers are only available for breakfast/dinner — not a lunchtime dish. String hoppers + coconut milk curry is the breakfast classic. Kottu roti is the crowd-pleaser for non-Sri Lankans — it's recognizably stir-fried but very Sri Lankan in seasoning.",
  },
  {
    name: "Sri Lankan & South Indian Overlap Restaurants",
    emoji: "🫙",
    area: "Silom Soi 11, Little India area, Pahurat",
    price: "Set meal ฿180–350",
    why: "Several Bangkok South Indian restaurants serve Sri Lankan dishes alongside South Indian food — particularly restaurants owned by Tamil Sri Lankans (the communities are closely linked). The Pahurat area (Little India) is the best place to look for authentic Sri Lankan food by exploring the many South Asian restaurants lining the streets.",
    tip: "The line between Tamil Sri Lankan and South Indian food is intentionally blurry in Bangkok's restaurants — both communities share many dishes. Good Tamil restaurant = excellent Sri Lankan food is a reliable shortcut.",
  },
];

export function BangkokSriLankanFood() {
  return (
    <div className="rounded-2xl border border-orange-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-orange-700 mb-3">
        🌿 Sri Lankan food in Bangkok — hoppers, kottu roti & black curry
      </div>
      <div className="space-y-2">
        {ITEMS.map((i) => (
          <div key={i.name} className="border border-orange-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{i.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{i.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{i.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{i.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{i.why}</div>
            <div className="text-[10px] text-orange-700">💡 {i.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
