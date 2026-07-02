const SPOTS = [
  {
    name: "Hong Kong Egg Waffles (Gai Daan Jai)",
    emoji: "🥚",
    area: "Yaowarat, Chatuchak, mall dessert courts",
    price: "฿60–120 per portion",
    why: "Hong Kong egg waffles (bubble waffles — small round pockets on a thin waffle grid) have become one of Bangkok's most popular dessert street foods. The crispy exterior with slightly chewy interior texture is distinctly different from regular waffles. Bangkok's egg waffle scene has evolved from simple sweet options to elaborately topped versions (soft serve ice cream, fresh fruit, syrup drizzles) at mall dessert stalls. The photogenic round bubble pattern makes egg waffles a standard Instagram dessert in Bangkok.",
    tip: "Best egg waffles in Bangkok: the original Yaowarat/Chinatown egg waffle stalls (identifiable by the cast iron dimple molds over gas fire) are freshest and least gimmicky. Mall versions add Instagram toppings but the waffle quality is often inferior — the fast-casual production volume means waffles aren't always eaten immediately after cooking. An egg waffle eaten 5 minutes post-cooking is dramatically better than one that's been sitting.",
  },
  {
    name: "Belgian Liège Waffles",
    emoji: "🇧🇪",
    area: "European-concept cafés — Ari, Ekkamai, Thonglor",
    price: "Waffle ฿180–350",
    why: "Bangkok's European café culture introduced proper Belgian Liège waffles (made from a dense, sweet yeasted dough with Belgian pearl sugar that caramelizes on the iron) to the Thai market. Liège waffles are served warm as a standalone dessert with fruit, ice cream, or fresh cream. Distinct from Hong Kong egg waffles and from American-style fluffy waffles — denser, sweeter, and more filling. Several Bangkok cafés import proper pearl sugar for authentic texture.",
    tip: "The key distinction: Liège waffle = dense, slightly heavy, caramelized sugar exterior; Brussels waffle = lighter, crispier, not sweet in itself. Most Bangkok 'Belgian waffles' are actually Liège style even if labeled Belgian. Serve immediately — pearl sugar caramelization softens within 10 minutes. A proper Liège waffle should be faintly chewy from the brioche-like dough.",
  },
  {
    name: "Thai-Twist Waffle Desserts",
    emoji: "🌸",
    area: "Street markets, dessert chains, Jodd Fairs",
    price: "฿50–150",
    why: "Thailand's dessert creativity applied to waffle formats: pandan-flavored waffle batter (bright green), taro cream waffle sandwiches, mango sticky rice incorporated into waffle presentation, Thai tea (cha yen) waffle topping combinations. These fusions blur the line between Thai dessert and Western waffle format in uniquely Bangkok ways. Weekend night markets (Jodd Fairs, Artbox) have the highest concentration of experimental waffle vendors.",
    tip: "Thai-twist waffles at night markets change frequently — what was trending at Jodd Fairs last month may be replaced by something new. The progression in Bangkok dessert trends: matcha waffles (2018) → black charcoal waffles (2019) → Thai tea waffles (2020–2022) → fruit mochi waffle combinations (2023 onwards). Each wave replaces the previous in street market stalls.",
  },
];

export function BangkokWaffles() {
  return (
    <div className="rounded-2xl border border-yellow-300 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-yellow-700 mb-3">
        🧇 Waffles in Bangkok — HK egg bubble waffles, Belgian Liège & Thai-flavored twists
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-yellow-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-yellow-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
