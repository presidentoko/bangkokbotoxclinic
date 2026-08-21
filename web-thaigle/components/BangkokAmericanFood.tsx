const PICKS = [
  {
    name: "Charley Brown's (Tex-Mex American)",
    emoji: "🦅",
    area: "Sukhumvit Soi 11",
    price: "Mains ฿280–580, All-day brunch ฿350–520",
    why: "Bangkok's oldest American restaurant. Opened 1985. Proper American-diner energy — big booths, sports on TVs, enormous portions. Exceptional brunch on weekends. Bangkok's expats' comfort food HQ.",
    tip: "Full American breakfast (eggs, bacon, hash browns, pancakes) available all day: ฿390. Chicken fried steak is a bucket list dish. Cocktails strong — Long Island Iced Tea is legendary.",
  },
  {
    name: "Firehouse (American BBQ + Burgers)",
    emoji: "🔥",
    area: "Sukhumvit Soi 11",
    price: "Burgers ฿380–580, BBQ Ribs ฿680–980",
    why: "American-style fire-station themed restaurant. Smoked ribs, BBQ pulled pork, loaded burgers. The kind of food Americans get homesick for. Generous portions meant for sharing.",
    tip: "The 'Backdraft Burger' (double patty, cheddar, jalapeños, smoked bacon) is their best. BBQ ribs need 24-hour advance order. Thursday ribs special ฿490.",
  },
  {
    name: "Bourbon Street Restaurant & Oyster Bar",
    emoji: "🦞",
    area: "Washington Square, Sukhumvit",
    price: "Mains ฿380–680, Oysters per-piece ฿120",
    why: "New Orleans-style American restaurant. Cajun and Creole cooking in Bangkok — jambalaya, gumbo, crawfish étouffée. Authentic American south comfort food. Bar with 200+ whiskeys.",
    tip: "Happy hour oysters (4–7pm): ฿80/piece. Jambalaya is the best Thai-accessible intro to Cajun cooking. Large portions — share starters. Sunday jazz brunch is a Bangkok institution.",
  },
];

const CLASSICS = [
  "American Breakfast: eggs any style + bacon + hash browns + toast + OJ ฿280–420",
  "NY-style Pizza: whole pies at several Sukhumvit spots ฿450–680",
  "All-American Burger: double patty, cheese, pickles — better than Thailand McDonald's",
  "BBQ Ribs: slow-smoked American-style at multiple spots ฿680–1,200 full rack",
  "Peanut Butter Everything: cheesecake, shakes, waffles — Bangkok embraced it",
];

export function BangkokAmericanFood() {
  return (
    <div className="rounded-2xl border border-blue-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-blue-700 mb-3">
        🦅 American food in Bangkok — BBQ, brunch & comfort food
      </h2>
      <div className="space-y-2 mb-3">
        {PICKS.map((p) => (
          <div key={p.name} className="border border-blue-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{p.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{p.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{p.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{p.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{p.why}</div>
            <div className="text-[10px] text-blue-700">💡 {p.tip}</div>
          </div>
        ))}
      </div>
      <details className="border border-blue-100 rounded-xl overflow-hidden">
        <summary className="px-3 py-2 cursor-pointer text-[10px] font-bold text-blue-700 hover:bg-blue-50">
          American classics available in Bangkok
        </summary>
        <ul className="px-3 pb-3 pt-1 space-y-0.5">
          {CLASSICS.map((c) => (
            <li key={c} className="text-[10px] text-[var(--fg)] flex items-start gap-1.5">
              <span className="text-blue-400 shrink-0">•</span>{c}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
