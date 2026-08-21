const AREAS = [
  {
    name: "Nana / Sukhumvit Soi 3 Area",
    emoji: "🌙",
    description: "Bangkok's unofficial Arabic Quarter. Concentrated cluster of Lebanese, Egyptian, Turkish, Yemeni, and Pakistani restaurants within walking distance.",
    picks: ["Al Saray — Lebanese meze, hummus, shawarma plates ฿120–350", "Shalimar — Pakistani biryani and curries from ฿90", "Restaurants along Soi 3/1 (\"Little Arabia\") with outdoor seating"],
    vibe: "Authentic and unpolished. Heavy with Middle Eastern expat community, halal-certified, hookah optional. Best for groups who want variety from street-level browsing.",
    tip: "Friday and Saturday evenings most lively — Arabic music, hookah smoke, families eating late. Many restaurants open until 2–3am.",
  },
  {
    name: "Jasmine Restaurant",
    emoji: "✨",
    description: "Premium Lebanese restaurant in upscale Bangkok setting",
    picks: ["Mezze platter ฿680–1,200", "Charcoal mixed grill ฿980–1,600", "Mezze + grill set for 2 ฿1,800"],
    vibe: "Bangkok's most elegant Lebanese dining. White tablecloth, proper Lebanese wine list, live oud music some evenings. Good for dates or business dinners wanting something different.",
    tip: "Lunch set menu is excellent value. Best hummus in Bangkok — request extra pita. Lebanese Arak (anise liqueur) available for an authentic touch.",
  },
  {
    name: "Moghul Room",
    emoji: "🎪",
    description: "Long-running Indian/Pakistani restaurant near Pathumwan",
    picks: ["Biryani (chicken/lamb) ฿220–380", "Dal makhani ฿160", "Roghan Josh ฿320", "Naan bread baked in tandoor ฿40"],
    vibe: "38+ years in Bangkok. Beloved by Indian expats for authentic sub-continental cooking. Unpretentious, generous portions, consistent quality.",
    tip: "Halal-certified. No alcohol served but fine with BYO (Bangkok Alcohol to go from 7-11). Weekday lunch thali/set is best value.",
  },
];

export function BangkokMiddleEastern() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-amber-700 mb-3">
        🌙 Middle Eastern food in Bangkok — Lebanese, Turkish, Arabic
      </h2>
      <div className="space-y-2">
        {AREAS.map((a) => (
          <details key={a.name} className="border border-amber-100 rounded-xl overflow-hidden group">
            <summary className="px-3 py-2.5 cursor-pointer flex items-center gap-2 hover:bg-amber-50 transition">
              <span className="text-2xl shrink-0">{a.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{a.name}</h3>
                <div className="text-[10px] text-[var(--muted)] truncate">{a.description}</div>
              </div>
            </summary>
            <div className="px-3 pb-3 border-t border-amber-100 pt-2 space-y-1.5">
              <div className="text-[10px] text-[var(--fg)] leading-snug">{a.vibe}</div>
              <ul className="space-y-0.5">
                {a.picks.map((p) => (
                  <li key={p} className="text-[10px] text-amber-700 flex items-start gap-1.5">
                    <span className="shrink-0">•</span>{p}
                  </li>
                ))}
              </ul>
              <div className="text-[10px] text-orange-600">💡 {a.tip}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
