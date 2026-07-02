const PLANS = [
  {
    type: "Budget weekend",
    emoji: "💸",
    budget: "฿500–1,200 total",
    sat: ["Morning — Chatuchak market (free entry)", "Lunch — JJ Market food court (฿60–100)", "Afternoon — Lumpini Park walk (free)", "Evening — street food on Sukhumvit Soi 38 (฿100–200)"],
    sun: ["Sunrise — Wat Arun pier crossing (฿4)", "Brunch — Or Tor Kor Market (฿80–120)", "Afternoon — BACC art gallery (free)", "Evening — Asiatique free entry, 1 cocktail (฿150–200)"],
    url: "/activities/budget",
  },
  {
    type: "Culture weekend",
    emoji: "🏛️",
    budget: "฿800–2,000 total",
    sat: ["Grand Palace + Wat Pho (฿500 + ฿200)", "Thai massage — Wat Pho school (฿420)", "Dinner — boat noodles Tha Tien (฿80–120)", "Evening — Khao San Road bar (฿150)"],
    sun: ["Jim Thompson House tour (฿200)", "Lunch — Chinatown dim sum (฿120–200)", "MOCA or Bangkok Art Museum (฿180)", "Dinner — Ananta by the river (฿400–600)"],
    url: "/guide",
  },
  {
    type: "Foodie weekend",
    emoji: "🍜",
    budget: "฿2,000–4,000 total",
    sat: ["Breakfast — Khao Tom Pla @ Chinatown (฿80)", "Cooking class + market tour (฿1,400)", "Afternoon break + hotel spa (฿420)", "Dinner — Nahm or Paste (฿1,500–2,000)"],
    sun: ["Brunch — Roast Coffee & Eatery (฿250–450)", "Street tour Phra Nakhon (฿100–200)", "Afternoon — Bo.lan food lab (฿400)", "Sunset dinner Silom (฿600–1,000)"],
    url: "/activities/cooking",
  },
];

export function WeekendPlan() {
  const seed = Math.floor(Date.now() / 86400000/ 7);
  const plan = PLANS[seed % PLANS.length];

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        📅 Weekend plan pick — {plan.emoji} {plan.type}
      </div>
      <div className="flex items-center justify-between mb-3">
        <div className="font-bold text-sm">{plan.type}</div>
        <span className="text-xs font-mono text-green-700 bg-green-100 px-2 py-0.5 rounded font-bold">{plan.budget}</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="text-xs font-black text-[var(--muted)] uppercase tracking-widest mb-1.5">Saturday</div>
          <ul className="space-y-1">
            {plan.sat.map((item, i) => (
              <li key={i} className="text-[11px] text-[var(--fg)] leading-snug flex gap-1.5">
                <span className="text-[var(--muted)] shrink-0">·</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-xs font-black text-[var(--muted)] uppercase tracking-widest mb-1.5">Sunday</div>
          <ul className="space-y-1">
            {plan.sun.map((item, i) => (
              <li key={i} className="text-[11px] text-[var(--fg)] leading-snug flex gap-1.5">
                <span className="text-[var(--muted)] shrink-0">·</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <a
        href={plan.url}
        className="mt-3 block text-center text-xs font-bold text-orange-600 border border-orange-200 bg-orange-50 rounded-full py-1.5 hover:bg-orange-100 transition"
      >
        Explore more weekend ideas →
      </a>
    </div>
  );
}
