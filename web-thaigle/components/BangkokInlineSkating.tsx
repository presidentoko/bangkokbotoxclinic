const SPOTS = [
  {
    name: "Lumpini Park Inline Skating",
    emoji: "⛸️",
    area: "Lumpini Park perimeter path",
    price: "Park entry free; Skate rental ฿80–150/hr at park entrance",
    why: "The 2.5km Lumpini Park perimeter path is smooth enough for inline skating — especially the newer sections. Saturday evenings the park hosts organized skating sessions with group beginners' lessons. Thai skate community uses the park regularly. Very social, family-friendly environment.",
    tip: "Skate rental available near Lumpini Gate 1 (Silom side). Bring knee pads and wrist guards if you have them — rental shops usually have basic protection gear for ฿50 extra. Avoid Sunday morning when it's most crowded with walkers/runners.",
  },
  {
    name: "Benjakitti Park Elevated Walkway",
    emoji: "🛤️",
    area: "Benjakitti Park, MRT Queen Sirikit",
    price: "Free (smooth paved surface)",
    why: "Newer park with wide, well-maintained paths. Elevated boardwalk sections provide interesting terrain changes. Less crowded than Lumpini for skating, especially on weekday evenings when lit. The park's main paths are smooth and properly paved — better surface than Lumpini's older sections.",
    tip: "The main lake loop path is approximately 2.5km and suitable for inline skating. No dedicated skate rental at this park — bring your own. Avoid the narrow elevated boardwalk sections at speed when pedestrians are present.",
  },
  {
    name: "Chatuchak Inline Skating Weekends",
    emoji: "🌿",
    area: "Chatuchak Park, adjacent to weekend market",
    price: "Free; Skate rental sometimes available ฿100–150",
    why: "Weekend morning skating scene at Chatuchak Park. Larger dedicated area than Lumpini. Thai skating group (Bangkok Skaters Club) often meets here Saturday mornings — welcome to visitors. The flat park surface is ideal for beginners. Occasional organized skating events.",
    tip: "Bangkok Skaters Club posts event meetups on Facebook — joining gives access to group sessions with experienced skaters. Helmet recommended in group setting. Weekend market means parking and crowds — arrive by public transit (BTS Mo Chit).",
  },
];

export function BangkokInlineSkating() {
  return (
    <div className="rounded-2xl border border-cyan-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-cyan-700 mb-3">
        ⛸️ Inline skating in Bangkok — park routes, rental & skating community
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-cyan-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-cyan-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
