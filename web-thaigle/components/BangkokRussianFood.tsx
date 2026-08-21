const SPOTS = [
  {
    name: "Dasha Restaurant",
    emoji: "🥂",
    area: "Sukhumvit Soi 7 area, Nana",
    price: "Main dishes ฿400–800",
    why: "Established Russian restaurant serving Bangkok's Russian expat community. Classic Russian menu: borscht (beet soup), pelmeni (dumplings), beef stroganoff, Oliver salad, blini (crepes). Russian vodka selection. More formal setting — white tablecloths, Russian staff.",
    dishes: "Borscht with sour cream + dark bread, pelmeni in butter-dill sauce, beef stroganoff with egg noodles. Russian tea from samovar.",
  },
  {
    name: "Russian Quarter (Sukhumvit 5–7 Nana Area)",
    emoji: "🏪",
    area: "Sukhumvit Nana area",
    price: "Varies — budget to mid-range",
    why: "The Nana area has developed a de-facto Russian corridor — Russian delis, supermarkets selling Russian food products, Russian-owned cafes and restaurants. Post-2022 exodus from Russia brought larger Russian community to Bangkok. Russian language signs, Russian menus, Russian-language media.",
    dishes: "Russian grocery stores sell: black bread, kefir, sour cream, Russian dumplings (frozen), caviar (legally sold), Russian confectionery. Home cooking supplies for long-stay expats.",
  },
  {
    name: "Pattaya Russian Restaurant Strip",
    emoji: "🌊",
    area: "Pattaya (1.5 hrs from Bangkok)",
    price: "Budget to mid-range",
    why: "Pattaya has a substantially larger Russian tourist and expat population than Bangkok. Multiple restaurants catering specifically to Russian tourists — menus in Russian, Russian staff, Russian TV channels. More options and larger portions than Bangkok equivalents.",
    dishes: "Same classic Russian dishes plus more regional variations. Pattaya's Russian restaurant strip near Central Pattaya road has dozens of options.",
  },
];

const CULTURE = [
  "Russian community in Bangkok significantly expanded 2022–2024 — now one of the larger European expat groups",
  "Pattaya historically has been Thailand's 'Russian resort' — largest concentration outside Bangkok",
  "Russian-language signage now appears throughout Nana, Asoke, and On Nut areas",
  "Thai-Russian relations remain positive — visa-free travel for Russians to Thailand",
  "Russian Orthodox church services held in Bangkok — check expatriate community boards",
];

export function BangkokRussianFood() {
  return (
    <div className="rounded-2xl border border-red-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-red-700 mb-3">
        🥂 Russian food in Bangkok — restaurants, delis & expat community
      </h2>
      <div className="space-y-2 mb-3">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-red-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-red-700">🍽️ {s.dishes}</div>
          </div>
        ))}
      </div>
      <details className="border border-red-100 rounded-xl overflow-hidden">
        <summary className="px-3 py-2 cursor-pointer text-[10px] font-bold text-red-700 hover:bg-red-50">
          Russian community in Bangkok
        </summary>
        <ul className="px-3 pb-3 pt-1 space-y-0.5">
          {CULTURE.map((c) => (
            <li key={c} className="text-[10px] text-[var(--fg)] flex items-start gap-1.5">
              <span className="text-red-400 shrink-0">•</span>{c}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
