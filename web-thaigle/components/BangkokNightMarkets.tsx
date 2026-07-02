const MARKETS = [
  {
    name: "Chatuchak Weekend Market",
    emoji: "🛍️",
    when: "Sat–Sun 9am–6pm (Plant section: also Fri evenings)",
    area: "Chatuchak / Mo Chit BTS",
    bestFor: "Vintage clothes, plants, art, antiques, street food",
    must: "Section 2 (art), Section 26 (vintage), Mixt chatuchak (food court)",
    cost: "฿–฿฿",
    tip: "Come before 10am. Gets very crowded and hot after noon. Maps available at entrance.",
  },
  {
    name: "Or Tor Kor Market",
    emoji: "🥭",
    when: "Daily 6am–6pm",
    area: "Opposite Chatuchak (MRT)",
    bestFor: "Premium Thai produce, prepared food, dried goods",
    must: "Durian section, Mango sticky rice, premium seafood",
    cost: "฿–฿฿",
    tip: "Best for buying quality Thai ingredients or a very good lunch. Air-conditioned stalls.",
  },
  {
    name: "Asiatique The Riverfront",
    emoji: "🎡",
    when: "Daily 5pm–midnight",
    area: "Chao Phraya riverside (Saphan Taksin BTS + free shuttle boat)",
    bestFor: "Tourist-facing market, Ferris wheel, live shows",
    must: "Calypso cabaret, evening Chao Phraya view, local handicrafts",
    cost: "฿฿–฿฿฿",
    tip: "Not a local market — it's a curated shopping-entertainment complex. Good for families.",
  },
  {
    name: "Yaowarat Night Street (Chinatown)",
    emoji: "🏮",
    when: "Daily 7pm–midnight (busiest Fri–Sun)",
    area: "Yaowarat Rd, Chinatown",
    bestFor: "Street seafood, roast duck, dim sum, pad thai",
    must: "Roast duck noodles, oyster omelette, deep-fried durian, fresh-squeezed juice",
    cost: "฿–฿฿",
    tip: "Go at 8pm on a Friday — it's at its most electric. Bring cash. Very busy — hold your phone tight.",
  },
  {
    name: "Train Night Bazaar (JJ Green/Ratchada)",
    emoji: "🚂",
    when: "Thu–Sun 5pm–1am",
    area: "Ratchada / Lat Phrao (MRT Thailand Cultural Centre)",
    bestFor: "Vintage clothes, retro items, young Thai designers, street food",
    must: "The rooftop area with city view, vintage Levi's, local Thai bands",
    cost: "฿–฿฿",
    tip: "More local than Chatuchak. Popular with Thais in their 20s–30s. Very Instagrammable.",
  },
];

export function BangkokNightMarkets() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        🛍️ Bangkok markets — the complete guide
      </div>
      <div className="space-y-3">
        {MARKETS.map((m) => (
          <div key={m.name} className="border border-[var(--border)] rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{m.emoji}</span>
              <div className="min-w-0">
                <div className="font-bold text-xs">{m.name}</div>
                <div className="text-[10px] text-[var(--muted)]">🕐 {m.when}</div>
                <div className="text-[10px] text-[var(--muted)]">📍 {m.area} · {m.cost}</div>
              </div>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5">Best for: {m.bestFor}</div>
            <div className="text-[10px] text-green-700 mb-0.5">Must try: {m.must}</div>
            <div className="text-[10px] text-orange-600">💡 {m.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
