const SPOTS = [
  {
    name: "Field Hockey in Bangkok",
    emoji: "🏑",
    area: "National sports complexes (Hua Mark National Stadium), university sports fields (Kasetsart, Mahidol)",
    price: "Training session ฿300–800; League registration ฿5,000–15,000/season; Equipment ฿3,000–15,000",
    why: "Field hockey in Thailand is administered by the Hockey Association of Thailand — the sport has an established base, particularly in Bangkok universities and at the national sports complex level. Thailand's national hockey team competes in Asian Hockey Federation events; women's hockey has stronger representation at the regional competition level. The Bangkok field hockey community is relatively small but dedicated — mostly Thai players at club level, with international development programs. For expats with prior field hockey background: the Bangkok hockey community is accessible and welcoming to experienced players — connecting through the Hockey Association of Thailand or university clubs is the path in.",
    tip: "Bangkok field hockey access: the most reliable route into Bangkok's field hockey community is through university sports clubs (particularly Chulalongkorn, Kasetsart, and ABAC which maintain active hockey programs) or through the Hockey Association of Thailand's official club listings. Equipment note: specialist field hockey equipment (curved sticks, goalkeeper gear, shin guards, mouthguards) is available from sports shops in Bangkok (Supersports, Decathlon) — basic sticks are accessible; specialist goalkeeper equipment may require advance ordering. For families relocating to Bangkok: international schools with field hockey programs (King George International, NIST, Shrewsbury) maintain competitive school hockey teams and provide the most structured youth development pathway.",
  },
  {
    name: "Ice Hockey in Bangkok",
    emoji: "🏒",
    area: "Ice rinks with hockey programs: Central World ice rink, Xtreme Ice Arena, Snow Town ice rinks",
    price: "Public skating ฿250–400; Hockey equipment rental ฿400–700; Hockey lesson ฿1,000–2,500",
    why: "Ice hockey in Bangkok is a genuinely niche activity sustained by the city's expatriate community from hockey-playing nations (Canadians, Americans, Russians, Finns, Swedes, Czechs — all of whom have significant Bangkok populations). The Bangkok recreational ice hockey scene centers on mall ice rinks that run hockey-specific sessions — learn-to-skate programs with hockey elements, adult recreational leagues, and skills clinics. Bangkok has a small but active adult recreational hockey community that uses available ice time at commercial rinks. The cultural disconnect: ice hockey requires explaining rules and context to Thai co-workers and friends — it's genuinely unfamiliar to the Thai sports mainstream.",
    tip: "Bangkok ice hockey practical information: ice time is expensive and scarce — most Bangkok ice rinks are primarily figure skating and public skating venues with limited hockey ice availability. Contact rink management directly to inquire about hockey scheduling and adult recreational leagues. Equipment: bringing your own skates significantly improves the experience (rental skates at Bangkok rinks are often low quality). Bangkok hockey player community: the Bangkok Hockey Association (Facebook group) organizes recreational games and events — connecting with this group is the starting point for expat hockey players. For children: some Bangkok ice rinks offer youth learn-to-skate programs that can transition to hockey skill development with appropriate coaching.",
  },
  {
    name: "Inline Skating & Street Hockey",
    emoji: "⛸️",
    area: "Skateparks (Ratchada area, BITEC, Lumphini Park roller skating area), parking structures for inline",
    price: "Inline skate rental ฿150–300/hour; Own inline skates ฿1,500–8,000; Skatepark free",
    why: "Inline skating in Bangkok occupies the intersection between recreational skating, aggressive skating, and street hockey culture. The Bangkok inline skating community uses public spaces — Lumphini Park's designated roller skating area, BITEC Bangna's wide corridors, and covered parking structures. Aggressive inline (skatepark tricks) shares space with the Bangkok skate culture at skateparks including Ratchada Skate Park and Sena Park. Street hockey on inline skates is an informal activity rather than organized sport in Bangkok — the climate and infrastructure make it primarily a morning/evening activity. Longboard and aggressive inline communities in Bangkok intersect and often share spaces and community events.",
    tip: "Bangkok inline skating considerations: the tropical heat concentrates skating activity in early mornings (6–9am) and evenings (6–9pm) — midday outdoor skating is unpleasant and potentially dangerous. Bangkok's traffic and road surface quality (uneven surfaces, open drains, pedestrians) makes road skating technically demanding. Lumphini Park roller skating area: dedicated smooth surface for recreational skating, busiest on weekend mornings — a genuine inline community gathers there regularly. Inline skate maintenance: Bangkok humidity affects skate bearings — dry and re-lube ABEC bearings regularly. Protective gear is available from sports shops (Supersports, Decathlon) — wearing wrist guards and helmet is standard in the Bangkok skating community.",
  },
];

export function BangkokHockey() {
  return (
    <div className="rounded-2xl border border-blue-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-blue-700 mb-3">
        🏒 Hockey & skating in Bangkok — field hockey, ice hockey & inline skating
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-blue-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-blue-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
