const IDEAS = [
  {
    title: "Tasting Menu at Sühring",
    emoji: "⭐",
    price: "฿4,500–6,000/person",
    where: "Sühring — Sukhumvit 52, Michelin 2★",
    why: "Bangkok's finest German tasting menu in a stunning townhouse. Brothers Thomas and Mathias Sühring cook extraordinary cuisine. Seasonal menu changes monthly. Wine pairing available.",
    tip: "Book 1–2 months ahead. Request the garden room for the most romantic setting. Tasting menu is 12–15 courses — plan 4 hours for the full experience.",
    budget: "Splurge",
  },
  {
    title: "Private Longtail Boat + Dinner on the River",
    emoji: "🚤",
    price: "Boat ฿1,500–2,500, Dinner ฿1,500–3,000/person",
    where: "Charter from Tha Chang pier",
    why: "Rent a private long-tail boat at sunset — just the two of you. Float past Wat Arun and Grand Palace as the lights come on. Follow with riverside dinner at The Deck (Arun Residence) or The Peninsula's riverside terrace.",
    tip: "Sunset cruise 5–6:30pm hits the golden hour perfectly. Negotiate round-trip with waiting time — expect 2 hours total charter. Combine with Wat Arun entry before boarding.",
    budget: "Mid-range",
  },
  {
    title: "Capella Bangkok Spa Retreat",
    emoji: "🏩",
    price: "Couple's package ฿8,000–15,000 (includes stay or spa half-day)",
    where: "Capella Bangkok — Charoenkrung riverfront",
    why: "Bangkok's best luxury hotel opened 2020. Stunning riverfront pool, exceptional spa, private pool villas. For an anniversary that needs to be truly unforgettable.",
    tip: "Book the River Suite if doing full stay. Day spa package for non-guests starts at ฿8,000/couple and includes access to pools and facilities.",
    budget: "Luxury splurge",
  },
  {
    title: "Thai Cooking Class for Two",
    emoji: "🍜",
    price: "฿2,000–3,000/couple",
    where: "Silom Thai Cooking School or Blue Elephant Cooking School",
    why: "Learn to cook each other's favorite Thai dishes together. Intimate activity, memorable shared experience. You leave with recipes and skills to recreate at home.",
    tip: "Blue Elephant is in a restored colonial mansion — more atmospheric and romantic. Book the evening session and eat your cooked dinner by candlelight.",
    budget: "Mid-range",
  },
];

export function BangkokAnniversary() {
  return (
    <div className="rounded-2xl border border-pink-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-pink-700 mb-3">
        💕 Bangkok anniversary celebrations — from mid-range to luxury
      </h2>
      <div className="space-y-2">
        {IDEAS.map((idea) => (
          <div key={idea.title} className="border border-pink-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{idea.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{idea.title}</div>
                <div className="text-[10px] text-[var(--muted)]">{idea.where} · {idea.budget}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{idea.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{idea.why}</div>
            <div className="text-[10px] text-pink-700">💡 {idea.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
