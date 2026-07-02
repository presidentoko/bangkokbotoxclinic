const TOPICS = [
  {
    title: "Bangkok Emergency Numbers & Services",
    emoji: "🆘",
    summary: "Essential emergency contacts for Bangkok — police, ambulance, tourist assistance, and consular services that every Bangkok visitor and resident should have accessible.",
    action: "Bangkok emergency numbers to save before you need them: (1) Emergency services: 191 (Police), 1669 (Medical EMS), 199 (Fire), 1155 (Tourist Police — English-speaking, available 24 hours); (2) Hospital emergency departments: Bumrungrad International (+66-2-667-1000), Samitivej Sukhumvit (+66-2-022-2222), BNH Hospital (+66-2-022-0700) — these hospitals have English-speaking staff and international patient experience; (3) Tourist Police 1155 is specifically designed for tourists in distress — theft, accidents, safety concerns, or language-barrier emergencies; Tourist Police can also assist with translation for interactions with regular police; (4) Embassy/consulate emergency lines: most embassies in Bangkok maintain a 24-hour emergency line for nationals in distress — save your embassy's emergency number before traveling; (5) Bangkok ambulance reality: private ambulance (Narenthorn, Ruam Phol Foundation) sometimes responds faster than government EMS — hotels can often coordinate faster ambulance response than individual calling.",
  },
  {
    title: "Bangkok Hospital System — Public vs Private",
    emoji: "🏥",
    summary: "Understanding Bangkok's two-tier hospital system — international private hospitals serve tourists and expats while the Thai public hospital system serves the majority of the Thai population at lower cost.",
    action: "Bangkok hospital landscape: (1) Private international hospitals (most relevant for tourists): Bumrungrad International (JCI-accredited, 200,000+ international patients/year, arguably best international patient experience), Bangkok Hospital Medical Center (BNH), Samitivej, Pahol Polyclinic — these hospitals quote prices in advance, have English-speaking staff throughout, and accept international insurance; (2) Government hospitals: Siriraj Hospital and Ramathibodi Hospital are Thailand's leading medical research/teaching hospitals with world-class specialists — costs are dramatically lower but the experience involves Thai-language navigation and longer waiting times; (3) Emergency room reality: Bangkok's private hospital ERs are accessible, fast (for paying patients), and genuinely high quality — presenting at Bumrungrad or Samitivej ER with a health issue that isn't immediately life-threatening is appropriate; (4) Medical insurance for Bangkok: both travel insurance with medical coverage and international health insurance plans (Cigna Global, Aetna International, BUPA International) are accepted at private Bangkok hospitals; upfront payment followed by insurance claim is common at smaller facilities.",
  },
  {
    title: "Natural Disasters & Safety in Thailand",
    emoji: "⛈️",
    summary: "Thailand's natural disaster profile — flood seasons, tropical storms, tsunami awareness, and Bangkok-specific flood risks that residents and visitors should understand.",
    action: "Thailand natural hazard calendar: (1) Flood season: the Gulf of Thailand and Chao Phraya basin experiences annual flooding June–October during monsoon — Bangkok has significant flood risk in low-lying areas (the 2011 Great Flood inundated large parts of Bangkok for months); monitoring Thai Meteorological Department (tmd.go.th) during rainy season is practical; (2) Tropical cyclones: the Gulf of Thailand and Bay of Bengal produce cyclones primarily October–December — Koh Samui and the eastern coast are the most affected Bangkok-accessible areas; (3) Tsunami risk: the Indian Ocean (Andaman Coast — Phuket, Krabi, Khao Lak) has tsunami risk from seismic activity; the Gulf of Thailand side (Bangkok, Pattaya, Koh Samui) has much lower tsunami risk due to the Malaysia Peninsula barrier; (4) Air quality: Bangkok's PM2.5 pollution peaks December–March when agricultural burning (northern Thailand) and temperature inversions reduce air movement — checking IQAir.com or AirVisual app for real-time Bangkok AQI is practical for anyone with respiratory concerns; (5) Emergency preparedness: basic flood supplies (clean water, medication, essential documents in waterproof container) are recommended during rainy season for Bangkok residents in historically-flooded areas.",
  },
  {
    title: "Bangkok Scams & Safety",
    emoji: "⚠️",
    summary: "Common Bangkok tourist situations that lead to financial loss or distress — the most prevalent scams and how to navigate them without excessive paranoia.",
    action: "Bangkok safety knowledge without excessive fear: (1) The tuk-tuk gem store scam: a friendly driver offers a very cheap or free ride to a 'special' place; the route inevitably includes a gem store where high-pressure sales occur — any tuk-tuk offering you free rides to see 'special Buddha' or 'government gem sale' is running this scam; (2) Closed attraction scam: a stranger tells you that your destination (Grand Palace, Wat Pho) is 'closed today for cleaning/holiday/ceremony' and offers to take you somewhere else — these attractions are almost never closed during operating hours; (3) Taxi meter refusal: legal Bangkok taxis must use the meter; if a driver refuses to use the meter and quotes a flat rate, get out and find another taxi; using Grab (Thai equivalent of Uber) eliminates this issue entirely; (4) The 'friendly stranger' who invites you for drinks or gambling — if you can't independently verify who you're with, this carries risk of drugged drink or gambling fraud; (5) Bangkok is significantly safer than these warnings suggest for normal tourist activity — millions of people visit Bangkok annually without incident; basic awareness is sufficient for the vast majority of visits.",
  },
];

export function BangkokEmergency() {
  return (
    <div className="rounded-2xl border border-red-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-red-700 mb-3">
        🆘 Bangkok emergency guide — hospitals, safety, natural hazards & avoiding scams
      </div>
      <div className="space-y-1">
        {TOPICS.map((t) => (
          <details key={t.title} className="border border-red-100 rounded-xl">
            <summary className="cursor-pointer p-3 flex items-center gap-2">
              <span className="text-xl">{t.emoji}</span>
              <span className="font-bold text-xs flex-1">{t.title}</span>
              <span className="text-[10px] text-[var(--muted)] shrink-0">{t.summary.slice(0, 60)}…</span>
            </summary>
            <div className="px-3 pb-3 text-[10px] text-[var(--fg)] leading-snug border-t border-red-50 pt-2">
              {t.summary}
              <div className="mt-1 text-red-700">▶ {t.action}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
