const SPOTS = [
  {
    name: "Wedding Venues in Bangkok — Hotels & Unique Spaces",
    emoji: "💍",
    area: "Mandarin Oriental Bangkok, Capella Bangkok, The Peninsula, rooftop venues, heritage buildings",
    price: "Hotel ballroom wedding ฿300,000–3,000,000+; Rooftop venue ฿150,000–600,000; Boutique venue ฿80,000–300,000",
    why: "Bangkok offers exceptional wedding venue diversity — from colonial-era grand hotels along the Chao Phraya River (Mandarin Oriental, established 1876; The Peninsula with river-facing ceremony options; Capella Bangkok's intimate riverside luxury) to modern rooftop ballrooms above the skyline, Thai heritage estate venues, and boutique hotels with curated ceremony packages. The Mandarin Oriental's lawn and garden ceremony with river backdrop is one of Asia's most iconic wedding settings — the combination of 150 years of hospitality history, lush tropical garden, and the Chao Phraya River creates photographs that no studio can replicate. Bangkok's year-round event infrastructure (professional florists, photographers, caterers, event coordinators with international experience) supports weddings at any scale.",
    tip: "Bangkok wedding planning timeline: 12–18 months advance booking for prime hotels on peak season weekends (November–February); 6–12 months for boutique venues. Legal registration: a civil marriage in Thailand requires both parties' documents (passport, certified single-status declaration from home country), registration at the local district office (amphoe), and typically an official translator — this takes 1–2 days and is separate from the ceremony. Symbolic ceremonies: many international couples hold a symbolic ceremony in Bangkok (no legal force in their home country) alongside a legal registration at home — Bangkok's ceremony infrastructure supports this format well. Destination wedding coordinators: several Bangkok-based companies specialize in destination weddings for international couples and handle logistics that are complex without local knowledge.",
  },
  {
    name: "Thai Traditional Wedding Ceremonies",
    emoji: "🙏",
    area: "Throughout Bangkok — Buddhist temples, wedding venues offering Thai ceremony packages",
    price: "Monk blessing ceremony ฿5,000–30,000 (temple donation, monk travel); Full Thai ceremony coordination ฿50,000–300,000",
    why: "Thai traditional weddings incorporate Buddhist ceremony elements, specific auspicious timing (consultation with a monk or astrologist to select the wedding date), and a series of rituals that have evolved over centuries. The Khan Maak procession (groom's party bringing gifts to the bride's home), the thread-tying ceremony (sai monkol), and the rod nam sang (elder's blessing with conch water poured over the couple's hands joined) are core elements of a traditional Thai ceremony. For mixed Thai-international couples, a hybrid ceremony incorporating traditional Thai elements alongside Western ceremony format is common and deeply meaningful. Bangkok's event industry has extensive experience managing Thai-international hybrid ceremonies.",
    tip: "Thai ceremony element understanding: the number of monks participating in a blessing ceremony is traditionally odd (3, 5, 7, or 9) and the timing of the ceremony is determined by an auspicious calculation. Appropriate dress: Thai ceremonial dress for the couple (typically rented or purchased at specialist shops in Pratunam area or at major malls) is traditional — Thai brides often wear a chut thai pasin (formal blouse and wrapped skirt in silk) with gold jewelry. Consultation with a Thai cultural advisor or a Thai family member familiar with ceremony protocol is essential for ensuring rituals are conducted correctly and respectfully.",
  },
  {
    name: "Pre-Wedding Photography in Bangkok",
    emoji: "📸",
    area: "Chao Phraya riverside, Grand Palace exterior, Lumphini Park, cafe/rooftop areas, Ayutthaya (day trip)",
    price: "Bangkok pre-wedding shoot ฿15,000–60,000 (4–8 hours); With Ayutthaya day trip add ฿5,000–10,000; MUA separate",
    why: "Pre-wedding photography (engagement shoots taken in the weeks or months before the wedding, used for wedding décor and announcement) has become extremely popular in Bangkok's wedding culture — the city's visual diversity (ancient temple complex exteriors, modern skyline, colonial architecture, lush tropical parks) provides exceptional photographic range in compact geography. Bangkok's professional pre-wedding photography industry is substantial — hundreds of studios and independent photographers serve both Thai and international couples. The Chao Phraya riverfront (especially at golden hour), Wat Arun (Temple of Dawn, dramatic spire backdrop), the area around the Grand Palace, and Lumphini Park are the most frequently photographed locations. Day trips to Ayutthaya's ancient ruins (80km north, 90 minutes by train) provide a dramatic UNESCO-heritage backdrop.",
    tip: "Bangkok pre-wedding shoot logistics: hire a professional makeup artist (MUA) separately from the photographer — Thailand's beauty professionals are exceptional at bridal/formal makeup and understand how makeup photographs in Bangkok's strong sunlight. Wardrobe: for outdoor Bangkok shoots, bring a minimum of 2–3 outfits (traditional Thai dress + Western formal + casual) to utilize different settings. Timing: golden hour shoots (5:30–7pm) at riverside locations dramatically improve quality — midday direct Bangkok sunlight is harsh. Temple exterior shoots: maintain respectful dress even as pre-wedding photography backdrop; no bare shoulders or short skirts near temple grounds. Drone photography permits: drone photography in central Bangkok requires permits — confirm with your photographer if they have current authorizations.",
  },
];

export function BangkokWeddingPlan() {
  return (
    <div className="rounded-2xl border border-pink-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-pink-700 mb-3">
        💍 Bangkok weddings — venue guide, Thai ceremonies & pre-wedding photography
      </h2>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-pink-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-pink-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
