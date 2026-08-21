const SPOTS = [
  {
    name: "Pathumwan Princess Skate Park (Bangkok Art & Culture Centre)",
    emoji: "🛹",
    area: "Siam / National Stadium BTS",
    price: "Free",
    why: "Bangkok's most central skate spot. The plaza outside BACC has smooth concrete, ledges, rails, and steps that have been skated for 20+ years. Unofficial but accepted. Street skaters and BMX riders use it daily. Near MBK and Siam BTS.",
    tip: "Security occasionally enforces no-skating rules — friendly approach and waiting it out usually works. Best session time: 4–7pm when most skaters gather. Small skate community but welcoming to visitors. Bring your own board — no rentals here.",
  },
  {
    name: "Skateboard Park at Chatuchak Park",
    emoji: "🏙️",
    area: "Chatuchak / Mo Chit area",
    price: "Free (park entry free)",
    why: "Official Chatuchak Park skateboard area. Smooth asphalt, properly maintained, with small ramps and rails. Shaded by trees. Popular with local teens. The only formal public skate area in Bangkok. Beginner friendly — not aggressive terrain.",
    tip: "Not huge by world standards (small ramp + grind rail + flatground) but maintained and free. Sessions busiest weekends 3–6pm. Nearby rental shops sell beginner boards (฿300–600/day). The park also has cycling and walking paths — less crowded on weekdays.",
  },
  {
    name: "Mega Bangna Skate Park (Ramp Section)",
    emoji: "🏬",
    area: "Bang Na, East Bangkok (45 min from center)",
    price: "Entry to area free; gear rental available",
    why: "Mega Bangna mall has an outdoor skate area adjacent to the mall complex. Larger than most Bangkok options with mini-ramp and beginner bowl. Protected from rain by mall overhang. Board rentals and protective gear available from adjacent sports store.",
    tip: "Best option for beginners — gear rental available, supervised, less street intimidation. Staff at adjacent sports store can give pointers. Mall access for food and AC when you need a break. Worth the trip if you're serious about skating during Bangkok stay.",
  },
];

const CULTURE = [
  "Bangkok's skate scene is underground but genuine — centered around local kids, not tourists",
  "Respect unwritten rules: don't drop in on someone else's run, clap for good attempts",
  "Thai skate brands: Rager, Slum Dog — check Chatuchak Weekend Market for local gear",
  "SUP (Stand-Up Paddle): different scene, Chao Phraya has clubs that rent boards",
  "BMX community overlaps with skate in Bangkok — often share Pathumwan space",
  "Heat note: sessions before 8am or after 4pm significantly more comfortable",
];

export function BangkokSkateParks() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-gray-700 mb-3">
        🛹 Skateboarding in Bangkok — parks, spots & scene guide
      </h2>
      <div className="space-y-2 mb-3">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-gray-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-gray-600">💡 {s.tip}</div>
          </div>
        ))}
      </div>
      <details className="border border-gray-100 rounded-xl overflow-hidden">
        <summary className="px-3 py-2 cursor-pointer text-[10px] font-bold text-gray-700 hover:bg-gray-50">
          Bangkok skate culture guide
        </summary>
        <ul className="px-3 pb-3 pt-1 space-y-0.5">
          {CULTURE.map((c) => (
            <li key={c} className="text-[10px] text-[var(--fg)] flex items-start gap-1.5">
              <span className="text-gray-400 shrink-0">•</span>{c}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
