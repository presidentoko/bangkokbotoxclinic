const FREE = [
  {
    name: "Lumphini Park (Dawn/Dusk)",
    emoji: "🌳",
    when: "5:30am–8am or 4pm–7pm",
    why: "Giant monitor lizards sunbathing. Dawn aerobics class (free, all welcome at 5:30am). Bird calls. Tai chi groups. Free outdoor gym equipment.",
    howToGet: "Silom MRT / Sala Daeng BTS (exit 1)",
  },
  {
    name: "Chatuchak Park",
    emoji: "🌸",
    when: "Open daily",
    why: "Botanical garden + butterfly garden (free), running track, weekend market next door. Very local atmosphere.",
    howToGet: "Chatuchak Park MRT",
  },
  {
    name: "Suan Pakkad Palace",
    emoji: "🏛️",
    when: "Daily 9am–4pm (small ฿100 donation suggested)",
    why: "5 traditional Thai houses in a garden — one of Bangkok's hidden gems. Most tourists don't know it exists. Lacquerware pavilion is stunning.",
    howToGet: "Phaya Thai BTS",
  },
  {
    name: "BACC (Bangkok Art & Culture Centre)",
    emoji: "🎨",
    when: "Tue–Sun 10am–9pm",
    why: "3 floors of rotating art exhibitions. Entrance free. Contemporary Thai art. Ground floor café with BTS Siam views.",
    howToGet: "Siam BTS",
  },
  {
    name: "Pak Klong Talad (Flower Market)",
    emoji: "🌺",
    when: "Best midnight–4am (most surreal) or 6am–9am (for locals buying)",
    why: "All of Bangkok's flowers transit through here. Mountains of jasmine garlands, orchids, roses. Surreal at 2am.",
    howToGet: "Pak Klong Talad ferry pier (Saphan Phut) or taxi",
  },
  {
    name: "Tha Maharaj Riverside Walking",
    emoji: "🌊",
    when: "Any time (golden hour best)",
    why: "Riverside walkway with market stalls, craft beer spots, flower shops, and river views. Free except food/drinks.",
    howToGet: "Na Phra Lan pier (take river ferry from Saphan Taksin)",
  },
];

export function BangkokFreeTourism() {
  return (
    <div className="rounded-2xl border border-green-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-green-700 mb-3">
        🆓 Free things to do in Bangkok — zero cost
      </h2>
      <div className="space-y-2">
        {FREE.map((f) => (
          <div key={f.name} className="border border-green-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-xl shrink-0">{f.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{f.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">🕐 {f.when}</div>
              </div>
              <span className="shrink-0 text-[10px] font-black text-green-700">FREE</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{f.why}</div>
            <div className="text-[10px] text-blue-700">🚇 {f.howToGet}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
