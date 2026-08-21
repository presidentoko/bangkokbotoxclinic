const SPACES = [
  {
    name: "Roots Ari",
    emoji: "☕",
    area: "Ari BTS",
    wifi: "Excellent (300+ Mbps fiber)",
    plugs: "Abundant — dedicated work-friendly tables",
    price: "฿120–160/coffee",
    seats: "30 (often 60–70% full on weekdays)",
    hours: "7am–8pm daily",
    why: "Best specialty coffee in Bangkok. Quiet morning atmosphere. Ari neighborhood is full of other nomads — easy to connect.",
    tip: "Avoid weekend afternoons — becomes social café, not work café.",
  },
  {
    name: "CO-OP Samyan Mitrtown (3F)",
    emoji: "🏢",
    area: "Samyan MRT",
    wifi: "Excellent (mall fiber)",
    plugs: "Every table",
    price: "฿150–300 day pass OR buy a drink",
    seats: "200+ (coworking dedicated)",
    hours: "7am–10pm daily",
    why: "Best free workspace Bangkok for the price. Air-conditioned. Meeting rooms bookable. Library above (Chula students and nomads mix well).",
    tip: "Ground floor free open area. 3F coworking charges day pass.",
  },
  {
    name: "Hubba Ekkamai",
    emoji: "💼",
    area: "Ekkamai BTS",
    wifi: "Professional (symmetric fiber, VPN-friendly)",
    plugs: "Every desk",
    price: "฿350/day hot desk",
    seats: "80",
    hours: "8am–10pm weekdays, 9am–6pm weekends",
    why: "Startup culture hub. Best networking for tech entrepreneurs. Monthly membership ฿3,500–6,000.",
    tip: "Day pass includes all amenities. Coffee extra ฿60–90. Meeting rooms ฿300–600/hr.",
  },
  {
    name: "Glowfish Athenee",
    emoji: "🐟",
    area: "Phloen Chit BTS",
    wifi: "Corporate-grade (100Mbps symmetric)",
    plugs: "Every desk",
    price: "฿450/day or ฿8,000/month",
    seats: "100",
    hours: "24/7 with member card",
    why: "Most professional coworking in Bangkok. Corporate companies use it for overflow. Quiet, serious work environment.",
    tip: "Best for video calls — 6 private phone booths, 4 meeting rooms. Excellent address if you need to impress clients.",
  },
];

export function BangkokDigitalNomadCafe() {
  return (
    <div className="rounded-2xl border border-cyan-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-cyan-700 mb-3">
        💻 Bangkok work cafés & coworking — digital nomad guide
      </h2>
      <div className="space-y-2">
        {SPACES.map((s) => (
          <div key={s.name} className="border border-cyan-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area} · {s.hours}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="flex flex-wrap gap-1 mb-1.5">
              <span className="text-[9px] bg-cyan-50 text-cyan-700 px-1.5 py-0.5 rounded-full">WiFi: {s.wifi}</span>
              <span className="text-[9px] bg-cyan-50 text-cyan-700 px-1.5 py-0.5 rounded-full">Plugs: {s.plugs}</span>
              <span className="text-[9px] bg-cyan-50 text-cyan-700 px-1.5 py-0.5 rounded-full">{s.seats} seats</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-orange-600">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
