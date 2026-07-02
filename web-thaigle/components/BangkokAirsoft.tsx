const SPOTS = [
  {
    name: "Airsoft in Bangkok — Fields & Venues",
    emoji: "🎯",
    area: "Indoor and outdoor airsoft fields throughout Bangkok and surrounding areas — major fields in Bang Na, Minburi, and outskirts",
    price: "Entry fee: ฿200–500; Equipment rental (full kit): ฿200–400; BB ammunition: ฿100–300; Private field booking (group): ฿3,000–10,000",
    why: "Bangkok has a well-developed airsoft community — both organized competitive play and casual rental field experiences for tourists and first-timers. The Thai airsoft scene is active and welcoming: many Bangkok-area fields cater to walk-on players (no prior gear needed) with rental equipment including gun, protective mask, vest, and ammunition. The diversity of Bangkok airsoft venues includes indoor CQB (close quarters battle) fields with tight room-clearing scenarios, outdoor woodland-style fields for longer-range tactical play, and multi-story building mock-ups for urban combat simulation. Thai airsoft culture has a strong community aspect — regular game days bring together clubs and pickup players, and the equipment quality of the domestic market (Bangkok has several shops stocking Tokyo Marui and other quality airsoft brands) is high.",
    tip: "Bangkok airsoft first-timer guidance: eye protection (a full-seal mask, not shooting glasses) is mandatory and provided with rentals — never remove during active play. Face protection (a lower mask covering teeth and jaw) is strongly recommended as BB impacts at close range are genuinely painful without protection. Appropriate clothing: long sleeves and pants reduce skin hits significantly; boots or high-top sneakers are better than low shoes for uneven outdoor field terrain. Pre-booking field visits: most Bangkok airsoft fields can be found on Facebook groups and LINE groups where game days are announced — walk-ins are typically welcome on advertised game days. Bangkok airsoft shops (Chatuchak area and dedicated shops in Bang Na) have staff who can advise on both fields and equipment.",
  },
  {
    name: "Paintball Bangkok",
    emoji: "🎨",
    area: "Paintball venues in Bangkok and surrounding areas — Safari World, Pattaya day trips, Bangkok area venues",
    price: "Paintball entry + 50 balls: ฿400–600; 100 ball package: ฿700–1,000; Full day including all-you-can-shoot events: ฿1,200–2,000",
    why: "Paintball maintains a distinct niche from airsoft in Bangkok — the paintball impact is more definitive (paint marks are visible), game formats favor larger groups and team events, and the experience is more accessible for first-timers without military simulation interest. Bangkok-area paintball fields are popular for corporate team building events, bachelor/bachelorette parties, and group outings. Safari World on the eastern side of Bangkok has a paintball operation that combines with the zoo/marine park visit. Pattaya (90 minutes from Bangkok) has developed paintball as part of its adventure sports cluster alongside bungee jumping and go-kart racing. Bangkok paintball venues typically offer scenario game formats (attack and defend, last team standing) with referee management and full rental equipment.",
    tip: "Bangkok paintball group booking: the team event format is best with 8–20 players for organized scenarios — smaller groups can join walk-in days but may wait for team formation. Paintball impact: paintball hits at direct range hurt more than most people expect — wearing additional padding under the provided suit reduces impact significantly. A common mistake is removing the mask between games (even on field edges) — a stray paintball at distance still carries significant energy. Photography: the colorful aftermath of a paintball session makes for genuinely entertaining team photos — coordinate with the venue about post-game photo opportunities on the field.",
  },
  {
    name: "Laser Tag & Combat Gaming",
    emoji: "🔫",
    area: "Laser tag venues in Bangkok shopping malls — Siam Square, CentralWorld area, Major Cineplex complexes",
    price: "Laser tag per game (15–20 minutes): ฿150–300; Multi-game package: ฿400–700; Group booking ฿3,000–5,000 for private session",
    why: "Laser tag occupies the family-friendly and lower-intensity end of the combat gaming spectrum in Bangkok — suitable for children, mixed-age groups, and people who want the team dynamics of tactical shooting games without the physical impact of paintball or airsoft. Bangkok's laser tag venues in shopping malls provide climate-controlled, accessible experiences that work for afternoon entertainment. The format (teams competing for tag counts, indoor arena with cover and obstacles) is consistent with laser tag globally, with Bangkok venues typically offering 15–20 minute games with electronic vests and phaser guns that track hits. Shopping mall laser tag venues are particularly practical for tourist groups who are already at the mall for dining or shopping.",
    tip: "Bangkok laser tag strategy: the sensor placement on laser tag vests (shoulder, chest, back) creates predictable vulnerability patterns — crouch to reduce chest exposure and turn sideways when stationary behind cover. Most Bangkok laser tag venues play with the same basic rules regardless of group composition — if playing with mixed experience players, a brief team strategy huddle before entering (simple role assignments: aggressive vs. defensive players) dramatically improves team cohesion. The smoke and blacklight environments in Bangkok laser tag arenas can disorienting for first-timers — take 30 seconds at the start to establish orientation before engaging.",
  },
];

export function BangkokAirsoft() {
  return (
    <div className="rounded-2xl border border-green-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-green-700 mb-3">
        🎯 Bangkok airsoft & combat sports — airsoft fields, paintball & laser tag
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-green-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-green-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
