const SPOTS = [
  {
    name: "VR Gaming in Bangkok",
    emoji: "🥽",
    area: "VR arcades throughout Bangkok — shopping malls (Siam Paragon, Terminal 21), dedicated VR venues in Sukhumvit area",
    price: "VR arcade session ฿300–600/30 minutes; VR room (2–4 players) ฿800–2,000/hour; Premium VR experience ฿500–1,500/experience",
    why: "Bangkok's VR gaming scene has expanded significantly since 2020 — the city's mall-culture infrastructure (multiple large shopping centers with entertainment floors) has provided venues for VR arcades that have established Bangkok as one of Southeast Asia's better developed VR entertainment markets. Bangkok's VR venues range from single-station HTC Vive or Oculus Quest setups in mall corridors to purpose-built VR arenas with free-roam tracking systems where multiple players move in physical space. The free-roam VR format (where players physically walk through a tracked arena space matching a virtual environment) is the highest-engagement VR experience — Bangkok has multiple venues offering this at prices significantly below equivalent Western experiences. Thai audiences have enthusiastically adopted VR gaming — venues run at high utilization on weekends and holidays.",
    tip: "Bangkok VR practical guidance: the mall-based VR experiences (Siam Paragon 5th floor entertainment zone, Terminal 21, and similar) are accessible and good for first-time VR visitors — staff assistance is provided, no prior VR experience needed. For higher quality experiences: dedicated VR arcades (search 'VR arena Bangkok') have better hardware, larger spaces, and more diverse game catalogs than mall kiosks. Motion sickness: VR motion sickness is real for some people — if you have a history of motion sensitivity, start with standing/seated VR experiences before attempting free-roam movement VR. The experience lasts longer with fewer sessions — a 30-minute VR session is typically more immersive and complete than multiple short sessions. Group bookings are recommended for free-roam VR as the multi-player formats are more engaging than single-player.",
  },
  {
    name: "Escape Rooms & Interactive Entertainment",
    emoji: "🔒",
    area: "Escape room venues throughout Bangkok — Escape Hunt (multiple branches), The Codex, numerous independent operators",
    price: "Standard escape room (60 min, 2–6 players) ฿500–900/person; Premium/theatrical room ฿800–1,500/person; Group packages often available",
    why: "Bangkok's escape room industry is mature and competitive — the city has over 100 escape room venues offering diverse concepts from standard locked-room puzzles to elaborate theatrical experiences with live actors, props, and cinematic production values. The most distinctive Bangkok escape rooms: The Codex (multiple Bangkok locations, known for quality puzzle design and room atmosphere), Escape Hunt (international brand with consistent quality), and numerous independent operators competing aggressively on creative concepts. Bangkok escape rooms often incorporate Thai cultural elements — ghost stories (Mae Nak theme rooms are popular), traditional Thai setting puzzles, and supernatural Bangkok themes that add local specificity to the format. Language: most reputable Bangkok escape rooms offer English-language game master communication and puzzle content.",
    tip: "Bangkok escape room booking: online pre-booking (via venue websites or Klook/GetYourGuide) is strongly recommended for popular venues and weekends — walk-in availability is limited. Team size optimization: escape rooms designed for 4–6 people work best at their target range — smaller groups in large rooms or large groups in small rooms both reduce the experience quality. Difficulty settings: most Bangkok venues offer difficulty selection — experienced escape room players should communicate prior experience to get appropriate challenge. The 'hint' culture: Thai escape rooms typically have game masters available for hints via intercom or walkie-talkie — using hints when genuinely stuck is normal and preserves the fun of solving puzzles. Post-game: many Bangkok escape room venues have adjacent cafés or partner with nearby food options — factor this into the outing plan.",
  },
  {
    name: "Gaming Cafés & Esports",
    emoji: "🎮",
    area: "Gaming cafés throughout Bangkok — concentrations near universities (Siam, Lat Phrao, Rangsit) and entertainment districts",
    price: "Gaming café per hour ฿30–60; Premium PC station ฿60–120/hour; Esports arena entry ฿100–300; Console gaming ฿50–100/hour",
    why: "Bangkok's gaming café (net café) culture is one of the world's most developed — the tradition dates to the 2000s internet café era and has evolved into premium gaming venues with high-end gaming PCs (RTX 4080/4090 class GPUs, 240Hz monitors, mechanical keyboards), ergonomic gaming chairs, private rooms, and community spaces. The Thai esports scene is regionally significant — Thailand has competitive players in PUBG, League of Legends, Valorant, and Free Fire at the professional level, and the local gaming culture that feeds this competitive scene is visible in Bangkok's gaming cafés. Bangkok's major gaming café chains (Pantip Plaza area, numerous university-adjacent locations) are social hubs for young Thai gamers — the café format remains popular despite home gaming because of the social atmosphere and the equipment quality relative to home setups.",
    tip: "Bangkok gaming café experience: even visitors unfamiliar with gaming café culture can walk in and rent a station — the process is typically: register at the counter with ID, choose a station, buy gaming tokens or hourly credit, sit down and game. Hourly rates are displayed clearly. Steam, Battle.net, Origin, and Epic Games launchers are typically pre-installed — login with your own account. Note that some game licenses may be restricted by region (VPNs are commonly used in Bangkok gaming cafés for this reason). Esports events: Bangkok hosts regional esports tournaments periodically — Impact Arena and Bangkok Arena have hosted major esports events. The ROV (Arena of Valor/Realm of Valor) mobile game is particularly dominant in Thailand's competitive esports scene — distinctively Thai/Southeast Asian gaming culture.",
  },
];

export function BangkokVR() {
  return (
    <div className="rounded-2xl border border-violet-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-violet-700 mb-3">
        🥽 Bangkok VR & gaming — virtual reality arenas, escape rooms & gaming cafés
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-violet-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-violet-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
