const DATE_IDEAS = [
  {
    idea: "Rooftop cocktails + river view",
    emoji: "🌆",
    budget: "฿1,500–3,000/couple",
    how: "Start at Octave (Marriott Thong Lo, 45F) at 7pm — free entry, spectacular views. Then move to Sky Bar Lebua (63F) for main drinks (minimum spend ฿1,500/couple).",
    tip: "Dress code: smart casual. No shorts or flip-flops at Sky Bar.",
    bestFor: "First date, impressing someone",
  },
  {
    idea: "Chao Phraya dinner cruise",
    emoji: "🚢",
    budget: "฿2,400–3,600/couple",
    how: "Asiatique Dinner Cruise from Asiatique pier. 2hr river cruise, set menu Thai food, live music. Departs 7:30pm and 9:30pm.",
    tip: "Book in advance at Asiatique or Klook (10% cheaper). Sit on upper deck for breeze.",
    bestFor: "Anniversary, birthday, romantic special occasion",
  },
  {
    idea: "Cooking class for two",
    emoji: "👨‍🍳",
    budget: "฿2,600–5,800/couple",
    how: "Afternoon class (3pm–7pm). You shop at market together, cook 4 dishes together, eat together. Incredibly intimate and fun.",
    tip: "Bangkok Bold Kitchen (Ari) or Blue Elephant (Sathorn) for luxury. Silom Thai for value.",
    bestFor: "Couples who like doing things, not just watching",
  },
  {
    idea: "Jazz bar + fine dining",
    emoji: "🎷",
    budget: "฿3,000–6,000/couple",
    how: "Dinner at Canvas or Mezzaluna (book 2 weeks ahead), then live jazz at Tuba (Ekamai) or Brown Sugar (Srapathum) post-10pm.",
    tip: "Brown Sugar has Bangkok's oldest jazz band — been playing since 1982. No reservation needed.",
    bestFor: "Music lovers, foodie couples",
  },
  {
    idea: "Canal tour at sunset",
    emoji: "🛶",
    budget: "฿1,500–2,500/couple",
    how: "Private long-tail boat from Tha Thien pier (฿1,000–1,500/hr). 1.5hr tour of Thonburi canals, hidden temples, floating markets.",
    tip: "Negotiate at pier — not at tourist touts near Grand Palace. ฿1,200/hr is fair.",
    bestFor: "Adventure couples, unique experience seekers",
  },
];

export function BangkokDateNightGuide() {
  return (
    <div className="rounded-2xl border border-rose-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-rose-700 mb-3">
        💑 Date night in Bangkok — ideas for every budget
      </h2>
      <div className="space-y-2">
        {DATE_IDEAS.map((d) => (
          <details key={d.idea} className="border border-rose-100 rounded-xl group">
            <summary className="px-3 py-2.5 cursor-pointer flex items-center gap-2 text-xs font-bold text-[var(--fg)] hover:text-rose-700 transition">
              <span className="text-lg shrink-0">{d.emoji}</span>
              <span className="flex-1">{d.idea}</span>
              <span className="text-[10px] font-mono text-green-700 shrink-0">{d.budget}</span>
              <span className="text-[var(--muted)] group-open:rotate-180 transition text-sm shrink-0">⌄</span>
            </summary>
            <div className="px-3 pb-3 space-y-1.5">
              <div className="text-[10px]"><span className="font-bold">How:</span> {d.how}</div>
              <div className="text-[10px] text-orange-600">💡 {d.tip}</div>
              <div className="text-[10px] text-rose-700">💕 Best for: {d.bestFor}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
