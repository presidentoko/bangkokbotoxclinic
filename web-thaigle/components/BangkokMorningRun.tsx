const ROUTES = [
  {
    name: "Lumpini Park Running Track",
    emoji: "🏃",
    area: "MRT Lumpini or Silom",
    distance: "2.5km loop (park perimeter)",
    time: "Best 5:30–8am",
    why: "Bangkok's premier running location. Flat paved perimeter track. Busy with hundreds of Thai runners daily. Exercise groups, tai chi, early morning drummers. Shaded by large trees. Running alongside Lumpini Lake with bird sightings. Most popular run in the city.",
    tip: "Running groups often form at the main entrance — join any group for paced run. Bring water (vendors from 6am). Running past the aerobic groups at 6am (200+ people exercising together) is a Bangkok-only experience. Crocodiles in the lake — don't be alarmed.",
  },
  {
    name: "Benjakitti Park (LED Running Track)",
    emoji: "🌃",
    area: "MRT Queen Sirikit National Convention Centre",
    distance: "3.5km outer loop",
    time: "Best 5:30–7:30am or 6pm–8pm (evening)  ",
    why: "Bangkok's newest major park. Professional running track with LED lighting system for evening runs. Wider, better-maintained than Lumpini, but newer and slightly less character. Excellent for interval training on the inner track sections. Outdoor gym equipment available free.",
    tip: "Evening runs (6–8pm) are popular and atmospheric — the park lights at night are beautiful. Water fountains in park. Weekend mornings: organized running events sometimes use this track (check social media). The park also connects to Benjakitti Forest Park for longer route.",
  },
  {
    name: "Chao Phraya Riverside Run (Tourist Belt)",
    emoji: "⛪",
    area: "Chao Phraya riverside, Rattanakosin Island area",
    distance: "Variable 3–8km",
    time: "Best 6–7:30am (before tourist rush)",
    why: "Running along the Chao Phraya riverside at dawn is magical. Temples emerge from mist, monks walk for alms, longtail boats motor upriver. Route connects Wat Pho riverside to Sanam Luang. Uneven pavements require attention. Best run for sightseeing-while-exercising.",
    tip: "Start at Maharaj Pier area. Run south along the river then turn back or continue to Pak Khlong flower market. Most riverside sidewalks are passable but narrow — yield to locals. Arrive by 6am before heat and tourist groups. Drink water at the Tha Chang market vendors (open from 5am).",
  },
];

const TIPS = [
  "Bangkok heat: never run past 9am without significant UV/heat acclimatization",
  "Hydration: start hydrating evening before, drink 400ml water before morning run",
  "Clothing: moisture-wicking fabric essential — cotton soaks and chafes in Bangkok humidity",
  "Bangkok's running community: Bangkok Running Club (BRC) organizes weekend group runs — welcoming to visitors",
  "Virtual challenges: Thailand's running community is active on Strava — search Bangkok running groups",
  "Safety: major parks are very safe. Sidewalk running outside parks: watch for motorcycle traffic",
];

export function BangkokMorningRun() {
  return (
    <div className="rounded-2xl border border-green-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-green-700 mb-3">
        🏃 Running in Bangkok — best routes, timing & heat survival guide
      </h2>
      <div className="space-y-2 mb-3">
        {ROUTES.map((r) => (
          <div key={r.name} className="border border-green-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{r.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{r.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{r.distance} · {r.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{r.time}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{r.why}</div>
            <div className="text-[10px] text-green-700">💡 {r.tip}</div>
          </div>
        ))}
      </div>
      <details className="border border-green-100 rounded-xl overflow-hidden">
        <summary className="px-3 py-2 cursor-pointer text-[10px] font-bold text-green-700 hover:bg-green-50">
          Running tips for Bangkok heat
        </summary>
        <ul className="px-3 pb-3 pt-1 space-y-0.5">
          {TIPS.map((t) => (
            <li key={t} className="text-[10px] text-[var(--fg)] flex items-start gap-1.5">
              <span className="text-green-400 shrink-0">•</span>{t}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
