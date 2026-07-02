const OPTIONS = [
  {
    provider: "AIS Tourist SIM",
    emoji: "📶",
    data: "30GB / 8 days",
    price: "฿299",
    where: "Airport arrival hall, 7-Eleven, AIS shops",
    pro: "Best network coverage. Works in most rural areas.",
    best: "Most travelers",
  },
  {
    provider: "DTAC Happy Tourist",
    emoji: "📱",
    data: "30GB / 15 days",
    price: "฿399",
    where: "DTAC shops, airport, department stores",
    pro: "Long validity. Good for longer trips.",
    best: "2+ week stays",
  },
  {
    provider: "True Move H Tourist",
    emoji: "🌐",
    data: "30GB / 30 days",
    price: "฿599",
    where: "TrueMove shops, Big C, airport",
    pro: "Best for digital nomads. Includes calls.",
    best: "Long stays, digital nomads",
  },
  {
    provider: "Pocket WiFi (rental)",
    emoji: "📡",
    data: "Unlimited",
    price: "฿150–250/day",
    where: "Airport counters (return before flight)",
    pro: "Share with your group. No SIM swap needed.",
    best: "Groups, keeps your home SIM active",
  },
];

export function SimCardGuide() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        📶 Thailand SIM cards — your options
      </div>
      <div className="space-y-2">
        {OPTIONS.map((o) => (
          <div key={o.provider} className="border border-[var(--border)] rounded-xl p-3">
            <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xl">{o.emoji}</span>
                <span className="font-bold text-xs">{o.provider}</span>
              </div>
              <span className="text-xs font-mono font-black text-green-700 bg-green-100 px-2 py-0.5 rounded">{o.price}</span>
            </div>
            <div className="text-[10px] text-[var(--muted)] mb-1">
              <span className="font-medium">Data:</span> {o.data} · {o.where}
            </div>
            <div className="text-[10px] text-[var(--fg)] leading-snug">{o.pro}</div>
            <div className="text-[10px] text-blue-600 font-medium mt-0.5">Best for: {o.best}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 text-[10px] text-[var(--muted)] bg-gray-50 rounded-xl p-2.5">
        <strong>Tip:</strong> Easiest = buy at Suvarnabhumi or Don Mueang airport on arrival. Bring your passport — required for SIM registration.
      </div>
    </div>
  );
}
