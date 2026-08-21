const COWORKS = [
  { name: "Hubba Ekkamai", vibe: "Startup-heavy, high networking density", price: "฿350/day · ฿5,500/month", area: "Ekkamai" },
  { name: "The HIVE Thonglor", vibe: "Creative + tech mix. Best light and design.", price: "฿350/day · ฿6,500/month", area: "Thonglor" },
  { name: "Glowfish Athenee", vibe: "Corporate clientele, premium seats", price: "฿450/day · ฿8,000/month", area: "Phloen Chit" },
  { name: "Mango Coworking", vibe: "Budget-friendly, quiet, multiple branches", price: "฿150/day · ฿2,500/month", area: "Various" },
];

const EVENTS = [
  "Bangkok Startup Meetup (monthly, Eventbrite)",
  "Google Startup Campus events (Ekkamai)",
  "TechSauce Global Summit (annual, Aug/Sep)",
  "Product Hunt Bangkok meetups (quarterly)",
  "Barcamp Bangkok (annual unconference)",
];

const COMMUNITIES = [
  { name: "Startup Thailand Facebook Group", who: "45k+ Thai startup community" },
  { name: "Digital Nomads Bangkok (FB)", who: "International remote workers, 30k members" },
  { name: "Bangkok Developers Community", who: "React, Node, full-stack — weekly meetups" },
  { name: "Product Hunt BKK", who: "Product managers, founders, makers" },
];

export function BangkokTechScene() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        💻 Bangkok tech & startup scene
      </h2>
      <div className="text-xs font-black mb-2">Top coworking spaces</div>
      <div className="space-y-1.5 mb-3">
        {COWORKS.map((c) => (
          <div key={c.name} className="border border-[var(--border)] rounded-xl p-2.5">
            <div className="flex items-center justify-between flex-wrap gap-1 mb-0.5">
              <span className="font-bold text-xs">{c.name}</span>
              <span className="text-[10px] font-mono text-blue-700">{c.price}</span>
            </div>
            <div className="text-[10px] text-[var(--muted)]">📍 {c.area} · {c.vibe}</div>
          </div>
        ))}
      </div>
      <div className="text-xs font-black mb-2">Events to find</div>
      <div className="space-y-1 mb-3">
        {EVENTS.map((e) => (
          <div key={e} className="text-[10px] flex gap-1.5 items-start">
            <span className="shrink-0 text-orange-500">▸</span>{e}
          </div>
        ))}
      </div>
      <div className="text-xs font-black mb-2">Communities to join</div>
      <div className="space-y-1">
        {COMMUNITIES.map((c) => (
          <div key={c.name} className="text-[10px] flex gap-2 border border-[var(--border)] rounded-lg px-2.5 py-1.5">
            <span className="font-bold text-[var(--fg)] shrink-0">{c.name}</span>
            <span className="text-[var(--muted)]">— {c.who}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
