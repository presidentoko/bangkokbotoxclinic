const INFO = [
  {
    name: "Prenatal Care at Bangkok's Private Hospitals",
    emoji: "🤰",
    area: "Bumrungrad International, Samitivej Sukhumvit, Bangkok Hospital",
    price: "Initial antenatal consultation ฿1,500–4,000; Package ฿30,000–120,000",
    why: "Bangkok's private hospitals offer world-class prenatal care at significantly lower cost than Western countries. Bumrungrad International Hospital has a dedicated OB/GYN department with obstetricians trained at US, UK, and Australian universities. Samitivej Sukhumvit is particularly popular with Japanese expats (Japanese-speaking OB on staff). Bangkok Hospital's Women's Health Center has the most comprehensive prenatal package options. English-speaking OBs are universal across the top-tier hospitals.",
    tip: "Prenatal packages at Bangkok private hospitals typically include: regular check-ups (10–12 visits), standard ultrasounds, blood tests, and delivery. Compare packages between hospitals — Bumrungrad tends toward the premium end, Samitivej is mid-range but highly regarded. For international insurance holders: get pre-authorization from your insurer before first consultation. AIA, CIGNA, and Bupa are the most common insurers with cashless admission at Bangkok's top hospitals.",
  },
  {
    name: "Birthing Options — Bangkok Hospitals",
    emoji: "🏥",
    area: "Multiple hospitals — central Bangkok",
    price: "Natural birth package ฿30,000–80,000; C-section package ฿60,000–150,000",
    why: "Bangkok has a notably high C-section rate (60–70% of hospital births) which influences how birth preferences are managed. Natural birth with epidural, water birth (limited availability — Samitivej has a birthing pool), and elective C-section are all available. Private hospital rooms are excellent — standard delivery room + private recovery room with sofa/TV for support partner. Thai nursing staff are attentive but English proficiency varies — hospital can arrange an English-speaking nurse upon request.",
    tip: "If natural birth is the preference: communicate clearly and in writing (birth plan form) before due date, and ensure your OB understands the preference. Thai hospital culture defaults to intervention more readily than many Western models. Hiring a doula (labor support professional) — several English-speaking doulas serve Bangkok expat community — provides advocacy during labor if natural birth is important.",
  },
  {
    name: "Prenatal Yoga & Classes in Bangkok",
    emoji: "🧘",
    area: "Ari, Thonglor, Ekkamai — yoga studios and expat community",
    price: "Prenatal yoga class ฿300–600; Lamaze/birth preparation ฿3,000–8,000 (course)",
    why: "Bangkok has a strong prenatal yoga community in the expat neighborhoods — Ari and Thonglor studios offer English-language prenatal yoga, and some yoga instructors specialize entirely in prenatal and postnatal. Lamaze and Bradley birth preparation classes are available in English. The Bangkok expat mums Facebook groups coordinate class recommendations, hospital experiences, and postnatal support.",
    tip: "Bangkok Facebook groups: 'Expat Mums Bangkok' and 'Pregnant in Bangkok' are the most active communities for experience-sharing, doctor recommendations, and birth preparation class information. Both groups have accumulated years of specific hospital reviews and OB recommendations from expat mothers — far more useful than generic travel health advice.",
  },
];

export function BangkokPrenatalCare() {
  return (
    <div className="rounded-2xl border border-pink-300 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-pink-700 mb-3">
        🤰 Prenatal care in Bangkok — top hospitals, birthing options & expat community
      </div>
      <div className="space-y-2">
        {INFO.map((i) => (
          <div key={i.name} className="border border-pink-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{i.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{i.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{i.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{i.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{i.why}</div>
            <div className="text-[10px] text-pink-700">💡 {i.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
