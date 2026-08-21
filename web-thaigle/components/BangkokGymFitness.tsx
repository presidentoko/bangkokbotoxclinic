const GYMS = [
  {
    name: "Jetts Fitness (24-hour chain)",
    emoji: "💪",
    area: "50+ locations across Bangkok including Thong Lo, Phrom Phong, Silom, Ari",
    price: "Day pass ฿250–300, Weekly ฿600, Monthly ฿990–1,500",
    hours: "24/7 (most locations)",
    why: "Best-value quality gym chain in Bangkok. Modern equipment, AC, clean facilities. App-based door entry. Very popular with expats. Best for travelers wanting consistent quality across locations.",
    tip: "Day pass or weekly pass works out cheapest for short stays. Can transfer between locations with the same membership. Avoid first week of January (New Year resolution crowds).",
  },
  {
    name: "Fitness First (Premium)",
    emoji: "🏋️",
    area: "Central Embassy, Siam Paragon, CentralWorld, Emporium",
    price: "Day pass ฿500–700, Monthly ฿2,500–4,000",
    hours: "Mon–Fri 6am–10pm, Sat–Sun 8am–8pm",
    why: "Bangkok's most premium gym chain. World-class equipment, pools, saunas, group fitness classes (yoga, cycling, HIIT). Located inside premium malls — convenient post-shopping.",
    tip: "Class schedules fill fast — book via app. CentralWorld and Paragon locations have pools. Most expensive gyms in Bangkok but genuinely premium quality.",
  },
  {
    name: "Virgin Active Bangkok",
    emoji: "🌟",
    area: "ICON SIAM, Discovery, Future Park",
    price: "Day pass ฿600, Monthly ฿3,500–5,000",
    hours: "Daily 6am–10pm",
    why: "International premium gym. Strong group class culture (90+ weekly classes), large pool, spa facilities, excellent personal training. Most popular with Bangkok's wellness-focused residents.",
    tip: "Trial day pass available — call ahead and mention you're considering membership. Aqua fitness classes in pool are excellent in Bangkok heat.",
  },
  {
    name: "Local Thai Gyms / Independent",
    emoji: "🏘️",
    area: "Everywhere — neighborhood gyms throughout Bangkok",
    price: "Day ฿80–150, Monthly ฿500–800",
    hours: "Usually 5am–9pm",
    why: "Cheap, functional, used by real Thai people. Not Instagram-worthy but equipment works. Often includes free Muay Thai bag area. Best value for longer stays.",
    tip: "Look for 'fitness center' signs in residential areas near BTS stations. Often in the same building as Thai boxing gyms. No English staff — bring a translation app.",
  },
];

export function BangkokGymFitness() {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-emerald-700 mb-3">
        💪 Bangkok gyms — from budget to premium, traveler-friendly options
      </h2>
      <div className="space-y-2">
        {GYMS.map((g) => (
          <div key={g.name} className="border border-emerald-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{g.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{g.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{g.hours} · {g.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{g.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{g.why}</div>
            <div className="text-[10px] text-emerald-700">💡 {g.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
