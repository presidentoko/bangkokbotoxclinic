const AIRPORTS = [
  {
    code: "BKK",
    name: "Suvarnabhumi",
    emoji: "✈️",
    to_city: [
      { method: "Airport Rail Link", time: "30 min", cost: "฿45", notes: "To Phaya Thai BTS (central). Runs 6am–midnight." },
      { method: "Grab (car)", time: "40–70 min", cost: "฿350–600", notes: "Traffic-dependent. Always cheaper than taxi desk." },
      { method: "Public bus", time: "60–90 min", cost: "฿35–60", notes: "Slowest. Good only if hotel is on the route." },
    ],
  },
  {
    code: "DMK",
    name: "Don Mueang",
    emoji: "🛫",
    to_city: [
      { method: "Grab (car)", time: "30–60 min", cost: "฿200–400", notes: "Best option. Most budget airlines use this airport." },
      { method: "Free shuttle to BTS Chatuchak", time: "20 min + BTS", cost: "Free + BTS ฿50", notes: "Shuttle runs 7am–9pm to Mo Chit BTS station." },
      { method: "Bus A1/A2", time: "45–90 min", cost: "฿30", notes: "Goes to BTS Mo Chit + Ratchaprasong. Slow but cheap." },
    ],
  },
];

export function BangkokAirportGuide() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        ✈️ Getting from Bangkok airports to the city
      </h2>
      <div className="space-y-4">
        {AIRPORTS.map((airport) => (
          <div key={airport.code}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{airport.emoji}</span>
              <div className="font-bold text-xs">{airport.name} ({airport.code})</div>
            </div>
            <div className="space-y-1.5">
              {airport.to_city.map((opt) => (
                <div key={opt.method} className="flex gap-3 items-start p-2.5 rounded-xl border border-[var(--border)] hover:border-orange-200 transition">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-xs">{opt.method}</span>
                      <span className="text-[10px] text-[var(--muted)]">~{opt.time}</span>
                    </div>
                    <div className="text-[10px] text-[var(--muted)] leading-snug">{opt.notes}</div>
                  </div>
                  <span className="min-w-0 break-words text-right text-[10px] font-mono font-bold text-green-700 bg-green-100 px-1.5 py-0.5 rounded">{opt.cost}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 text-[10px] text-[var(--muted)] bg-gray-50 rounded-xl p-2.5">
        <strong>Tip:</strong> Never use the official taxi desk — they overcharge. Walk to the Grab/taxi lane or use Grab app. Always agree on meter for regular taxis.
      </div>
    </div>
  );
}
