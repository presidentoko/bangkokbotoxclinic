const INFO = [
  {
    name: "Shisha Lounges in Bangkok",
    emoji: "💨",
    area: "Sukhumvit (particularly Soi 11, Nana area), Thonglor, Silom",
    price: "Shisha pipe ฿400–800; With drinks ฿600–1,500 minimum",
    why: "Bangkok has a well-established shisha (hookah) lounge scene serving Middle Eastern expats, Thai young adults, and international visitors. The Sukhumvit Soi 11 and Nana area has the highest concentration of dedicated shisha lounges, many with Arabic food menus, cushioned floor seating, and extended late-night hours (midnight to 3am). Shisha lounges serve as social gathering spaces — the slow pace of smoking encourages long conversations.",
    tip: "Thailand's laws on shisha are somewhat ambiguous — tobacco-based shisha is technically restricted but enforced inconsistently. Some establishments use herbal/fruit-based non-tobacco shisha alternatives. The Nana/Sukhumvit Soi 3–11 area has the most reliable shisha lounges that have operated consistently for years. Typically no reservations needed — arrive early evening (7–9pm) for the best atmosphere before crowds thin out late night.",
  },
  {
    name: "Arabic & Middle Eastern Food + Shisha",
    emoji: "🕌",
    area: "Sukhumvit Soi 3 (Arab Street), Silom Soi 4",
    price: "Mezze platter ฿300–600; Shisha ฿400–800",
    why: "Sukhumvit Soi 3 (locally called 'Arab Street') is Bangkok's Middle Eastern district — shawarma restaurants, Egyptian coffeehouses, Lebanese restaurants, and shisha lounges operate side by side. The area serves Bangkok's significant Middle Eastern expatriate population (Gulf nationals on holiday, Egyptian/Jordanian/Lebanese businesspeople, and Pakistani/Bangladeshi residents). Authentic mezze, kunafa, and fresh fruit juices accompany shisha in this environment.",
    tip: "Sukhumvit Soi 3 Arabic food is genuinely authentic — the restaurants serve Gulf and Levantine communities who demand real quality. Recommended: fresh-squeezed juice (mango, pomegranate, avocado), mixed mezze platter (hummus, mutabal, fattoush), and grilled meat platters at the Lebanese grill restaurants. The shisha lounges on Soi 3 are more traditional Arabic style than the trendy Sukhumvit Soi 11 versions.",
  },
  {
    name: "Rooftop & Terrace Shisha",
    emoji: "🌆",
    area: "Rooftop venues — Thonglor, Ekkamai, Silom",
    price: "฿700–1,500 minimum spend",
    why: "Bangkok's rooftop bar scene has incorporated shisha as a premium addition — terrace lounges with city views, cocktails, and shisha create the relaxed outdoor evening atmosphere that Bangkok's warm nights support well. The combination of shisha + Bangkok skyline view is unique to this city's entertainment culture. Not strictly shisha lounges but hybrid rooftop-bar concepts.",
    tip: "Rooftop shisha in Bangkok: best from 8–11pm before the heat fully dissipates. Smoke from the shisha disperses quickly in outdoor settings — the scent is pleasant in open-air but overwhelming indoors. Bangkok's humidity means charcoal management (keeping coals hot) requires more attention from staff than in dry climates.",
  },
];

export function BangkokShishaLounge() {
  return (
    <div className="rounded-2xl border border-purple-300 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-purple-800 mb-3">
        💨 Shisha lounges in Bangkok — Sukhumvit Arab Street, Middle Eastern food & rooftop
      </h2>
      <div className="space-y-2">
        {INFO.map((i) => (
          <div key={i.name} className="border border-purple-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{i.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{i.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{i.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{i.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{i.why}</div>
            <div className="text-[10px] text-purple-800">💡 {i.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
