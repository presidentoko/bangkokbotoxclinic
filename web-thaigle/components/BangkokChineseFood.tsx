const PICKS = [
  {
    name: "Yaowarat Road (Chinatown)",
    emoji: "🏮",
    type: "Authentic Chinese street food belt",
    price: "฿50–300/dish",
    why: "Largest Chinatown outside China. 200+ street stalls. Best roasted duck, steamed fish, braised pork knuckle in Bangkok.",
    must: ["Braised duck + rice (เป็ดพะโล้)", "Jok (congee, open from midnight)", "Steamed crabs from tank", "Crab omelette (at Raan Jay Fai nearby ฿1,200)"],
    hours: "Best 5pm–midnight. Some stalls open 6am–3pm for lunch.",
  },
  {
    name: "Shang Palace (Shangri-La Hotel)",
    emoji: "👑",
    type: "Cantonese fine dining",
    price: "฿800–2,500",
    why: "Bangkok's best Cantonese restaurant. Dim sum lunch is unmissable — some of the best har gow and siu mai outside Hong Kong.",
    must: ["Sunday dim sum brunch", "Peking Duck (24hr advance order)", "Bird's nest soup"],
    hours: "Lunch daily 11:30am–2:30pm, Dinner 6pm–10:30pm.",
  },
  {
    name: "Canton Brewing Company",
    emoji: "🍺",
    type: "Craft beer + Cantonese BBQ",
    price: "฿300–700",
    why: "Modern take on Cantonese. House-brewed beer + char siu pork, roast goose, Hong Kong noodles. Casual atmosphere.",
    must: ["Char Siu Pork", "Roast duck over rice", "House craft lager"],
    hours: "5pm–midnight. Closed Monday.",
  },
  {
    name: "Somboon Seafood",
    emoji: "🦀",
    type: "Thai-Chinese seafood (Bangkok icon)",
    price: "฿300–1,000",
    why: "Bangkok institution since 1969. Famous for curry crab — best in city. Very Thai-Chinese cooking style but iconic.",
    must: ["Curry crab (ปูผัดผงกะหรี่) — signature dish ฿450–800/crab", "Stir-fried morning glory", "Tiger prawn with glass noodles"],
    hours: "Multiple locations. Daily 4pm–10pm.",
  },
];

export function BangkokChineseFood() {
  return (
    <div className="rounded-2xl border border-red-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-red-700 mb-3">
        🏮 Chinese food in Bangkok — dim sum to roast duck
      </h2>
      <div className="space-y-3">
        {PICKS.map((p) => (
          <div key={p.name} className="border border-red-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{p.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{p.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{p.type}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{p.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-1 leading-snug">{p.why}</div>
            <div className="flex flex-wrap gap-1 mb-1">
              {p.must.map((m) => (
                <span key={m} className="text-[9px] bg-red-50 text-red-700 px-1.5 py-0.5 rounded-full">{m}</span>
              ))}
            </div>
            <div className="text-[10px] text-[var(--muted)]">🕐 {p.hours}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
