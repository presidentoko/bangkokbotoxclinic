const ACTIVITIES = [
  {
    name: "Chatuchak Weekend Market",
    emoji: "🛍️",
    time: "Sat–Sun 6am–6pm (plants: Fri also)",
    effort: "Half-day to full day",
    why: "The world's largest weekend market. 15,000 stalls across 27 acres. Antiques, plants, art, food, clothing, vintage — everything.",
    pro: "Or Tor Kor organic market (5-min walk from Chatuchak Gate 1) for premium Thai produce and prepared food.",
    get: "Section 2–4 (vintage/antiques), Section 7 (art/pottery), Section 18 (plants), Food court Section 27. Map at every gate.",
  },
  {
    name: "Lumpini Park Morning Walk",
    emoji: "🌳",
    time: "5am–9am (best), open all day",
    effort: "Easy 2–3km loop",
    why: "Bangkok's Central Park. Morning tai chi groups, aerobics classes, Komodo dragons (yes, real monitor lizards) sunbathing. Free entry.",
    pro: "Sunday: outdoor aerobics at 5:30am and 6:30am run by the park (free, anyone can join). Banana vendors at gates.",
    get: "Arrive before 7am to see Bangkok at its most peaceful. The rest of the city is still asleep.",
  },
  {
    name: "Bang Krachao Green Lung Cycling",
    emoji: "🌿",
    time: "7am–1pm (morning is best)",
    effort: "Moderate: 8–12km flat cycling",
    why: "River meander 5km from downtown — thick jungle, organic farms, canal paths. The most Bangkok-not-Bangkok experience.",
    pro: "Ferry from Si Phraya Pier (Sat–Sun only, most frequent service). Bike rental on arrival ฿50–80/hr.",
    get: "Sri Nakhon Khuean Khan Park in center (free), local seafood lunch before heading back (~฿150–250).",
  },
  {
    name: "Sunday Brunch Crawl",
    emoji: "🥂",
    time: "10am–3pm",
    effort: "Relaxed walking between venues",
    why: "Bangkok's brunch scene is world-class. Walk from one spot to next, have a cocktail or eggs at each.",
    pro: "The Thong Lo–Ekkamai axis is Bangkok's best brunch neighborhood. 10+ excellent brunch spots within walking distance.",
    get: "Route: Start at Roast (Thong Lo), walk to Never Ending Summer, end at The Pelican. Grab coffee at % Arabica.",
  },
];

export function BangkokSundayActivities() {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-emerald-700 mb-3">
        ☀️ Bangkok Sunday activities — how to spend the day
      </h2>
      <div className="space-y-2">
        {ACTIVITIES.map((a) => (
          <details key={a.name} className="border border-emerald-100 rounded-xl overflow-hidden group">
            <summary className="px-3 py-2.5 cursor-pointer flex items-center gap-2 hover:bg-emerald-50 transition">
              <span className="text-2xl shrink-0">{a.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{a.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{a.time} · {a.effort}</div>
              </div>
            </summary>
            <div className="px-3 pb-3 border-t border-emerald-100 pt-2 space-y-1">
              <div className="text-[10px] text-[var(--fg)] leading-snug">{a.why}</div>
              <div className="text-[10px] text-emerald-700">💡 Pro tip: {a.pro}</div>
              <div className="text-[10px] text-orange-600">⭐ Don't miss: {a.get}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
