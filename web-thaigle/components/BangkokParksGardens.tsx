const PARKS = [
  {
    name: "Lumpini Park",
    emoji: "🌳",
    area: "Silom / Siam (Silom MRT)",
    size: "57.6 acres — Bangkok's Central Park",
    why: "Bangkok's most important green space. Morning tai chi, afternoon joggers, evening couples. Giant monitor lizards roam freely — 2+ meters, completely safe and docile.",
    activities: ["Morning tai chi (free group sessions 6:30–7:30am)", "Paddle boats on the lake ฿40/30min", "Jogging track 2.5km perimeter", "Free outdoor gym equipment"],
    tip: "Best 5:30–8am for morning exercise culture. Bring water — no vendors allowed inside. Sunrise and sunset are the most photogenic times. Monitor lizard spotting near the lake.",
    hours: "Daily 4:30am–9pm",
  },
  {
    name: "Bang Krachao (Green Lung)",
    emoji: "🌿",
    area: "Across Chao Phraya from Klong Toei (ferry ฿6)",
    size: "Massive — the urban jungle that survived Bangkok's development",
    why: "Called Bangkok's 'green lung' — a loop of land in the river that remained undeveloped. Dense mangrove, fruit orchards, cycling paths, floating market. Otherworldly given proximity to city.",
    activities: ["Bicycle rental ฿80–100/day at ferry landing", "Pak Kret Floating Market (weekends)", "Mangrove cycling trails (mostly flat)", "Bang Nam Phueng Floating Market"],
    tip: "Come Saturday or Sunday when floating market opens. Ferry from Klong Toei or Wat Klong Toei pier (฿6–9). Bring insect repellent — mosquitoes in dense jungle sections.",
    hours: "Always open. Ferry 6am–8pm",
  },
  {
    name: "Nong Bon Park",
    emoji: "🌻",
    area: "Prawet district (On Nut BTS + taxi)",
    size: "130 acres — Bangkok's largest city park",
    why: "Less famous than Lumpini but larger. Lotus ponds, jogging tracks, outdoor gym, paddleboats. Very local Thai atmosphere — far fewer tourists. Beautiful sunrise over the lake.",
    activities: ["Jogging 3.5km lake perimeter", "Paddle boats ฿40", "Giant outdoor gym (free)", "Fishing (licensed, bring equipment)"],
    tip: "Less known to tourists = authentic Bangkok morning experience. Grab motorbike from On Nut BTS (฿40–50). Weekend mornings: outdoor aerobics sessions and tai chi groups.",
    hours: "Daily 5am–8pm",
  },
  {
    name: "Benjakitti Forest Park",
    emoji: "🌲",
    area: "Asok/Sukhumvit 22 (Asok BTS)",
    size: "130 acres — fully forest park (Phase 2 opened 2022)",
    why: "Bangkok's newest major park, built over a former tobacco factory site. Elevated walkways through urban forest. Night events and light installations on weekends.",
    activities: ["Elevated forest boardwalk (2km)", "Night light installations (some weekends)", "Jogging paths", "Bird watching (migrant species Oct–Mar)"],
    tip: "Very convenient from Asok BTS. Connects to Benjakitti Lake park for longer loop. Evenings especially beautiful — solar-powered lighting. Free always.",
    hours: "Daily 5am–9pm",
  },
];

export function BangkokParksGardens() {
  return (
    <div className="rounded-2xl border border-lime-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-lime-700 mb-3">
        🌳 Bangkok parks & nature — where to escape the city
      </h2>
      <div className="space-y-2">
        {PARKS.map((p) => (
          <details key={p.name} className="border border-lime-100 rounded-xl overflow-hidden group">
            <summary className="px-3 py-2.5 cursor-pointer flex items-center gap-2 hover:bg-lime-50 transition">
              <span className="text-2xl shrink-0">{p.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{p.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{p.area} · {p.hours}</div>
              </div>
            </summary>
            <div className="px-3 pb-3 border-t border-lime-100 pt-2 space-y-1.5">
              <div className="text-[10px] text-[var(--fg)] leading-snug">{p.why}</div>
              <ul className="space-y-0.5">
                {p.activities.map((a) => (
                  <li key={a} className="text-[10px] text-lime-700 flex items-start gap-1.5">
                    <span className="shrink-0">•</span>{a}
                  </li>
                ))}
              </ul>
              <div className="text-[10px] text-orange-600">💡 {p.tip}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
