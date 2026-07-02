const SOLO_PICKS = [
  {
    name: "Free Walking Tour",
    emoji: "🚶",
    time: "10am (Old City) — 2–3 hrs",
    cost: "Free (tip the guide ฿200–400)",
    why: "Best way to meet other solo travelers. Tours in English from Democracy Monument or Khao San Road. Guide knows local history, will recommend restaurants.",
    tip: "Check 'Bangkok Free Walking Tour' on Facebook to confirm meet points each day.",
  },
  {
    name: "Chatuchak Weekend Market Solo",
    emoji: "🛍️",
    time: "Sat–Sun 6am–6pm (go before 10am)",
    cost: "Free entry. Budget ฿500–2,000",
    why: "15,000+ stalls. Solo-friendly — you move at your own pace. Section maps available at entrance. Great for unique souvenirs.",
    tip: "Section 2–4: Plants/animals. Section 8–26: Clothes. Section 22–23: Antiques. Chill at café section 17 when overloaded.",
  },
  {
    name: "Muay Thai Evening at Rajadamnern Stadium",
    emoji: "🥊",
    time: "Mon/Wed/Thu/Sun — doors open 5:30pm",
    cost: "฿2,000 (ringside) or ฿1,000 (upper tier)",
    why: "Authentic Thai boxing, not a tourist show. Atmosphere is electric. Go solo — you'll meet other travelers and expats in ringside seats.",
    tip: "Buy tickets at the stadium box office (day of) or reputable online. Beware scalpers claiming shows are 'sold out'.",
  },
  {
    name: "Sunrise at Wat Arun",
    emoji: "🌅",
    time: "6:30am ferry from Tha Tien",
    cost: "Ferry ฿5 each way + temple ฿100",
    why: "Temple opens at 8am but take the ferry at 6:30am to photograph the glittering spires reflecting in the river. Almost no crowds.",
    tip: "Cross on the non-tourist ferry (look for orange flag, not the tourist boat). Breakfast at nearby Tha Tien market ฿50.",
  },
  {
    name: "Cooking Class (group format)",
    emoji: "👨‍🍳",
    time: "Morning class 9am–1pm or afternoon class 3pm–7pm",
    cost: "฿1,300–2,900 (full class including market visit + 4 dishes)",
    why: "Group class with 8–15 strangers — very social. Silom Thai Cooking School (฿1,300) is the best solo-traveler choice for meeting people.",
    tip: "Afternoon classes more social (people more relaxed). Solo travelers often get paired together for prep work.",
  },
];

export function BangkokSoloActivities() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-amber-700 mb-3">
        🎒 Best activities for solo travelers in Bangkok
      </div>
      <div className="space-y-2.5">
        {SOLO_PICKS.map((s) => (
          <div key={s.name} className="border border-amber-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">⏱️ {s.time}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.cost}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-orange-600">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
