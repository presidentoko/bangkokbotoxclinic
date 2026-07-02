const SPOTS = [
  {
    name: "Wat Arun from the river (Chao Phraya)",
    emoji: "🛶",
    area: "Chao Phraya River, best from Maharaj Pier area",
    access: "Free from riverbank; ฿30 boat crossing to Wat Arun",
    why: "Sunset at Wat Arun (Temple of Dawn) is paradoxically best at sunset. The west-facing porcelain mosaic temple turns gold-orange as sunlight rakes across its ornate surface. View from the river or across from Maharaj Pier. Bangkok's most photographed sunset.",
    tip: "Position yourself across the river from Wat Arun — not on it. Best vantage: Maharaj Pier area or the roof terrace of restaurants along that strip. Golden hour starts 30 min before published sunset time. Set phone to 'portrait' mode and be patient — clouds change the quality.",
  },
  {
    name: "Mahanakhon Skywalk (78th Floor)",
    emoji: "🏙️",
    area: "Silom/Chong Nonsi BTS area",
    access: "฿870 general; ฿1,050 with glass floor",
    why: "Bangkok's highest publicly accessible point. 360-degree city view from 314m. Glass floor extends beyond building edge. Sunset turns the entire Bangkok grid gold — you can see both rivers, the Gulf of Thailand on clear days, and hundreds of temple spires.",
    tip: "Sunset times change monthly — check online (5:30–6:30pm range). Book online to avoid queues. The glass floor experience is worth the extra price — stepping off the edge sensation is memorable. Champagne bar available on the same level.",
  },
  {
    name: "Lebua State Tower Rooftop (Sirocco)",
    emoji: "🍸",
    area: "Silom/Bang Rak area",
    access: "Smart dress code + cocktail minimum spend ฿1,000+",
    why: "The original Bangkok sky bar — 63 floors, open-air circular bar, 360-degree views. Made famous by The Hangover Part II. Sunset here is theatrical — you're standing on the rim with Bangkok sprawling 250m below. Best 6–7pm timing.",
    tip: "Dress code strictly enforced: smart casual, no shorts or sandals for men, no flip-flops. Take the lift to the 59th floor, then walk up stairs. Cocktails ฿550–950 — expensive but you're paying for the location. Reservations not required but smart to book for weekend sunset.",
  },
  {
    name: "Golden Mount (Wat Saket) at Sunset",
    emoji: "🔔",
    area: "Old City / Democracy Monument area",
    access: "Entry ฿100",
    why: "17th-century golden pagoda on Bangkok's only hill offers 360-degree views of Old Bangkok at sunset. Temple bells ring as the sky turns orange behind Rattanakosin Island's spires. Far more authentic and atmospheric than hotel rooftops. Stairs (300+) provide the workout.",
    tip: "Climb the 300+ steps — rest at each of the 4 intermediate levels for photos. Summit bell (ring for good luck) at sunset is powerful. Golden Mount's sunset is busier now than 10 years ago but still manageable. Less crowded weekday afternoons. Buy entry tickets at base.",
  },
];

export function BangkokSunsetViews() {
  return (
    <div className="rounded-2xl border border-orange-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-orange-700 mb-3">
        🌅 Bangkok sunset spots — rooftops, river views & temple silhouettes
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-orange-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.access}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-orange-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
