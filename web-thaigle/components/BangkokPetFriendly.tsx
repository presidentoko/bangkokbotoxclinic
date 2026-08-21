const SPOTS = [
  {
    name: "Pet-Friendly Cafés (Cat Cafés + Dog Cafés)",
    emoji: "🐱",
    area: "Various Bangkok locations",
    price: "Entrance + drink ฿200–450",
    why: "Bangkok has 15+ cat cafés and several dog cafés. You pay an entrance fee for unlimited time with resident cats or dogs plus a free drink. Healthy, well-cared-for animals. Popular with Thai youth and expats. No need to bring your own pet.",
    tip: "Most famous: Cataholic (Thonglor), Catio (Ari). Dog cafés: different animals each session (rotate dogs). Rules: no picking up cats, wash hands before entry, no flash photography. Visit Tuesday–Thursday to avoid weekend Instagram rush.",
  },
  {
    name: "Bangkok's Dog-Friendly Parks",
    emoji: "🐕",
    area: "Benjakitti Park, Wachirabenchatat Park, Chatuchak Park",
    price: "Free",
    why: "Bangkok's major parks welcome leashed dogs. Benjakitti Park (near MRT Queen Sirikit) has a dedicated dog zone with pet water stations. Chatuchak Park has long walking paths. Dogs must be leashed — most Bangkok parks enforce this. Busy times are 5–8pm.",
    tip: "Bring water and a portable bowl — Bangkok heat dehydrates dogs fast. Morning walks (before 8am) much safer temperature-wise. Pickup bags required but not always available — bring your own. Benjakitti Park's dog area has agility equipment and is very popular.",
  },
  {
    name: "Pet-Friendly Restaurants & Cafés",
    emoji: "🍽️",
    area: "Thonglor, Ekkamai, Ari — outdoor seating areas",
    price: "Normal café/restaurant prices",
    why: "Many Bangkok cafés with outdoor seating welcome leashed well-behaved dogs. Thonglor and Ekkamai neighborhoods have the highest density of pet-tolerant spots. Some restaurants specifically advertise as pet-friendly on Instagram.",
    tip: "No indoor dining with pets in Bangkok (food safety regulations). Outdoor terrace seating only. Carry a mat or portable bed — Bangkok ground is hot even in shade. Always bring water for your dog — outdoor Bangkok café temperatures can stress dogs.",
  },
  {
    name: "Dog-Friendly Hotels in Bangkok",
    emoji: "🏨",
    area: "Select hotels across Bangkok",
    price: "Pet fee varies: ฿500–2,000/night additional",
    why: "Several Bangkok hotels now accept pets. Kimpton Maa-Lai Hotel (5-star, Silom) is pet-welcoming with no pet fee. Sofitel Bangkok Sukhumvit allows pets under 20kg. Various boutique hotels accept small dogs. Policy changes — always confirm before booking.",
    tip: "Call hotel directly even if website says pet-friendly — policies and pet size limits vary. Ask about: pet fee, weight limit, if pets can be left alone in room, designated pet relief areas. Kimpton is the most pet-welcoming luxury hotel in Bangkok (as of 2025).",
  },
];

export function BangkokPetFriendly() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-amber-700 mb-3">
        🐾 Pet-friendly Bangkok — dog parks, cat cafés & pet-welcoming spots
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
            <div className="text-[10px] text-amber-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
