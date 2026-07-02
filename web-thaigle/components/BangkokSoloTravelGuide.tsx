const TIPS = [
  {
    category: "Safety",
    emoji: "🔒",
    tips: [
      "Keep a photo of your hotel business card — easy to show to Grab/taxi if you get lost",
      "Share your location with someone back home (Google Maps / Find My)",
      "Avoid unlicensed taxis at night — use Grab app exclusively",
      "Tourist Police 1155 is English-speaking and available 24/7",
    ],
  },
  {
    category: "Meeting people",
    emoji: "🤝",
    tips: [
      "Coworking spaces (Hubba, The HIVE) are excellent for meeting other solo travelers and nomads",
      "Hostel bar nights: Bed Station, Lub D Silom, NapPark have social events every week",
      "Walking food tours: Airbnb Experiences and Bangkok Food Tours are group-friendly",
      "Muay Thai gyms are very social — training sessions mix tourists from everywhere",
    ],
  },
  {
    category: "Solo female tips",
    emoji: "👩",
    tips: [
      "Bangkok is very safe for solo women. Rated one of Asia's safest female solo destinations.",
      "Use Grab (rideshare) not unlicensed taxis at night",
      "Cover up when visiting temples — a scarf works. Temple-area dress requirements are strictly enforced by guards.",
      "Silom / Sukhumvit areas at night are bustling and safe. Khaosan Road gets drunk tourists — lower risk but more hassle.",
    ],
  },
];

export function BangkokSoloTravelGuide() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        🧳 Bangkok solo travel guide
      </div>
      <div className="space-y-3">
        {TIPS.map((section) => (
          <div key={section.category}>
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-lg">{section.emoji}</span>
              <span className="font-black text-xs">{section.category}</span>
            </div>
            <div className="space-y-1">
              {section.tips.map((t) => (
                <div key={t} className="text-[10px] flex gap-2 items-start border border-[var(--border)] rounded-lg px-2.5 py-2">
                  <span className="shrink-0 text-orange-500 mt-px">✓</span>
                  <span className="text-[var(--fg)] leading-snug">{t}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
