const IDEAS = [
  {
    title: "Full-Day Spa & Wellness Package",
    emoji: "🌸",
    price: "฿2,000–5,000/person",
    why: "Bangkok has world-class spas at prices unthinkable at home. Group spa packages available with private room, multiple treatments.",
    best: "Divana Virtue (whole spa rental for groups ฿8,000–15,000), Oasis Spa (mid-range group packages), Health Land (budget but great).",
    tip: "Pre-book 1–2 weeks for groups of 4+. Most spas offer group discounts for 4+ people. Include Thai massage, body scrub, and facial.",
  },
  {
    title: "Thai Cooking Class + Market Tour",
    emoji: "🍳",
    price: "฿1,500–2,500/person",
    why: "Half-day cooking class starting with a fresh market visit. Learn 4–5 dishes. Takes home recipe cards. Most fun as a group activity.",
    best: "Silom Thai Cooking School (central location, very good), BaanThai Cooking School (traditional house setting), Siam@Siam Market Tour.",
    tip: "Book the morning class (7:30am) — includes the market visit. Take the Grab with whole group — cheaper than taxis separately.",
  },
  {
    title: "Platinum Mall Fashion Haul",
    emoji: "👗",
    price: "Budget ฿2,000–10,000/person (shopping)",
    why: "Bangkok's wholesale fashion center. 6 floors of affordable Thai fashion. Perfect group shopping experience with fitting rooms and café breaks.",
    best: "Arrive 9am (before tour groups). Top 3 floors for fashion, level 2–3 for accessories. Bring cash — many vendors cash-only.",
    tip: "Budget 3–4 hours. Group bargaining gets slightly better prices. Combine with nearby Pratunam market (5-min walk).",
  },
  {
    title: "Rooftop Bar Sunset Tour",
    emoji: "🌅",
    price: "฿500–1,500/person (drinks)",
    why: "Bangkok's rooftop bar scene is spectacular. Plan a sunset bar crawl across 2–3 venues for group photos against the Bangkok skyline.",
    best: "Start at Octave (Marriott Sukhumvit 57 — most Instagram-friendly, 360°). Move to Abar Rooftop (free entry). End at Sing Sing Theater.",
    tip: "Start at 5pm for sunset photos. Reserve table at Octave via phone for best experience. After midnight the bars convert to clubs.",
  },
];

export function BangkokGirlsTrip() {
  return (
    <div className="rounded-2xl border border-pink-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-pink-700 mb-3">
        👯‍♀️ Bangkok girls trip ideas — spa, shopping & nightlife
      </div>
      <div className="space-y-2">
        {IDEAS.map((idea) => (
          <details key={idea.title} className="border border-pink-100 rounded-xl overflow-hidden group">
            <summary className="px-3 py-2.5 cursor-pointer flex items-center gap-2 hover:bg-pink-50 transition">
              <span className="text-2xl shrink-0">{idea.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{idea.title}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{idea.price}</span>
            </summary>
            <div className="px-3 pb-3 border-t border-pink-100 pt-2 space-y-1">
              <div className="text-[10px] text-[var(--fg)] leading-snug">{idea.why}</div>
              <div className="text-[10px] text-pink-700">⭐ Best: {idea.best}</div>
              <div className="text-[10px] text-orange-600">💡 {idea.tip}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
