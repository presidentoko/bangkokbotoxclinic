const SPOTS = [
  {
    name: "Laem Chabang Zipline & Adventure Park",
    emoji: "🪂",
    area: "Laem Chabang, Chonburi (1.5 hrs from Bangkok)",
    price: "Zipline course ฿500–1,500; Combined adventure package ฿1,200–2,500",
    why: "The closest major zipline operations to Bangkok are in Chonburi province — a 1.5-hour drive accessible as a day trip. Zipline courses in this area combine tree canopy traversal with rope bridges and abseil elements. Thai adventure parks have improved significantly in terms of safety equipment (harness systems, belay devices, certified guides) over the past decade. The Pattaya area (2 hrs) has several adventure park options with zipline components.",
    tip: "Safety standard to check before booking: look for harnesses with dual-clip connections (backup clip), helmets provided, and guides with certification (Thai Adventure Tourism Association or international equivalents). Weight limits (typically 30–110kg) apply to zipline equipment — confirm before booking for larger groups. Morning slots (8–11am) have the best temperature for physical activity.",
  },
  {
    name: "Khao Yai Jungle Adventure — Zipline & Canopy Walk",
    emoji: "🌿",
    area: "Khao Yai National Park area (2.5 hrs from Bangkok)",
    price: "Canopy adventure ฿800–2,000; Full day package ฿2,500–5,000",
    why: "Khao Yai's jungle environment provides a genuinely different zipline experience from beach resort versions — real tropical forest, potential wildlife sightings (gibbons, hornbills, deer), and UNESCO Biosphere Reserve ecosystem. Several adventure tourism operators near Khao Yai's entrance offer zipline and jungle canopy walk packages combined with elephant sanctuary visits, ATV, and waterfall trekking.",
    tip: "Khao Yai zipline is best booked as part of a weekend trip rather than a day trip from Bangkok — the 2.5-hour drive is manageable but a 2-day itinerary allows wildlife spotting (early morning and evening are best) alongside adventure activities. The rainy season (May–October) makes the jungle more lush and dramatic but zipline activity may be suspended in heavy rain.",
  },
  {
    name: "Pattaya Flight of the Gibbon / Zip Through Time",
    emoji: "🦅",
    area: "Pattaya, Chonburi (2 hrs from Bangkok)",
    price: "Flight of the Gibbon full course ฿3,000–4,500",
    why: "Flight of the Gibbon (international eco-adventure brand) operates a mature zipline network at Pattaya with 30+ platforms and consistent safety standards. More expensive than Thai-run operations but higher quality harness systems, trained multi-language guides, and an established reputation. The Pattaya course includes a longest single zipline of 200m+. Day trip from Bangkok (leave 7am, zipline by 10am, return by 4pm) is feasible.",
    tip: "Flight of the Gibbon in Pattaya is the most bookable option for Bangkok visitors wanting certainty about safety and English communication — their online booking system is straightforward and cancellation policy is clear. Book at least 3 days in advance for weekend dates. Wear closed-toe shoes and avoid loose scarves or jewelry.",
  },
];

export function BangkokZipline() {
  return (
    <div className="rounded-2xl border border-green-300 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-green-800 mb-3">
        🪂 Zipline near Bangkok — Chonburi adventure park, Khao Yai canopy & Pattaya Flight
      </h2>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-green-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-green-800">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
