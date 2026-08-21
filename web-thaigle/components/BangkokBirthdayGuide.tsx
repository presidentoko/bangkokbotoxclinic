const IDEAS = [
  {
    title: "Rooftop Birthday Dinner",
    emoji: "🌆",
    budget: "฿3,000–8,000/person",
    where: "Vertigo at Banyan Tree, CHAR at Hotel Muse, Brewski at Radisson Blu",
    how: "Reserve minimum 2 weeks ahead. Request birthday cake pre-ordering. Dress code: smart casual to formal.",
    best: "Vertigo (Banyan Tree) — most dramatic open-air rooftop. CHAR — intimate rooftop with charcoal grill.",
    group: "2–6 people ideal",
  },
  {
    title: "Private Dinner Cruise",
    emoji: "🛳️",
    budget: "฿2,500–6,000/person",
    where: "Chao Phraya Princess, Manohra Cruises, White Orchid River Cruise",
    how: "Book 1 week ahead. Private tables available. Pick up from Asiatique or Maharaj Pier.",
    best: "Manohra Cruises (floating teak rice barge, very romantic) or Chao Phraya Princess (affordable, live band).",
    group: "2–30 people (private charter available)",
  },
  {
    title: "Spa Day Package",
    emoji: "🧖",
    budget: "฿2,000–12,000/person",
    where: "Divana Spa, Chi Spa at Shangri-La, Banyan Tree Spa, Oasis Spa",
    how: "Book full-day packages (4–8 hours). Group spa days available. Birthday add-ons: flower petal bath, champagne, cake.",
    best: "Divana Spa (Sukhumvit 25) — best value luxury spa. Chi at Shangri-La — premium hotel spa experience.",
    group: "2–8 people ideal",
  },
  {
    title: "Private Cooking Class",
    emoji: "👨‍🍳",
    budget: "฿1,500–3,000/person",
    where: "Silom Cooking School, The Local Table, Chef Joe at Amari Hotel",
    how: "Book private class (not group). Starts with fresh market tour. 4–5 dishes + eating everything you cook.",
    best: "Silom Cooking School — most professional. Group-friendly, up to 15 people. Birthday extras available.",
    group: "6–15 people perfect",
  },
  {
    title: "Muay Thai VIP Night",
    emoji: "🥊",
    budget: "฿1,000–4,000/person (VIP ring-side)",
    where: "Rajadamnern Stadium or Lumpini Stadium",
    how: "Ring-side seats at authentic Muay Thai stadium. Reserve VIP section for groups. Thai food + drinks in-stadium.",
    best: "Rajadamnern Stadium (Mon/Wed/Thu/Sun) — most authentic. Group packages include ring-side + dinner.",
    group: "Any size, 4+ for best group energy",
  },
];

export function BangkokBirthdayGuide() {
  return (
    <div className="rounded-2xl border border-pink-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-pink-700 mb-3">
        🎂 Birthday celebrations in Bangkok — ideas by vibe
      </h2>
      <div className="space-y-2">
        {IDEAS.map((idea) => (
          <details key={idea.title} className="border border-pink-100 rounded-xl overflow-hidden group">
            <summary className="px-3 py-2.5 cursor-pointer flex items-center gap-2 hover:bg-pink-50 transition">
              <span className="text-2xl shrink-0">{idea.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{idea.title}</div>
                <div className="text-[10px] text-[var(--muted)]">{idea.group} · {idea.budget}</div>
              </div>
            </summary>
            <div className="px-3 pb-3 border-t border-pink-100 pt-2 space-y-1">
              <div className="text-[10px] text-[var(--muted)]">📍 {idea.where}</div>
              <div className="text-[10px] text-[var(--fg)] leading-snug">📋 {idea.how}</div>
              <div className="text-[10px] text-orange-600">⭐ Best pick: {idea.best}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
