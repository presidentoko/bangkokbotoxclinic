const SPOTS = [
  {
    name: "Bangpra Non-Hunting Area (Chonburi)",
    emoji: "🦜",
    area: "Chonburi Province (2h from Bangkok)",
    season: "Year-round; Oct–Apr best for migrants",
    why: "Thailand's most productive birding site within day-trip distance of Bangkok. Reservoir with surrounding forests. 300+ species recorded. Open-billed storks, purple herons, painted storks, large cormorant colonies. Accessible by rented car.",
    tip: "Early morning arrival (6–8am) critical — birds most active before heat. Bring binoculars (min 8x42) and regional field guide (Birds of Thailand). Local guide recommended (ask at Thai Bird Club Facebook group). Entrance fee ฿50–100.",
  },
  {
    name: "Wachirabenchatat Park (Bangkok)",
    emoji: "🦅",
    area: "Phaya Thai / Victory Monument area",
    season: "Year-round, morning best",
    why: "Bangkok's most accessible urban birding site. 11+ resident species including Asian koel, coppersmith barbet, oriental magpie-robin, black-naped oriole. Migratory species pass through October–March. Free, central, no equipment required.",
    tip: "Walking slowly along the tree line early morning (6:30–8am) reveals most species. Download eBird app — Bangkok birders upload checklists. Listen for koels (cuckoo-like call) and barbets (loud monotone). No guide needed for urban species.",
  },
  {
    name: "Laem Phak Bia (Gulf of Thailand shore)",
    emoji: "🦩",
    area: "Petchaburi Province (3h south of Bangkok)",
    season: "Sept–April for shorebirds and waders",
    why: "Thailand's premier shorebird site. Tidal mudflats with enormous numbers of migrating waders — bar-tailed godwit, red-necked stint, greater sand plover, spoon-billed sandpiper (critically endangered). Royal Project nearby makes it culturally interesting too.",
    tip: "Spoon-billed sandpiper (one of world's most endangered birds) recorded here October–March. Join organized birding trips from Bangkok (Thai Bird Club or Birdtour Asia for scheduling). Drive essential — no public transport to mudflats.",
  },
];

const BASICS = [
  "Thailand has 1,000+ bird species — one of Asia's highest counts",
  "Essential gear: binoculars (8x42 or 10x42), Birds of Thailand field guide (Robson)",
  "Best time: 6–9am and 4–6pm (heat midday pushes birds into shade)",
  "eBird app: free, track lists, see where Bangkok birders have gone recently",
  "Thai Bird Club: active Facebook group with trip reports and beginner welcome",
  "Respect: no playback calls near breeding birds — causes stress and nest abandonment",
];

export function BangkokBirding() {
  return (
    <div className="rounded-2xl border border-green-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-green-700 mb-3">
        🦜 Birdwatching near Bangkok — sites, species & beginner guide
      </h2>
      <div className="space-y-2 mb-3">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-green-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.season} · {s.area}</div>
              </div>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-green-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
      <details className="border border-green-100 rounded-xl overflow-hidden">
        <summary className="px-3 py-2 cursor-pointer text-[10px] font-bold text-green-700 hover:bg-green-50">
          Birding basics for Thailand
        </summary>
        <ul className="px-3 pb-3 pt-1 space-y-0.5">
          {BASICS.map((b) => (
            <li key={b} className="text-[10px] text-[var(--fg)] flex items-start gap-1.5">
              <span className="text-green-400 shrink-0">•</span>{b}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
