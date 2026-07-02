const COURSES = [
  {
    name: "Alpine Golf Resort & Sports Club",
    area: "Pathum Thani, 40 min from Bangkok",
    greens: "฿1,800–2,400 (incl. cart + caddie)",
    par: 72,
    tip: "Bangkok's best-value championship course. Wide fairways. Preferred by expat golfers.",
    holes: 18,
  },
  {
    name: "Nikanti Golf Club",
    area: "Nakhon Pathom, 50 min west",
    greens: "฿2,500–3,500",
    par: 72,
    tip: "Most scenic course near Bangkok. Lotus pond features, excellent clubhouse dining.",
    holes: 18,
  },
  {
    name: "Thana City Golf & Sports Club",
    area: "Bang Na, 30 min (on expressway)",
    greens: "฿1,500–2,200",
    par: 72,
    tip: "Closest championship course to Suvarnabhumi Airport. Perfect for post-flight golf.",
    holes: 18,
  },
  {
    name: "Pinehurst Golf Club",
    area: "Nonthaburi, 35 min north",
    greens: "฿1,600–2,100",
    par: 72,
    tip: "45-hole resort. Ideal for groups wanting to split up. Strong driving range.",
    holes: 45,
  },
];

export function BangkokGolfGuide() {
  return (
    <div className="rounded-2xl border border-green-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-green-700 mb-3">
        ⛳ Golf near Bangkok — top courses
      </div>
      <div className="space-y-2 mb-3">
        {COURSES.map((c) => (
          <div key={c.name} className="border border-green-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1">
              <span className="text-2xl shrink-0">⛳</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{c.name}</div>
                <div className="text-[10px] text-[var(--muted)]">📍 {c.area} · Par {c.par} · {c.holes} holes</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono font-black text-green-700">{c.greens}</span>
            </div>
            <div className="text-[10px] text-orange-600">💡 {c.tip}</div>
          </div>
        ))}
      </div>
      <div className="text-[10px] text-[var(--muted)] bg-green-50 rounded-xl p-2.5">
        All courses include mandatory caddie (tip ฿200–300/round). Cart fee usually included. Book at least 1 day ahead for weekend tee times.
      </div>
    </div>
  );
}
