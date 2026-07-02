const LOCATIONS = [
  {
    name: "BACC — Bangkok Art & Culture Centre",
    emoji: "🏛️",
    area: "National Stadium BTS (directly connected)",
    admission: "Free entry, rotating exhibitions",
    open: "Tue–Sun 10am–9pm (closed Monday)",
    why: "Bangkok's premier contemporary art center. 8 floors of rotating galleries plus permanent collection. International and Thai artists. Free admission makes this Bangkok's best cultural deal.",
    tip: "Basement level has café. Top floors better natural light for photography. Check BACC website for current exhibitions before visiting — some are exceptional.",
  },
  {
    name: "MAIIAM Contemporary Art Museum",
    emoji: "🎨",
    area: "Chiang Mai (1hr flight) — but worth special mention",
    admission: "฿150 adults",
    open: "Wed–Mon 10am–6pm",
    why: "Thailand's most important contemporary art museum. Not in Bangkok, but if serious about Thai contemporary art, plan a day trip to Chiang Mai for MAIIAM.",
    tip: "Bangkok → Chiang Mai flight ฿800–2,000. MAIIAM is 15 min from Chiang Mai airport. Combine with 1 night in Chiang Mai for a proper arts weekend.",
  },
  {
    name: "100 Tonson Gallery",
    emoji: "🖼️",
    area: "Ploenchit BTS area, Soi Lang Suan",
    admission: "Free, private gallery",
    open: "Tue–Sat 11am–7pm",
    why: "Bangkok's most important commercial art gallery. Shows major Thai and international contemporary artists. Serious collector space — not a tourist gallery.",
    tip: "Exhibition openings (usually Thursday evenings) are Bangkok's art social events — attend for the scene and free wine as much as the art.",
  },
  {
    name: "River City Bangkok Gallery Floors",
    emoji: "🛶",
    area: "River City complex, near Si Phraya pier",
    admission: "Free, individual gallery admissions vary",
    open: "Daily 10am–8pm",
    why: "Bangkok's most commercially active art district. 3rd and 4th floors of River City filled with antique dealers, fine art galleries, and auction houses. Regular auctions of Thai antiques and Southeast Asian art.",
    tip: "The quarterly antique auction at River City is a Bangkok institution — attend even as observer. Pre-auction viewing is free. Bidder registration if planning to buy.",
  },
];

export function BangkokPublicArtGuide() {
  return (
    <div className="rounded-2xl border border-indigo-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-indigo-700 mb-3">
        🎨 Bangkok contemporary art — galleries, museums & the scene
      </div>
      <div className="space-y-2">
        {LOCATIONS.map((l) => (
          <div key={l.name} className="border border-indigo-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{l.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{l.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{l.area} · {l.open}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{l.admission}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{l.why}</div>
            <div className="text-[10px] text-indigo-700">💡 {l.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
