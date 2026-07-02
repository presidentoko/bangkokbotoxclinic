const METHODS = [
  {
    method: "SuperRich Thailand",
    emoji: "💵",
    rate: "Best rate in Bangkok",
    fee: "No fee",
    where: "Central World B1, Siam Square One, Victory Monument",
    tip: "ORANGE SuperRich (not green). Often 3–5% better than airport booths. Cash only.",
    verdict: "best",
  },
  {
    method: "Airport exchange",
    emoji: "✈️",
    rate: "2–5% worse than city",
    fee: "No explicit fee — built into rate",
    where: "Suvarnabhumi arrivals hall",
    tip: "Change only what you need for taxi/transport on arrival. Change more in the city.",
    verdict: "acceptable",
  },
  {
    method: "ATM (bank card)",
    emoji: "🏧",
    rate: "Close to mid-market",
    fee: "฿220 Thai ATM fee + your bank's foreign fee",
    where: "Every mall, 7-Eleven, street corners",
    tip: "Use Bangkok Bank or Kasikorn ATMs — most reliable. Bring two cards (card blocking is common).",
    verdict: "acceptable",
  },
  {
    method: "Hotel reception",
    emoji: "🏨",
    rate: "Worst rate (often 10–15% below market)",
    fee: "Sometimes adds service charge",
    where: "Hotel front desk",
    tip: "Convenience only. Avoid unless stuck.",
    verdict: "avoid",
  },
];

const VERDICT_COLORS: Record<string, string> = {
  best: "text-green-700 bg-green-100",
  acceptable: "text-blue-700 bg-blue-100",
  avoid: "text-red-700 bg-red-100",
};

export function MoneyGuide() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        💴 Currency exchange Bangkok — best rates
      </div>
      <div className="space-y-2">
        {METHODS.map((m) => (
          <div key={m.method} className="border border-[var(--border)] rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xl">{m.emoji}</span>
              <span className="font-bold text-xs">{m.method}</span>
              <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded capitalize ${VERDICT_COLORS[m.verdict]}`}>{m.verdict}</span>
            </div>
            <div className="text-[11px] text-[var(--fg)] mb-0.5"><span className="font-medium">Rate:</span> {m.rate} · <span className="font-medium">Fee:</span> {m.fee}</div>
            <div className="text-[10px] text-[var(--muted)]">📍 {m.where}</div>
            <div className="text-[10px] text-orange-600 mt-0.5">💡 {m.tip}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 text-[10px] text-[var(--muted)] bg-gray-50 rounded-xl p-2.5">
        <strong>Current rates:</strong> ~฿35 per USD · ~฿38 per EUR · ~฿43 per GBP (fluctuates daily). Check XE.com before you go.
      </div>
    </div>
  );
}
