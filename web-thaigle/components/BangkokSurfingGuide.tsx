const SPOTS = [
  {
    name: "FlowRider Bangkok (Flow House)",
    emoji: "🏄",
    area: "A-Square, Sukhumvit 26",
    type: "Surf machine / indoor wave pool",
    price: "30-min session ฿500, equipment included",
    why: "Bangkok's original indoor surfing attraction. FlowRider wave machine simulates a perfect wave. Good for learning the basics before hitting actual ocean. Lessons available. Helmet and vest provided.",
    tip: "First-timers: start bodyboarding on your knees before standing. 30-min session is intense — arms and core will burn. Book weekend sessions online to avoid walking-in wait. Lockers available.",
  },
  {
    name: "Koh Samet (3.5 hours from Bangkok)",
    emoji: "🌊",
    area: "Rayong Province — bus from Ekamai Eastern Bus Terminal",
    type: "Nearest beach from Bangkok",
    price: "Day trip ฿800–1,200 (bus + ferry), waves ฿0",
    why: "Closest ocean beach to Bangkok. Small but consistent waves at Hat Sai Kaew (White Sand Beach) and Ao Phai. Best August–October for swells. Reef-free sandy bottom. Manageable waves for beginners.",
    tip: "Weekend return from Bangkok to Koh Samet: bus at 7am from Ekkamai station, arrive noon. Last ferry back 5:30pm. Bring rash guard — sun is extreme. Rent bodyboards on beach (฿200/day). Surfboards rare — bring your own.",
  },
  {
    name: "Koh Chang (5 hours, surf-ready)",
    emoji: "🏝️",
    area: "Trat Province — bus from Ekkamai",
    type: "Real surf destination near Bangkok",
    price: "Bus + ferry ฿800, boards ฿300/day rental",
    why: "Bigger island with consistent swells at Lonely Beach and Kai Bae. November–February monsoon season brings real 1–3m waves on west coast. ThaiSurf operates boards and lessons. More serious than Samet.",
    tip: "Visit October–February for best swells (southwest monsoon). East coast calm. West coast surfable. ThaiSurf Koh Chang (on Lonely Beach) runs morning lessons. Book the jungle-side hostels — beach huts get packed.",
  },
];

export function BangkokSurfingGuide() {
  return (
    <div className="rounded-2xl border border-sky-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-sky-700 mb-3">
        🏄 Surfing near Bangkok — indoor waves + closest beach breaks
      </h2>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-sky-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.type} · {s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-sky-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
