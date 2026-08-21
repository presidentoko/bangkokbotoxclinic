const COURSES = [
  {
    name: "Thai Country Club",
    emoji: "⛳",
    area: "Bang Na / Sukhumvit Soi 77 (30 min by Grab)",
    green: "฿2,500–4,000 (weekday) / ฿3,500–5,500 (weekend)",
    holes: "18 holes, par 72",
    why: "Bangkok's most prestigious golf club. Hosted Asian Tour events. Excellent course condition year-round. Caddie included in fee.",
    tip: "Morning tee times book out fast — reserve 1 week ahead. Caddie fee (฿400–600) is separate.",
  },
  {
    name: "Vintage Club",
    emoji: "🌿",
    area: "Samut Prakan (45 min from central Bangkok)",
    green: "฿1,800–2,800 (weekday) / ฿2,500–3,500 (weekend)",
    holes: "27 holes, multiple nines",
    why: "Most scenic course near Bangkok. Lake holes with mountain backdrop (painted scenery but effective). Popular with Japanese and Korean expats.",
    tip: "27 holes means multiple course combinations. Ask for 'Championship Nine' for the best layout.",
  },
  {
    name: "Panya Indra Golf Club",
    emoji: "🏌️",
    area: "Lat Phrao / Ramintra (40 min by Grab)",
    green: "฿1,500–2,500",
    holes: "18 holes",
    why: "Best value course near central Bangkok. Well-maintained. Very accessible location. Popular with Bangkok residents for weekend rounds.",
    tip: "Adjacent driving range (฿80/100 balls) good for warm-up or if you just want to hit balls.",
  },
  {
    name: "Driving Range (Hua Mak)",
    emoji: "🎯",
    area: "Hua Mak BTS (E12)",
    green: "฿80–150/basket of balls",
    holes: "Driving range only (3-tier)",
    why: "Bangkok's most accessible driving range. On BTS Sukhumvit line. Great if you don't have 5 hours for a full round. 100m–250m range.",
    tip: "Evening sessions (6–10pm) cooler and well-lit. Club rental ฿100. Free car parking.",
  },
];

export function BangkokGolfCourses() {
  return (
    <div className="rounded-2xl border border-green-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-green-700 mb-3">
        ⛳ Golf in Bangkok — courses & ranges near the city
      </h2>
      <div className="space-y-2">
        {COURSES.map((c) => (
          <div key={c.name} className="border border-green-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{c.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{c.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{c.holes} · {c.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{c.green}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{c.why}</div>
            <div className="text-[10px] text-orange-600">💡 {c.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
