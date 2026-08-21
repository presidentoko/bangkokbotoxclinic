const IDEAS = [
  {
    title: "Michelin-Star Dinner",
    emoji: "⭐",
    venues: "Sühring, Le Normandie, Gaggan Anand, 80/20, Nusara",
    price: "฿3,000–8,000/person",
    why: "Bangkok has more Michelin-starred restaurants than most cities. A graduation milestone deserves a meal worth remembering.",
    book: "Book 2–6 weeks ahead for weekends. All have online booking. Dress code required at most.",
    tip: "Le Normandie at Mandarin Oriental is the most classic special occasion. Sühring for modern German-Thai fusion experience.",
  },
  {
    title: "Chao Phraya River Dinner Cruise",
    emoji: "🚢",
    venues: "Wonderful Pearl Cruise, White Orchid, Grand Pearl, Meridian",
    price: "฿1,400–2,500/person",
    why: "Dinner on the river with illuminated temples, bridges, and Bangkok skyline. 2–3 hour cruise with live music, international/Thai buffet.",
    book: "Book online at wonderfulpearl.com or via Klook. Pick up/drop off at various piers.",
    tip: "Wonderful Pearl is the best value. Grand Pearl for more upscale feel. Saturday/Sunday has higher demand — book early.",
  },
  {
    title: "Luxury Spa Day (Half-Day Package)",
    emoji: "🌸",
    venues: "Anantara Riverside, Mandarin Oriental Spa, COMO Shambhala, Four Seasons",
    price: "฿3,500–8,000/half-day (includes multiple treatments)",
    why: "Half-day package with massage, facial, hydrotherapy, and healthy lunch. Perfect graduation celebration, particularly for mothers + daughters or friend groups.",
    book: "Direct booking via hotel spa websites. Call 1 week ahead for group bookings.",
    tip: "Anantara Riverside's Bodhi Spa is the best value among 5-star options. Often runs seasonal promotions.",
  },
  {
    title: "Private Rooftop Bar Celebration",
    emoji: "🎉",
    venues: "Above Eleven, Char (Hotel Indigo), Sky Bar (Lebua) for the views",
    price: "฿500–2,000/person (drinks + private area booking)",
    why: "Some rooftop bars allow private area bookings for graduation parties. Bangkok skyline backdrop for photos, champagne service, celebration cake option.",
    book: "Contact venues directly via email. Often require minimum spend ฿5,000–20,000 for private area.",
    tip: "Sky Bar (State Tower) is the most famous rooftop. Book the private 'Breeze' lounge area for groups of 8–20.",
  },
];

export function BangkokGraduationGuide() {
  return (
    <div className="rounded-2xl border border-purple-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-purple-700 mb-3">
        🎓 Bangkok graduation celebration ideas
      </h2>
      <div className="space-y-2">
        {IDEAS.map((idea) => (
          <details key={idea.title} className="border border-purple-100 rounded-xl overflow-hidden group">
            <summary className="px-3 py-2.5 cursor-pointer flex items-center gap-2 hover:bg-purple-50 transition">
              <span className="text-2xl shrink-0">{idea.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{idea.title}</div>
                <div className="text-[10px] text-[var(--muted)]">{idea.venues}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{idea.price}</span>
            </summary>
            <div className="px-3 pb-3 border-t border-purple-100 pt-2 space-y-1">
              <div className="text-[10px] text-[var(--fg)] leading-snug">{idea.why}</div>
              <div className="text-[10px] text-purple-700">📅 Book: {idea.book}</div>
              <div className="text-[10px] text-orange-600">💡 {idea.tip}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
