const TYPES = [
  {
    name: "Day-Use Pool Villa at Luxury Hotel",
    emoji: "🏊",
    area: "Various Bangkok 5-star hotels",
    price: "Pool villa day use ฿5,000–25,000 (includes food/drink credit)",
    why: "Several Bangkok luxury hotels offer 'pool villa day use' — private villas with plunge pool, sun deck, butler service for 6–10 hours without overnight stay. Anantara Bangkok, Capella Bangkok, 137 Pillars. Perfect for staycation without hotel room cost.",
    tip: "Day use includes F&B credit in most packages — use it for breakfast + lunch + afternoon snacks. Book Fridays or Sundays for quietest experience. Minimum 2 people for value. Summer (March–May) is peak pool season — book 2+ weeks ahead.",
  },
  {
    name: "Private Pool Villa Rental (Event/Party)",
    emoji: "🥳",
    area: "Bangna, Pinklao, and outer Bangkok areas",
    price: "Full-day villa rental ฿8,000–50,000+ depending on size",
    why: "Bangkok has private pool villas rentable by the day for parties and events. Airbnb and local platforms list them. Best for birthdays, bachelorette parties, team events. Private entrance, own chef access, bring your own food and drink, full pool access.",
    tip: "Search Airbnb with filter 'pool' + 'private' + Bangkok — sort by 'entire home.' Check 'events allowed' in house rules (some don't allow parties). IMPORTANT: Confirm maximum guest count before booking — most private villas have occupancy limits for parties.",
  },
  {
    name: "Rooftop Infinity Pool (Hotel Access)",
    emoji: "🌅",
    area: "Bangkok CBD — Sathorn, Silom, Sukhumvit",
    price: "Day pass ฿1,500–5,000 (includes pool + sun lounger + drinks)",
    why: "Bangkok hotels with iconic rooftop infinity pools sell day passes for non-guests. W Bangkok, Banyan Tree, COMO Metropolitan, and Movenpick all have rooftop pools with day access. City views + pool = quintessential Bangkok experience.",
    tip: "Book online — day pass capacity is limited (usually 20–30 slots). Bring SPF 50+ sunscreen (Bangkok sun is intense). Rooftop UV exposure stronger — 30 min feels like 2 hours. Towels provided. Smart casual dress code for pool area entry.",
  },
  {
    name: "Private Pool Apartment Rental (Self-Catering)",
    emoji: "🏡",
    area: "Sukhumvit, Asoke, Sathorn condominiums",
    price: "3–7 nights ฿5,000–15,000/night",
    why: "Bangkok has luxury condominiums with in-unit or rooftop shared pool available for short-term rental. Staying in a condo with pool beats hotel room for groups 4+ who want kitchen, multiple bedrooms, pool access, and full Bangkok location.",
    tip: "Book via Airbnb under 'entire condo' + 'pool.' Central Bangkok condos (Asoke, Phrom Phong) have 24-hour security, western kitchens, and building amenities. Week+ stays often negotiable for 15–20% discount. Grocery delivery to condo from Grab Mart.",
  },
];

export function BangkokPoolVilla() {
  return (
    <div className="rounded-2xl border border-blue-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-blue-700 mb-3">
        🏊 Pool villas in Bangkok — day use, private rental & rooftop pools
      </div>
      <div className="space-y-2">
        {TYPES.map((t) => (
          <div key={t.name} className="border border-blue-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{t.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{t.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{t.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{t.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{t.why}</div>
            <div className="text-[10px] text-blue-700">💡 {t.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
