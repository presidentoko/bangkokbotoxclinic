const IDEAS = [
  {
    title: "Private River Dinner Cruise",
    emoji: "🚢",
    price: "From ฿2,500–6,000/person",
    where: "Chao Phraya River departures from Asiatique or Tha Maharaj pier",
    why: "The most memorable Bangkok celebration setting. 3-course Thai dinner with live music while watching the river temples light up. White tablecloth service.",
    tip: "Manohra Cruises (Golden Swan) is the most elegant. Horizon Dinner Cruise is good value. Book at least 1 week ahead for private tables.",
  },
  {
    title: "Mandarin Oriental Sunday Brunch",
    emoji: "🌹",
    price: "฿3,800/person including free-flow wine",
    where: "Mandarin Oriental Bangkok — Tha Oriental pier (shuttle available)",
    why: "Bangkok's most iconic hotel brunch. 5-star buffet with champagne included. River terrace seating. Perfect for marking a big life moment with elegance.",
    tip: "Reserve 2–3 weeks ahead. Smart casual dress code. Free-flow Moët included in premium package. Budget for a full afternoon — no rush to leave.",
  },
  {
    title: "Luxury Spa Day — CHI Spa at Shangri-La",
    emoji: "💆",
    price: "Half-day package ฿3,500–7,000/person",
    where: "Shangri-La Bangkok Hotel, near Saphan Taksin BTS",
    why: "Bangkok is one of the world's best cities for world-class spa treatment at reasonable prices. CHI Spa, Mandarin Oriental Spa, and Banyan Tree Spa are all award-winning.",
    tip: "Book the 'Journey' package (multi-treatment, 3 hours+). Complimentary use of pools and facilities. Request the traditional Thai herbal compress upgrade.",
  },
  {
    title: "Cooking Class + Dinner for the Group",
    emoji: "👩‍🍳",
    price: "฿2,000–4,000/person for premium cooking class with dinner",
    where: "Silom Thai Cooking School (beginner-friendly, central), Baipai Thai Cooking (intermediate, north Bangkok)",
    why: "Learn to cook 4–5 Thai dishes together with professional instruction, then eat what you cooked. Celebratory activity with learning and dining combined.",
    tip: "Baipai Thai Cooking School is a peaceful suburban house with garden setting — perfect for special occasions. Must book 1 week ahead. Private group booking available.",
  },
];

export function BangkokRetirementCelebration() {
  return (
    <div className="rounded-2xl border border-rose-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-rose-700 mb-3">
        🎊 Bangkok retirement & milestone celebration ideas
      </div>
      <div className="space-y-2">
        {IDEAS.map((idea) => (
          <div key={idea.title} className="border border-rose-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{idea.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{idea.title}</div>
                <div className="text-[10px] text-[var(--muted)]">{idea.where}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{idea.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{idea.why}</div>
            <div className="text-[10px] text-rose-700">💡 {idea.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
