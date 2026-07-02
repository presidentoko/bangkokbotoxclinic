const SPOTS = [
  {
    name: "Bangkok Snooker & Pool Halls",
    emoji: "🎱",
    area: "Multiple areas — Sukhumvit, Silom, RCA",
    price: "Pool table ฿60–120/hour; Snooker table ฿120–200/hour",
    why: "Billiards and snooker culture is deeply embedded in Thai social life. Bangkok has hundreds of pool/snooker halls open until midnight or later. High-quality tables (often English billiard cloth), good lighting. Local players are skilled — a serious game culture rather than tourist-friendly bar environment.",
    tip: "8-ball (pool) is most common; 9-ball also popular; snooker tables in dedicated halls. Thai players often happy to play with visitors — a good way to meet locals. Most halls serve drinks. Bring your own cue for serious play or use house cues (usually passable quality).",
  },
  {
    name: "Q Snooker (Chain Venues)",
    emoji: "🏆",
    area: "Ratchada and multiple Bangkok locations",
    price: "Snooker table ฿150–250/hour",
    why: "Bangkok's most reliable snooker chain — professional snooker tables, maintained to international standards. Popular with Thai snooker enthusiasts who follow professional UK snooker on TV. Some Q Snooker venues have hosted regional amateur tournaments.",
    tip: "Snooker tables require advance booking on evenings and weekends. Weekday afternoons almost always available. The skill level among Thai regular players is high — don't underestimate Bangkok snooker culture.",
  },
  {
    name: "Khaosan Road Area Pool Bars",
    emoji: "🍺",
    area: "Khaosan Road and Banglamphu area",
    price: "Pool table free with minimum drink purchase, or ฿40–80/game",
    why: "More social, less competitive. Backpacker bars on Khaosan Road have pool tables as social lubricant — meet other travelers, challenge for the table. Not serious billiards but good fun. Open until 2am or later.",
    tip: "Much more tourist-friendly than dedicated halls. Games are social rather than competitive. Worth knowing for the Khaosan Road backpacker social circuit rather than billiards skill development.",
  },
];

export function BangkokBilliards() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-gray-700 mb-3">
        🎱 Billiards & snooker in Bangkok — pool halls, snooker clubs & local culture
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-gray-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-gray-600">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
