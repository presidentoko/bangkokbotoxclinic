const SPOTS = [
  {
    name: "Pop Mart Bangkok (Official Stores)",
    emoji: "🎁",
    area: "ICON SIAM, Central Embassy, Siam Square One, many more",
    price: "Blind box ฿390–590, Full series box ฿3,500–5,500",
    brand: "Pop Mart (Chinese — Molly, Skullpanda, Labubu, etc.)",
    why: "The global blind box phenomenon has gone massive in Bangkok. Pop Mart has more Bangkok stores than almost any Asian city. Labubu is everywhere here — and actually cheaper than many markets.",
    tip: "Bangkok Pop Mart sometimes restocks exclusive Thailand-edition Labubu before international release. Follow their Instagram for restock notifications. Resale value: rare Labubu ฿2,000–15,000+",
  },
  {
    name: "Kamonohashi (Siam Square)",
    emoji: "🧸",
    area: "Siam Square Soi 7",
    price: "Figures ฿600–5,000, Rare ฿10,000+",
    brand: "Mix of Japanese vinyl figures, Bearbrick, Kaws, Medicom",
    why: "Bangkok's best independent art toy shop. Japanese toys: Bearbrick, Kaws, Medicom, Blythe dolls. More curated than mall stores. Staff are genuine collectors.",
    tip: "Bearbrick 400%: ฿4,000–8,000 depending on collab. Kaws companions and Beanies often cheaper here than buying in Japan. Ask about upcoming drops.",
  },
  {
    name: "Chatuchak Weekend Market (Section 2-3)",
    emoji: "🏺",
    area: "Chatuchak, Mo Chit BTS",
    price: "Vintage toys ฿100–5,000, Art toys ฿300–3,000",
    brand: "Secondhand vintage, imports, independent designers",
    why: "Chatuchak's vintage section has stalls with vintage Japanese toys, action figures, and rare collectibles. Also Bangkok's independent artist toy market — buy direct from Thai creators.",
    tip: "Ask for the 'artist toy section' — small but growing Thai independent art toy community. Vintage Japanese tin toys here can be valuable — research before paying.",
  },
  {
    name: "Siam Center / Siam Square Art Toy Shops",
    emoji: "🎯",
    area: "Siam BTS area",
    price: "Various — ฿300–10,000+",
    brand: "Multiple brands including Lego Designer Sets, Gundam, exclusive collabs",
    why: "Siam Center 3F has Bangkok's best curated designer toy floor. Gunpla (Gundam models) here are authentic and well-priced. Lego Designer Sets sold at face value (harder to find in some markets).",
    tip: "Gundam Perfect Grade models: ฿5,000–15,000 authentic. Fake Gundam is common online — buy from Siam Center stores only. Lego sets 5–10% cheaper than Europe.",
  },
];

export function BangkokArtToys() {
  return (
    <div className="rounded-2xl border border-pink-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-pink-700 mb-3">
        🎁 Bangkok art toys & blind boxes — Labubu, Bearbrick, Pop Mart guide
      </h2>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-pink-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-pink-700 mb-0.5">Brands: {s.brand}</div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-orange-600">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
