const SPOTS = [
  {
    name: "Somboon Seafood",
    emoji: "🦀",
    area: "Multiple locations (Silom flagship)",
    price: "฿300–1,000/person",
    why: "Bangkok institution since 1969. Famous yellow curry crab (ปูผัดผงกะหรี่). Must order.",
    must: "Curry crab ฿450–900 (price by crab weight), stir-fried morning glory, tiger prawn in glass noodles",
    book: "No reservation — queue 30–60 min on weekends. Worth it.",
    hours: "Daily 4pm–10pm",
  },
  {
    name: "Or Tor Kor Market Seafood",
    emoji: "🦞",
    area: "Chatuchak / Mo Chit MRT",
    price: "฿80–200/dish",
    why: "Bangkok's premium fresh market. Highest quality, but still market prices. Pre-cook seafood + rice = perfect lunch.",
    must: "Steamed whole fish with lime sauce, stir-fried shrimp with basil, fresh oysters by the dozen",
    book: "No reservation. Arrive by 10am for best selection.",
    hours: "Daily 8am–6pm (seafood section best 8am–2pm)",
  },
  {
    name: "Pak Pao Seafood",
    emoji: "🍤",
    area: "Bang Khun Thian (riverside, 40 min south)",
    price: "฿200–600/person",
    why: "Best fresh seafood in Greater Bangkok. What Thai families drive 40km for. River shrimp, crab, clams all live-from-tank.",
    must: "Grilled river prawn with garlic butter, steamed sea bass, whole deep-fried snapper",
    book: "Weekends only — book 1 week ahead",
    hours: "Daily 10am–8pm",
  },
  {
    name: "Krua Apsorn (Royals' restaurant)",
    emoji: "👑",
    area: "Dinso Rd, Old City (near Grand Palace)",
    price: "฿150–400/person",
    why: "Named after the recipe used for Thai royals. Famous crab omelette and massaman crab curry. Busy with Thai government workers at lunch.",
    must: "Crab massaman curry, crab omelette, stir-fried water spinach",
    book: "No reservation. Arrive before 12:30pm to beat lunch rush.",
    hours: "Daily 10:30am–7:30pm",
  },
];

export function BangkokSeafood() {
  return (
    <div className="rounded-2xl border border-sky-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-sky-700 mb-3">
        🦐 Best seafood restaurants in Bangkok
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-sky-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">📍 {s.area} · 🕐 {s.hours}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-orange-600 mb-0.5">⭐ Must order: {s.must}</div>
            <div className="text-[10px] text-sky-700">📱 {s.book}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
