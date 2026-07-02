const SITES = [
  {
    name: "Rattanakosin Island — Bangkok's Historic Core",
    emoji: "🏛️",
    area: "Rattanakosin (Old Bangkok) — Grand Palace, Sanam Luang, Wat Pho",
    price: "Grand Palace & Wat Phra Kaew ฿500; Wat Pho ฿200; Wat Arun ฿100",
    why: "Rattanakosin Island (the original Bangkok city area, surrounded by the Chao Phraya River and khlong canals) contains Bangkok's most significant historical monuments — the Grand Palace (royal residence and Wat Phra Kaew with the Emerald Buddha), Wat Pho (oldest temple in Bangkok, home to the Reclining Buddha), Wat Arun (Temple of Dawn on the opposite bank), and the National Museum. These monuments represent the Rattanakosin period of Thai history (from 1782) — the current dynasty's capital. Walking this area (2–3 km between major sites) covers more Thai cultural history per meter than anywhere else in the country.",
    tip: "Rattanakosin visit planning: start early (8–9am) before tour groups arrive — the Grand Palace is extremely crowded by 11am. Dress code enforced at all royal/temple sites: shoulders and knees covered (sash/sarong rental available at the gates for ฿50–100 if you arrive inappropriately dressed). The free Chao Phraya Express Boat from Central Pier (Sathorn) to Tha Chang (Grand Palace pier) is the most scenic and traffic-free approach. Allocate a full day for the Rattanakosin temple circuit.",
  },
  {
    name: "Chinatown — Yaowarat Heritage District",
    emoji: "🏮",
    area: "Yaowarat Road, Bangkok Chinatown",
    price: "Free to explore; Food from ฿30/dish",
    why: "Bangkok's Chinatown (established in the 1780s when Chinese merchants were relocated from the Grand Palace area) is one of Asia's most atmospheric Chinatown districts — dense with gold shops, Chinese temples (Wat Mangkon Kamalawat is the most significant), traditional medicine pharmacies, and the most legendary street food concentration in Bangkok. The architecture is layered over 200 years — colonial shophouse facades, neon signage, modern additions — creating a textured streetscape. Yaowarat is also Bangkok's gold trading center — hundreds of gold shops line the main road.",
    tip: "Yaowarat visit strategy: the street food experience is best at night (from 6pm) when the vendors set up fully. Daytime is better for temples and the gold shops (which close by 6pm). The best entry point is MRT Hua Lamphong or the new Yaowarat MRT station. The alley behind the main Yaowarat Road (known as Trok Issara Nuphap) has concentrated traditional Chinese medicine shops and older character architecture. The Chinese New Year period (January-February) transforms Yaowarat into Bangkok's most spectacular street celebration.",
  },
  {
    name: "Charoen Krung & Bang Rak — Creative Heritage Belt",
    emoji: "🎭",
    area: "Charoen Krung Road, Si Phraya, Bang Rak",
    price: "Free to explore; Museums ฿100–200",
    why: "Charoen Krung (Bangkok's first paved road, 1861) runs through the original foreign merchant quarter — Portuguese, French, and British consulates, early hotels, and trading houses established the built environment still partially standing. The River City shopping center (antiques and art), Warehouse 30 (creative industries), TCDC (design center), and the Jam Factory collectively anchor Bangkok's most interesting creative heritage neighborhood. The Mandarin Oriental Hotel's Authors' Wing (opened 1887) is the most atmospheric heritage hospitality site in Thailand. The riverside strip from Si Phraya to the Oriental has Bangkok's most layered history.",
    tip: "Charoen Krung exploration: the ICON SIAM ferry (from Sathorn/Central Pier) passes this entire area — take the Chao Phraya Express to Tha Si Phraya or Oriental pier. The afternoon light on this riverside stretch (3–6pm) is spectacular photography. Heritage houses: Baan Phra Arthit (Phra Arthit Road, northern end) and the Bangkokian Museum (Si Phraya) give residential historical context to Thai middle-class life in the 1940s–1960s. Warehouse 30 and Jam Factory host regular weekend markets that combine heritage architecture with contemporary Bangkok culture.",
  },
];

export function BangkokHeritage() {
  return (
    <div className="rounded-2xl border border-amber-300 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-amber-800 mb-3">
        🏛️ Bangkok heritage — Rattanakosin palaces, Yaowarat Chinatown & Charoen Krung history
      </div>
      <div className="space-y-2">
        {SITES.map((s) => (
          <div key={s.name} className="border border-amber-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-amber-800">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
