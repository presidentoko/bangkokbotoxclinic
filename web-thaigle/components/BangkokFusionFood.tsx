const SPOTS = [
  {
    name: "80/20 Bangkok",
    emoji: "🌟",
    area: "Charoen Krung Soi 26 (heritage building)",
    price: "฿2,500–3,500/person (tasting menu)",
    type: "Modern Thai-Western fusion",
    why: "Michelin 1-star. Chef Itt Pochanakarn uses hyperlocal Thai ingredients in contemporary European-technique dishes. One of Bangkok's most intellectually interesting dining experiences.",
    must: "Tasting menu — order the whole thing. A la carte also available. Strong natural wine list.",
  },
  {
    name: "Sühring",
    emoji: "⭐",
    area: "Yen Akat area (Sathorn)",
    price: "฿4,000–5,500/person (tasting menu)",
    type: "German-Thai fusion · Michelin 2-star",
    why: "Twin brothers Thomas and Mathias Sühring cook German cuisine using Thai ingredients and Thai refinement. Unique, impossible to replicate elsewhere.",
    must: "Full tasting menu. The pretzel course is legendary. Book 4–8 weeks ahead.",
  },
  {
    name: "Paste Bangkok",
    emoji: "🥘",
    area: "Gaysorn Tower (Chit Lom BTS)",
    price: "฿1,200–2,500/person",
    type: "Royal Thai cuisine refined",
    why: "Michelin 1-star. Ancient royal Thai recipes modernized with exceptional technique. More subtle flavor profiles than typical Thai street food.",
    must: "Blue-swimmer crab curry, mieng kham (betel leaf snacks), the dessert flight.",
  },
  {
    name: "Charoenkrung Creative District Street Fusion",
    emoji: "🏛️",
    area: "Charoenkrung Soi 32–42 corridor",
    price: "฿200–600/person",
    type: "Cafe-fusion, local chef creative",
    why: "Bangkok's creative dining neighborhood. Independent chefs, fusion cafes, natural wine bars, small-batch craft everything. The area to discover the new Bangkok food scene.",
    must: "Walk the area — explore. No single spot but many excellent discoveries.",
  },
];

export function BangkokFusionFood() {
  return (
    <div className="rounded-2xl border border-violet-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-violet-700 mb-3">
        🍽️ Bangkok fusion dining — where Thai meets the world
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-violet-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.type} · {s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-orange-600">⭐ {s.must}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
