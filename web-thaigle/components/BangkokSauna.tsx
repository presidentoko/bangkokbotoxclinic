const SPOTS = [
  {
    name: "Herbal Steam Sauna at Wat Pho",
    emoji: "♨️",
    area: "Wat Pho, Old City (Grand Palace area)",
    price: "฿50–150 (basic steam room access)",
    why: "Wat Pho's traditional medicine school includes a Thai herbal steam room. Steam infused with lemongrass, kaffir lime, ginger, galangal, and prai. Used traditionally to treat muscle tension and fatigue. Ancient style — not luxury spa, but authentic traditional herbal steam experience.",
    tip: "Combine with the famous Wat Pho massage school (฿260/30 min traditional massage). The herbal steam opens pores and enhances the subsequent massage. Open during temple hours (8am–5pm). Bring spare clothes — you'll be very sweaty.",
  },
  {
    name: "Korean Sauna (Jjimjilbang) — Asoke area",
    emoji: "🇰🇷",
    area: "Sukhumvit Asoke, near BTS Asoke",
    price: "฿400–800 all-day pass",
    why: "Bangkok's Korean expat community has brought Korean-style jjimjilbang saunas. Multiple temperature rooms (infrared, salt, clay, gold). Mixed-gender common areas (shorts + sauna uniform provided), separate gender wet rooms. Sleep on the floor area — these are open 24 hours.",
    tip: "Look for Korean businesses signs in the Asoke area. The sauna uniforms are provided — don't bring extra clothes to the common area. Eggs roasted in the dry heat room is a traditional jjimjilbang feature — available for purchase. Avoid if you have heart conditions (high heat exposure).",
  },
  {
    name: "Luxury Spa Sauna (Hotel Day Pass)",
    emoji: "🛁",
    area: "Sukhumvit luxury hotels",
    price: "Day pass ฿1,200–4,000 (includes pool, gym, sauna, steam)",
    why: "Bangkok 5-star hotels offer day spa passes — access to their spa facilities including dry sauna, steam room, ice plunge pool, herbal soak, whirlpool, infinity pool, and gym. JW Marriott, The Sukhothai, Conrad, and SO Bangkok all offer day passes.",
    tip: "Best value: weekday morning (9am–1pm) when business crowd is at work — pools nearly empty. Call ahead (passes sell out at popular hotels). The SO Bangkok rooftop area with pool + sauna combo is spectacular. Bring swimwear — hotel pools require it.",
  },
  {
    name: "Infrared Sauna Therapy (Wellness Studios)",
    emoji: "🌡️",
    area: "Thonglor, Ekkamai wellness zone",
    price: "Per session ฿800–1,500 (45–60 min)",
    why: "Modern wellness studios in Thonglor and Ekkamai offer private infrared sauna cabins. Lower temperature than traditional saunas (50–65°C) but deeper penetrating heat. Popular among Bangkok fitness crowd. Some studios offer additional services: chromotherapy, halotherapy (salt).",
    tip: "Hydrate well before and after — Bangkok humidity already dehydrates. Studios: Body Tune, ViaSpa, and several Japanese wellness spaces in Thonglor. Private rooms mean you can bring your phone — popular option for 'silent retreat' hour alone. Best booked Monday–Wednesday when cheaper rates available.",
  },
];

export function BangkokSauna() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-amber-700 mb-3">
        ♨️ Sauna & steam in Bangkok — herbal steam, Korean jjimjilbang & infrared
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
