const INFO = [
  {
    heading: "Is Scooter Riding in Bangkok Recommended?",
    emoji: "⚠️",
    content: "Bangkok city center is NOT recommended for scooter beginners. Traffic is dense, road markings inconsistent, motorcycle lanes exist but are poorly defined. The expressway and tollway system is confusing. However: many Bangkok suburbs and neighborhoods like Bangkrachao island and quieter sois are excellent for scooter exploration.",
  },
  {
    heading: "Where Scooters Make Sense in Bangkok Area",
    emoji: "🏍️",
    content: "Bangkrachao island (car-free, scooter-perfect), Kanchanaburi (2 hrs from Bangkok), Ayutthaya historic sites (flat, manageable), Khao Yai weekend escape, and coastal areas like Hua Hin and Pattaya. These destinations are reachable by car/bus and then scooter-explored locally.",
  },
  {
    heading: "Rental Process in Bangkok",
    emoji: "🔑",
    content: "Passport required as ID (sometimes held as deposit — insist on deposit cash instead). Daily rate: 150–300฿ for Honda Click/PCX automatics. Full-day rental usually 8am–6pm. Check brakes, headlights, and tyres before accepting the scooter. Photograph any existing damage with the rental staff present.",
  },
  {
    heading: "Insurance & Legal Reality",
    emoji: "🛡️",
    content: "Most travel insurance policies explicitly exclude motorbike/scooter accidents unless you hold a valid motorcycle license from your home country. Thai law requires a Thai motorcycle license or IDP covering motorcycles. In practice, tourist scooter riding is widespread but verify your insurance coverage carefully before renting.",
  },
  {
    heading: "Helmet Law",
    emoji: "⛑️",
    content: "Helmets required by law for both rider and passenger — ฿500 fine for violation. Rental shops provide helmets. Bring your own quality helmet if safety matters (rental helmets vary widely in quality). Full-face helmets available for purchase at Motorcycle Centers on the Ratchada area.",
  },
];

export function BangkokScooterRental() {
  return (
    <div className="rounded-2xl border border-orange-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-orange-700 mb-3">
        🏍️ Scooter rental near Bangkok — where to ride, rental process & safety
      </h2>
      <div className="space-y-2">
        {INFO.map((i) => (
          <div key={i.heading} className="border border-orange-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1">
              <span className="text-xl shrink-0">{i.emoji}</span>
              <div className="font-bold text-xs">{i.heading}</div>
            </div>
            <div className="text-[10px] text-[var(--fg)] leading-snug">{i.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
