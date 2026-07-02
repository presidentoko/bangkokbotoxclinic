const IDEAS = [
  {
    type: "Night Kickoff",
    emoji: "🌃",
    options: ["Octave Bar (Marriott) — skybar with 360° views for drinks and photos", "Soi 11 bar hop (Levels, Wicked, Insanity all walkable)", "Khao San Road pub crawl — cheap and chaotic in the best way"],
    price: "฿800–2,000/person",
    tip: "Book table at Octave 2 weeks ahead for weekends. Arrive Soi 11 at 10pm — clubs fill by 11pm.",
  },
  {
    type: "Go-Kart + Day Activity",
    emoji: "🏎️",
    options: ["EasyKart Bang Na — adult go-karts (฿400–650/session)", "Flight Experience Bangkok — simulator flights (฿2,500+)", "Laser tag + bowling at Central Bangna or EmQuartier"],
    price: "฿400–2,500/person",
    tip: "EasyKart Bang Na is 20min by Grab (฿100–150). Book via their website for group rates (6+ get discount).",
  },
  {
    type: "Thai Boxing Experience",
    emoji: "🥊",
    options: ["Rajadamnern Stadium live Muay Thai evening (฿1,000–3,000 ringside)", "Muay Thai lesson for group (฿600–900/person per session)", "Fight Club session with trainer sparring"],
    price: "฿600–3,000/person",
    tip: "Stadium fights: Tuesday, Friday, Saturday evenings. Ringside seats worth the premium — close enough to feel the impact. Book group lessons via Airbnb Experiences.",
  },
  {
    type: "Luxury Spa Pregame",
    emoji: "💆",
    options: ["Health Land group booking (private room available for 6-8)", "Let's Relax (multiple locations) — 2-hour Thai massage ฿900", "COMO Shambhala or Anantara Spa for premium treatment"],
    price: "฿900–3,500/person",
    tip: "Book Health Land group room 1 week ahead. A 2-hour spa session before night out = better stamina. Not what you'd expect as a bachelor party activity — but uniquely Bangkok.",
  },
];

export function BangkokBachelorParty() {
  return (
    <div className="rounded-2xl border border-purple-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-purple-700 mb-3">
        🎉 Bangkok bachelor / bachelorette party ideas
      </div>
      <div className="space-y-2">
        {IDEAS.map((idea) => (
          <details key={idea.type} className="border border-purple-100 rounded-xl overflow-hidden group">
            <summary className="px-3 py-2.5 cursor-pointer flex items-center gap-2 hover:bg-purple-50 transition">
              <span className="text-2xl shrink-0">{idea.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{idea.type}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{idea.price}</span>
            </summary>
            <div className="px-3 pb-3 border-t border-purple-100 pt-2 space-y-1.5">
              <ul className="space-y-0.5">
                {idea.options.map((o) => (
                  <li key={o} className="text-[10px] text-[var(--fg)] flex items-start gap-1.5">
                    <span className="text-purple-400 shrink-0">•</span>{o}
                  </li>
                ))}
              </ul>
              <div className="text-[10px] text-orange-600">💡 {idea.tip}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
