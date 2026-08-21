const ZONES = [
  {
    name: "Khao San Road Night Market",
    emoji: "🌙",
    area: "Banglamphu (walk from Tha Phra Athit Pier)",
    best: "Backpacker gear, tie-dye clothing, handmade jewelry, hill tribe crafts, fake IDs (don't)",
    price: "฿50–500. Bargain aggressively — first price is tourist price.",
    hours: "4pm–midnight daily (vendors set up from 4pm, peak 8–11pm)",
    tip: "Best street shopping for hippie/festival wear, elephant pants (฿100–150), fisherman pants, and souvenirs. Prices are tourist-oriented — negotiate.",
    vibe: "Busy, backpacker-heavy, loud music from bars. Fun chaos.",
  },
  {
    name: "MBK 4th Floor (Electronics/Tech)",
    emoji: "📱",
    area: "MBK Center, National Stadium BTS",
    best: "Phone cases, chargers, secondhand phones, watches, small electronics",
    price: "Variable. Established shops have fixed prices. Stalls negotiable.",
    hours: "Daily 10am–10pm",
    tip: "Don't buy phones here without testing extensively. Accessories (cases, chargers, cables) are great value. Verify everything works before paying.",
    vibe: "Labyrinthine indoor market inside a mall. Busy, no natural light, great AC.",
  },
  {
    name: "Silom Road Evening Vendors",
    emoji: "🌃",
    area: "Silom Road near Sala Daeng BTS",
    best: "Knockoff luxury goods, copy watches (obviously fake), scarves, accessories",
    price: "฿200–2,000. All negotiable.",
    hours: "Weekdays 5pm–10pm",
    tip: "Thai fakes are openly sold and noticeably fake — not attempting to deceive. Buying is legal for personal use. Custom Thai silk scarves are legitimate purchases.",
    vibe: "Business district unwinding. Mix of office workers and tourists.",
  },
  {
    name: "Pratunam Market",
    emoji: "👗",
    area: "Phetchaburi and Ratchaprarop Rd (Pratunam BTS)",
    best: "Wholesale clothing, T-shirts in bulk, fashion accessories, Thai-designed apparel",
    price: "Wholesale prices start ฿50–100/item. Minimum quantities sometimes required.",
    hours: "Daily 6am–7pm (mornings are best — fashion buyers arrive early)",
    tip: "Bangkok's wholesale fashion center. Even retail buyers get wholesale prices here. Best for buying clothes in quantity. Less tourist-focused than Chatuchak.",
    vibe: "No-frills, business-focused. Locals and regional buyers from Myanmar, Laos, Cambodia.",
  },
];

export function BangkokStreetShopping() {
  return (
    <div className="rounded-2xl border border-violet-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-violet-700 mb-3">
        🛍️ Bangkok street shopping zones — what to buy where
      </h2>
      <div className="space-y-2">
        {ZONES.map((z) => (
          <details key={z.name} className="border border-violet-100 rounded-xl overflow-hidden group">
            <summary className="px-3 py-2.5 cursor-pointer flex items-center gap-2 hover:bg-violet-50 transition">
              <span className="text-2xl shrink-0">{z.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{z.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{z.area} · {z.hours}</div>
              </div>
            </summary>
            <div className="px-3 pb-3 border-t border-violet-100 pt-2 space-y-1">
              <div className="text-[10px] text-violet-700">🎯 Best for: {z.best}</div>
              <div className="text-[10px] text-green-700">💰 Prices: {z.price}</div>
              <div className="text-[10px] text-[var(--fg)] leading-snug">🌆 Vibe: {z.vibe}</div>
              <div className="text-[10px] text-orange-600">💡 {z.tip}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
