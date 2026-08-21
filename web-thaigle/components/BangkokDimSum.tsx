const SPOTS = [
  {
    name: "Shang Palace (Shangri-La Hotel)",
    emoji: "🏮",
    area: "Bangrak, Saphan Taksin BTS (hotel pier)",
    price: "฿400–800/person dim sum brunch",
    hours: "Dim sum served daily 11am–2:30pm",
    why: "Bangkok's finest Cantonese dim sum. Award-winning for 30 years. Best char siu bao (BBQ pork buns) and har gow (shrimp dumplings) in the city.",
    must: "Char siu bao, har gow, siu mai, cheung fun, deep-fried taro puff",
    tip: "Sunday dim sum brunch has live Chinese music. Reservation required.",
  },
  {
    name: "MingCha (Mandarin Oriental)",
    emoji: "✨",
    area: "Mandarin Oriental Hotel, Charoen Krung",
    price: "฿600–1,200/person",
    hours: "Daily 12pm–2:30pm",
    why: "Legendary hotel dim sum. Refined presentation. Superlative service. One of Bangkok's longest-running dim sum experiences.",
    must: "Lobster har gow (luxury), crystal dumplings, turnip cake, red bean sesame ball",
    tip: "Very formal — dress code applies. Best 'occasion' dim sum in Bangkok.",
  },
  {
    name: "Yaowarat Road (Chinatown) dim sum stalls",
    emoji: "🥢",
    area: "Yaowarat, Mangkon MRT (Chinatown line)",
    price: "฿50–150/plate",
    hours: "8am–2pm (breakfast dim sum best before 11am)",
    why: "Authentic, cheap, no hotel markup. Bangkok's Chinese community eats here. Chaotic, fast, delicious.",
    must: "Deep-fried crullers with congee (ปาท่องโก๋), dim sum basket, BBQ pork rice, tofu pudding",
    tip: "Walk Yaowarat Soi 11 from main road. Ask in Thai or just point. Very few English menus.",
  },
  {
    name: "Canton Brewing Co.",
    emoji: "🍺",
    area: "Silom Soi 2",
    price: "฿250–500/person (dim sum + craft beer)",
    hours: "Daily 11am–midnight",
    why: "Modern Cantonese + craft beer. Dim sum with natural wine and IPA pairings. Younger Bangkok crowd. More casual than hotel options.",
    must: "Kimchi xiao long bao, truffle har gow, beer-steamed pork ribs",
    tip: "Live music weekend evenings. Reservation for weekend lunch or dinner.",
  },
];

export function BangkokDimSum() {
  return (
    <div className="rounded-2xl border border-red-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-red-700 mb-3">
        🥢 Dim sum in Bangkok — from traditional to modern
      </h2>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-red-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area} · {s.hours}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-orange-600 mb-0.5">⭐ Must order: {s.must}</div>
            <div className="text-[10px] text-red-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
