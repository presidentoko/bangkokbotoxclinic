const BRUNCHES = [
  {
    name: "Marriott Sukhumvit Sunday Brunch",
    emoji: "🥂",
    style: "International buffet + live stations",
    price: "฿1,899 food only / ฿2,899 with free-flow prosecco",
    hours: "Sun 11:30am–3pm",
    why: "Best value Sunday brunch in Bangkok for the quality. 100+ dishes, carving station, oysters, live sushi, pastry corner.",
    tip: "Book 1 week ahead. Ask for a window table overlooking the pool. Arrive early for oysters.",
  },
  {
    name: "Mandarin Oriental Sunday Brunch",
    emoji: "👑",
    style: "Legendary 5-star heritage brunch",
    price: "฿3,500–4,200 with champagne",
    hours: "Sun 12pm–3pm",
    why: "Bangkok's most iconic brunch since the 1980s. Multi-venue experience across 3 restaurants. Highest service level in Thailand.",
    tip: "Reserve 3+ weeks ahead. Dress code: smart casual minimum (no shorts, no flip-flops). Special occasion only.",
  },
  {
    name: "NEXT2 Café (Anantara Riverside)",
    emoji: "🌊",
    style: "Riverside garden brunch",
    price: "฿1,500–2,200 with free-flow wine",
    hours: "Sun 12pm–3:30pm",
    why: "Chao Phraya river view brunch. Live seafood, Japanese station, Thai BBQ. Most scenic setting.",
    tip: "Get there via Saphan Taksin hotel boat (call ahead). Kids eat free under 12. Good for families.",
  },
  {
    name: "Rooftop Brunch (Various hotels)",
    emoji: "🌆",
    style: "Sky bar day brunch",
    price: "฿900–1,800 (smaller menu, cocktail focus)",
    hours: "Sun 11am–3pm",
    why: "Octave Rooftop (Marriott Thong Lo) does weekend brunch. Stunning views without full luxury pricing.",
    tip: "Order the specialty cocktails over free-flow — quality vs. quantity. Best for a 2-hour social rather than full eating session.",
  },
];

export function BangkokSundayBrunch() {
  return (
    <div className="rounded-2xl border border-orange-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-orange-700 mb-3">
        🥐 Bangkok Sunday brunch — best splurge options
      </h2>
      <div className="space-y-2">
        {BRUNCHES.map((b) => (
          <div key={b.name} className="border border-orange-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-xl shrink-0">{b.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{b.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{b.style} · {b.hours}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono font-black text-green-700">{b.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-1 leading-snug">{b.why}</div>
            <div className="text-[10px] text-orange-600">💡 {b.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
