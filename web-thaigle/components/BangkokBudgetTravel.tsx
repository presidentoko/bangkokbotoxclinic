const CATEGORIES = [
  {
    title: "Accommodation: under ฿500/night",
    emoji: "🛏️",
    picks: [
      "Lub d Bangkok (Siam) — dorm ฿350–450, private ฿800–1,200. Best hostel in Bangkok.",
      "HQ Hostel (Silom) — dorm ฿250–350, clean and social",
      "Nantra de Comfort (Siam) — budget hotel ฿700–1,000/night private room with AC",
      "Airbnb: Bearing area private rooms ฿400–700/night for 1-month stays",
    ],
    tip: "Khao San Road hostels: ฿200–350 dorm but noisy. Off-Khao San (Banglamphu area) quieter for same price.",
  },
  {
    title: "Food: eat well under ฿200/day",
    emoji: "🍜",
    picks: [
      "7-Eleven: Pad Thai cup ฿25, Som Tum ready-meal ฿35 — convenience store meals are decent",
      "Local market (talat) near any BTS: rice plates ฿30–50, noodles ฿30–60",
      "Mo Chit food court (near Chatuchak): best budget Thai variety ฿35–80/dish",
      "Grab app: delivery during lunch specials = 40% off standard restaurant prices",
    ],
    tip: "Skip tourist restaurants (Khao San, Siam tourist spots). Walk 2 minutes off tourist streets and prices halve.",
  },
  {
    title: "Transport: get around for ฿30–80/trip",
    emoji: "🚇",
    picks: [
      "MRT/BTS: ฿16–45 per trip (one-day pass ฿140). Covers most tourist areas.",
      "Chao Phraya Express Boat: ฿15–33 — more scenic than BTS, covers riverside areas",
      "Songthaew (fixed-route minibus): ฿10–15 on some routes — ask locals",
      "Grab motorbike: ฿40–80 for short trips inside Sukhumvit — fastest in traffic",
    ],
    tip: "Taxis are cheap — ฿60–150 for most Sukhumvit trips. Always insist on meter ('pid meter'). Walking + MRT + occasional Grab covers 90% of Bangkok travel needs.",
  },
  {
    title: "Activities: free or under ฿100",
    emoji: "🎭",
    picks: [
      "BACC contemporary art museum: FREE entry",
      "Lumpini Park: FREE — morning tai chi, paddle boats ฿40",
      "Chatuchak Weekend Market: FREE entry, pay only what you buy",
      "Temple hopping in Rattanakosin: ฿20–50 per temple",
      "Bang Krachao bicycle ride: ฿80 ferry + ฿100 bike rental = best ฿180 in Bangkok",
    ],
    tip: "Bangkok's free activity list is long: Lumphini Park, all major temples exterior viewing, Chinatown walk, river boat ride (express boat not tourist cruise).",
  },
];

export function BangkokBudgetTravel() {
  return (
    <div className="rounded-2xl border border-green-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-green-700 mb-3">
        💰 Bangkok on a budget — how to do it properly (not rough)
      </h2>
      <div className="space-y-2">
        {CATEGORIES.map((c) => (
          <details key={c.title} className="border border-green-100 rounded-xl overflow-hidden group">
            <summary className="px-3 py-2.5 cursor-pointer flex items-center gap-2 hover:bg-green-50 transition">
              <span className="text-2xl shrink-0">{c.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{c.title}</div>
              </div>
            </summary>
            <div className="px-3 pb-3 border-t border-green-100 pt-2 space-y-1.5">
              <ul className="space-y-0.5">
                {c.picks.map((p) => (
                  <li key={p} className="text-[10px] text-[var(--fg)] flex items-start gap-1.5">
                    <span className="text-green-500 shrink-0">•</span>{p}
                  </li>
                ))}
              </ul>
              <div className="text-[10px] text-orange-600">💡 {c.tip}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
