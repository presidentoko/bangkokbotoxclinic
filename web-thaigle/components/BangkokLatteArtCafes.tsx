const CAFES = [
  {
    name: "Roots Coffee Roasters",
    emoji: "☕",
    area: "The Commons (Thong Lo) + multiple Bangkok locations",
    price: "Espresso drinks ฿90–140, Pour-over ฿120–180",
    specialty: "Single-origin Thai beans, filter coffee, minimal aesthetic",
    why: "Bangkok's most respected specialty coffee roaster. Thai coffee from Chiang Mai highlands. Known for extremely precise brewing and quality sourcing. Favorite of Bangkok coffee enthusiasts.",
    latte: "Beautiful minimalist latte art — rosetta and tulip only. No novelty art — their policy: quality over Instagram.",
    tip: "Try the Thai Natural process pour-over — berry-forward and unlike any mass-market coffee. Their Origin Blend is the house espresso base and consistently excellent.",
  },
  {
    name: "Ceresia Coffee Roasters",
    emoji: "🌿",
    area: "Siam Square and Ari BTS",
    price: "Drinks ฿80–160",
    specialty: "Latte art competitions, training roastery",
    why: "Thailand's most award-winning barista culture. The café where Bangkok's barista competition circuit practice. Intricate, competition-level latte art on every cup.",
    latte: "3D latte art and signature swan/peacock designs. Training sessions available for enthusiasts who want to learn.",
    tip: "Thursday evenings: open barista practice sessions you can watch and sometimes participate in. Best latte art in Bangkok guaranteed.",
  },
  {
    name: "Brave Roasters",
    emoji: "💪",
    area: "Ekkamai BTS area",
    price: "Drinks ฿80–140",
    specialty: "Experimental flavors, Thai-infused coffee drinks",
    why: "Bangkok's most experimental coffee shop. Thai flavors in coffee: pandan latte, butterfly pea flat white, lemongrass cold brew. Creative and genuinely delicious.",
    latte: "Thai-style colored lattes — blue butterfly pea, green pandan, orange turmeric. Instagram-worthy but also genuinely tasty.",
    tip: "Seasonal Thai flavor lattes rotate monthly. The Pandan Latte is their most famous — get it iced in Bangkok heat. Opens 7am, busy 8:30–10am with WFH crowd.",
  },
  {
    name: "Casa Lapin",
    emoji: "🐰",
    area: "Multiple: Sukhumvit 26, Nimman Chiang Mai style space in BKK",
    price: "Drinks ฿90–160",
    specialty: "Clean design, consistent specialty coffee for office neighborhoods",
    why: "Bangkok's best specialty coffee chain. Consistent high quality across locations. Clean Nordic-inspired interior. Goes well with work — reliable power outlets and WiFi.",
    latte: "Clean heart and rosetta latte art. Not competition-level but consistently beautiful and appropriate.",
    tip: "Sukhumvit 26 has rooftop seating (first-come). Best for working — reliable WiFi, many power outlets. Open from 7am weekdays.",
  },
];

export function BangkokLatteArtCafes() {
  return (
    <div className="rounded-2xl border border-orange-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-orange-700 mb-3">
        ☕ Bangkok specialty coffee & latte art cafés — top picks
      </h2>
      <div className="space-y-2">
        {CAFES.map((c) => (
          <div key={c.name} className="border border-orange-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{c.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{c.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{c.area} · {c.specialty}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{c.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{c.why}</div>
            <div className="text-[10px] text-orange-700 mb-0.5">🎨 Art: {c.latte}</div>
            <div className="text-[10px] text-blue-700">💡 {c.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
