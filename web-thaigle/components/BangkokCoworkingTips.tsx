const SPACES = [
  {
    name: "Hubba Ekkamai",
    emoji: "💡",
    highlight: "Best networking + startup community",
    day: "฿350",
    monthly: "฿5,500",
    area: "Ekkamai (BTS Ekkamai)",
    wifi: "500Mbps+",
    hours: "Mon–Fri 9am–9pm, Sat 10am–7pm",
    best: "Entrepreneurs, developers, startup founders",
  },
  {
    name: "The HIVE Thonglor",
    emoji: "🌿",
    highlight: "Best space design + creative vibe",
    day: "฿350",
    monthly: "฿6,500",
    area: "Thonglor (BTS Thong Lo)",
    wifi: "1Gbps",
    hours: "Mon–Fri 8am–10pm, Sat 10am–6pm",
    best: "Creatives, designers, UX/UI teams",
  },
  {
    name: "Glowfish Athenee",
    emoji: "🏢",
    highlight: "Premium. Best for client meetings",
    day: "฿450",
    monthly: "฿8,500",
    area: "Phloen Chit (BTS Phloen Chit)",
    wifi: "1Gbps",
    hours: "24/7 for members",
    best: "Corporate, consultants, client-facing work",
  },
  {
    name: "Mango Coworking",
    emoji: "🥭",
    highlight: "Best budget option, multiple locations",
    day: "฿150",
    monthly: "฿2,500",
    area: "Various branches",
    wifi: "200Mbps",
    hours: "9am–9pm daily",
    best: "Budget travelers, solo freelancers",
  },
  {
    name: "CO-OP Coworking (Samyan Mitrtown)",
    emoji: "🛍️",
    highlight: "Mall-connected, 24hr, very central",
    day: "฿300",
    monthly: "฿4,500",
    area: "Sam Yan (MRT Sam Yan)",
    wifi: "500Mbps",
    hours: "24/7",
    best: "Night workers, central Bangkok location",
  },
];

export function BangkokCoworkingTips() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        💻 Bangkok coworking spaces compared
      </h2>
      <div className="space-y-2">
        {SPACES.map((s) => (
          <div key={s.name} className="border border-[var(--border)] rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">📍 {s.area} · WiFi {s.wifi}</div>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-[10px] font-mono font-black text-green-700">{s.day}/day</div>
                <div className="text-[9px] text-[var(--muted)]">{s.monthly}/mo</div>
              </div>
            </div>
            <div className="text-[10px] text-blue-600 mb-0.5">⭐ {s.highlight}</div>
            <div className="text-[10px] text-[var(--muted)]">🕐 {s.hours} · Best for: {s.best}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 text-[10px] text-[var(--muted)] bg-gray-50 rounded-xl p-2.5">
        <strong>Tip:</strong> Always check the coworking's Instagram for current promotions. First-visit day passes often discounted 20–30%. Many have private meeting rooms bookable by the hour.
      </div>
    </div>
  );
}
