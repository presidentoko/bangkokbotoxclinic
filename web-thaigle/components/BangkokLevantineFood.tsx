const SPOTS = [
  {
    name: "Lebanese & Israeli Food in Bangkok",
    emoji: "🫙",
    area: "Sukhumvit Soi 11 (Middle East corridor), Silom",
    price: "Hummus & mezze ฿200–450; Mixed grill mains ฿350–700",
    why: "Bangkok's Levantine food scene is anchored by the Middle Eastern expat community concentrated on Sukhumvit Soi 3 (known locally as Arab Street or 'Soi Arabic') and Soi 11. Lebanese restaurants serve authentic mezze (hummus, baba ghanoush, tabbouleh, fattoush), fresh-baked pita, and mixed grills (kafta, shish tawook, shish kebab). Israeli hummus bars have emerged more recently — Israeli backpacker culture (post-army world travel typically involves Thailand) creates demand for Tel Aviv-style hummus with fresh toppings, shakshuka, and sabich.",
    tip: "Bangkok's best Lebanese zone: the Sukhumvit Soi 3 area has multiple Lebanese and Arabic restaurants operating side by side — compare menus posted at doors, as quality varies significantly. The fresh fattoush (toasted bread salad with lemon dressing) and tabbouleh are reliable quality indicators. Halal certification at most Middle Eastern restaurants in this area — confirmed halal for Muslim visitors. For Israeli food specifically: fewer dedicated restaurants but the 'Israeli backpacker restaurant' format (hummus, shakshuka, tahini) appears in backpacker areas (Khao San Road adjacent, Silom).",
  },
  {
    name: "Syrian & Palestinian Home Cooking",
    emoji: "🍢",
    area: "Community restaurants near Soi 3, residential neighborhoods",
    price: "Homestyle plate ฿200–400",
    why: "Bangkok's Syrian community (some arriving as refugees, others as established business families) maintains homestyle cooking traditions difficult to find in commercial restaurants — kibbeh (bulgur and meat croquettes), mujadara (lentils and rice with caramelized onions), mansaf (Jordanian lamb and yogurt over rice) occasionally available through community networks. Palestinian food is similar in repertoire — musakhan (chicken over flatbread with onion and sumac), knafeh (cheese pastry with sugar syrup) from Palestinian-owned bakeries.",
    tip: "Finding authentic Levantine home cooking in Bangkok: the small restaurants on the back alleys off Sukhumvit Soi 3 are run by community families and serve more authentic home-style food than the larger Arabic restaurants on the main Soi 3 strip. Look for handwritten menu boards and restaurants that appear to be feeding regulars rather than tourists. Friday lunch (after Jumu'ah prayer at nearby mosques) is when community food is at its most abundant and authentic.",
  },
  {
    name: "Falafel, Shawarma & Street Food",
    emoji: "🌯",
    area: "Soi 3 Sukhumvit street stalls, Khao San Road area",
    price: "Falafel wrap ฿80–150; Shawarma ฿150–250",
    why: "Levantine street food — falafel (fried chickpea balls in pita with tahini, pickles, fresh vegetables), shawarma (spit-roasted meat in flatbread), and manakish (Lebanese flatbread with za'atar or cheese) — are accessible in Bangkok's Middle Eastern corridor at prices significantly lower than European or American equivalents. The shawarma culture particularly has taken root in Bangkok — Thai people have adopted shawarma wraps into the street food ecosystem.",
    tip: "Best falafel in Bangkok: the small falafel stalls on Sukhumvit Soi 3 are typically fresh-made (watch for active frying vs. pre-made sitting under heat lamps — fresh is dramatically better). Manakish (Lebanese flatbread) is the lesser-known best item — za'atar manakish (za'atar herb blend with olive oil on fresh-baked bread) is breakfast in Lebanon and extraordinary with tea. The Zaatar W Zeit chain (Lebanese fast casual, multiple Bangkok mall locations) is consistent for manakish and salads when looking for reliable quality.",
  },
];

export function BangkokLevantineFood() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-amber-700 mb-3">
        🫙 Levantine food in Bangkok — Lebanese mezze, Israeli hummus, falafel & shawarma
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-amber-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-amber-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
