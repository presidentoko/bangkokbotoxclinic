const AREAS = [
  {
    university: "Chulalongkorn (CU) Area",
    emoji: "🎓",
    station: "Sam Yan MRT (M5) or Siam BTS (CEN)",
    neighborhood: "Samyan–Chula",
    why: "Bangkok's oldest and most prestigious university area. Surrounded by cheap eats + vintage book stores.",
    mustDo: [
      "Samyan Mitrtown mall — night food court, 24hr, CO-OP coworking",
      "Jae W Nai market (student street food, ฿40–80/dish)",
      "Old book shops on Chulalongkorn Soi 12",
      "AUA Language Center library café (non-students welcome)",
    ],
    tip: "Budget food at its best. Pad kra pao ฿50, mango sticky rice ฿60. Very safe, very local.",
  },
  {
    university: "Kasetsart University (KU) Area",
    emoji: "🌿",
    station: "Bang Sue MRT or Chatuchak Park BTS",
    neighborhood: "Bang Khen",
    why: "Agricultural university with its own farm market. Organic produce, fresh campus food.",
    mustDo: [
      "KU Fresh Market (farm direct, Sat–Sun) — fresh produce at wholesale",
      "Campus restaurants open to public, cheapest Thai food in Bangkok",
      "Botanical garden walk (free)",
    ],
    tip: "Worth combining with Chatuchak weekend market (5 min by taxi). Locals-only feel.",
  },
  {
    university: "Thammasat (TU) Tha Prachan",
    emoji: "⚖️",
    station: "Sanam Chai MRT + river ferry",
    neighborhood: "Rattanakosin",
    why: "Historic law + political science university right next to Grand Palace. Great street food and political energy.",
    mustDo: [
      "Tha Prachan amulet market (on the pier)",
      "Saranrom Park (lunch break spot)",
      "Local pad thai stalls on Maharat Road ฿60",
    ],
    tip: "Combine with Grand Palace and Wat Pho (5-min walk) for a full Rattanakosin day.",
  },
];

export function BangkokUniversityArea() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        🎓 Bangkok university areas — local food & culture
      </h2>
      <div className="space-y-3">
        {AREAS.map((a) => (
          <div key={a.university} className="border border-[var(--border)] rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{a.emoji}</span>
              <div>
                <div className="font-bold text-xs">{a.university}</div>
                <div className="text-[10px] text-[var(--muted)]">🚉 {a.station}</div>
              </div>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-1.5 leading-snug">{a.why}</div>
            <div className="space-y-0.5 mb-1.5">
              {a.mustDo.map((m) => (
                <div key={m} className="text-[10px] flex gap-1.5">
                  <span className="shrink-0 text-blue-500">▸</span>{m}
                </div>
              ))}
            </div>
            <div className="text-[10px] text-orange-600">💡 {a.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
