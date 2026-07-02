const INFO = [
  {
    heading: "IRONMAN & Triathlon Races in Thailand",
    emoji: "🏊🚴🏃",
    content: "Thailand hosts multiple IRONMAN and triathlon events annually. IRONMAN Thailand in Phuket is the flagship event (December) — 3.8km swim, 180km bike, 42.2km run. IRONMAN 70.3 Phuket, 70.3 Pattaya, and Bangkok Triathlon are other options. Registration opens months ahead — check Ironman.com/asia-pacific for schedule.",
    tip: "Bangkok itself isn't ideal for bike training (traffic) — most Bangkok-based triathletes travel to Kanchanaburi or Khao Yai for long ride training. The swimming and running components are trainable in Bangkok (hotel pool for swim, parks for run).",
  },
  {
    heading: "Triathlon Training Groups",
    emoji: "👥",
    content: "Bangkok Triathlon Club (BTC) is the main organized tri group — weekly group rides (Kanchanaburi road routes), open water swims at Bangpra reservoir (2 hrs from Bangkok), and track running sessions. Mix of Thai national team athletes and expat enthusiasts. Training level from beginner to competitive Kona qualifier.",
    tip: "Facebook: 'Bangkok Triathlon Club' — active community. Group rides typically depart 4:30am Saturday to beat traffic out of Bangkok. Annual club championship is a social highlight. Kit (cycling kit) available from members.",
  },
  {
    heading: "Equipment & Gear",
    emoji: "🚲",
    content: "Serious tri gear available in Bangkok: Cervelo, Trek, Specialized tri bikes available at specialized shops. Running shoes: NB, Asics, Nike at SportWorld and running specialty stores. Wetsuits available to buy but rarely needed in Thailand (water temperature 27–30°C year-round). Swim gear at Pro Shop near major hotel pools.",
    tip: "Bike fit is available at premium Bangkok cycle shops — essential for tri position. Nutrition (gels, electrolytes) available at Tops and Villa markets. Sports medicine and physiotherapy at Bangkok Hospital Sports Medicine is used by national level athletes.",
  },
];

export function BangkokTriathlon() {
  return (
    <div className="rounded-2xl border border-indigo-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-indigo-700 mb-3">
        🏊🚴🏃 Triathlon in Bangkok — training clubs, IRONMAN Thailand & gear
      </div>
      <div className="space-y-2">
        {INFO.map((i) => (
          <div key={i.heading} className="border border-indigo-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-xl shrink-0">{i.emoji}</span>
              <div className="font-bold text-xs">{i.heading}</div>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-1 leading-snug">{i.content}</div>
            <div className="text-[10px] text-indigo-700">💡 {i.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
