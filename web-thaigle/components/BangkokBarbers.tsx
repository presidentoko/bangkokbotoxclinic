const SPOTS = [
  {
    name: "Bangkok Barbershop Scene — Traditional & Modern",
    emoji: "✂️",
    area: "Throughout Bangkok — barber shops at every price point, major concentration in Sukhumvit, Silom, Ari, and Thong Lor",
    price: "Traditional Thai barber: haircut ฿80–200; Straight razor shave ฿100–200; Modern barbershop: ฿300–700; Premium/grooming shop: ฿500–1,500",
    why: "Bangkok has an exceptional barbershop value proposition — haircuts at quality barbers cost 10–30% of equivalent services in Western countries, while Thai barbers have genuine technical skill developed through apprenticeship traditions. The barbershop landscape divides into: traditional Thai barbers (older-style shops with reclining chairs, straight razor shaves, and the classic Thai haircut including head, neck, and shoulder massage standard), modern Thai barbershops (contemporary design, fade and undercut specialists, Instagram-documented aesthetics), and premium grooming shops (full service including haircut, beard, facial, and sometimes color). Bangkok's modern barbershop movement, particularly in Thong Lor and Ari neighborhoods, has created shops that are genuinely world-class in technique and experience at a fraction of Western prices.",
    tip: "Bangkok barber finding strategy: Instagram is the most current source for Bangkok barbershop discovery — search #bangkokbarber or neighborhood tags. Photo reference is universal — showing a photo of the desired haircut eliminates language barriers effectively. Traditional barbers: the straight razor shave experience at a traditional Bangkok barber (with the hot towel, shaving cream lather, blade, and followup with aftershave and a few slaps to close pores) is a genuine cultural experience available for ฿100–200 — seek out the older-style shops near markets and local neighborhoods rather than tourist areas for the most authentic experience. Tipping: not mandatory but common at higher-end barbershops (฿50–100 is appropriate); at traditional barbers, the printed price is all-in.",
  },
  {
    name: "Men's Grooming & Spa Services",
    emoji: "💆",
    area: "Grooming-focused salons throughout Bangkok — premium areas: Thong Lor, Silom, Sukhumvit",
    price: "Men's facial ฿500–2,000; Head massage with barber service ฿200–500; Full grooming package ฿1,000–4,000",
    why: "Bangkok has developed a significant men's grooming culture beyond basic haircuts — the Thai massage tradition's integration into everyday barbershop service (head, neck, and shoulder massage often included with haircut services at traditional barbers) has created a baseline service expectation that Western men find surprisingly comprehensive. Premium grooming shops extend this with facial treatments, manicures/pedicures for men, beard waxing and styling, and full grooming service packages. The price-quality relationship in Bangkok men's grooming is dramatically favorable compared to comparable Western market pricing: a premium Bangkok grooming experience (haircut, beard service, facial, head massage) totaling ฿1,500–2,500 would cost USD 150–300+ in Western cities.",
    tip: "Bangkok men's spa services: many Bangkok day spas (not just traditional massage shops) offer men-specific facial treatments targeting Bangkok's air quality skin effects (PM2.5 accumulation, sweat-clogged pores from humidity). Men's nail care: pedicures specifically are genuinely useful in Bangkok's sandal-wearing culture and available at most nail salons without any social hesitation — routine foot maintenance is practical rather than cosmetic in this context. Hair color: Bangkok's salons do excellent hair color work including bleaching, highlights, and the K-pop-influenced Korean-style color treatments — pricing is dramatically below Western salon prices for equivalent quality.",
  },
  {
    name: "Thai Hair Culture & Beauty Rituals",
    emoji: "🌿",
    area: "Traditional hair care products at markets, specialized hair treatment salons, traditional apothecaries",
    price: "Thai herbal hair treatment ฿300–800; Kaffir lime hair rinse treatment ฿200–500; Hair ritual package ฿600–2,500",
    why: "Thailand has a rich indigenous hair care tradition — the kaffir lime (ma krut) hair rinse has been used in Thailand for centuries and provides a genuinely effective protein treatment that leaves hair glossy and strong. Traditional Thai hair oil preparations (using coconut oil, jasmine, and other botanical infusions) predate Western hair product chemistry by centuries and remain in use in traditional beauty rituals. Bangkok's traditional market apothecaries (particularly in Chinatown and traditional district markets) sell these herbal hair preparations in authentic forms. The intersection of traditional Thai beauty with the modern K-beauty influence has produced Bangkok salons that blend traditional herbal treatments with Korean hair technology — scalp care, hair streaming, and treatment protocols.",
    tip: "Thai hair care products to seek at Bangkok markets: pure kaffir lime juice (squeezed fresh at some market stalls or sold as concentrated extract) is a traditional final rinse after shampooing — it closes the hair cuticle and adds significant shine. Virgin coconut oil: available at health food stores throughout Bangkok as an authentic traditional hair and skin treatment. The best place to find traditional Thai hair and beauty apothecary products: Or Tor Kor market and traditional market areas in Chinatown and Banglamphu have established apothecary vendors with genuine traditional products alongside mainstream cosmetics.",
  },
];

export function BangkokBarbers() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-slate-700 mb-3">
        ✂️ Bangkok barbershops & grooming — traditional barbers, men's spa & Thai hair care
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-slate-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-slate-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
