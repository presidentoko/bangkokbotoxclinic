const MONTHS = [
  { m: 0, name: "January", events: ["Bangkok International Film Festival (BIFF)", "Art & Design District markets", "Low season (coolest, best time)"] },
  { m: 1, name: "February", events: ["Valentine's week rooftop events", "Chinese New Year in Chinatown (varies)", "Flower Festival (Chiang Mai connection)"] },
  { m: 2, name: "March", events: ["Kite Flying Festival at Sanam Luang", "End of cool season — last good weather", "Last good diving month (Gulf side)"] },
  { m: 3, name: "April", events: ["Songkran Thai New Year April 13–15 — HUGE 3-day water fight. Bangkok's biggest street party", "Water pistols required on Khao San Road and Silom", "Hotels book months in advance"] },
  { m: 4, name: "May", events: ["Visakha Bucha (Buddha day) — temples packed, alcohol ban one day", "First rains arrive — dramatically cheaper accommodation", "Royal Ploughing Ceremony at Sanam Luang"] },
  { m: 5, name: "June", events: ["Rainy season in force — plan indoor activities", "Great hotel deals", "Fruit season: durian, mangosteen at markets"] },
  { m: 6, name: "July", events: ["Asalha Bucha — Buddhist holy day", "Khao Phansa — monks begin rains retreat (Candle Festival in Ubon Ratchathani)"] },
  { m: 7, name: "August", events: ["Queen Mother's Birthday (Aug 12) — national holiday, white lily flowers everywhere", "Bangkok International Jazz Competition", "Off-peak season continues"] },
  { m: 8, name: "September", events: ["Vegetarian Festival preparation", "River flooding risk in low-lying areas", "Best food market weather — slightly cooler"] },
  { m: 9, name: "October", events: ["Vegetarian Festival — Chinese temples, lion dances, yellow flag restaurants (vegetarian)", "Ok Phansa — end of rains retreat", "Loy Krathong planning"] },
  { m: 10, name: "November", events: ["Loy Krathong — full moon floating candle festival (most beautiful Thai festival)", "Bangkok's best weather starts", "Jazz Festival, World Expo events"] },
  { m: 11, name: "December", events: ["King's Birthday Dec 5 — national holiday", "Christmas events in shopping malls", "New Year countdown at Centralworld + Silom (biggest in Southeast Asia)", "Peak season — book accommodation 2–3 months ahead"] },
];

export function BangkokEventCalendar() {
  const currentMonth = new Date().getMonth();
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        📅 Bangkok event calendar — monthly highlights
      </div>
      <div className="space-y-1">
        {MONTHS.map((m) => (
          <details key={m.name} className={`rounded-xl group border transition ${m.m === currentMonth ? "border-orange-300 bg-orange-50" : "border-[var(--border)]"}`} open={m.m === currentMonth}>
            <summary className="px-3 py-2.5 cursor-pointer flex items-center gap-2 text-xs font-bold text-[var(--fg)]">
              {m.m === currentMonth && <span className="shrink-0 text-orange-500 text-[10px] font-black">▶ NOW</span>}
              <span className="flex-1">{m.name}</span>
              <span className="text-[var(--muted)] group-open:rotate-180 transition text-sm shrink-0">⌄</span>
            </summary>
            <div className="px-3 pb-3 space-y-0.5">
              {m.events.map((e) => (
                <div key={e} className="text-[10px] flex gap-1.5">
                  <span className="shrink-0 text-[var(--accent)]">•</span>
                  <span>{e}</span>
                </div>
              ))}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
