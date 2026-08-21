const DAY_TRIPS = [
  {
    name: "Ayutthaya — Ancient Capital",
    emoji: "🏛️",
    distance: "80km north, 1.5hr by train or minibus",
    cost: "Train ฿15–345. Entry: ฿50/temple, ฿220 combined pass",
    why: "UNESCO World Heritage temples, stone Buddhas, river island setting. Bangkok's most rewarding day trip for history lovers.",
    how: "Hua Lamphong station → Ayutthaya station (hourly trains). Or minibus from Mo Chit (northern bus terminal).",
    best: "Wat Mahathat (face in tree roots), Wat Phra Sri Sanphet, elephant sanctuary if interested. Rent bicycle at station ฿50.",
    tip: "Start by 7am to beat heat and tour buses. Back by 6pm on last train.",
  },
  {
    name: "Kanchanaburi — WWII History + Nature",
    emoji: "🌉",
    distance: "130km west, 2.5hr by train",
    cost: "Train ฿100–300. Admission free to bridge, ฿50–100 for museums.",
    why: "Bridge on the River Kwai, Death Railway, WWII museum, and stunning Erawan waterfalls nearby (30min by songthaew).",
    how: "Thonburi station (Bangkok Noi) → Kanchanaburi by train Saturday/Sunday. Or Sai Tai Mai minibus daily 5:30am–9pm.",
    best: "Walk across the actual bridge, Jeath War Museum, Allied War Cemetery, then Erawan Falls (hire songthaew ฿150–200 return).",
    tip: "Kanchanaburi weekend trains leave Saturday 7:45am and Sunday 7:45am. Book at Thonburi station.",
  },
  {
    name: "Damnoen Saduak Floating Market",
    emoji: "🛶",
    distance: "100km southwest, 2hr by minibus",
    cost: "Minibus ฿100–150 from Southern Bus Terminal (Sai Tai Mai). Entry free, boat tour ฿150.",
    why: "Photogenic canal market selling food and produce from boats. Touristy but genuinely colorful and fun early morning.",
    how: "Air-conditioned minibus from Sai Tai Mai bus station (BTS Victory Monument then Grab to terminal). Leave by 7am.",
    best: "Arrive 8–9am before tour buses. Pad Thai from boat vendor ฿80. Don't feel pressured to buy every souvenir.",
    tip: "Combine with Amphawa Floating Market (17km east) for evening boat tour and firefly watching.",
  },
  {
    name: "Pattaya Beach Weekend",
    emoji: "🏖️",
    distance: "150km southeast, 2hr by express bus",
    cost: "Bus ฿108–200 from Ekkamai Eastern Bus Terminal. Day trip or overnight.",
    why: "Closest beach resort to Bangkok. Jomtien Beach quieter than Pattaya Beach. Water sports, seafood, and Koh Larn island day trip option.",
    how: "BTS to Ekkamai, then bus from Ekkamai Eastern Bus Terminal (hourly 5am–10pm). Or Grab for group of 3+.",
    best: "Jomtien Beach over Pattaya Beach (calmer). Koh Larn ferry ฿30 from Bali Hai Pier. Fresh seafood at Naklua Fish Market.",
    tip: "Day trip or overnight. Can get expensive with water activities. Budget ฿1,500–2,500 for transport + activities.",
  },
];

export function BangkokDayTripsGuide() {
  return (
    <div className="rounded-2xl border border-teal-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-teal-700 mb-3">
        🗺️ Bangkok day trips — best escapes within 3 hours
      </h2>
      <div className="space-y-2">
        {DAY_TRIPS.map((d) => (
          <details key={d.name} className="border border-teal-100 rounded-xl overflow-hidden group">
            <summary className="px-3 py-2.5 cursor-pointer flex items-center gap-2 hover:bg-teal-50 transition">
              <span className="text-2xl shrink-0">{d.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{d.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{d.distance}</div>
              </div>
            </summary>
            <div className="px-3 pb-3 border-t border-teal-100 pt-2 space-y-1">
              <div className="text-[10px] text-[var(--fg)] leading-snug">{d.why}</div>
              <div className="text-[10px] text-teal-700">🚌 How to get there: {d.how}</div>
              <div className="text-[10px] text-orange-600">⭐ Best: {d.best}</div>
              <div className="text-[10px] text-green-700">💰 Cost: {d.cost}</div>
              <div className="text-[10px] text-[var(--muted)]">💡 {d.tip}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
