const SPOTS = [
  {
    type: "Café",
    emoji: "☕",
    examples: ["Ristr8to (Silom)", "Pacamara (Ari)", "Phil Coffee (Ekkamai)"],
    wifi: "Good — 50–100 Mbps",
    power: "Limited sockets, arrive early",
    timeLimit: "2–4 hrs unspoken — buy every 2 hrs",
    cost: "฿80–180 per drink",
  },
  {
    type: "Coworking space",
    emoji: "💼",
    examples: ["The Hive (Ekkamai/Silom)", "Hubba-TO (Ekkamai)", "Launchpad (Thonglor)"],
    wifi: "Excellent — 100–500 Mbps",
    power: "Dedicated desks, unlimited sockets",
    timeLimit: "Day pass, no time limit",
    cost: "฿300–600 / day",
  },
  {
    type: "Hotel lobby",
    emoji: "🏨",
    examples: ["COMO Metropolitan", "Grand Hyatt lobby", "Marriott Sukhumvit"],
    wifi: "Good — password at front desk",
    power: "Café area usually has outlets",
    timeLimit: "Guest-only officially, lobby often open",
    cost: "Buy 1 coffee or tea",
  },
  {
    type: "Mall / BTS",
    emoji: "🏬",
    examples: ["True Wifi @ Central, EmQuartier", "AIS Wifi @ BTS stations"],
    wifi: "Variable — 5–50 Mbps",
    power: "No outlets at BTS; malls have food courts",
    timeLimit: "No limit",
    cost: "Free (register with phone number)",
  },
];

export function WifiFinder() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        📶 Wi-Fi in Bangkok — where to work
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.type} className="border border-[var(--border)] rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xl">{s.emoji}</span>
              <span className="font-bold text-xs">{s.type}</span>
              <span className="ml-auto text-xs font-mono text-green-700 bg-green-100 px-2 py-0.5 rounded font-bold">{s.cost}</span>
            </div>
            <div className="flex flex-wrap gap-1 mb-1.5">
              {s.examples.map((e, i) => (
                <span key={i} className="text-[10px] px-1.5 py-0.5 bg-gray-100 rounded text-[var(--muted)]">{e}</span>
              ))}
            </div>
            <div className="text-[10px] text-[var(--muted)] space-y-0.5">
              <div>📶 {s.wifi} · 🔌 {s.power}</div>
              <div>⏱️ {s.timeLimit}</div>
            </div>
          </div>
        ))}
      </div>
      <a
        href="/activities/digital-nomad"
        className="mt-3 block text-center text-xs font-bold text-blue-600 border border-blue-200 bg-blue-50 rounded-full py-1.5 hover:bg-blue-100 transition"
      >
        Digital nomad guide Bangkok →
      </a>
    </div>
  );
}
