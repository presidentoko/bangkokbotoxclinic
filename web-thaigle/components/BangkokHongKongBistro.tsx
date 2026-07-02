const SPOTS = [
  {
    name: "HK Style Milk Tea (Cha Chaan Teng)",
    emoji: "🧋",
    where: "Various HK-style cafés in Silom + Chinatown",
    price: "Milk tea ฿60–120, set meals ฿180–350",
    why: "Hong Kong-style cafés (cha chaan teng) serve thick, silky milk tea brewed in a sock strainer. Distinct from Thai milk tea — no sweetener added, pure tea-milk balance. Noodle sets, French toast (golden fried bread with butter), egg tarts.",
    tip: "Search 'Hong Kong Café' or 'cha chaan teng Bangkok' — several in Silom and Chinatown. Order: HK milk tea + polo bun + BBQ pork bun + egg tart = complete HK breakfast experience. Total cost ฿200–300.",
  },
  {
    name: "Dim Sum Bangkok (Chinatown specialists)",
    emoji: "🥟",
    where: "Yaowarat Road (Chinatown) — morning shops",
    price: "Per basket ฿50–180",
    why: "Bangkok's Chinatown has authentic Cantonese dim sum shops descended from Hong Kong-trained cooks. Har gow (shrimp dumplings), siu mai (pork dumplings), char siu bao (BBQ pork buns), cheung fun (rice rolls).",
    tip: "Best dim sum: mornings only (7am–2pm). Look for cart-pushed dim sum (old school) not menu-ordered. Arrivals before 10am get freshest batches. Chinatown's top dim sum shops have no English menus — point at carts.",
  },
  {
    name: "HK BBQ Pork (Char Siu) Shops",
    emoji: "🍖",
    where: "Chinatown area + Thai Yotha Road vicinity",
    price: "Char siu ฿150–350/100g",
    why: "Bangkok has excellent Cantonese-style BBQ meat shops (siu mei) run by Hong Kong-descended families. Char siu (BBQ pork), siu yuk (crispy roast pork), roast duck. Hanging meats visible from street — all freshly roasted daily.",
    tip: "Thai-Chinese roast pork (moo deng) is different from char siu. Ask specifically for 'char siu' (HK-style BBQ pork) — sweeter, red-lacquered. Crispy pork belly (siu yuk/moo krob) sold at same shops. Eat before 2pm when shops close.",
  },
];

export function BangkokHongKongBistro() {
  return (
    <div className="rounded-2xl border border-red-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-red-700 mb-3">
        🇭🇰 Hong Kong food in Bangkok — char siu, dim sum & milk tea guide
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-red-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.where}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-red-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
