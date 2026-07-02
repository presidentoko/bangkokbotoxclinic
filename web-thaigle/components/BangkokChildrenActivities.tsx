const ACTIVITIES = [
  {
    name: "SEA LIFE Bangkok Ocean World",
    emoji: "🦈",
    area: "Siam Paragon, 2nd floor (Siam BTS)",
    price: "Adult ฿1,050, Child ฿850. Book online for ฿20–50 discount.",
    age: "All ages. Best for 3–12.",
    why: "Bangkok's premier aquarium. 30,000+ sea creatures, shark tank walkthrough tunnel, penguin exhibit, glass-bottom boat ride.",
    tip: "First visit: buy combo ticket online (shark walk add-on). Weekday mornings are least crowded.",
  },
  {
    name: "KidZania Bangkok",
    emoji: "👮",
    area: "Siam Paragon Floor 5 (Siam BTS)",
    price: "Adult ฿350, Child 3–14 ฿850. Book ahead online.",
    age: "4–14 years old ideal",
    why: "Mini-city roleplay attraction where kids work as doctors, pilots, firefighters, TV anchors. Educational and genuinely fun.",
    tip: "Sessions are 2.5 hours. Arrive 30 min early for best activity slot selection. Bring snacks — food inside is overpriced.",
  },
  {
    name: "Safari World Bangkok",
    emoji: "🦒",
    area: "Minburi (30–40 min from central by Grab)",
    price: "Combined ticket: Adult ฿1,000, Child ฿900. Book via klook.com for discount.",
    age: "All ages",
    why: "Drive-through safari (drive own car or take safari bus) with giraffes, zebras, white tigers, rare animals. Marine Park section with dolphin/bird shows.",
    tip: "Grab/taxi from Ekkamai is easiest (฿200–350). Morning drive-through is best for animal activity. Marine Park shows at 11am, 1:30pm, 3:30pm.",
  },
  {
    name: "Elephant World + Ethical Sanctuaries",
    emoji: "🐘",
    area: "Day trip: Kanchanaburi (2.5hr from Bangkok), or Chiang Mai (fly)",
    price: "Half-day ethical sanctuary: ฿1,500–2,500/person",
    age: "3+ years old",
    why: "Ethical elephant experience without riding — observe, feed, and bathe rescued elephants. Significant educational experience for children.",
    tip: "From Bangkok: Elephant World in Kanchanaburi is the closest ethical sanctuary (2.5hr). No riding — the ethical way. Book via elephantworld.org.",
  },
];

export function BangkokChildrenActivities() {
  return (
    <div className="rounded-2xl border border-cyan-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-cyan-700 mb-3">
        👦 Bangkok with kids — top activities for families
      </div>
      <div className="space-y-2">
        {ACTIVITIES.map((a) => (
          <div key={a.name} className="border border-cyan-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{a.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{a.name}</div>
                <div className="text-[10px] text-[var(--muted)]">Ages: {a.age} · {a.area}</div>
              </div>
            </div>
            <div className="text-[10px] text-cyan-700 mb-0.5">💰 {a.price}</div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{a.why}</div>
            <div className="text-[10px] text-orange-600">💡 {a.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
