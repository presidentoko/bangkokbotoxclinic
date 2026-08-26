const SALONS = [
  {
    name: "Bangkok Hair Club",
    emoji: "✂️",
    area: "Sukhumvit Soi 19 (Asok BTS)",
    price: "Men ฿250–400, Women ฿500–1,500",
    type: "Western-trained stylists, international clientele",
    why: "Bangkok's best-reviewed foreign-friendly hair salon. English-speaking stylists trained in London and Tokyo. Understand non-Thai hair types.",
    best: "Precision cuts, natural hair coloring, curly hair specialists",
    book: "Line @bangkokhairclub. Book 3–5 days ahead for weekend.",
  },
  {
    name: "Toni & Guy Bangkok",
    emoji: "🌟",
    area: "Multiple (EmQuartier, Emporium, Central Embassy)",
    price: "Men ฿600–900, Women ฿1,200–3,000",
    type: "International chain, consistent quality",
    why: "Most reliable quality for international visitors. All stylists trained at Toni & Guy Academy. Consistent results regardless of location.",
    best: "Color services, balayage, Brazilian blow-dry, any complex services",
    book: "toniandguy.com or walk-in. Less busy Mon–Wed.",
  },
  {
    name: "Local Thai Barbershop",
    emoji: "💈",
    area: "Any neighborhood, especially Sukhumvit side streets",
    price: "Men's cut ฿80–150",
    type: "Traditional Thai barber",
    why: "Excellent value for simple cuts. Thai barbers are skilled with clipper work. Often includes head massage. No appointment needed.",
    best: "Short men's cuts, buzz cuts, clipper fades. Not recommended for complex styling.",
    book: "Walk-in. Look for the spinning red-blue-white barber pole.",
  },
  {
    name: "Tiara Beauty Salon",
    emoji: "💫",
    area: "Nana / Sukhumvit 3-4 area",
    price: "Women ฿400–1,200",
    type: "Afro and curly hair specialist",
    why: "Bangkok's most established salon for Afro-textured and curly hair. Products imported specifically. Community-recommended.",
    best: "Braiding, natural hair treatments, locs, protective styles",
    book: "Book 1 week ahead — specialist appointments fill fast.",
  },
];

export function BangkokHairSalon() {
  return (
    <div className="rounded-2xl border border-purple-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-purple-700 mb-3">
        ✂️ Hair salons in Bangkok — cuts, color & specialty services
      </h2>
      <div className="space-y-2">
        {SALONS.map((s) => (
          <div key={s.name} className="border border-purple-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.type} · {s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-orange-600 mb-0.5">⭐ Best for: {s.best}</div>
            <div className="text-[10px] text-purple-700">📱 {s.book}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
