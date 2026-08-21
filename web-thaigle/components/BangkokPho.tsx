const SPOTS = [
  {
    name: "Pho Bo (Beef Pho) in Bangkok",
    emoji: "🍲",
    area: "Sukhumvit Soi 22–24, Vietnamese Community Areas",
    price: "Pho bo ฿150–280",
    why: "Authentic Vietnamese beef pho — clear bone broth simmered with star anise, cinnamon, ginger, and charred onion for 8+ hours, served with thin rice noodles, thinly-sliced beef (raw or cooked), fresh herbs, lime, and chili. Bangkok's Vietnamese community has maintained authentic pho restaurants that pre-date the tourist-focused Vietnamese restaurants by decades.",
    tip: "The broth is everything in pho — it should be clear, golden, aromatic with star anise but not overpowering. Order pho tai (rare beef) and let the hot broth cook the meat at the table — this is the correct technique. Add sriracha and hoisin on the side, not directly in the soup.",
  },
  {
    name: "Pho Restaurants vs Pho-Inspired in Bangkok",
    emoji: "🌿",
    area: "Vietnamese restaurants throughout Sukhumvit and beyond",
    price: "฿130–320 depending on broth and protein",
    why: "Bangkok has both authentic Vietnamese pho restaurants (primarily serving the Vietnamese expat community) and Thai-adapted pho-inspired dishes. The authentic version has a more complex, clearer broth. Thai adaptations may add nam prik pao (roasted chili paste) or use different noodle sizes. Both are valid but offer different experiences.",
    tip: "For authentic pho: look for restaurants where Vietnamese is spoken and where there's no English-heavy menu with photos. Smaller, older restaurants in the Sukhumvit 22–24 area tend toward authentic. Fresh bean sprouts should be served raw at the table, not already added to the soup.",
  },
  {
    name: "Bun Bo Hue — Spicy Pho Alternative",
    emoji: "🌶️",
    area: "Authentic Vietnamese restaurants in Bangkok",
    price: "฿160–300",
    why: "Spicier Vietnamese noodle soup from Hue (central Vietnam) — thicker, rounder noodles in a lemongrass-shrimp paste-chili broth with pork and shrimp. More intense and complex than pho. Less commonly available than pho in Bangkok but worth seeking out at authentic Vietnamese restaurants. The shrimp paste-lemongrass combination is distinct from both Thai food and northern Vietnamese pho.",
    tip: "Bun bo Hue is the insider's Vietnamese noodle soup — if a Vietnamese restaurant has it on the menu, the kitchen's authentic credibility is high. It's spicier than pho and the shrimp paste aroma is strong — an acquired taste that rewards.",
  },
];

export function BangkokPho() {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-emerald-700 mb-3">
        🍲 Vietnamese pho in Bangkok — authentic beef broth, bun bo Hue & fresh herbs
      </h2>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-emerald-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-emerald-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
