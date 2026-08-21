const COOLERS = [
  {
    name: "Coconut Ice Cream (Coconut Cart)",
    emoji: "🥥",
    where: "Chatuchak Weekend Market, major parks, street carts",
    price: "฿35–60 (coconut shell serving)",
    why: "Served inside a real coconut half with toppings: corn, sticky rice, roasted coconut flakes, peanuts. Rich, naturally sweet, cold. Bangkok's most photogenic and delicious heat cooler. Look for carts with silver barrels and lines.",
    tip: "The cart with the longest line is best — fresh coconut ice cream doesn't stay good for long. Order 'extras' (toppings): ask for 'sticky rice, corn, peanut'. Chatuchak Weekend Market has 8–10 competing carts.",
  },
  {
    name: "Nom Yen (Thai Iced Pink Milk)",
    emoji: "🩷",
    where: "Any Thai restaurant or 7-Eleven",
    price: "Café ฿35–60, 7-Eleven ฿20–30",
    why: "Bright pink Thai iced tea made with sala syrup (rose apple flavoring). Fragrant, very sweet, iced. Often seen in tourist photos. Actually popular with Thai locals too. Available everywhere.",
    tip: "Full-sweet version is aggressively sweet — ask 'wan noi' (less sweet) to reduce sugar. The Thai Tea version (Cha Yen, orange) is more popular with locals. Mix Thai Tea + Nom Yen = Thai Rainbow Tea (very photo-worthy).",
  },
  {
    name: "Nam Daeng (Thai Iced Fruit Syrup)",
    emoji: "🫙",
    where: "Street carts, morning fresh markets",
    price: "฿20–40",
    why: "Classic Thai cold drink — red rosewater syrup over shaved ice. Essentially Thai-style snow cone but with lotus seeds, basil seeds (sabja), or jelly additions. Pure refreshment. Very Bangkok.",
    tip: "Sabja seeds (Thai basil seeds) swell in water — interesting texture. Common additions: toddy palm fruit (tender coconut-like), red rubies (water chestnut). The more toppings = more satisfying experience. Watch it being assembled — it's an art.",
  },
  {
    name: "Shaved Ice (Nam Khaeng Sai)",
    emoji: "🧊",
    where: "Or Tor Kor Market, Yaowarat/Chinatown at night",
    price: "฿50–120 depending on toppings",
    why: "Bangkok shaved ice is considerably more sophisticated than typical snow cone. Ultra-fine ice shavings (almost powder) topped with sweetened mung beans, red beans, coconut milk, syrup combinations. Yaowarat's Nam Khaeng Sai shops are legendary.",
    tip: "Yaowarat Road has Bangkok's best shaved ice shops (open 6pm–midnight). Order 'sai num phung' (sweetened condensed milk drizzle) as the topping base. The crushed ice must be freshly shaved — ask if made to order.",
  },
];

export function BangkokHeatCoolers() {
  return (
    <div className="rounded-2xl border border-sky-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-sky-700 mb-3">
        🧊 Beat the Bangkok heat — cold drinks & desserts that actually help
      </h2>
      <div className="space-y-2">
        {COOLERS.map((c) => (
          <div key={c.name} className="border border-sky-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{c.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{c.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{c.where}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{c.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{c.why}</div>
            <div className="text-[10px] text-sky-700">💡 {c.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
