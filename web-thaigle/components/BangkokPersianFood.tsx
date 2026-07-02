const RESTAURANTS = [
  {
    name: "Sahan Restaurant (Sukhumvit 3)",
    emoji: "🥙",
    area: "Sukhumvit Soi 3 (Arab Street / Nana area)",
    price: "Mains ฿180–380",
    why: "Sukhumvit Soi 3 is Bangkok's informal 'Arabic Quarter'. Sahan serves Persian-influenced Middle Eastern food. Kebabs (koobideh, joujeh, shishlik), rice dishes (chelo), dips (hummus, mast-o-khiar). Iranian and Arabic expats eat here.",
    tip: "The area has 15+ Middle Eastern restaurants — walk and look inside. Sahan is most authentically Persian. Order the 'Chelo Kebab Koobideh' — ground lamb kebab with saffron-buttered rice. Lavash bread is complimentary.",
  },
  {
    name: "Maida Restaurant (Silom area)",
    emoji: "🌹",
    area: "Silom Road area",
    price: "Full meal ฿350–600",
    why: "More formal Persian-influenced dining in Bangkok. Fesenjan (pomegranate walnut stew), ghormeh sabzi (herb lamb), ash reshteh (noodle soup). Known by expat Iranian community as the most authentic Persian kitchen.",
    tip: "Fesenjan is the signature dish — sweet-sour pomegranate walnut sauce over duck or chicken. Reserve in advance. Cash only. Friday is busiest — many Iranian Muslims congregate here after Friday prayer at nearby mosque.",
  },
  {
    name: "Soi 3 Walking Tour (DIY)",
    emoji: "🚶",
    area: "Sukhumvit Soi 3 / Soi 3/1",
    price: "Shawarma ฿80–150, shisha ฿200–400",
    why: "Self-guided food tour of Bangkok's Arab quarter. Mix of Lebanese, Egyptian, Iranian, Turkish, and Pakistani restaurants. Shawarma stands, halal butchers, Arabic bakeries, shisha cafés. Unique Bangkok microculture.",
    tip: "Best 7pm–midnight when restaurants are full of Arabic expats. Walk the whole soi (250m) before choosing. Bakeries at the entrance sell excellent manakish (flatbread with zaatar). Shisha with mint tea is the evening ritual.",
  },
];

const DISHES = [
  "Koobideh kebab — ground lamb with onion + parsley, on skewer. Persian's everyday food",
  "Chelo — steamed saffron rice. The foundation of Persian cuisine",
  "Fesenjan — pomegranate + walnut sauce stew. Iran's most unique dish",
  "Ghormeh sabzi — herb-heavy lamb stew. Smell is 'Iran in a pot'",
  "Mast-o-khiar — yogurt + cucumber dip. Fresh counterpoint to rich mains",
  "Lavash — thin, soft flatbread. Eat everything wrapped in this",
];

export function BangkokPersianFood() {
  return (
    <div className="rounded-2xl border border-rose-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-rose-700 mb-3">
        🇮🇷 Persian & Middle Eastern food Bangkok — Soi 3 Arab quarter guide
      </div>
      <div className="space-y-2 mb-3">
        {RESTAURANTS.map((r) => (
          <div key={r.name} className="border border-rose-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{r.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{r.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{r.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{r.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{r.why}</div>
            <div className="text-[10px] text-rose-700">💡 {r.tip}</div>
          </div>
        ))}
      </div>
      <details className="border border-rose-100 rounded-xl overflow-hidden">
        <summary className="px-3 py-2 cursor-pointer text-[10px] font-bold text-rose-700 hover:bg-rose-50">
          Persian dishes explained
        </summary>
        <ul className="px-3 pb-3 pt-1 space-y-0.5">
          {DISHES.map((d) => (
            <li key={d} className="text-[10px] text-[var(--fg)] flex items-start gap-1.5">
              <span className="text-rose-400 shrink-0">•</span>{d}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
