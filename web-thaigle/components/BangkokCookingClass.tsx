const SCHOOLS = [
  {
    name: "Blue Elephant Royal Thai Cuisine",
    emoji: "🐘",
    area: "Sathorn Road (30 min from center)",
    price: "Half-day class ฿3,500–5,500",
    why: "The most prestigious Thai cooking school in Bangkok. Operates from a restored colonial mansion. Morning market visit (optional), Thai cookbook, hands-on cooking of 5 dishes. Chefs have cooked for Thai royalty. Each student at their own workstation.",
    tip: "Book at least 1 week ahead — most popular school in Bangkok. Morning market visit at Or Tor Kor Market adds context to ingredients. Classes held at 8:30am only. Full-day option includes lunch at the Blue Elephant restaurant (additional cost).",
  },
  {
    name: "Silom Thai Cooking School",
    emoji: "🌿",
    area: "Silom area (BTS Chong Nonsi)",
    price: "3-hour class ฿1,000–1,500",
    why: "Best value quality cooking class in Bangkok. 5 dishes in 3 hours, your own workstation, take-home recipe booklet. Small groups (max 15). Nearby MBK market walk for ingredients first. Very popular with travelers for 1-day experience.",
    tip: "Book online (fills up weeks ahead). Class sizes max 15 — more personal than larger schools. They have morning market trip to see Silom market + cooking. Dietary restrictions accommodated (vegetarian, vegan, gluten-free options). Eat everything you cook.",
  },
  {
    name: "Amita Thai Cooking Class (Thonburi)",
    emoji: "🏡",
    area: "Thonburi (traditional Thai house across the river)",
    price: "Half-day ฿2,500–4,000",
    why: "Cooking class in a traditional Thai wooden home across Chao Phraya River. Only 6 students per class — very personal. Herb garden tour, hands-on cooking, eat in the garden. A genuinely beautiful experience rather than just a class. Often cited as Bangkok's most 'authentic feeling' cooking experience.",
    tip: "6-student maximum makes this the most intimate option. Includes canal boat transfer from pier (part of the charm). Amita herself often teaches — ask about her herb garden. Classes run 9am only. Advance booking essential (often booked 2+ weeks).",
  },
  {
    name: "Bangkok Thai Cooking Academy",
    emoji: "👨‍🍳",
    area: "On Nut / Sukhumvit area",
    price: "Group class ฿1,200–2,000; Private ฿4,000–8,000",
    why: "Flexible scheduling with multiple daily class slots — best if your Bangkok dates are limited. Group and private options. Air-conditioned professional kitchen. 4 dishes per session. Accommodates large groups (good for team activities or corporate events).",
    tip: "Private class option best if traveling with family 4+ people. Corporate team cooking event capacity up to 30. Flexible menus — choose from 20+ dish options before class. On Nut location makes it accessible via BTS. Evening classes available (unusual among schools).",
  },
];

export function BangkokCookingClass() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-amber-700 mb-3">
        👨‍🍳 Thai cooking classes in Bangkok — from luxury to budget picks
      </div>
      <div className="space-y-2">
        {SCHOOLS.map((s) => (
          <div key={s.name} className="border border-amber-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-amber-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
