const INDOOR_ACTIVITIES = [
  {
    name: "Ice skating — Central World Ice Rink",
    emoji: "⛸️",
    location: "Central World (BTS Siam/Chidlom)",
    price: "฿300–450 including skate rental",
    hours: "10am–9:30pm daily",
    why: "Largest ice rink in Thailand. Huge fun on a rainy day. Packed with Thai families on weekends.",
    tip: "Weekday morning sessions are empty. Rent thick socks at the counter.",
  },
  {
    name: "Planetarium & Science Museum",
    emoji: "🔭",
    location: "Sukhumvit 40 (Phrakanong BTS)",
    price: "฿50–100",
    hours: "8:30am–4:30pm Tue–Sun",
    why: "Thai National Science Museum. 40-seat digitarium projector. Good for 2–3 hours.",
    tip: "Planetarium shows at 10am and 2pm. English commentary available.",
  },
  {
    name: "Bangkok Butterfly Garden & Insectarium",
    emoji: "🦋",
    location: "Chatuchak Park (Mo Chit MRT)",
    price: "Free",
    hours: "8:30am–4:30pm (closed Monday)",
    why: "Hidden gem — free indoor butterfly enclosure inside Chatuchak Park. Perfect rainy day 2hr activity.",
    tip: "Combine with Chatuchak if it stops raining — next door.",
  },
  {
    name: "Cooking class (rain activity)",
    emoji: "👨‍🍳",
    location: "Various (Silom, Banglamphu)",
    price: "฿1,300–2,900",
    hours: "Morning 9am–1pm, Afternoon 3pm–7pm",
    why: "Best thing to do when it rains — you're indoors for 4 hours, learn a skill, eat 4 dishes, and have a great time.",
    tip: "Book same-day at Silom Thai Cooking School if you show up to them in person.",
  },
  {
    name: "Escape rooms",
    emoji: "🚪",
    location: "Asok area, Silom, Chatuchak",
    price: "฿400–700/person (group of 2–5)",
    hours: "12pm–10pm",
    why: "Bangkok has excellent English-language escape rooms. Good social activity if traveling in groups.",
    tip: "Escape Hunt Bangkok (Sukhumvit 11) or Let's Escape (Asok) — both highly rated.",
  },
];

export function BangkokRainyDayGuide() {
  return (
    <div className="rounded-2xl border border-blue-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-blue-700 mb-3">
        🌧️ Rainy day in Bangkok — best indoor activities
      </h2>
      <div className="text-[10px] bg-blue-50 rounded-xl p-2.5 mb-3 text-blue-800">
        Bangkok rainy season: <strong>May–October</strong>. Showers typically 2–3pm for 30–90 min, then clear. Plan indoor activities around this window.
      </div>
      <div className="space-y-2">
        {INDOOR_ACTIVITIES.map((a) => (
          <div key={a.name} className="border border-blue-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{a.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{a.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">📍 {a.location} · 🕐 {a.hours}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{a.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{a.why}</div>
            <div className="text-[10px] text-orange-600">💡 {a.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
