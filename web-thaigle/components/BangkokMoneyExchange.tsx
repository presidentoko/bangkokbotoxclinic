const METHODS = [
  {
    method: "SuperRich Exchange (Yellow or Green)",
    emoji: "💱",
    best: "Best rates for cash-to-baht conversion",
    rate: "Often 0.5–2% better than airport or hotel",
    where: "CentralWorld, Victory Monument, Asok/Ekkamai, multiple locations",
    how: "Show your cash, they quote the rate, you accept or walk. No commission.",
    tip: "SuperRich (orange) vs. Super Rich (green) — both are good. Check today's rate at their Google Maps listing before going.",
  },
  {
    method: "ATM Withdrawal (most convenient)",
    emoji: "🏧",
    best: "Convenience — available everywhere 24/7",
    rate: "Thai bank ATM fee: ฿180–220/transaction. Your bank may also charge foreign transaction fee.",
    where: "Every BTS station, 7-Eleven, shopping malls, everywhere",
    how: "Use Kasikorn (K-Bank) or Bangkok Bank ATMs. Choose 'without conversion' when prompted — let your home bank convert.",
    tip: "Withdraw larger amounts to minimize per-transaction fee. ฿5,000–10,000 at once rather than ฿2,000 several times.",
  },
  {
    method: "Wise Card (travelers' best option)",
    emoji: "💳",
    best: "Real exchange rate, low fees — best for longer stays",
    rate: "Interbank rate + small % fee. Usually 0.5–1.5% total",
    where: "Any Mastercard-accepting ATM or payment terminal",
    how: "Top up in your home currency via Wise app. Use Wise card in Bangkok like any debit card.",
    tip: "Set up before travel. Wise gives you the real mid-market rate. Much better than any currency exchange booth or hotel.",
  },
  {
    method: "Airport / Hotel / Mall Exchange",
    emoji: "✈️",
    best: "Convenience only — rates are poor",
    rate: "Airport: often 3–5% worse than SuperRich. Hotels: worst rates of all.",
    where: "Suvarnabhumi airport arrivals, hotel front desks, airport mall",
    how: "Only do this if you need small baht amount immediately on arrival for taxi/transport.",
    tip: "Change minimum amount at airport (฿1,000–2,000 for immediate needs). Go to SuperRich or ATM next day for better rates.",
  },
];

export function BangkokMoneyExchange() {
  return (
    <div className="rounded-2xl border border-green-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-green-700 mb-3">
        💱 Bangkok money exchange — best rates & where to go
      </div>
      <div className="space-y-2">
        {METHODS.map((m) => (
          <div key={m.method} className="border border-green-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{m.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{m.method}</div>
                <div className="text-[10px] text-green-700">{m.best}</div>
              </div>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">Rate: {m.rate}</div>
            <div className="text-[10px] text-[var(--muted)] mb-0.5">📍 {m.where}</div>
            <div className="text-[10px] text-orange-600">💡 {m.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
