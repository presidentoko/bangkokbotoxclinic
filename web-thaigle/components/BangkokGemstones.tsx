const SPOTS = [
  {
    name: "Bangkok's Gem & Jewelry Trade Hub",
    emoji: "💎",
    area: "Silom Road (major gem district), Jewelry Trade Center (Silom), Si Lom complex building, Jao Sua Road, and Makkasan (colored stone cutting district)",
    price: "Colored gemstones (per carat): sapphire ฿500–50,000+; ruby ฿1,000–200,000+; Emerald varies; Gold 96.5%: near spot price; Jewelry manufacturing: ฿1,000–50,000+ for custom pieces",
    why: "Bangkok is one of the world's most important gemstone trading and cutting centers — the city accounts for a substantial portion of global colored gemstone (particularly ruby, sapphire, and other corundum) cutting, treatment, and trading volume. Thailand's proximity to the classic ruby and sapphire sources (Myanmar/Mogok, Chanthaburi province in Thailand itself, Sri Lanka, Madagascar) has made Bangkok the natural hub for the colored stone trade. The Silom area gem district has hundreds of dealers, cutting workshops, jewelry manufacturers, and exporters operating within a few blocks — visiting this area reveals a genuine global trade hub operating in plain sight. Bangkok's gem cutting expertise: Thai gem cutters are among the world's most skilled, particularly for ruby and sapphire. Bangkok also has multiple gem treatment facilities (heating, fracture filling) that serve the global trade.",
    tip: "Bangkok gem buying guide: (1) Education before purchasing — the Bangkok gem trade is knowledgeable and competitive at the professional level; without comparable knowledge, tourists paying 'gem tour' prices are almost always paying 3–10x fair value; (2) If serious about gem purchasing: obtain a GIA or AGL (American Gemological Laboratories) certificate for any stone costing over ฿20,000 — certificates verify natural origin, treatments, and quality; reputable Bangkok dealers provide these; (3) The gem tour scam: the 'government gem sale' or 'special lucky day at gem wholesale' approach used on tourists near the Grand Palace and major tourist sites is one of Bangkok's longest-running tourist scams — do not participate regardless of how legitimate the 'guide' appears; (4) Legitimate gem shopping: Silom area gem dealers who have permanent shops, English-language websites, and international client relationships are the safer access point for non-professional buyers.",
  },
  {
    name: "Gold in Bangkok — Thai Gold Culture",
    emoji: "🥇",
    area: "Chinatown (Yaowarat Road) gold shops, gold shops at every major Bangkok shopping area, 24K Thai gold jewelry standard",
    price: "Thai gold (96.5% purity): near spot price (฿30,000–35,000+ per baht weight = 15.2 grams); Workmanship charges ฿500–3,000+; 18K Italian-style gold (different pricing)",
    why: "Gold purchasing in Bangkok occupies a unique position — Thai gold culture (96.5% purity, distinctively warm yellow color, sold by 'baht weight' at near-spot prices with small workmanship charges) is one of the world's most transparent and fair gold markets. Yaowarat (Chinatown) in Bangkok is lined with hundreds of gold shops that display current buy and sell prices alongside government-regulated spot prices — the Thai gold market operates with minimal markup over the commodity price of gold. This makes Bangkok one of the world's best places to purchase gold jewelry as an investment-grade asset rather than purely as fashion jewelry. Thai gold jewelry aesthetics: traditional Thai gold jewelry (22–24K) tends toward simpler, heavier designs compared to Western fashion jewelry — the value is in gold content rather than design complexity. The Yaowarat gold shops experience is genuinely fascinating as a visible commodity market.",
    tip: "Bangkok gold purchasing guide: (1) Price transparency: the Thai Gold Traders Association publishes daily gold prices that shops are required to post — the buy/sell spread is typically ฿200–300 per baht weight, which is significantly lower than Western jewelry markup; (2) Baht weight measurement: 1 Thai baht of gold = 15.244 grams; prices are quoted per baht of gold — doing the math against international spot prices validates fair pricing; (3) Workmanship charges: the cost above spot price for the labor to fabricate the jewelry is the variable component — simpler designs have lower workmanship charges; (4) Chinatown gold shop hours: Yaowarat gold shops typically close on Chinese New Year and other Chinese holiday periods — planning around this is practical; (5) Carrying gold internationally: gold jewelry purchased in Bangkok for personal wear is generally exempt from customs duty in most countries when worn — confirm your home country's regulations before purchasing investment quantities.",
  },
  {
    name: "Custom Jewelry Making in Bangkok",
    emoji: "⚒️",
    area: "Jewelry workshops in Silom and Pratunam areas, custom jewelry studios, goldsmith workshops in Chinatown",
    price: "Custom gold ring (simple design): ฿3,000–10,000 fabrication; Custom stone-set piece ฿5,000–50,000+; Jewelry making class (beginner): ฿2,000–5,000; Silver jewelry workshop ฿1,500–3,500",
    why: "Bangkok's jewelry manufacturing infrastructure supports world-class custom fabrication — the combination of skilled goldsmiths (many of whom have decades of experience), access to excellent materials (Thai gold, sourced gemstones, imported findings), and labor costs significantly below Western markets creates a custom jewelry opportunity that attracts buyers from globally. Custom jewelry use cases in Bangkok: bringing a design idea (sketch, photo, or 3D model) to a Bangkok goldsmith and receiving a handcrafted piece at a fraction of Western jeweler pricing. Silver jewelry: Thailand's silversmith tradition (particularly in Chiang Mai, where hill tribe silver work is a significant craft industry) is accessible at Bangkok jewelry shops and craft markets. Bangkok also has jewelry-making workshop experiences available for tourists — typically silver ring or simple pendant fabrication using basic goldsmithing tools under instructor guidance.",
    tip: "Bangkok custom jewelry commission guide: (1) Referral-based goldsmith finding: asking at gem dealers in Silom for recommended fabricators, or connecting through expat communities who have had successful custom work done, is more reliable than random selection; (2) Design communication: CAD (computer-aided design) 3D renderings before fabrication are now common at better Bangkok jewelry shops — this prevents miscommunication and allows design refinement before metal is committed; (3) Timeline reality: quality custom jewelry fabrication in Bangkok typically takes 3–5 business days minimum; rush work costs more and results in lower quality; (4) Hallmarking: Thai gold jewelry should be hallmarked with purity stamps — verify the purity marking matches what you paid for; (5) Silver jewelry at Chatuchak: the weekend market's jewelry sections (particularly areas near sections 2 and 3) have excellent and affordable silver jewelry from direct-from-maker vendors.",
  },
];

export function BangkokGemstones() {
  return (
    <div className="rounded-2xl border border-cyan-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-cyan-700 mb-3">
        💎 Bangkok gems & gold — colored stones trading hub, Thai gold culture & custom jewelry
      </h2>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-cyan-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-cyan-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
