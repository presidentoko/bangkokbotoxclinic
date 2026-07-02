const CAFES = [
  {
    name: "Roots Coffee Roaster",
    emoji: "☕",
    area: "Ari BTS (multiple locations)",
    priceRange: "฿100–160",
    type: "Specialty roaster",
    best: "Single origin pour-over. Signature 'Chiang Rai' blend. Clean natural light space.",
    hours: "7am–8pm daily",
    why: "Bangkok's most respected specialty roaster. Thai-grown beans from Chiang Rai highland farms. Multiple locations.",
  },
  {
    name: "Factory Coffee",
    emoji: "🏭",
    area: "Ari / Phahon Yothin",
    priceRange: "฿90–140",
    type: "Casual specialty",
    best: "Oat milk flat white. Cold brew. Good laptop workspace.",
    hours: "7am–7pm (closed Tue)",
    why: "Second best roaster after Roots. More casual atmosphere. Great for working. Slightly cheaper.",
  },
  {
    name: "Brewed Awakening",
    emoji: "🌄",
    area: "Ekkamai BTS",
    priceRange: "฿120–180",
    type: "Concept café",
    best: "Signature drinks — matcha latte, seasonal Thai fruit drinks.",
    hours: "8am–8pm daily",
    why: "Beautiful interior design. Photogenic. Creative specialty menu. Good for Instagram + coffee simultaneously.",
  },
  {
    name: "Ink & Lion Coffee",
    emoji: "🦁",
    area: "Chatuchak / Mo Chit",
    priceRange: "฿80–120",
    type: "Neighborhood café",
    best: "Thai tea latte. House filter coffee. Pandan cake.",
    hours: "7am–6pm (closed Mon)",
    why: "Hidden local gem near Chatuchak market. Very Thai café aesthetic. Popular with the creative crowd.",
  },
  {
    name: "Nana Coffee Roasters",
    emoji: "🌿",
    area: "Sukhumvit 49",
    priceRange: "฿110–160",
    type: "Plant-filled roaster",
    best: "Cold brew tower. Botanical-themed espresso drinks.",
    hours: "8am–7pm daily",
    why: "Lush tropical plant walls + specialty coffee = Instagram heaven + actually good coffee. Work-friendly.",
  },
];

export function BangkokCoffeeShops() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-amber-700 mb-3">
        ☕ Bangkok specialty coffee — best cafés
      </div>
      <div className="space-y-2">
        {CAFES.map((c) => (
          <div key={c.name} className="border border-amber-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{c.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{c.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{c.type} · {c.area} · {c.hours}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{c.priceRange}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{c.why}</div>
            <div className="text-[10px] text-orange-600">⭐ Order: {c.best}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
