const SPOTS = [
  {
    name: "Paintball Bangkok — Outdoor Fields",
    emoji: "🎯",
    area: "Phra Khanong, outer Bangkok (multiple venues)",
    price: "Package with gear + 200 balls ฿500–800; Additional balls ฿200–400/100",
    why: "Bangkok's paintball scene caters primarily to corporate team events and bachelor/bachelorette parties — several venues operate outdoor fields with multiple game modes (capture the flag, elimination, last man standing). The Thai paintball venues provide all equipment including full mask, chest protector, and overalls, making it genuinely accessible without any personal gear. The outdoor field environments vary from open woodland to structured bunker courses. Group sizes of 8–20 are the sweet spot; smaller groups can join public sessions on weekends.",
    tip: "Bangkok paintball booking: most venues require advance booking especially for weekends. Dress code: wear old clothes under the overalls provided (paintball stings through thin fabric on direct hits). The paint washes out of clothing but the impact bruising is real — the adrenaline of the game typically overrides noticing hits until after. For corporate team events, Bangkok paintball venues offer packages including BBQ, drinks, and team competition formats that are popular among expat company team-building.",
  },
  {
    name: "Laser Tag & VR Combat Experiences",
    emoji: "⚡",
    area: "Shopping mall game zones — Central Ladprao, MBK, Esplanade",
    price: "Laser tag game ฿150–300; VR combat ฿200–500",
    why: "Bangkok's shopping mall game entertainment sector includes several laser tag arenas and VR shooting/combat experience centers. These provide the combat-game experience without the physical impact and are open to younger participants. The VR combat experiences at venues like VR Zone and Sandbox VR (Thai franchise) in major malls offer shooting, military, and sport simulations. Bangkok's mall entertainment culture means these venues are air-conditioned, centrally located, and often combine with food court access for a full outing.",
    tip: "Laser tag in Bangkok malls: Esplanade Ratchadaphisek has the largest dedicated laser tag arena. Most game zones offer 20-minute laser tag sessions — book same-day at the venue. VR experiences have weight/height restrictions for some equipment and minimum age requirements for intense VR simulations. The combination of laser tag (10–15 min) + VR (10 min) + food court creates a 2-hour mall outing that works well for groups with mixed ages.",
  },
  {
    name: "Archery & Target Shooting Venues",
    emoji: "🏹",
    area: "Indoor archery ranges, Sukhumvit area and outskirts",
    price: "Archery session ฿400–800 (30–60 arrows with coaching); Shooting range per round",
    why: "Target sports — archery and airgun/pistol shooting — have Bangkok venues accessible to tourists and residents. Indoor archery ranges in air-conditioned environments offer lessons for complete beginners through to recurve/compound bow progression. Thai archery culture exists through the national federation's programs, and Olympic recurve archery coaching is available at several Bangkok ranges. Shooting ranges offer legal handgun and rifle shooting under supervision — these are legitimate licensed recreational facilities, not unusual by regional standards.",
    tip: "Bangkok archery for beginners: most ranges start with a 15-minute safety and form introduction before releasing arrows. Expect to shoot recurve (Olympic-style) rather than compound bow unless specifically requested. Finger tabs are provided; form correction from the coach is included. The repetitive meditative quality of archery appeals to a broad personality range beyond sport archery enthusiasts — many Bangkok archery visitors are first-timers looking for something different.",
  },
];

export function BangkokPaintball() {
  return (
    <div className="rounded-2xl border border-lime-300 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-lime-800 mb-3">
        🎯 Paintball & combat sports in Bangkok — outdoor paintball, laser tag, archery & VR
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-lime-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-lime-800">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
