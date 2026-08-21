const SPOTS = [
  {
    name: "Outdoor Fitness Bootcamps — Lumpini & Benjakitti Park",
    emoji: "🏃",
    area: "Lumpini Park (Silom), Benjakitti Park (Sukhumvit 22), Chatuchak Park",
    price: "Free (self-organized) – ฿200–500/session (commercial bootcamp)",
    why: "Bangkok's parks host both self-organized and commercial fitness bootcamps in the early morning (5:30–7:30am) and evening (5–7pm) hours. The outdoor bootcamp culture is well-established — trainers set up in park areas with TRX suspension kits, resistance bands, and agility ladders. Lumpini Park's jogging track (around the lake) is used as the cardio base for many bootcamp programs. Bangkok's outdoor training temperature is most manageable during these early/evening windows, with the parks providing natural shelter from direct sun.",
    tip: "Bangkok outdoor bootcamp temperature reality: morning sessions (pre-7am) are the only comfortable window during hot season (March–June). The humidity is high even at 6am but the ambient temperature (26–28°C before 8am vs. 34°C+ by 10am) is a significant difference. OYNB (One Year No Beer) Thailand chapter and similar wellness communities run free group accountability sessions in Bangkok parks — social commitment groups outperform solo training for consistency. Bring insect repellent for Lumpini Park — mosquitoes are active at dawn.",
  },
  {
    name: "F45 Training & Functional Fitness Studios",
    emoji: "⚡",
    area: "Multiple locations — Thonglor, Ari, Silom, Ekkamai",
    price: "Monthly ฿3,500–6,000; Trial week ฿500",
    why: "F45 (Functional 45 — 45-minute functional training circuit) has multiple Bangkok franchise locations drawing the same internationally mobile professional demographic as globally. The standardized program (same workout worldwide) and team-based class format suits Bangkok's active expat community. Beyond F45, Bangkok has several CrossFit boxes (WODs following the international CrossFit programming), HIIT-focused boutique studios, and strength-focused gyms that cater to the high-performance fitness market. The Thonglor and Ekkamai areas have the highest concentration of boutique fitness studios per square kilometer.",
    tip: "F45 Bangkok location quality varies by franchise — visit before committing to a package. Best indicators of quality: clean equipment, proper AC, coach-to-member ratio. The Bangkok CrossFit community connects at competition events — Bangkok CrossFit Championship is an annual event bringing international competitors. For expats in Bangkok on multi-year placements, joining a CrossFit box provides both fitness AND community (the social bonding in CrossFit boxes is well-documented and functions as instant friend network in new cities).",
  },
  {
    name: "Muay Thai Fitness & Cardio Kickboxing",
    emoji: "🥊",
    area: "Major Muay Thai gyms offering fitness programs (non-competitive)",
    price: "Single session ฿400–800; Monthly ฿3,000–8,000",
    why: "Bangkok's Muay Thai gyms have developed separate 'fitness track' programs for expats and tourists who want the conditioning benefits of Muay Thai without the competitive/professional pathway. These fitness-oriented Muay Thai sessions (pad work, bag work, conditioning circuits) provide one of the most intense workouts available in Bangkok. The physical development — core strength, cardiovascular capacity, shoulder mobility, hip flexibility — is exceptional. Gym environments vary from tourist-friendly (English-speaking, AC, modern equipment) to hardcore Thai training camp style.",
    tip: "Muay Thai fitness (non-competitive) in Bangkok: the gyms around Sukhumvit (Soi 11, Soi 26), Lumpini area, and Thonglor have multiple English-friendly options. Best budget-value option: Fairtex Training Center (Sukhumvit Soi 26, one of the most famous gym brands in Muay Thai globally — tourist fitness sessions are excellent value). Most intimidating but highest quality: traditional camps in the Rangsit or Bang Khen areas where professional fighters train alongside tourists.",
  },
];

export function BangkokFitnessBootcamp() {
  return (
    <div className="rounded-2xl border border-amber-300 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-amber-800 mb-3">
        🏃 Fitness bootcamp in Bangkok — park workouts, F45, CrossFit & Muay Thai fitness
      </h2>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-amber-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-amber-800">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
