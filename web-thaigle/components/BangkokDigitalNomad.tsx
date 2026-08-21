const HUBS = [
  {
    name: "Hubba-TO (Thonglor)",
    emoji: "💻",
    area: "Thonglor / Ekkamai",
    price: "Day pass ฿350, monthly ฿4,500–8,000",
    why: "Bangkok's most established coworking community. Strong startup + tech crowd. Monthly events, meetups, skill shares. Fast 500Mbps internet, standing desks, private pods. Coffee from resident roaster. Networking is the main draw.",
    tip: "Day passes best value for first visit. Monthly members get lockers and free printing. Thursday evening events are well-attended — good for meeting Bangkok's tech + entrepreneur community. Ask about their startup community.",
  },
  {
    name: "LAUNCHPAD (Ari)",
    emoji: "🚀",
    area: "Ari / Phahonyothin",
    price: "Day pass ฿280, monthly ฿3,800",
    why: "Laid-back coworking with residential neighborhood feel. Ari is Bangkok's most livable expat district. Better work-life balance than Sukhumvit. Regular digital nomad meetups. Solo travelers fit in easily.",
    tip: "Ari area has best ratio of quality cafés, restaurants, and parks per block in Bangkok. Walk from coworking to Or Tor Kor market for lunch. Phahonyothin MRT 5 minutes away.",
  },
  {
    name: "CAMP Coworking (Siam Paragon/CentralWorld)",
    emoji: "🏢",
    area: "Siam / CentralWorld (multiple locations)",
    price: "Free with coffee purchase (฿120+)",
    why: "DTAC and True Move's coffee-shop coworking. Located in major malls. Fast wifi, power outlets at every seat, AC. Not traditional coworking — more like a free workspace if you buy something. Useful for laptop days without committing.",
    tip: "Best for 2–4 hour focused sessions while doing errands or sightseeing. The Siam Square One location is most spacious. Get there before 11am on weekdays for guaranteed seats.",
  },
  {
    name: "Regus / IWG (CBD coworking)",
    emoji: "🏙️",
    area: "Silom, Sathorn, Asoke (CBD locations)",
    price: "Day pass ฿550, monthly from ฿6,500",
    why: "Professional international coworking for business travelers who need meeting rooms, printing, and a proper business address. Less community-focused than Hubba but more professional setup. Good for calls with clients in formal settings.",
    tip: "Regus day passes include meeting room credits — useful if you need a video call background that doesn't look like a café. CBD location means easy access to government offices, banks, and business meetings.",
  },
];

const NOMAD_TIPS = [
  "Visa: Tourist visa gives 60 days, LTR Visa (Long-Term Resident) designed for digital nomads",
  "Internet: True Move H SIM ฿299 for 30 days unlimited — best speed for nomads",
  "Banking: Wise (formerly TransferWise) card works for most Bangkok transactions",
  "Tax: Thailand LTR Visa exempts foreign income from Thai tax if you stay <6 months",
  "Community: Bangkok Nomad Lunch (Facebook group) — weekly meetups at different neighborhoods",
  "Cost: Bangkok comfortably livable on ฿45,000–60,000/month (accommodation + food + transport)",
];

export function BangkokDigitalNomad() {
  return (
    <div className="rounded-2xl border border-blue-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-blue-700 mb-3">
        💻 Bangkok digital nomad guide — coworking, visa & cost of living
      </h2>
      <div className="space-y-2 mb-3">
        {HUBS.map((h) => (
          <div key={h.name} className="border border-blue-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{h.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{h.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{h.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{h.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{h.why}</div>
            <div className="text-[10px] text-blue-700">💡 {h.tip}</div>
          </div>
        ))}
      </div>
      <details className="border border-blue-100 rounded-xl overflow-hidden">
        <summary className="px-3 py-2 cursor-pointer text-[10px] font-bold text-blue-700 hover:bg-blue-50">
          Nomad practicalities — visa, banking, cost
        </summary>
        <ul className="px-3 pb-3 pt-1 space-y-0.5">
          {NOMAD_TIPS.map((t) => (
            <li key={t} className="text-[10px] text-[var(--fg)] flex items-start gap-1.5">
              <span className="text-blue-400 shrink-0">•</span>{t}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
