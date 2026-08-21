const METHODS = [
  {
    method: "BTS Skytrain",
    emoji: "🚈",
    cost: "฿17–59/ride (distance-based)",
    speed: "Fast — avoid traffic entirely",
    bestFor: "Sukhumvit + Silom corridors, airport",
    avoid: "Doesn't reach Old City, Chinatown, Chatuchak (need MRT)",
    tip: "Rabbit Card (฿100 deposit + credit) for tap-and-go. Saves queuing. Get at any BTS station.",
  },
  {
    method: "MRT Subway",
    emoji: "🚇",
    cost: "฿17–42/ride",
    speed: "Fast — underground, no traffic",
    bestFor: "Chatuchak, Huai Khwang, China Town (Sanam Chai, Hua Lamphong), Queen Sirikit",
    avoid: "Limited network vs BTS. Not all tourist areas covered.",
    tip: "Connects to BTS at multiple interchange stations (Asok=Sukhumvit, Mo Chit=Chatuchak Park). Buy stored value card.",
  },
  {
    method: "Grab Car/Taxi",
    emoji: "🚗",
    cost: "฿50–300 most rides within Bangkok",
    speed: "Slow in peak hours (7–9am, 5–8pm)",
    bestFor: "Late night, short distances, areas without BTS/MRT, rain",
    avoid: "Peak hours — you can walk faster than Asok to Nana in rush hour.",
    tip: "Always use Grab App (more reliable than street taxis). Surge pricing applies 7–9am and 5–8pm — expect 1.5–2x normal fare.",
  },
  {
    method: "Motorbike Taxi (Win)",
    emoji: "🏍️",
    cost: "฿20–80 short distances",
    speed: "Fastest in traffic — weaves between cars",
    bestFor: "Getting from BTS to your hotel in a soi. Short distances.",
    avoid: "Rain (dangerous), distances over 5km (expensive + uncomfortable)",
    tip: "Orange vest drivers = Win (motorbike taxi). Negotiate fare before getting on. Don't skip the helmet offer — they have them.",
  },
  {
    method: "Tuk-Tuk",
    emoji: "🛺",
    cost: "฿100–300 tourist prices",
    speed: "Medium — slower than motorbike, similar to taxi",
    bestFor: "Tourist experience, photos, short Old City hops",
    avoid: "Long distances — never agree to multi-temple 'guided tour' tuk-tuks (scam setup)",
    tip: "Always agree the price BEFORE getting in. Fair rate: ฿100–150 for Old City. Scam warning: any tuk-tuk driver who offers a 'free city tour' earns commission at gem shops he takes you to.",
  },
  {
    method: "Khlong Boat",
    emoji: "⛵",
    cost: "฿10–20 per ride",
    speed: "Surprisingly fast — bypasses all road traffic",
    bestFor: "Bang Pakok to Pratunam to On Nut along Khlong Saen Saep canal",
    avoid: "Spray from the boat — wear dark clothes or bring a plastic bag",
    tip: "Secret weapon for crossing Bangkok's east-west congestion. Connects Pratunam to Ramkhamhaeng faster than any taxi. Hang onto the rail.",
  },
];

export function BangkokTransportComparison() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        🚌 Bangkok transport — which to use when
      </h2>
      <div className="space-y-1.5">
        {METHODS.map((m) => (
          <details key={m.method} className="border border-[var(--border)] rounded-xl group">
            <summary className="px-3 py-2.5 cursor-pointer flex items-center gap-2 text-xs font-bold text-[var(--fg)] hover:text-blue-700 transition">
              <span className="text-xl shrink-0">{m.emoji}</span>
              <span className="flex-1">{m.method}</span>
              <span className="text-[10px] font-mono text-green-700 shrink-0">{m.cost}</span>
              <span className="text-[var(--muted)] group-open:rotate-180 transition text-sm shrink-0">⌄</span>
            </summary>
            <div className="px-3 pb-3 space-y-1">
              <div className="text-[10px]"><span className="text-blue-600 font-bold">Speed:</span> {m.speed}</div>
              <div className="text-[10px]"><span className="text-green-600 font-bold">Best for:</span> {m.bestFor}</div>
              <div className="text-[10px]"><span className="text-red-600 font-bold">Avoid:</span> {m.avoid}</div>
              <div className="text-[10px] text-orange-600">💡 {m.tip}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
