const SPOTS = [
  {
    name: "Bangkok Budget Hostels — Khao San Area",
    emoji: "🛏️",
    area: "Khao San Road, Banglamphu, Phra Nakhon District — near Grand Palace, BTS not accessible, taxi/tuk-tuk/bus required",
    price: "Dorm bed ฿200–500/night; Private room ฿600–1,500; En-suite private ฿1,000–3,000",
    why: "Khao San Road remains Bangkok's backpacker epicenter — the area around Khao San and the surrounding Banglamphu neighborhood has 50+ years of budget traveler infrastructure including some of Southeast Asia's best hostel social scenes, cheap international food, travel agencies, tattoo parlors, street markets, and the particular Bangkok atmosphere that defined the global backpacker era. The Grand Palace and major temples (Wat Pho, Wat Arun) are within walking distance — the historic rationale for the area remains valid. Modern Khao San hostels range from dormitory-style classic hostels to boutique hostel-hotels with pools. The area's limitation: no direct BTS/MRT access — everywhere else in Bangkok requires a 20-minute tuk-tuk or taxi ride.",
    tip: "Khao San area practical navigation: the Chao Phraya Express Boat is actually the most efficient transport into and out of the Banglamphu area — the N13 (Phra Arthit) pier is a 10-minute walk from Khao San Road and connects to riverside temples and the BTS at Saphan Taksin. Khao San tuk-tuks: negotiate before boarding (฿80–150 to Sukhumvit area depending on traffic and negotiation); insist the driver takes you directly without 'stops' at gem shops or tailor shops (common tourist diversion tactics). The area's social scene has evolved: the best-reviewed modern Khao San hostels (Lub d Bangkok Silom, NapPark Hostel, Siam Classic) offer design-forward spaces with rooftop bars and organized social events that differ from the older dormitory-and-party format.",
  },
  {
    name: "Silom & Sukhumvit Area Hostels",
    emoji: "🌆",
    area: "Silom District (BTS Sala Daeng), Sukhumvit Soi 2–20 area (BTS Nana, Asok, Phrom Phong)",
    price: "Dorm ฿350–700/night; Private hostel room ฿900–2,500; Boutique hostel private ฿1,200–4,000",
    why: "Bangkok's Silom and Sukhumvit corridor hostels offer the city's highest-quality budget accommodation options combined with BTS access — the strategic advantage over Khao San is that everything in Bangkok is reachable without taxi costs. The Silom LGBT+ district (Silom Soi 4, Soi 2) has several boutique hostels popular with the LGBT+ travel community. Sukhumvit area hostels cluster around accessible BTS stations — Nana, Asok, and Phrom Phong are the primary hostels zones, with Asok having excellent walkability and the Terminal 21 mall (good for cheap food courts, free WiFi, AC refuge). The hostel landscape in this area has evolved significantly toward 'hostel-hotels' — properties with both dormitory options and private rooms that compete on design, facilities (pool, co-working space, rooftop), and social programming rather than price alone.",
    tip: "Booking strategy for Bangkok hostels: Hostelworld and Booking.com both cover Bangkok's hostel inventory; reviews from within the last 6 months are most reliable as properties change quality quickly. For solo travelers: book mixed or female-only dorms based on comfort level — female-only dorms are significantly quieter than mixed. Quiet vs. party hostel distinction: Bangkok hostels range from quiet-sleep-focused to party-oriented with bars and event programming — check recent reviews to identify which atmosphere a specific property has at the time of your visit. Security: all lockers (bring a padlock or check if provided), safe deposit boxes, or in-room locked storage are standard at quality hostels — evaluate before booking a valuables storage method.",
  },
  {
    name: "Boutique Guesthouses — Bangkok's Mid-Range Gap",
    emoji: "🏡",
    area: "Throughout Bangkok — the 'boutique guesthouse' category bridges backpacker and hotel",
    price: "Boutique guesthouse private room ฿900–3,000/night; Often includes breakfast; Some pool-equipped ฿1,500–4,000",
    why: "Bangkok's boutique guesthouse category fills the gap between backpacker hostels and hotel rates — these are often heritage shophouse buildings, small family-run properties, or design-focused small hotels with 10–25 rooms in excellent locations that major hotel booking platforms don't always surface easily. The quality range is significant: some boutique guesthouses offer extraordinary value (design-forward, excellent breakfast, helpful English-speaking staff, ideal location) while others are dated properties with inflated prices. The Bangkok guesthouse tradition dates from the Khao San era but has evolved into a sophisticated category in neighborhoods like Ari (quiet residential charm), Thong Lor (design aesthetic), and the charming Chinatown/Yaowarat area where pre-WWII heritage buildings have been converted into atmospheric boutiques.",
    tip: "Finding Bangkok's best boutique guesthouses: Airbnb sometimes surfaces properties not on major hotel platforms; direct booking via the property's social media or website often provides better rates than platform pricing. The Chinatown/Yaowarat area (accessible via MRT Sam Yot) has excellent boutique properties in restored Chinese shophouses — less central than Sukhumvit but more atmospheric. Breakfast value: Bangkok's Thai breakfast (rice congee, fried rice, fruit) at quality guesthouses is genuinely excellent — factor this into total daily cost when comparing accommodation. Key questions when booking: WiFi speed (important for remote workers), whether air-conditioning is per-room-controlled (vs. central and variable), laundry service availability, and nearest BTS/MRT distance.",
  },
];

export function BangkokHostelGuide() {
  return (
    <div className="rounded-2xl border border-teal-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-teal-700 mb-3">
        🛏️ Bangkok hostels & budget accommodation — Khao San Road, Sukhumvit & boutique guesthouses
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-teal-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-teal-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
