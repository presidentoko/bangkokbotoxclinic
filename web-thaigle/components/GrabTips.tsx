const ROUTES = [
  { from: "Suvarnabhumi Airport", to: "Sukhumvit", price: "฿250-350", time: "30–60 min", note: "Use meter or Grab — avoid touts" },
  { from: "Don Mueang Airport", to: "Chatuchak", price: "฿150-250", time: "20–45 min", note: "Grab is cheapest here" },
  { from: "BTS Asok", to: "Khao San Road", price: "฿120-180", time: "15–25 min", note: "Grab recommended — heavy traffic" },
  { from: "Silom", to: "Chatuchak Weekend Market", price: "฿120-180", time: "20–30 min", note: "Better via MRT + BTS (฿44)" },
];

const TIPS = [
  "Set pickup to a landmark, not a side soi — drivers find large gates/7-Eleven easier",
  "Cancel and re-request if no driver after 3 mins — fresh driver pool",
  "GrabCar > GrabTaxi for cleaner AC + no meter disputes",
  "Surge pricing disappears if you walk 1 block from BTS exit",
];

export function GrabTips() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white overflow-hidden my-4">
      <div className="px-4 pt-4 pb-2">
        <div className="text-sm font-black">🚗 Grab in Bangkok — What to Expect</div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-[var(--bg)] border-y border-[var(--border)]">
              <th className="text-left px-4 py-2 font-bold text-[var(--muted)]">Route</th>
              <th className="text-right px-3 py-2 font-bold text-[var(--muted)]">Price</th>
              <th className="text-right px-3 py-2 font-bold text-[var(--muted)]">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {ROUTES.map((r, i) => (
              <tr key={i}>
                <td className="px-4 py-2">
                  <div className="font-medium">{r.from} → {r.to}</div>
                  <div className="text-[var(--muted)]">{r.note}</div>
                </td>
                <td className="px-3 py-2 text-right font-bold text-green-700 whitespace-nowrap">{r.price}</td>
                <td className="px-3 py-2 text-right text-[var(--muted)] whitespace-nowrap">{r.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-3 border-t border-[var(--border)] bg-orange-50">
        <div className="text-xs font-bold mb-2">Pro tips:</div>
        <ul className="space-y-1">
          {TIPS.map((t, i) => (
            <li key={i} className="text-xs text-[var(--muted)] flex gap-1.5">
              <span className="text-orange-500 shrink-0">→</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
