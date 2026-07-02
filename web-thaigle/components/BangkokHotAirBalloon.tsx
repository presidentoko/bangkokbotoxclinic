const OPTIONS = [
  {
    name: "Hot Air Balloon at Singha Park (Chiang Rai)",
    emoji: "🎈",
    type: "Certified tethered balloon flight",
    location: "Singha Park, Chiang Rai (9h from Bangkok or fly)",
    price: "฿900–1,800 per person (15–20 min tethered flight)",
    why: "Thailand's most consistent hot air balloon experience. Singha Park in Chiang Rai offers tethered balloon rides with stunning mountain and tea plantation views. Operated by professional balloon company with safety equipment. Annual Singha Park Ballooning Festival (usually January) is spectacular.",
    tip: "Book ahead for Singha Park — popular on weekends. Best view months: November–February (clear skies, cooler weather). The annual festival (January) adds free balloon viewing events. Fly Bangkok to Chiang Rai on domestic flights (฿1,200–3,500 return).",
  },
  {
    name: "Hot Air Balloon at Thailand Balloon Festival",
    emoji: "🌅",
    type: "Annual festival event",
    location: "Various venues — most recently Chiang Mai area",
    price: "Viewing: free. Tethered ride: ฿400–1,500",
    why: "Thailand holds several annual hot air balloon festivals. The International Balloon Festival in Chiang Mai (typically November/December) features 50+ balloons, night glow events, and tethered rides. Spectacular photography opportunity for balloon enthusiasts.",
    tip: "Check current year dates — festivals have moved venues. Night glow events (balloons lit from inside at dusk) are the most photogenic. Tethered rides during festivals are popular — arrive early morning. Cold weather appropriate clothing needed at festival altitude (Chiang Mai nights, 15–22°C).",
  },
  {
    name: "Captive Balloon (Bangkok City Views)",
    emoji: "🏙️",
    type: "Urban tethered observation balloon",
    location: "Asiatique the Riverfront area (seasonal operation)",
    price: "฿500–1,200 per adult when operating",
    why: "A large tethered helium balloon has operated at various Bangkok locations including Asiatique for panoramic city views. Not traditional hot air balloon but gives same aerial perspective. Rises to 150m for 15 minutes. Seasonal and currently not permanent — check if operating.",
    tip: "Search 'balloon Bangkok 2025' before visiting — this type of attraction opens, closes, moves venues. When operating at Asiatique, best timed for golden hour + night views (6:30–8pm). Corporate event operators also run balloons at major festivals.",
  },
];

export function BangkokHotAirBalloon() {
  return (
    <div className="rounded-2xl border border-orange-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-orange-700 mb-3">
        🎈 Hot air balloon experiences near Bangkok — where & when to fly
      </div>
      <div className="space-y-2">
        {OPTIONS.map((o) => (
          <div key={o.name} className="border border-orange-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{o.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{o.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{o.type} · {o.location}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{o.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{o.why}</div>
            <div className="text-[10px] text-orange-700">💡 {o.tip}</div>
          </div>
        ))}
      </div>
      <div className="mt-2 px-3 py-2 bg-blue-50 rounded-xl text-[10px] text-blue-700">
        <strong>Note:</strong> Full free-flight hot air balloon in Bangkok city is not possible due to airspace restrictions (Suvarnabhumi airport). For full flight, Chiang Rai or Chiang Mai areas are the best options in Thailand.
      </div>
    </div>
  );
}
