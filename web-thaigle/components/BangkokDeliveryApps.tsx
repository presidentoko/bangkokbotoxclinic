const COMPARISONS = [
  { app: "Grab Food", emoji: "🟢", best_for: "Widest selection, best coverage", fee: "฿10–60", speed: "15–35 min central", payment: "Grab Pay/Cash/Card" },
  { app: "LINE MAN", emoji: "🟡", best_for: "Local Thai street food", fee: "฿15–70", speed: "20–40 min", payment: "LINE Pay/Cash" },
  { app: "Food Panda", emoji: "🩷", best_for: "International chains, grocery", fee: "฿20–60", speed: "25–50 min", payment: "Cash/Card" },
  { app: "Robinhood", emoji: "🏴", best_for: "Price conscious (0% fee model)", fee: "฿0–30", speed: "20–45 min", payment: "SCB/Cash" },
];

const HACKS = [
  "Compare same restaurant price across apps — varies 5–15%",
  "Grab Food Promos tab: flash deals update every hour",
  "LINE MAN: 'from now' filter = fastest nearby delivery only",
  "Order before noon — lunch rush 12–1pm adds 15–20 min to all apps",
  "Hotels: include building instructions in Thai (Google Translate) for complex addresses",
  "Cold drink tip: order drinks separately to arrive same time as food (different timing)",
];

export function BangkokDeliveryApps() {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-emerald-700 mb-3">
        📱 Bangkok food delivery apps compared — Grab vs LINE MAN vs Food Panda
      </div>
      <div className="space-y-1.5 mb-3">
        {COMPARISONS.map((c) => (
          <div key={c.app} className="border border-emerald-100 rounded-xl p-2.5 flex items-center gap-2">
            <span className="text-xl shrink-0">{c.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-[10px]">{c.app}</div>
              <div className="text-[9px] text-[var(--muted)]">{c.best_for}</div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-[9px] font-mono text-green-700">{c.fee}</div>
              <div className="text-[9px] text-[var(--muted)]">{c.speed}</div>
            </div>
          </div>
        ))}
      </div>
      <details className="border border-emerald-100 rounded-xl overflow-hidden">
        <summary className="px-3 py-2 cursor-pointer text-[10px] font-bold text-emerald-700 hover:bg-emerald-50">
          Delivery hacks for Bangkok
        </summary>
        <ul className="px-3 pb-3 pt-1 space-y-0.5">
          {HACKS.map((h) => (
            <li key={h} className="text-[10px] text-[var(--fg)] flex items-start gap-1.5">
              <span className="text-emerald-400 shrink-0">•</span>{h}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
