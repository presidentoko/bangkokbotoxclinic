const IDEAS = [
  {
    category: "Romantic dinners",
    emoji: "🌹",
    spots: [
      { name: "Vertigo Too rooftop", cost: "฿฿฿฿", why: "61st floor, Bangkok skyline, sunset required" },
      { name: "Issaya Siamese Club", cost: "฿฿฿", why: "Restored colonial mansion, garden dining, Thai fine dining" },
      { name: "The Deck (Arun Residence)", cost: "฿฿฿", why: "Facing Wat Arun across the river at night" },
    ],
  },
  {
    category: "Spa for couples",
    emoji: "💆",
    spots: [
      { name: "The Oriental Spa (Mandarin Oriental)", cost: "฿฿฿฿", why: "Bangkok's most legendary spa, riverside location" },
      { name: "The Oasis Spa (Sukhumvit 31)", cost: "฿฿฿", why: "Private 2-person suites, Thai & oil massage packages" },
      { name: "Divana Virtue Spa", cost: "฿฿", why: "Excellent value couples packages, beautiful garden setting" },
    ],
  },
  {
    category: "Experiences to share",
    emoji: "✨",
    spots: [
      { name: "Thai cooking class together", cost: "฿฿", why: "Most cooking schools have couples pricing. You cook + eat together." },
      { name: "Sunset Chao Phraya cruise", cost: "฿฿–฿฿฿", why: "Private cruise or dinner boat, magical city skyline" },
      { name: "Muay Thai class (padwork together)", cost: "฿", why: "Beginner couples pad sessions available — fun, active, unique" },
    ],
  },
];

export function BangkokCoupleTips() {
  return (
    <div className="rounded-2xl border border-pink-200 bg-pink-50 p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-pink-700 mb-3">
        ❤️ Bangkok for couples — romantic ideas
      </h2>
      <div className="space-y-4">
        {IDEAS.map((cat) => (
          <div key={cat.category}>
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-lg">{cat.emoji}</span>
              <span className="font-black text-xs">{cat.category}</span>
            </div>
            <div className="space-y-1.5">
              {cat.spots.map((s) => (
                <div key={s.name} className="bg-white border border-pink-100 rounded-xl p-2.5 flex gap-2.5 items-start">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-xs">{s.name}</h3>
                    <div className="text-[10px] text-[var(--muted)] leading-snug mt-0.5">{s.why}</div>
                  </div>
                  <span className="shrink-0 text-xs text-pink-600 font-mono font-black">{s.cost}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
