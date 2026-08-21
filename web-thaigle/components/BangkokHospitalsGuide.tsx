const HOSPITALS = [
  {
    name: "Bumrungrad International",
    emoji: "🏥",
    area: "Sukhumvit Soi 3",
    why: "World-famous, 30+ languages, 5,000 doctors. Most expats' first choice. Walk-in ER 24/7.",
    phone: "+66 2-066-8888",
    cost: "฿฿฿ — International pricing",
    specialties: "Full spectrum. International SOS network.",
  },
  {
    name: "Bangkok Hospital (BKK-central)",
    emoji: "🏥",
    area: "New Phetchaburi Rd",
    why: "Large network across Thailand. Excellent cardiac and orthopedic units. JCI accredited.",
    phone: "+66 2-310-3000",
    cost: "฿฿–฿฿฿",
    specialties: "Dental, cardiac, orthopedic",
  },
  {
    name: "Samitivej Sukhumvit",
    emoji: "🏥",
    area: "Sukhumvit Soi 49",
    why: "Popular with expat families. 24hr ER, excellent OB/GYN, pediatrics.",
    phone: "+66 2-022-2222",
    cost: "฿฿–฿฿฿",
    specialties: "Family, pediatric, obstetrics",
  },
  {
    name: "Police General Hospital",
    emoji: "🏥",
    area: "Ratchawithi Rd",
    why: "Government hospital with good quality and much lower prices. Long waits.",
    phone: "+66 2-205-2930",
    cost: "฿ — Local pricing",
    specialties: "General, emergency",
  },
];

export function BangkokHospitalsGuide() {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-red-700 mb-3">
        🏥 Bangkok hospitals — for travelers
      </h2>
      <div className="space-y-2">
        {HOSPITALS.map((h) => (
          <div key={h.name} className="bg-white border border-red-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1">
              <span className="text-xl">{h.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{h.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">📍 {h.area} · {h.cost}</div>
              </div>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{h.why}</div>
            <div className="text-[10px] text-[var(--muted)]">✦ {h.specialties}</div>
            <a href={`tel:${h.phone.replace(/ /g, "")}`} className="text-[10px] font-bold text-red-700 hover:underline">
              📞 {h.phone}
            </a>
          </div>
        ))}
      </div>
      <div className="mt-3 text-[10px] text-red-700 font-medium">
        Emergency: Police 191 · Ambulance 1669 · Tourist Police 1155
      </div>
    </div>
  );
}
