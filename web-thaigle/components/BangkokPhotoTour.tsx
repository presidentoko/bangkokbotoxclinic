const TOURS = [
  {
    name: "Golden Hour Bangkrachao Photo Walk",
    emoji: "🌅",
    area: "Bangkrachao ('Bangkok's Green Lung'), via Klong Toei pier",
    price: "DIY free; Guided tour ฿800–2,000",
    why: "Bangkrachao at golden hour is Bangkok's best landscape photography experience — lush mangrove and orchard island 15 minutes from central Bangkok, with wooden bridges, village life, and canals. Sunrise: misty canals and farmers on bikes. Sunset: warm light through the orchard canopy. Far from the city's concrete aesthetic. Bicycle rentals available on the island.",
    tip: "Bring mosquito repellent. Best access: last Bangkrachao ferry (approx 6:30pm) barely catches sunset in good weather. Arrive by 5pm for the best golden hour walk along the wooden bridge circuit. The wooden bridge walkway between the piers is the most photogenic path.",
  },
  {
    name: "Street Photography — Chinatown & Bangrak",
    emoji: "📸",
    area: "Yaowarat/Chinatown, Bangrak, Old City",
    price: "Free; Photo tour guide ฿1,500–3,500",
    why: "Bangkok's old districts are Southeast Asia's best street photography environments — Yaowarat neon signs at dusk, street food vendors with wok fire, traditional shophouses, gold merchants. Bangrak (Bang Rak) has 19th-century Portuguese and Chinese shophouse architecture. Old City (Rattanakosin) temple alleys. The layering of eras, the density of life, and the light make Bangkok exceptional for documentary street photography.",
    tip: "Shoot in RAW if possible — Chinatown at night requires significant processing. Best shots: 5:30–7pm during the transition from natural to neon light. The gold shop district (Yaowarat mid-block) glows yellow in evening light. Ask permission for close portraits — most Bangkok street vendors are comfortable being photographed if you show the result.",
  },
  {
    name: "Architecture & Modernism Photo Tour",
    emoji: "🏙️",
    area: "Riverside (State Tower, ICON Siam), Sukhumvit (Mahanakhon), Silom",
    price: "Free walking; Drone permit required for aerial",
    why: "Bangkok's skyline is dramatic — Mahanakhon's pixelated exterior, MahaNakhon Skywalk's glass floor, King Power Mahanakhon's observation deck, ICON Siam's curvilinear exterior at night. The Chao Phraya riverside has the contrast of ancient Wat Arun against modern banking towers. Architecture photographers have decades of material in Bangkok.",
    tip: "Drone photography in Bangkok requires CAA permit and is prohibited near the Grand Palace, airports, and most central areas. For architectural photography: Mahanakhon observation deck (฿1,080 entry) provides the best urban overview. Evening shots of the river from ICON Siam's waterfront promenade are free.",
  },
];

export function BangkokPhotoTour() {
  return (
    <div className="rounded-2xl border border-violet-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-violet-700 mb-3">
        📸 Photo tours in Bangkok — golden hour walks, street photography & architecture
      </div>
      <div className="space-y-2">
        {TOURS.map((t) => (
          <div key={t.name} className="border border-violet-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{t.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{t.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{t.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{t.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{t.why}</div>
            <div className="text-[10px] text-violet-700">💡 {t.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
