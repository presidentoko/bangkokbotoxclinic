const TRACKS = [
  {
    name: "Speed Park Karting (Rama 9)",
    emoji: "🏎️",
    area: "Rama 9 / Huai Khwang",
    price: "10-min session ฿350–550; corporate packages available",
    why: "Bangkok's most central go-kart track. 450m indoor track, air-conditioned building, professional karts with speed limiter settings for beginners. Adult and junior karts. Good for spontaneous afternoon activity. Accepts walk-ins.",
    tip: "Helmet and suit provided — bring socks (required, closed-toe shoes also required). Evening sessions cooler and more atmospheric. First-timers: choose the slower kart setting, then upgrade speed. Average lap time 35–50 seconds for beginners.",
  },
  {
    name: "Easy Kart Thailand",
    emoji: "🏁",
    area: "Multiple Bangkok locations (RCA and Ratchaphruek)",
    price: "10-min race ฿400–700",
    why: "International-standard karting chain. Two Bangkok locations. Timed laps displayed on screen. Racing suits and helmets provided. Staff speak English. Good for competitive groups wanting real race experience with timing systems.",
    tip: "RCA location nearest to central Bangkok. Online booking available for groups (5+). Corporate events package includes racing suits with your name, podium ceremony, champion trophy. Minimum height requirement: 140cm for adult track.",
  },
  {
    name: "Siam Park City Go-Karts",
    emoji: "🚗",
    area: "Khan Na Yao, East Bangkok",
    price: "Per race ฿150–300 (combo tickets available)",
    why: "Go-karts as part of the Siam Park City amusement complex. Longer outdoor track (1km). Slower karts but more of a scenic experience. Good for combining with water park visit. Family-friendly with junior track option.",
    tip: "Best as add-on to full Siam Park City day pass — the combo pricing makes karting essentially free. Junior track (age 6–12) is enclosed and very safe. Outdoor track means heat — consider early morning or after 4pm for shade.",
  },
];

const TIPS = [
  "Racing technique: brake before corners (not during), accelerate out of the apex",
  "Wet/sweaty hands = better grip in karts — don't worry about sweating",
  "Never bump other karts on purpose — most tracks issue immediate stop-and-go penalties",
  "Improve lap time: look ahead not at front of kart, smooth inputs beat aggressive driving",
  "Corporate kart racing: minimum 8 cars for proper race format, book at least 1 week ahead",
];

export function BangkokKarting() {
  return (
    <div className="rounded-2xl border border-orange-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-orange-700 mb-3">
        🏎️ Go-karting in Bangkok — tracks, prices & racing tips
      </div>
      <div className="space-y-2 mb-3">
        {TRACKS.map((t) => (
          <div key={t.name} className="border border-orange-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{t.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{t.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{t.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{t.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{t.why}</div>
            <div className="text-[10px] text-orange-700">💡 {t.tip}</div>
          </div>
        ))}
      </div>
      <details className="border border-orange-100 rounded-xl overflow-hidden">
        <summary className="px-3 py-2 cursor-pointer text-[10px] font-bold text-orange-700 hover:bg-orange-50">
          Karting tips for faster laps
        </summary>
        <ul className="px-3 pb-3 pt-1 space-y-0.5">
          {TIPS.map((t) => (
            <li key={t} className="text-[10px] text-[var(--fg)] flex items-start gap-1.5">
              <span className="text-orange-400 shrink-0">•</span>{t}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
