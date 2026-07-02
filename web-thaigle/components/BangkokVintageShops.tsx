const SHOPS = [
  {
    name: "Chatuchak Weekend Market (Section 2 & 3)",
    emoji: "🏺",
    area: "Chatuchak, Mo Chit BTS",
    price: "Clothing ฿100–800, Accessories ฿50–500, Furniture ฿200–5,000",
    open: "Sat–Sun 9am–6pm",
    why: "Southeast Asia's largest weekend market has an entire section dedicated to vintage clothing, retro furniture, and antique collectibles. Overwhelming scale — plan which sections to hit.",
    tip: "Section 2: vintage clothing and accessories. Section 24: antiques. Arrive 9am before crowds and heat. Bargain firmly — initial prices 30–50% inflated.",
  },
  {
    name: "Pratunam Vintage",
    emoji: "👗",
    area: "Pratunam area (near Ratchaprasong BTS)",
    price: "Secondhand clothes ฿50–400 per piece",
    open: "Daily 10am–8pm (Tue closed)",
    why: "Multi-floor secondhand clothing warehouse with Thai, Japanese, and Western vintage. Mixture of streetwear, formalwear, and Y2K pieces. Best for clothing hunters.",
    tip: "Arrive weekday mornings for freshest stock. Bags sell out fast. Price per kilo system on some floors — weigh before haggling.",
  },
  {
    name: "The Jam Factory Antiques",
    emoji: "🏭",
    area: "Charoen Krung (near ASIATIQUE)",
    price: "Antiques ฿500–50,000, Design pieces ฿200–5,000",
    open: "Tue–Sun 10am–8pm",
    why: "Converted warehouse space in Bangkok's arts district with curated antique and vintage dealers. Higher-end than Chatuchak but more authentic items with provenance.",
    tip: "Best for quality over quantity. Dealers here speak English. Some pieces have genuine Rattanakosin-era Thai antiques. Ask for authenticity certificates on major pieces.",
  },
  {
    name: "Talat Rot Fai (Train Market)",
    emoji: "🚂",
    area: "Ratchada (near Thailand Cultural Centre MRT)",
    price: "Vintage items ฿100–10,000",
    open: "Thu–Sun 5pm–midnight (night market)",
    why: "Bangkok's coolest night vintage market. Retro Americana, Thai vintage, 1950s–1980s collectibles, vintage motorcycles displayed. Atmospheric warehouse setting.",
    tip: "Night market — arrive 6pm as it fills up. Famous for vintage vehicle displays alongside shopping. Adjacent street food market. Take MRT to Thailand Cultural Centre.",
  },
];

export function BangkokVintageShops() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-amber-700 mb-3">
        🕰️ Bangkok vintage shopping — secondhand, antiques & retro finds
      </div>
      <div className="space-y-2">
        {SHOPS.map((s) => (
          <div key={s.name} className="border border-amber-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area} · {s.open}</div>
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
