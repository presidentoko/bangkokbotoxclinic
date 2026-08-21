const PICKS = [
  {
    name: "Sühring",
    emoji: "⭐",
    type: "German-Italian (two Michelin stars)",
    area: "Sukhumvit Soi 53",
    price: "Tasting menu ฿5,500–9,000/person",
    why: "Twin brothers Stefan and Thomas Sühring — German chefs cooking Italian with hyper-seasonal Thai ingredients. Pasta is house-made daily. One of Bangkok's most technically impressive kitchens.",
    tip: "Book 3–4 weeks ahead online. Lunch tasting menus available from ฿3,500. Wine pairing adds ฿3,000–5,000.",
  },
  {
    name: "Brix Wine Bar & Restaurant",
    emoji: "🍷",
    type: "Italian wine bar with natural wines",
    area: "Ploenchit area",
    price: "Pasta ฿320–580, mains ฿580–1,200",
    why: "Tiny wine bar with rotating Italian pasta menu. Natural wine list curated by sommelier. Atmosphere is serious but not stuffy. Black truffle pasta a standout.",
    tip: "Walk-in only — no reservations. Opens 6pm. Best to arrive when they open or by 7pm. Tuesday–Sunday.",
  },
  {
    name: "La Scala (Sukhothai Hotel)",
    emoji: "🏨",
    type: "Classic fine-dining Italian",
    area: "South Sathorn Road",
    price: "Pasta ฿850–1,400, mains ฿1,500–3,500",
    why: "Bangkok's most consistent high-end Italian for 20+ years. Tableside service, proper risotto, hand-made pasta. Business lunch favorite of Bangkok's Italian expat community.",
    tip: "Lunch set menu ฿890–1,200 for 2 courses + coffee = excellent value vs à la carte. Business casual or smarter dress expected.",
  },
  {
    name: "Trattoria Da Giuseppe",
    emoji: "🍝",
    type: "Family-run neighbourhood Italian",
    area: "Sukhumvit Soi 49",
    price: "Pasta ฿290–550",
    why: "Genuine Italian-run trattoria loved by Bangkok's Italian community. Nothing fancy — just proper pasta, good Chianti, and Italian conversation at neighboring tables.",
    tip: "Carbonara, amatriciana made properly (no cream). Ask for specials — Giuseppe brings ingredients from Italy. Sunday lunch especially popular.",
  },
];

export function BangkokPastaItalian() {
  return (
    <div className="rounded-2xl border border-orange-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-orange-700 mb-3">
        🍝 Italian food in Bangkok — pasta worth seeking out
      </h2>
      <div className="space-y-2">
        {PICKS.map((p) => (
          <div key={p.name} className="border border-orange-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{p.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{p.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{p.type} · {p.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{p.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{p.why}</div>
            <div className="text-[10px] text-orange-700">💡 {p.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
