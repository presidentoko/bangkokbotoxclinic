const BARS = [
  {
    name: "Octave Rooftop Lounge (Marriott Sukhumvit)",
    emoji: "🌃",
    area: "Thong Lo BTS (E5)",
    floor: "45F–49F",
    vibe: "360° panoramic — most expansive view in Bangkok",
    dress: "Smart casual",
    price: "Cocktails ฿350–550, no cover charge",
    tip: "Free walk-in. Arrive 5:30–6pm for sunset without queues. Tables fill fast after 7pm.",
    bestFor: "Best overall value rooftop in Bangkok",
  },
  {
    name: "Sky Bar (Lebua at State Tower)",
    emoji: "✨",
    area: "Si Phraya pier (Chao Phraya)",
    floor: "63F — one of Southeast Asia's highest bars",
    vibe: "Iconic. Hangover (film). Gold-domed exterior. Must-do once.",
    dress: "Smart dress code enforced — no shorts/sandals",
    price: "Cocktails ฿600–900, minimum spend ฿1,500/person",
    tip: "Pre-book via their website for guaranteed spot. Cosmo is their signature ฿700.",
    bestFor: "Special occasions, impressing guests",
  },
  {
    name: "Vertigo (Banyan Tree Bangkok)",
    emoji: "🌙",
    area: "Sala Daeng BTS (S2)",
    floor: "61F open-air",
    vibe: "No roof overhead — pure open sky. Most wind in Bangkok. Amazing Silom views.",
    dress: "Smart casual minimum",
    price: "Cocktails ฿450–700",
    tip: "Good weather dependent. Can be windy. Also has Vertigo Grill for dinner — reserve ahead.",
    bestFor: "Pure open-air experience",
  },
  {
    name: "Sugar Ray (The Standard)",
    emoji: "🎵",
    area: "Sathorn (Chong Nonsi BTS)",
    floor: "43F",
    vibe: "Coolest crowd in Bangkok. Mixologist-driven. DJ nights Thu–Sat.",
    dress: "Fashion-forward, no flip flops",
    price: "Natural wine ฿300–500/glass. Cocktails ฿380–550",
    tip: "Book tables for Thu–Sat. Walk-in possible Sun–Wed. Underground music events here.",
    bestFor: "Nightlife crowd, cocktail lovers",
  },
  {
    name: "Above Eleven (Fraser Suites)",
    emoji: "🌴",
    area: "Asok BTS (E4)",
    floor: "33F",
    vibe: "Peruvian-Japanese Nikkei bar. Ceviche + cocktails. Less touristy.",
    dress: "Casual but neat",
    price: "Cocktails ฿320–480, food ฿200–600",
    tip: "Best Nikkei food in Bangkok + amazing Sukhumvit views. More local crowd than typical rooftop.",
    bestFor: "Foodie + cocktail combo",
  },
];

export function BangkokRooftopBars() {
  return (
    <div className="rounded-2xl border border-indigo-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-indigo-700 mb-3">
        🌆 Bangkok rooftop bars — ranked for every traveler
      </h2>
      <div className="space-y-2">
        {BARS.map((b) => (
          <div key={b.name} className="border border-indigo-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-xl shrink-0">{b.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{b.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">📍 {b.area} · Floor {b.floor}</div>
              </div>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-1 leading-snug">{b.vibe}</div>
            <div className="text-[10px] text-green-700 mb-0.5">{b.price} · Dress: {b.dress}</div>
            <div className="text-[10px] text-orange-600 mb-0.5">💡 {b.tip}</div>
            <div className="text-[10px] font-bold text-indigo-600">⭐ {b.bestFor}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
