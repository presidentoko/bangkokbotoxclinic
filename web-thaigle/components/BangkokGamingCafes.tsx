const CAFES = [
  {
    name: "GameYard Bangkok",
    emoji: "🎮",
    area: "RCA / Huai Khwang area",
    price: "฿50–80/hour PC gaming, VR games ฿200–400",
    games: ["PC gaming (Steam library)", "PS5 stations", "VR simulators", "Retro arcade section"],
    why: "Bangkok's most popular gaming café chain. High-spec gaming PCs with RTX 4090s. Good internet (1Gbps). 24-hour access on weekends. Popular with Thai esports community.",
    tip: "Weeknight 2–6pm least crowded. Monthly membership ฿1,800 for unlimited play. Food and drinks available. Teams of 4–6 should book ahead for adjacent PC stations.",
  },
  {
    name: "Esports Arena Bangkok (True Digital Park)",
    emoji: "🏆",
    area: "True Digital Park, Bang Na",
    price: "Free public access + gaming café rates ฿60/hour",
    games: ["Tournament-grade PCs", "Streaming studios", "Practice arena", "Console gaming zone"],
    why: "Thailand's largest esports facility — part of the True Digital Park startup campus. Professional tournament-grade setup. Hosts regional esports tournaments. The most serious gaming venue in Bangkok.",
    tip: "25 minutes from Sukhumvit by BTS (Bang Na station). Worth the trip for serious gamers. Free Wi-Fi and open areas even without paying for gaming. Restaurant and convenience store on-site.",
  },
  {
    name: "Playground VR Bangkok",
    emoji: "🥽",
    area: "Siam Square area",
    price: "VR sessions ฿350–800 (30–60 min depending on experience)",
    games: ["Beat Saber arena", "Escape room VR", "Multiplayer VR battles", "Flight simulator"],
    why: "VR-focused entertainment venue. Multiple VR headsets available simultaneously. Best for groups wanting shared virtual experiences. Kid-friendly options alongside adult experiences.",
    tip: "Beat Saber most popular first-timer experience. Book escape room VR 48 hours ahead — limited slots. Under 8s need guardian supervision. Motion sickness precautions: avoid if prone.",
  },
];

export function BangkokGamingCafes() {
  return (
    <div className="rounded-2xl border border-violet-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-violet-700 mb-3">
        🎮 Gaming cafés & esports venues in Bangkok
      </div>
      <div className="space-y-2">
        {CAFES.map((c) => (
          <details key={c.name} className="border border-violet-100 rounded-xl overflow-hidden group">
            <summary className="px-3 py-2.5 cursor-pointer flex items-center gap-2 hover:bg-violet-50 transition">
              <span className="text-2xl shrink-0">{c.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{c.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{c.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{c.price}</span>
            </summary>
            <div className="px-3 pb-3 border-t border-violet-100 pt-2 space-y-1.5">
              <div className="text-[10px] text-[var(--fg)] leading-snug">{c.why}</div>
              <div className="flex flex-wrap gap-1">
                {c.games.map((g) => (
                  <span key={g} className="px-1.5 py-0.5 bg-violet-50 text-violet-700 rounded text-[10px]">{g}</span>
                ))}
              </div>
              <div className="text-[10px] text-orange-600">💡 {c.tip}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
