const VENUES = [
  {
    name: "Timezone — Bangkok's Largest Arcade Chain",
    emoji: "🎮",
    area: "Multiple malls: Central World, Seacon Square, Mega Bangna, Siam Paragon",
    price: "Funcard (stored value) from ฿200; most games ฿5–25/play",
    why: "Timezone operates Bangkok's best-equipped arcade centers with a wide range of machines: rhythm games (Dancing Stage, Taiko no Tatsujin), racing simulators (Mario Kart, Initial D), sports (Basketball, Air Hockey, Claw machines), and redemption ticket games. Good for groups and families. Card-based system means no coin fumbling. Prize redemption counters with small toys and candy.",
    tip: "Load ฿500+ on the funcard for better value deals. Claw machines near the entrance have the best prize-to-difficulty ratio. The redemption counter prizes aren't worth much monetarily — focus on the game experience. Weekend afternoons are busiest; weekday evenings better for rhythm game access.",
  },
  {
    name: "Round1 (Japanese Arcade at ICON Siam)",
    emoji: "🕹️",
    area: "ICON Siam, Riverside",
    price: "Credit system; most machines ฿15–50/play",
    why: "Japanese Round1 mega-arcade bringing the full Japanese arcade experience to Bangkok. UFO catchers (Japanese claw machines) with Japanese prizes, prize game area, sports simulators, karaoke cabins, and bowling lanes. The Japanese claw machine selection is far superior to local Thai arcades — genuine anime merchandise, figures, and plushies. The best arcade experience in Bangkok if you're into Japanese gaming culture.",
    tip: "The UFO catchers at Round1 require specific technique — watch Thai pro gamers at the machines for 5 minutes before spending. Staff will occasionally demonstrate or adjust machine difficulty if you ask politely. Karaoke cabins here are private Japanese-style booths — better soundproofing than standalone karaoke venues.",
  },
  {
    name: "Joystick Bar — Gaming Bar",
    emoji: "👾",
    area: "Ekkamai area",
    price: "Entry with drinks; retro console games included",
    why: "Bar/gaming venue hybrid focused on retro gaming culture — classic consoles (NES, SNES, Genesis, N64, PS1, PS2) with all-time classic titles available alongside craft beers and cocktails. More adult-oriented than family arcades. The retro game selection is curated — actual good games rather than random secondhand titles. Groups of gamers and nostalgia seekers.",
    tip: "Ekkamai's Joystick Bar is best for 90s/early 2000s gaming nostalgia events — Mario Kart 64, Street Fighter II, GoldenEye 007. Order multiple drinks as the gaming is free with consumption. Tuesday and Wednesday have lighter crowds than weekends.",
  },
];

export function BangkokArcade() {
  return (
    <div className="rounded-2xl border border-purple-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-purple-700 mb-3">
        🎮 Arcades in Bangkok — Timezone, Round1 at ICON Siam & retro gaming bars
      </h2>
      <div className="space-y-2">
        {VENUES.map((v) => (
          <div key={v.name} className="border border-purple-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{v.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{v.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{v.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{v.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{v.why}</div>
            <div className="text-[10px] text-purple-700">💡 {v.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
