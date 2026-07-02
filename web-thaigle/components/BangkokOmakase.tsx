const RESTAURANTS = [
  {
    name: "Sushi Zo Bangkok",
    emoji: "⭐",
    stars: "LA original — Michelin recommended",
    area: "Phrom Phong area",
    price: "Omakase from ฿4,500 (lunch) / ฿7,500+ (dinner)",
    seats: "8-seat counter only",
    why: "Pure Edomae sushi, 15–20 courses. Fish from Tsukiji and local Thai waters. Minimalist — no elaborate garnishes. The purist's choice in Bangkok. Counter experience where chef explains each piece.",
    tip: "Book 3+ weeks ahead via phone or email. No substitutions — trust the chef ('omakase' = I leave it to you). Don't wear heavy perfume — disrupts tasting experience. Business casual.",
  },
  {
    name: "Jin by Chef Tammy",
    emoji: "🏆",
    stars: "Bangkok's most awarded omakase",
    area: "Sukhumvit 61",
    price: "Omakase ฿5,500–9,000 per person",
    seats: "12-seat counter",
    why: "Chef Tammy (Instagram-famous Bangkok chef) combines traditional Edomae technique with Thai seasonal ingredients. Creative omakase that's also approachable. First Thai omakase chef to receive international recognition.",
    tip: "Chef's table experience — conversation with chef is part of the experience. Photography allowed. Menu changes seasonally with Thai harvest. Book via DM on Instagram 2 weeks ahead.",
  },
  {
    name: "Sushi Masato",
    emoji: "🗾",
    stars: "Japanese chef-owned Bangkok institution",
    area: "Ekkamai area",
    price: "Lunch omakase from ฿3,200 / Dinner from ฿5,800",
    seats: "10-seat counter",
    why: "Chef Masato trained in Tokyo for 8 years before opening this Bangkok institution. Best value omakase at this quality level. Very traditional — no garnishes or Thai fusion. Pure sushi mastery.",
    tip: "Lunch omakase (฿3,200) is remarkable value for 12-course Edomae. Fish flown weekly from Japan. Wednesday fresh fish delivery = Thursday lunch best day to visit. Cash only.",
  },
];

const ETIQUETTE = [
  "Eat each piece immediately — sushi waits for no one",
  "Nigiri: pick up with fingers or chopsticks (either is correct)",
  "Dip fish side only in soy sauce — never the rice",
  "Don't mix wasabi into soy sauce — chef applies wasabi inside each piece",
  "Ginger (gari) is a palate cleanser between different fish — not a topping",
  "Thank the chef after each course — 'itadakimasu' before, 'gochisousama' after",
];

export function BangkokOmakase() {
  return (
    <div className="rounded-2xl border border-indigo-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-indigo-700 mb-3">
        🍣 Omakase sushi in Bangkok — Bangkok's best Japanese counter dining
      </div>
      <div className="space-y-2 mb-3">
        {RESTAURANTS.map((r) => (
          <div key={r.name} className="border border-indigo-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{r.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{r.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{r.stars} · {r.seats} · {r.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{r.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{r.why}</div>
            <div className="text-[10px] text-indigo-700">💡 {r.tip}</div>
          </div>
        ))}
      </div>
      <details className="border border-indigo-100 rounded-xl overflow-hidden">
        <summary className="px-3 py-2 cursor-pointer text-[10px] font-bold text-indigo-700 hover:bg-indigo-50">
          Omakase counter etiquette
        </summary>
        <ul className="px-3 pb-3 pt-1 space-y-0.5">
          {ETIQUETTE.map((e) => (
            <li key={e} className="text-[10px] text-[var(--fg)] flex items-start gap-1.5">
              <span className="text-indigo-400 shrink-0">•</span>{e}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
