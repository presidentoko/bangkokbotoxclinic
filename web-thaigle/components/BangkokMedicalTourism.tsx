const HOSPITALS = [
  {
    name: "Bumrungrad International Hospital",
    emoji: "🏥",
    area: "Sukhumvit Soi 3 (Nana BTS)",
    specialty: "Full-service international hospital — all departments",
    why: "World's most visited private hospital for medical tourism. JCI-accredited. 58 countries' insurance accepted. 300+ specialist doctors speak English.",
    popular: "Cosmetic surgery, dental, orthopedics, health check-ups, cancer screenings",
    pricing: "30–70% cheaper than US/UK/Australia for equivalent procedures",
    book: "bumrungrad.com — online appointments available. 24hr emergency.",
  },
  {
    name: "Bangkok Hospital (Phetchaburi)",
    emoji: "❤️",
    area: "Phetchaburi Rd / Phetchaburi MRT",
    specialty: "Heart surgery, orthopedics, cosmetic surgery, cancer",
    why: "Bangkok's second-largest international hospital network. Excellent heart surgery and orthopedic departments. Often cheaper than Bumrungrad.",
    popular: "Hip/knee replacement (฿180,000–350,000 vs ฿2–3M in US), cardiac bypass",
    pricing: "25–60% cheaper than Western equivalents",
    book: "bangkokhospital.com. International patient coordinator available.",
  },
  {
    name: "Yanhee Hospital",
    emoji: "✨",
    area: "Charan Sanitwong Rd (Bang Yi Khan MRT)",
    specialty: "Cosmetic surgery specialist — gender reassignment, rhinoplasty, facelifts",
    why: "Thailand's most famous cosmetic surgery hospital. Gender reassignment pioneer. 40+ years experience. Over 100 surgeons.",
    popular: "Rhinoplasty (฿40,000–80,000), breast augmentation (฿60,000–120,000), SRS",
    pricing: "Cosmetic procedures 40–80% cheaper than US/Europe",
    book: "yanhee.net — free consultation on arrival.",
  },
  {
    name: "Rajavithi Hospital (Public / Dental)",
    emoji: "🦷",
    area: "Rajavithi Rd, Ratchathewi BTS area",
    specialty: "Government hospital — excellent dental at minimal cost",
    why: "If you just need dental work, Thailand's public teaching hospitals offer excellent quality at ฿500–2,000 per procedure vs ฿5,000+ private.",
    popular: "Dental filling (฿500–800), cleaning (฿300–600), crown (฿3,000–8,000)",
    pricing: "70–90% cheaper than private Bangkok hospitals",
    book: "Walk-in. Arrive early (7am). Dental usually same-day.",
  },
];

export function BangkokMedicalTourism() {
  return (
    <div className="rounded-2xl border border-blue-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-blue-700 mb-3">
        🏥 Bangkok medical tourism — hospitals & procedures
      </h2>
      <div className="text-[10px] bg-blue-50 rounded-xl p-2.5 mb-3 text-blue-800">
        Thailand is one of Asia's top medical tourism destinations. All major private hospitals have international patient departments with English-speaking staff and medical records coordination with home-country hospitals.
      </div>
      <div className="space-y-2">
        {HOSPITALS.map((h) => (
          <details key={h.name} className="border border-blue-100 rounded-xl overflow-hidden group">
            <summary className="px-3 py-2.5 cursor-pointer flex items-center gap-2 hover:bg-blue-50 transition">
              <span className="text-2xl shrink-0">{h.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{h.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{h.specialty} · {h.area}</div>
              </div>
            </summary>
            <div className="px-3 pb-3 border-t border-blue-100 pt-2 space-y-1">
              <div className="text-[10px] text-[var(--fg)] leading-snug">{h.why}</div>
              <div className="text-[10px] text-orange-600">⭐ Popular: {h.popular}</div>
              <div className="text-[10px] text-green-700">💰 {h.pricing}</div>
              <div className="text-[10px] text-blue-700">📱 {h.book}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
