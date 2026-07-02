const SPOTS = [
  {
    name: "Zumba Bangkok — Licensed Instructor Classes",
    emoji: "💃",
    area: "Fitness First (multiple Sukhumvit), Virgin Active, independent studios",
    price: "Gym membership ฿1,800–4,000/month; Drop-in ฿300–600",
    why: "Bangkok's fitness scene has strong Zumba programming — major gym chains (Fitness First has 20+ Bangkok locations, Virgin Active 6 locations) include Zumba in group fitness schedules. Licensed Zumba instructors (ZIN — Zumba Instructor Network) teach at the major gyms and independently at community centers and hotel fitness clubs. Bangkok Zumba classes typically have higher energy participation levels than Western cities — Thai group fitness culture is enthusiastic and social. The outdoor Zumba flash mob events (Lumpini Park, Suan Luang Rama 9) have occurred as city health initiatives.",
    tip: "Best Zumba options in Bangkok: Fitness First's 'MOVE' class is their branded cardio dance class that incorporates Zumba elements. For pure Zumba (ZUMBA® branded program), look for ZIN-certified instructors. Independent Zumba classes near Sukhumvit are often announced through LINE groups and Thai Facebook communities. The outdoor Zumba events at major parks are free and happen during health promotion days — check Bangkok Metropolitan Administration (BMA) event announcements.",
  },
  {
    name: "Latin Dance (Salsa, Bachata, Merengue)",
    emoji: "🎶",
    area: "ONYX nightclub (Sukhumvit), dedicated salsa studios, Latin nights",
    price: "Dance class ฿300–600; Social dancing nights ฿200–400 entry",
    why: "Bangkok's Latin dance community is small but internationally connected — a social salsa and bachata scene runs at several venues with regular class-before-social-dancing events. The expat Latin American community (Venezuelan, Colombian, Brazilian, Mexican) anchors authenticity while Thai participants make the community locally rooted. Latin nights happen weekly at changing venues — the community is mobile and venue-flexible. Beginner salsa classes run before the social dancing at most events, making entry accessible.",
    tip: "Bangkok salsa events: search 'salsa Bangkok' on Facebook Events for current weekly events. The community moves venues frequently — dedicated venues are rare, but the community shows up consistently at whichever location is currently hosting. A 'nivel principiante' (beginner) session runs 1–1.5 hours before social dancing starts — attending this first is the fastest way to integrate. Basic salsa is learnable in 3–4 sessions; bachata's rolling motion is often found easier by beginners.",
  },
  {
    name: "Belly Dancing & Fusion Dance",
    emoji: "🌙",
    area: "Ladies' fitness studios, cultural centers, private studios",
    price: "Class ฿350–700; Monthly ฿3,000–6,000",
    why: "Belly dancing (Oriental/Egyptian dance, raqs sharqi) has a small Bangkok community with several qualified instructors. Bangkok's Middle Eastern restaurant cluster (Sukhumvit Soi 3/11 — Nana area) hosts occasional belly dance performances. Tribal fusion belly dance (ATS — American Tribal Style, combined with Gothic and contemporary influences) has its own Bangkok community. The women's fitness studio scene in Ekkamai and Phrom Phong includes belly dancing as an alternative dance workout.",
    tip: "Belly dancing in Bangkok: search Instagram for #bellydancebangkok to find active instructors. The Nana area's Sukhumvit Soi 3 Middle Eastern restaurants occasionally have live belly dance entertainment (ask the restaurants directly — not always advertised). ATS tribal fusion classes tend to be at independent studios in Ekkamai and On Nut rather than major gym chains. Beginner belly dance is body-image positive — the culture actively welcomes all body types and fitness levels.",
  },
];

export function BangkokZumba() {
  return (
    <div className="rounded-2xl border border-pink-300 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-pink-800 mb-3">
        💃 Dance fitness in Bangkok — Zumba classes, salsa nights & belly dancing
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-pink-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-pink-800">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
