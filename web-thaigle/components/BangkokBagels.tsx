const SPOTS = [
  {
    name: "New York-Style Bagel Bakeries",
    emoji: "🥯",
    area: "Ekkamai, Ari, Thonglor — Western café clusters",
    price: "Plain bagel ฿80–120; Loaded bagel sandwich ฿200–380",
    why: "Bangkok's New York deli-inspired bagel scene grew from the expat American demand and spread to Thai café culture after 2020. True New York-style bagels (water-boiled before baking, chewy interior, shiny exterior) exist in Bangkok at several dedicated bakeries and café-deli hybrids. The range now includes sesame, everything, cinnamon raisin, and poppy seed. Bangkok's heat makes a fresh morning bagel particularly satisfying before the day heats up.",
    tip: "The test for a real NY bagel: it should be chewy enough to require effort to tear, dense rather than bread-soft, and shiny from the boiling process. If it tears easily and feels like soft bread, it's a bagel-shaped roll not a true bagel. Cream cheese is consistently available; nova lox is the challenge (real smoked salmon is available at Villa Market and some specialty stores). The best Bangkok bagel shops make their own schmear (cream cheese spread).",
  },
  {
    name: "Jewish-Style Deli Influence",
    emoji: "🥨",
    area: "Scattered — no specific Jewish quarter in Bangkok",
    price: "Deli items ฿150–400",
    why: "Bangkok has no formal Jewish district but Jewish-influenced deli culture (bagels, pastrami, rugelach, matzo ball soup) has permeated the city's international food scene through American and European expats. The Israeli community in Bangkok (post-military travel, digital nomads, tourists) has brought shakshuka, hummus, falafel, and bagels into the consciousness of Thai café owners. Several Ari and Ekkamai cafés serve shakshuka and bagels in the same brunch menu — an unusual fusion that works well.",
    tip: "Shakshuka (eggs poached in tomato sauce with peppers and spices) at Bangkok cafés has become a standard brunch offering, often alongside bagels. The preparation varies — some Bangkok cafés add Thai spices (galangal, lemongrass) or use coconut milk in the tomato sauce. Ask if the shakshuka is 'classic' or 'Thai-adapted' to set expectations. Rugelach (pastry rolls) appear at European-influenced bakeries.",
  },
  {
    name: "Pretzel & German Bakery Products",
    emoji: "🥨",
    area: "German and European bakeries — Silom, Sathorn, Asoke",
    price: "Pretzel ฿80–150; German bakery products ฿60–250",
    why: "Authentic soft German pretzels (laugenbrezel — boiled in lye/baking soda solution for the characteristic brown glaze and chewy texture) are available at Bangkok's German bakeries, Oktoberfest pop-up events, and some specialty delis. Zum Bruno (German restaurant) serves pretzels as a starter. The German bakery Backhaus and various German expatriate community catering supply breads, Brötchen (bread rolls), and pastries not otherwise available in Bangkok.",
    tip: "A soft German pretzel should be served warm, salted, and with sweet mustard. The lye dip is what creates the pretzel's uniqueness — without it, it's just a shaped bread roll. Bangkok's authentic German pretzels are found at German restaurants rather than general bakeries. Weisswurst (Bavarian white sausage) breakfast sets occasionally appear at Bangkok's German community events.",
  },
];

export function BangkokBagels() {
  return (
    <div className="rounded-2xl border border-stone-300 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-stone-700 mb-3">
        🥯 Bagels & deli in Bangkok — NY-style bakeries, Jewish brunch & German pretzels
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-stone-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-stone-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
