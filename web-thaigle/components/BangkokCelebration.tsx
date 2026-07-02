const IDEAS = [
  {
    title: "Dinner Cruise on the Chao Phraya",
    emoji: "⛵",
    budget: "฿1,800–4,500 per person",
    why: "Celebrate while floating past illuminated temples — Wat Pho, Wat Arun, Grand Palace lit at night from the water. Dinner cruises depart Asiatique, River City, or ICONSIAM piers. Thai and international buffet/set menus, live Thai classical music, open-air deck.",
    tip: "Chaophraya Cruise and Manohra Cruise are the best quality options. Book dedicated deck seating for celebrations (not indoor-only). Thursday and Sunday have more local crowd; Friday–Saturday more tourist groups. Champagne upgrade usually ฿500 extra.",
  },
  {
    title: "Private Chef Dinner at a Rooftop Suite",
    emoji: "🌆",
    budget: "฿8,000–30,000 (depending on hotel and chef)",
    why: "Rent a suite with rooftop terrace or penthouse at Bangkok's luxury hotels. Hire a private chef. Order flowers and decorations through hotel concierge. Completely private, fully personalized celebration. For engagements, anniversaries, or milestone birthdays.",
    tip: "Hotels that facilitate in-room private chef events: The Peninsula, Capella, Mandarin Oriental. Concierge arranges everything — flowers, champagne tower, cake, musicians if desired. Book 2–3 weeks ahead for chef availability. Wedding proposal via private chef dinner has 100% success rate in Bangkok (ambiance is unbeatable).",
  },
  {
    title: "Rooftop Cocktail Party (Hire the Space)",
    emoji: "🥂",
    budget: "฿3,000–25,000 minimum spend depending on venue",
    why: "Bangkok rooftop venues can be hired for private events during off-peak hours (afternoons typically). Many bars offer 'private event' booking for 15–80 guests. Sky Bar at Lebua, Vertigo at Banyan Tree, Above Eleven all do private events.",
    tip: "Minimum spend includes F&B credit — often more affordable than it sounds for groups. DJs available for additional fee. Decorations allowed (check venue). Best for celebrations where 'the view' is the centerpiece. Canapés and cocktails work better than formal dinner at most rooftops.",
  },
  {
    title: "Thai Cultural Experience Party",
    emoji: "🌺",
    budget: "฿3,500–12,000 per person",
    why: "Celebrate with uniquely Thai experiences: a Thai cooking party, traditional dress photoshoot at Grand Palace, blessing ceremony with monk, traditional spa afternoon. These moments become the memory of Bangkok rather than a generic dinner. Especially meaningful for visitors seeing Thailand for the first time.",
    tip: "Thai dress photoshoot near Grand Palace: multiple shops offer rental traditional Thai royal dress (฿600–1,200/hour) and photographers. Traditional massage spa afternoon at Wat Pho (฿500–800/hr) before a celebration dinner creates the perfect Bangkok day arc.",
  },
];

export function BangkokCelebration() {
  return (
    <div className="rounded-2xl border border-rose-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-rose-700 mb-3">
        🥂 Celebrations in Bangkok — unique experiences for special occasions
      </div>
      <div className="space-y-2">
        {IDEAS.map((idea) => (
          <div key={idea.title} className="border border-rose-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{idea.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{idea.title}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{idea.budget}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{idea.why}</div>
            <div className="text-[10px] text-rose-700">💡 {idea.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
