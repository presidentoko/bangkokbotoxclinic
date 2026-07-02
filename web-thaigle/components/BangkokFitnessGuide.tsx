const GYMS = [
  {
    name: "Virgin Active Thailand",
    emoji: "💪",
    type: "Premium gym chain",
    locations: "Siam Paragon, Central Embassy, Samyan Mitrtown",
    dayPass: "฿400–600",
    monthly: "฿2,500–4,000",
    facilities: "Olympic pool, all equipment, group classes (yoga, spin, pilates)",
    tip: "Best facilities in Bangkok. Day pass gives full access. Drop-in yoga and spinning classes included.",
  },
  {
    name: "Fitness First",
    emoji: "🏋️",
    type: "Mid-range chain",
    locations: "Asok, Silom, Thonglor, many more",
    dayPass: "฿300–500",
    monthly: "฿1,800–3,000",
    facilities: "Full weight equipment, cardio, group classes",
    tip: "Most locations near BTS. Reliable but not premium. Good for quick workouts while traveling.",
  },
  {
    name: "Absolute You",
    emoji: "🔥",
    type: "Boutique hot yoga + cycling",
    locations: "Sukhumvit 24, Ari, Thonglor",
    dayPass: "฿550–750",
    monthly: "฿4,500–8,000",
    facilities: "Infrared yoga studios, hot yoga 38°C, spin bikes",
    tip: "Best hot yoga in Bangkok. Infrared heating not conventional sauna — feels different. Try the Bikram 26+2 class.",
  },
  {
    name: "Lumpini Park Open-Air",
    emoji: "🌳",
    type: "Free outdoor fitness",
    locations: "Silom / Sathorn (MRT Lumpini)",
    dayPass: "Free",
    monthly: "Free",
    facilities: "Jogging track 2.5km, outdoor gym equipment, group aerobics at 6am",
    tip: "Best free exercise in Bangkok. 6am aerobics (free, all welcome) + morning tai chi. Giant monitor lizards roam the grass — they're harmless.",
  },
  {
    name: "Evolve MMA Bangkok",
    emoji: "🥊",
    type: "Premium martial arts gym",
    locations: "Sukhumvit, Orchard Tower area",
    dayPass: "฿1,000–1,500",
    monthly: "฿8,000–20,000",
    facilities: "Muay Thai, MMA, boxing, BJJ, yoga — all world-class",
    tip: "World champions teach here. Serious gym — not for tourism, for real training. Single class available.",
  },
];

export function BangkokFitnessGuide() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        💪 Bangkok fitness guide — gyms & workouts
      </div>
      <div className="space-y-2">
        {GYMS.map((g) => (
          <div key={g.name} className="border border-[var(--border)] rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-xl shrink-0">{g.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{g.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{g.type} · {g.locations}</div>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-[10px] font-mono font-black text-green-700">{g.dayPass}</div>
                <div className="text-[9px] text-[var(--muted)]">{g.monthly}/mo</div>
              </div>
            </div>
            <div className="text-[10px] text-blue-700 mb-0.5">{g.facilities}</div>
            <div className="text-[10px] text-orange-600">💡 {g.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
