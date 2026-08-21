const OPTIONS = [
  {
    name: "Urban Day Spa Retreats",
    emoji: "🌺",
    area: "Sukhumvit, Silom — major wellness hotel spas",
    price: "Half-day ฿3,500–8,000; Full-day ฿6,000–15,000",
    why: "Bangkok's luxury hotel spas offer full wellness day retreat packages: Thai massage, aromatherapy, body scrub, facial, steam room, pool access, healthy lunch. Banyan Tree Spa, The Oriental Spa (Mandarin Oriental), CHI Spa (Shangri-La) and ESPA (various hotels) all offer full-day packages. A complete departure from city stress within Bangkok.",
    tip: "Book 3–5 days ahead — popular weekend packages sell out. The Banyan Tree Spa on the 52nd floor offers the most dramatic setting. ESPA packages typically include meal, multiple treatments, and hydrotherapy. Come with nothing to do for the rest of the day — the wellness effect takes 4–6 hours to peak.",
  },
  {
    name: "Multi-Day Wellness Resort (Outside Bangkok)",
    emoji: "🏞️",
    area: "Chiang Mai, Koh Samui, Kanchanaburi, Pattaya",
    price: "3-day package ฿15,000–50,000 all-inclusive",
    why: "Bangkok residents escape to proper wellness retreats outside the city: Kamalaya on Koh Samui (yoga, detox, emotional healing), RAKxa in Bangkok (but actually immersive), Dhara Dhevi in Chiang Mai, and various Hua Hin/Pattaya health resorts. Programs range from juice detox to full Ayurvedic panchakarma. These are transformational trips, not just spa days.",
    tip: "Kamalaya is Thailand's most internationally recognized wellness resort — combine with a Koh Samui beach holiday. Book a 3-day minimum — shorter stays don't allow the program to take effect. Chiang Mai's cooler climate makes wellness retreats there more comfortable than in Bangkok's heat.",
  },
  {
    name: "Yoga & Detox Retreat Packages",
    emoji: "🧘",
    area: "Ekkamai, Thonglor, Ari — Bangkok's wellness studio hubs",
    price: "Week-long studio package ฿5,000–12,000",
    why: "Bangkok's Ari neighborhood has become a wellness hub — yoga studios, clean eating cafés, detox programs, and functional health clinics concentrated within walking distance. Studio packages: daily yoga + meditation + workshop, clean food included. Not a resort but an urban wellness program. Flow House, Yoga Elements, and Pure Yoga offer intensive packages.",
    tip: "Combine an Ari-area yoga package with staying at a wellness-focused hotel nearby. Ari's walking streets are traffic-calm and green relative to the rest of Bangkok — the neighborhood itself reduces stress. Add a raw/vegan restaurant routine from the area's health food scene.",
  },
];

export function BangkokWellnessRetreat() {
  return (
    <div className="rounded-2xl border border-teal-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-teal-700 mb-3">
        🌺 Wellness retreats in Bangkok — spa days, detox programs & yoga packages
      </h2>
      <div className="space-y-2">
        {OPTIONS.map((o) => (
          <div key={o.name} className="border border-teal-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{o.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{o.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{o.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{o.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{o.why}</div>
            <div className="text-[10px] text-teal-700">💡 {o.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
