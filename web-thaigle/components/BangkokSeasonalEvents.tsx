const EVENTS = [
  {
    month: "January",
    emoji: "🎆",
    events: [
      { name: "New Year Recovery Period", desc: "Bangkok quiets after NYE. Good for sightseeing without crowds. Hotels offer January sales." },
      { name: "Chinese New Year Prep", desc: "Yaowarat Chinatown starts decorating late January. Lanterns go up. Watch for exact date (varies yearly)." },
    ],
    weather: "Cool and dry. Best weather month. 25–32°C. No rain.",
    crowd: "Low-medium",
  },
  {
    month: "February",
    emoji: "🏮",
    events: [
      { name: "Chinese New Year / Tết", desc: "Yaowarat explosion of color and firecrackers. Massive lion dances. Bangkok's most impressive street festival. 3-day celebration." },
      { name: "Valentine's Day Bangkok", desc: "Thai couples + expats make Sukhumvit restaurants extremely busy. Book dinner 2+ weeks ahead." },
    ],
    weather: "Still cool and dry. Excellent. 26–33°C.",
    crowd: "Medium (Chinese New Year week = very busy in Chinatown)",
  },
  {
    month: "April",
    emoji: "💦",
    events: [
      { name: "Songkran — Thai New Year (Apr 13–15)", desc: "Bangkok shuts down. 3 days of national water fight. Khao San Road and Silom are the epicenters. Get wet, embrace it." },
      { name: "Songkran Temple Merit-Making", desc: "Early morning: locals bring offerings to temples, pour water over Buddha images, ask blessings from elders. The spiritual side before the water fights." },
    ],
    weather: "Hottest month. 36–40°C. Very humid. Miserable without water fight excuse.",
    crowd: "Very busy domestically. Bangkok empties as Thais go home — but filled with tourists.",
  },
  {
    month: "November",
    emoji: "🪔",
    events: [
      { name: "Loy Krathong (Full Moon)", desc: "Float decorated banana-leaf cups with flowers and candles on the river. Most beautiful Thai festival. Chao Phraya riverside is packed. Also lanterns (Yi Peng) in northern Thailand." },
      { name: "Bangkok Art Biennale", desc: "International contemporary art event using Bangkok's heritage buildings. Free entry at most venues. October–February dates vary by year." },
    ],
    weather: "End of rainy season. Cooling down. 25–33°C. Last month of serious rain risk.",
    crowd: "High — one of the best times to visit.",
  },
  {
    month: "December",
    emoji: "🎄",
    events: [
      { name: "King's Birthday (Dec 5) / Father's Day", desc: "Thai national holiday. Ratchadamnoen Avenue illuminated. Government buildings decorated. Celebrations throughout Bangkok." },
      { name: "Christmas in Bangkok", desc: "Malls go all-out: CentralWorld has 50m Christmas tree. Asiatique outdoor market with lights. Not a Thai holiday but massive commercial event." },
      { name: "New Year's Eve", desc: "Centralworld countdown, Chao Phraya riverside fireworks, Silom and Asok road parties. Bangkok NYE rivals Singapore for scale." },
    ],
    weather: "Perfect. 22–30°C. No rain. Cool evenings.",
    crowd: "Very high December 24–January 2. Book everything in advance.",
  },
];

export function BangkokSeasonalEvents() {
  return (
    <div className="rounded-2xl border border-yellow-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-yellow-700 mb-3">
        📅 Bangkok seasonal events calendar — month by month
      </div>
      <div className="space-y-2">
        {EVENTS.map((e) => (
          <details key={e.month} className="border border-yellow-100 rounded-xl overflow-hidden group">
            <summary className="px-3 py-2.5 cursor-pointer flex items-center gap-2 hover:bg-yellow-50 transition">
              <span className="text-2xl shrink-0">{e.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{e.month}</div>
                <div className="text-[10px] text-[var(--muted)]">👥 {e.crowd} crowds · ☀️ {e.weather}</div>
              </div>
            </summary>
            <div className="px-3 pb-3 border-t border-yellow-100 pt-2 space-y-1.5">
              {e.events.map((ev, i) => (
                <div key={i}>
                  <div className="text-[10px] font-bold text-yellow-700">{ev.name}</div>
                  <div className="text-[10px] text-[var(--fg)] leading-snug">{ev.desc}</div>
                </div>
              ))}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
