const IDEAS = [
  {
    name: "Private Villa Weekend (Khao Yai / Hua Hin)",
    emoji: "🏡",
    distance: "2–3 hours from Bangkok",
    price: "฿8,000–25,000/night for private villa (6–15 pax)",
    why: "Best format for multi-generational family reunion. Private pool, shared kitchen, big BBQ area. Khao Yai has international-standard villas with mountain views. Everyone can set their own pace without hotel schedules.",
    tip: "Book weekdays — weekend villa prices are 40% higher. Khao Yai villas often come with staff/cook included. Minimum 2-night stays usually required. Airbnb and local Thai villa booking sites both have options.",
    who: "Large families, 6–15 adults + kids",
  },
  {
    name: "Thai Cooking Class (Whole Family)",
    emoji: "👨‍🍳",
    distance: "Bangkok (Old Town area)",
    price: "฿1,200–2,000 per person",
    why: "Universal activity everyone can join regardless of age. Children 8+ can participate. Teaching kitchen setting eliminates the 'where to go' conversation. You cook Thai classics then eat what you made together.",
    tip: "Baipai Thai Cooking School and Silom Thai Cooking School both accept families. Book the 'family' session specifically — they use child-safe equipment and simpler techniques for mixed age groups. Morning class leaves afternoon free.",
    who: "Mixed-age families, 4–15 people",
  },
  {
    name: "Grand Palace + Wat Pho Day + Family Lunch",
    emoji: "🛕",
    distance: "Rattanakosin Island — Old Bangkok",
    price: "฿600/person entrance + ฿800 lunch",
    why: "Culturally rich day out that satisfies everyone — history for adults, spectacle for kids. Grand Palace genuinely impresses all ages. Follow with Wat Pho's giant reclining Buddha. Lunch at nearby local restaurants.",
    tip: "Start 8:30am (cooler + fewer crowds). Dress code enforced (no bare shoulders/shorts). Buy long pants/sarongs at entrance for ฿100 if needed. After Grand Palace, take the Chao Phraya Express Boat to Central Pier — scenic and cheap.",
    who: "Multi-generational, 2–20 people",
  },
  {
    name: "Family Buffet Brunch + Pool Hotel Day",
    emoji: "🍽️",
    distance: "Bangkok city (any luxury hotel)",
    price: "฿1,500–3,000 per person",
    why: "Relaxed and crowd-pleasing — buffet brunch removes picky-eater debates. Followed by pool access at the same hotel. Royal Orchid Sheraton and Avani Riverside both offer brunch-pool packages. Grandparents appreciate the comfort.",
    tip: "Book weekend brunch packages that include pool access (usually ฿1,800/person range). Bangkok's best family brunches: Marriott Marquis rooftop, Sofitel So pool brunch. Call ahead to confirm kid prices — under 12 often 50% off.",
    who: "All ages, relaxed pace",
  },
];

export function BangkokFamilyReunion() {
  return (
    <div className="rounded-2xl border border-orange-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-orange-700 mb-3">
        👨‍👩‍👧‍👦 Family reunion Bangkok — activities that work for every generation
      </h2>
      <div className="space-y-2">
        {IDEAS.map((i) => (
          <div key={i.name} className="border border-orange-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{i.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{i.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{i.who} · {i.distance}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{i.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{i.why}</div>
            <div className="text-[10px] text-orange-700">💡 {i.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
