const ROUTES = [
  {
    name: "Chao Phraya Express Boat — Main River Line",
    emoji: "⛵",
    area: "Sathorn (Central Pier) to Nonthaburi — 36 stops",
    price: "฿15–32 depending on line (tourist boat ฿60 flat); Ferry cross-river ฿5",
    why: "The Chao Phraya Express Boat is Bangkok's river public transport — faster than road traffic during rush hour and a uniquely Bangkok experience. Multiple lines: Orange Flag (no stops, direct), Yellow Flag (express), Green Flag (local), and Blue Tourist Boat (fixed ฿60 all-day pass, tourist-friendly with commentary). The river route connects key Bangkok destinations: Sathorn/Silom (Central Pier) → Tha Tien (Wat Pho) → Tha Chang (Grand Palace) → Banglamphu (Khao San Road area) → Nonthaburi (weekend market). Sunset on the Chao Phraya from a river boat is one of Bangkok's signature experiences.",
    tip: "River boat navigation: Central Pier (Sathorn) is the main hub — large, signed, BTS Saphan Taksin connects directly. On/off the boat: it barely stops (30-second stop maximum at each pier). Have your fare ready, step on/off quickly. During peak hours, boats are packed. The ฿60 tourist Blue Boat is worth it for first-timers as it includes commentary, unlimited re-boarding, and free hop-on/hop-off. For daily commuting, the orange flag local boat is the best value (฿15 flat).",
  },
  {
    name: "Khlong (Canal) Taxi — Bangkok's Hidden Highways",
    emoji: "🛥️",
    area: "Khlong Saen Saep — Pratunam to Min Buri (27km inland waterway)",
    price: "฿11–25 depending on distance",
    why: "Khlong Saen Saep is Bangkok's most-used canal taxi route — an inland waterway running parallel to Sukhumvit that moves thousands of commuters daily faster than any road option. The boats are fast (30+ km/h), cheap, and authentically Bangkok in a way road transport isn't. The junction at Pratunam pier connects to BTS Asok, Siam, and the city center. Canal boat etiquette includes the plastic tarp that staff pull over passengers when the boat passes under bridges (to avoid spray) — a uniquely Bangkok experience.",
    tip: "Khlong Saen Saep practical tips: the spray from the engine is real and the water is dark (heavily polluted — not something you want on white clothing). Keep bags on your lap, wear something you don't mind getting water-splashed. The canal boats are cramped during peak hours (7–9am, 5–8pm) but faster than any other option. Key stops: Pratunam (for Platinum Fashion Mall, airport rail link change point), Nana (connects to Sukhumvit), Ekamai (Thonglor area).",
  },
  {
    name: "Long-Tail Speedboat Tours",
    emoji: "🚤",
    area: "Bangkok's network of smaller khlongs (Bang Kok Noi, Bang Kok Yai, Bangkok Noi)",
    price: "Private charter ฿1,200–2,000/hour; Tour packages ฿600–1,000/person",
    why: "Long-tail boat tours of Bangkok's smaller canal system (the network of khlongs west of the Chao Phraya, in the older Thonburi district) provide access to traditional stilted canal-side wooden houses, floating vendors, temple complexes, and orchard communities that look unchanged from 50 years ago. The boats themselves — narrow, extreme length, powerful aircraft engine mounted on a long shaft — are iconic Bangkok machines. The noise is extraordinary (earplugs recommended). The experience of weaving through narrow khlongs at speed is not replicated anywhere else.",
    tip: "Long-tail boat tours: negotiate price before boarding (˜฿1,200–1,500/hour for private is fair, ฿2,000 is tourist premium). A 1.5-hour tour covers the main canals (Khlong Bangkok Noi, Khlong Bangkok Yai, the royal barge museum approach, orchid farms). Bring earplugs — the engine is genuinely very loud. The canal-side vendors selling fresh coconuts and som tum to passing boats at certain stops are part of the experience — have small bills ready. Depart from Tha Tien Pier (near Wat Pho) or Pinklao Bridge for best western Bangkok network access.",
  },
];

export function BangkokSpeedboat() {
  return (
    <div className="rounded-2xl border border-cyan-300 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-cyan-800 mb-3">
        🚤 River & canal transport in Bangkok — Chao Phraya express, canal taxi & long-tail tours
      </h2>
      <div className="space-y-2">
        {ROUTES.map((r) => (
          <div key={r.name} className="border border-cyan-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{r.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{r.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{r.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{r.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{r.why}</div>
            <div className="text-[10px] text-cyan-800">💡 {r.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
