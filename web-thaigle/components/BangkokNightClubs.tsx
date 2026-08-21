const CLUBS = [
  {
    name: "Onyx (RCA — Royal City Avenue)",
    emoji: "🎵",
    area: "RCA Road (Phra Ram 9 MRT, then taxi)",
    price: "Cover ฿400–600 (includes drinks), Without drinks ฿200–300",
    music: "EDM, Tech House, mainstream dance",
    crowd: "Mixed Thai and international. 20–30s",
    why: "Bangkok's biggest club complex. Multiple rooms: EDM main floor + hip-hop room + open-air bar. Thai professional crowd on Fridays, more international on Saturdays.",
    tip: "Dress code: no shorts, no flip-flops, no sleeveless. Get there before midnight to avoid 45-min queues. Grab + taxi back to Sukhumvit ฿150–200.",
  },
  {
    name: "Levels Club (Sukhumvit Soi 11)",
    emoji: "🏙️",
    area: "Sukhumvit Soi 11, directly accessible from Nana BTS",
    price: "Cover ฿400–500, table booking required for VIP",
    music: "Commercial EDM, hip-hop, R&B, mainstream",
    crowd: "Heavy tourist and expat mix, 21–35",
    why: "Bangkok's most internationally-known club — featured in every 'Bangkok nightlife' list. Rooftop section has city views. Central location, easy BTS access.",
    tip: "Saturdays most crowded. Lines peak 1–2am. Pre-book table via their Instagram to skip queue. Bar prices: cocktails ฿350–450, beers ฿180–220.",
  },
  {
    name: "Studio Lam (Sukhumvit 51)",
    emoji: "🌏",
    area: "Sukhumvit Soi 51, Thong Lo area",
    price: "No cover charge. Drinks ฿200–350.",
    music: "Thai molam, luk thung, Southeast Asian electronic, world beats",
    crowd: "Thai creatives and educated expats, 25–40",
    why: "Bangkok's cult vinyl bar and dance club for people who care about music. Playing molam, luk thung, Thai country music + world music. Not mainstream — this is where music nerds go.",
    tip: "Run by Zudrangma Records — buy vinyl here. DJ sets run Thursday–Saturday nights. Small, intimate — perfect for dancing close. No tourist vibe whatsoever.",
  },
  {
    name: "Glow (Sukhumvit Soi 23)",
    emoji: "🔆",
    area: "Sukhumvit Soi 23, near Asok BTS",
    price: "Cover ฿200–400, sometimes free before midnight",
    music: "Underground electronic: techno, house, deep house",
    crowd: "Bangkok's underground music scene, 24–38",
    why: "Bangkok's most respected underground electronic music venue. Monthly international DJ bookings. Sound system is exceptional. Not for mainstream clubbers — for people who love electronic music.",
    tip: "Check their Facebook for events — different theme each night. Techno nights on certain Saturdays have the best sound. Arrive after 1am for full energy.",
  },
];

export function BangkokNightClubs() {
  return (
    <div className="rounded-2xl border border-violet-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-violet-700 mb-3">
        🎵 Bangkok nightclubs — from underground to mainstream
      </h2>
      <div className="space-y-2">
        {CLUBS.map((c) => (
          <details key={c.name} className="border border-violet-100 rounded-xl overflow-hidden group">
            <summary className="px-3 py-2.5 cursor-pointer flex items-center gap-2 hover:bg-violet-50 transition">
              <span className="text-2xl shrink-0">{c.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{c.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{c.music} · {c.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{c.price}</span>
            </summary>
            <div className="px-3 pb-3 border-t border-violet-100 pt-2 space-y-1">
              <div className="text-[10px] text-violet-700">👥 {c.crowd}</div>
              <div className="text-[10px] text-[var(--fg)] leading-snug">{c.why}</div>
              <div className="text-[10px] text-orange-600">💡 {c.tip}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
