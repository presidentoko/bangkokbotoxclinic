const GYMS = [
  {
    name: "EDGE Climbing (ECC Ekkamai)",
    emoji: "🧗",
    area: "Ekkamai BTS / Ekkamai Soi 5",
    price: "Day pass ฿350, Shoe rental ฿50, Harness ฿50",
    height: "14m lead walls, bouldering cave",
    why: "Bangkok's most comprehensive climbing gym. Lead, top-rope, and bouldering. Strong community — classes every day.",
    tip: "First-time climbers: book the intro course (฿500, 90 min). Includes technique basics, safety, and belay certification.",
    open: "Mon–Fri 10am–10pm, Sat–Sun 9am–9pm",
  },
  {
    name: "Rockies Bouldering (Silom)",
    emoji: "🪨",
    area: "Silom area / Bang Rak",
    price: "Day pass ฿300, Shoe rental ฿50",
    height: "Bouldering only — up to 4.5m walls",
    why: "No harness, no rope — pure bouldering. Most beginner-friendly option. Bangkok's most social climbing spot. Coffee bar inside.",
    tip: "Problems reset weekly (Thursdays usually). Wednesday evenings popular for community bouldering sessions.",
    open: "Daily 10am–10pm",
  },
  {
    name: "Stone Monkeys (On Nut)",
    emoji: "🐒",
    area: "Sukhumvit 77 (On Nut BTS, 10 min walk)",
    price: "Day pass ฿280, Monthly ฿2,200",
    height: "Mixed bouldering and sport climbing",
    why: "Smaller but strong local community. Good for intermediate and advanced climbers. Less crowded than EDGE on weekends.",
    tip: "Regular moonlight climbing events — open 10pm–2am some Saturdays. Check their Instagram for schedule.",
    open: "Mon–Fri 2pm–10pm, Sat–Sun 10am–8pm",
  },
  {
    name: "Outdoor Climbing — Krabi",
    emoji: "🌴",
    area: "Day trip or overnight: Krabi is 1hr flight from BKK",
    price: "Flight ฿800–2,000, guided climbing ฿1,200/half-day",
    height: "Sea cliffs to 200m — world-class limestone",
    why: "If you're a serious climber, Krabi's Railay Beach and Ton Sai cliffs are bucket-list destinations. Deep Water Soloing also available.",
    tip: "Rainy season (May–Oct) makes cliffs slippery. Best months Nov–Apr. Book courses with King Climbers or Hot Rock climbing schools.",
    open: "Year-round (conditions dependent)",
  },
];

export function BangkokClimbingGyms() {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-stone-700 mb-3">
        🧗 Bangkok climbing gyms — bouldering, sport climbing & more
      </div>
      <div className="space-y-2">
        {GYMS.map((g) => (
          <div key={g.name} className="border border-stone-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{g.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{g.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{g.area} · {g.open}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{g.price}</span>
            </div>
            <div className="text-[10px] text-stone-700 mb-0.5">Wall: {g.height}</div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{g.why}</div>
            <div className="text-[10px] text-orange-600">💡 {g.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
