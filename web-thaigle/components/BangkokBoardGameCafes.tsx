const CAFES = [
  {
    name: "Boardgame Café Bangkok (Ari)",
    emoji: "🎲",
    area: "Ari BTS area",
    price: "฿120/person for unlimited play (weekday), ฿150 (weekend). Drinks separate.",
    games: "500+ games: Catan, Ticket to Ride, Wingspan, Exploding Kittens, Dixit, Thai and English games",
    why: "Bangkok's most popular board game café. Friendly staff who recommend games for your group size. Great mix of Thai and international games. English instructions available for most.",
    tip: "Weekday afternoons very quiet — perfect for learning new games with help from staff. Weekend evenings can fill up — call ahead. 4-person groups work best.",
  },
  {
    name: "The Battle Café (Thong Lo)",
    emoji: "⚔️",
    area: "Thong Lo BTS area, Sukhumvit 55",
    price: "฿150–200/person + drinks",
    games: "Focus on strategy games: Chess, Go, Puerto Rico, complex Euro games",
    why: "Bangkok's best café for serious board gamers. Heavy strategy games and regular tournaments. Regular Board Game Night events. Not for casual players — great for enthusiasts.",
    tip: "Monday evening chess nights open to drop-ins. Regular Dungeons & Dragons one-shot sessions on Saturdays — check their Facebook for schedule.",
  },
  {
    name: "Café Gamers (Multiple Locations)",
    emoji: "🎮",
    area: "Silom area + Ekkamai",
    price: "฿100/2hours per person + minimum order ฿100",
    games: "Mix of board games + video games (Switch, PS5, retro consoles)",
    why: "Bangkok's most mixed-format gaming café. Board games + console gaming in the same space. Good for groups with mixed interests. Great for party games.",
    tip: "Nintendo Switch with Mario Kart available for group tournaments. The MarioKart 8 tournaments are wildly popular on Fridays.",
  },
];

const POPULAR = [
  "Catan (Settlers) — 4 players, 90 min — Bangkok's most-requested game",
  "Codenames — 4–8 players, 30 min — perfect for larger groups",
  "Dixit — 3–6 players, 45 min — artistic, easy to learn",
  "Pandemic (Cooperative) — 2–4 players, 90 min — team vs game",
  "Ticket to Ride — 2–5 players, 60 min — easy for beginners",
  "Secret Hitler — 5–10 players, 45 min — very popular in Bangkok cafés",
];

export function BangkokBoardGameCafes() {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-emerald-700 mb-3">
        🎲 Bangkok board game cafés — where to play & what to expect
      </div>
      <div className="space-y-2 mb-3">
        {CAFES.map((c) => (
          <div key={c.name} className="border border-emerald-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{c.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{c.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{c.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{c.price}</span>
            </div>
            <div className="text-[10px] text-emerald-700 mb-0.5">🎯 Games: {c.games}</div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{c.why}</div>
            <div className="text-[10px] text-orange-600">💡 {c.tip}</div>
          </div>
        ))}
      </div>
      <div className="border border-emerald-100 rounded-xl p-3">
        <div className="text-[10px] font-bold text-emerald-700 mb-1.5">Bangkok's most popular games to request:</div>
        <ul className="space-y-0.5">
          {POPULAR.map((g) => (
            <li key={g} className="text-[10px] text-[var(--fg)] flex items-start gap-1.5">
              <span className="text-emerald-400 shrink-0">•</span>{g}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
