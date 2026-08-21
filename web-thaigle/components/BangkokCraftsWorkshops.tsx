const WORKSHOPS = [
  {
    name: "Bangkok Indigo (Natural Dyeing Workshop)",
    emoji: "🎨",
    area: "Bang Rak / Charoenkrung area",
    price: "Workshop ฿1,200–2,000 per person",
    duration: "3–4 hours",
    why: "Natural indigo dyeing using traditional Thai-Japanese shibori techniques. Make your own custom scarf, bandana, or fabric piece. Meditative, creative, and you take something unique home. Bangkok's most unique craft experience.",
    tip: "Wear clothes you don't mind staining — indigo is permanent on skin for 2–3 days. Bring your own item to dye (white cotton tote, scarf) or buy theirs. Book 1 week ahead via website or Instagram.",
  },
  {
    name: "Muang Thai Soap & Candle Workshop (Chatuchak)",
    emoji: "🕯️",
    area: "Chatuchak area, also Thonglor",
    price: "฿600–900 per person",
    duration: "2 hours",
    why: "Traditional Thai herbal soap and candle making. Choose Thai botanicals (jasmine, ylang-ylang, lemongrass, kaffir lime). Design and pour your own candle or soap bar. Great couples or friends activity.",
    tip: "Finishing time varies — soft crafts need 1–2 hours to set so you'll wait or receive delivered. Thai flower-shaped soaps make excellent gifts. Morning sessions available at most studios.",
  },
  {
    name: "Baan Dindong (Thai Pottery Village)",
    emoji: "🏺",
    area: "Bang Khen district, Bangkok north",
    price: "Pottery throwing ฿800–1,500",
    duration: "2–3 hours",
    why: "Traditional Thai celadon pottery community. Learn wheel-throwing from local potters whose families have made Thai ceramics for generations. Different from modern pottery studios — raw community feel.",
    tip: "Further from center (40 min by taxi) but worth it for authenticity. Pieces can be fired and shipped home (6–8 week shipping). Saturday is community market day — also sells finished Thai ceramics at good prices.",
  },
  {
    name: "Thai Traditional Mural Painting Class",
    emoji: "🖌️",
    area: "Old City / Rattanakosin area",
    price: "Single session ฿1,500–2,500",
    duration: "3 hours",
    why: "Learn traditional Thai mural painting technique (same style as Grand Palace and Wat Pho). Gold leaf, natural pigments, ancient pattern vocabulary. Culture immersion and artistic skill combined.",
    tip: "Classes at Silpakorn University area or independent ateliers. Thai fine arts teachers lead these — not tourist-industry classes. Bring reference photos of Thai mural art you love. Watercolors vs gold pigment are very different — ask what's included.",
  },
];

export function BangkokCraftsWorkshops() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-amber-700 mb-3">
        🎨 Creative workshops Bangkok — dyeing, pottery, soap & traditional crafts
      </h2>
      <div className="space-y-2">
        {WORKSHOPS.map((w) => (
          <div key={w.name} className="border border-amber-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{w.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{w.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{w.duration} · {w.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{w.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{w.why}</div>
            <div className="text-[10px] text-amber-700">💡 {w.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
