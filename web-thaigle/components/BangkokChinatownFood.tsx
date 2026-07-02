const DISHES = [
  {
    name: "T&K Seafood (Yaowarat landmark)",
    emoji: "🦀",
    area: "Yaowarat Soi 8 (main Chinatown strip)",
    price: "฿200–600/person",
    why: "Most famous seafood restaurant in Chinatown. Tables literally spill into the street. Grilled prawns, crab, oysters.",
    must: "Grilled river prawn with glass noodles (฿350 for 3), oyster omelette, stir-fried century egg",
    hours: "Daily 4pm–2am",
  },
  {
    name: "Nai Mong Hoi Thod (Oyster Omelette)",
    emoji: "🦪",
    area: "Plaeng Nam Rd, Chinatown (south of Yaowarat Rd)",
    price: "฿100–200",
    why: "Bangkok's most famous oyster omelette (hoi tod). Family recipe passed down 4 generations. Crispy style (or) or soft gooey style (crunchy is better).",
    must: "Crispy oyster omelette (oi tod/crunchy) ฿150. Always freshly made to order.",
    hours: "Daily 9am–7pm",
  },
  {
    name: "Yaowarat Tofu (Pork Blood Tofu Soup)",
    emoji: "🫕",
    area: "Multiple stalls along Yaowarat",
    price: "฿60–100",
    why: "Bangkok street food you won't find elsewhere. Silky tofu, pork blood cubes, in delicate Chinese five-spice broth.",
    must: "Ask for 'tao huu nam khing' (tofu with ginger soup) or 'tao huu lueat' (tofu blood soup).",
    hours: "5am–2pm (breakfast stalls)",
  },
  {
    name: "Guay Jub (Rolled Rice Noodle Soup)",
    emoji: "🍜",
    area: "Yaowarat and Charoenkrung side sois",
    price: "฿60–100",
    why: "Chinese-Thai noodle soup with pork, offal, and rolled rice noodles. Intense, peppery broth. Late-night workers' dish.",
    must: "Guay jub 'nam sai' (clear soup) or 'nam khon' (thick broth). Add pork crackling.",
    hours: "Late night 10pm–4am (best), also morning stalls 6am–noon",
  },
];

const TIPS = [
  "Best time: 8–10pm. Day crowd is tourists; night crowd is real Bangkok Chinatown life.",
  "Yaowarat Road from Charoen Krung intersection to Odeon Circle is the main drag (400m walk).",
  "February full moon = Chinese New Year. Beyond incredible atmosphere but extremely crowded.",
  "Take MRT to Mangkon station (Chinatown station on Blue Line extension).",
];

export function BangkokChinatownFood() {
  return (
    <div className="rounded-2xl border border-red-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-red-700 mb-3">
        🏮 Chinatown Bangkok (Yaowarat) — essential food guide
      </div>
      <div className="space-y-2 mb-3">
        {DISHES.map((d) => (
          <div key={d.name} className="border border-red-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{d.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{d.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{d.area} · {d.hours}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{d.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{d.why}</div>
            <div className="text-[10px] text-orange-600">⭐ Order: {d.must}</div>
          </div>
        ))}
      </div>
      <div className="border border-red-100 rounded-xl p-3">
        <div className="text-[10px] font-bold text-red-700 mb-1.5">🏮 Chinatown tips</div>
        <ul className="space-y-0.5">
          {TIPS.map((t, i) => (
            <li key={i} className="text-[10px] text-[var(--fg)] leading-snug flex items-start gap-1.5">
              <span className="text-red-400 shrink-0">•</span>{t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
