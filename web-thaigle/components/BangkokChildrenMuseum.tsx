const VENUES = [
  {
    name: "Children's Discovery Museum",
    emoji: "🔬",
    area: "Chatuchak (Mo Chit MRT / BTS)",
    age: "2–12 years",
    price: "Free (Thailand residents), ฿70 foreigners",
    hours: "Tue–Sun 10am–4pm (closed Mon)",
    why: "Hands-on science exhibits. Water play, fire truck, mini supermarket for role-play. Best museum for young kids in Bangkok.",
    tip: "Friday afternoons are emptier. Bring change of clothes for water zone.",
  },
  {
    name: "KidZania Bangkok",
    emoji: "👷",
    area: "Siam Paragon, 5F",
    age: "4–14 years",
    price: "฿850–1,100",
    hours: "10am–5pm (morning) or 3pm–8pm (afternoon session)",
    why: "Role-play city where kids do real jobs — pilot, doctor, chef, firefighter. Kids LOVE it. 2–3hr minimum.",
    tip: "Buy tickets online in advance (often sold out weekends). Bring extra socks.",
  },
  {
    name: "Dream World Theme Park",
    emoji: "🎢",
    area: "Rangsit, Bangkok outskirts (40km, 1hr taxi)",
    age: "All ages (rides for 5+)",
    price: "฿500–700 (rides + attractions)",
    hours: "10am–5pm daily",
    why: "Closest theme park to Bangkok. Snow Town (real snow indoor), 5 roller coasters, cartoon characters. Big for young kids.",
    tip: "Weekdays almost empty — all rides walk-on. Weekends can queue 30–60min for major rides.",
  },
  {
    name: "SEA LIFE Bangkok Ocean World",
    emoji: "🦈",
    area: "Siam Paragon, B1–B2",
    age: "All ages (best 4–10 years)",
    price: "฿990–1,200 (online ฿700–850 Klook)",
    hours: "10am–9pm daily (last entry 8pm)",
    why: "Largest aquarium in Southeast Asia. 30,000 sea creatures. Glass tunnel walk, penguin encounter, shark diving (extra).",
    tip: "Book Klook in advance — 30% cheaper. Early morning is empty. Penguin feeding 11am and 3:30pm.",
  },
];

export function BangkokChildrenMuseum() {
  return (
    <div className="rounded-2xl border border-sky-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-sky-700 mb-3">
        👶 Bangkok with kids — museums & attractions
      </div>
      <div className="space-y-2">
        {VENUES.map((v) => (
          <div key={v.name} className="border border-sky-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{v.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{v.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{v.area} · Ages: {v.age}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{v.price}</span>
            </div>
            <div className="text-[10px] text-sky-700 mb-0.5">🕐 {v.hours}</div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{v.why}</div>
            <div className="text-[10px] text-orange-600">💡 {v.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
