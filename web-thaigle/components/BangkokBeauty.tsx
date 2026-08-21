const SPOTS = [
  {
    name: "Bangkok Hair Salons — International & Local",
    emoji: "💇",
    area: "Japanese hair salons (Thonglor, Ekkamai), Korean hair salons (Thonglor Soi 13 'Korean Street'), Thai premium salons",
    price: "Cut and style ฿500–3,000; Japanese salon cut ฿1,500–4,000; Korean treatment ฿2,000–8,000",
    why: "Bangkok's hair salon scene reflects the city's diversity — Japanese hair salons (staffed by Japanese stylists or Thai stylists trained in Japan) are particularly valued for precision cutting techniques on straight Asian hair. Korean hair salons (concentrated around Thonglor's Korean community corridor) specialize in Korean-trend perms, color techniques, and scalp treatments. Thai premium salons (Toni & Guy, international brands, and local upscale chains) provide reliable international-standard services. The Bangkok Japanese salon experience: same premium-tier quality and consultation depth as Tokyo salons at roughly 40–60% of Tokyo prices — highly popular with Japanese expats and quality-conscious internationals. Hair color culture in Bangkok is sophisticated — balayage, highlights, and precision color work are widely available at quality salons.",
    tip: "Bangkok hair salon selection by hair type: Japanese salons excel with straight/Asian hair texture; Korean salons for perms and trendy styles; Brazilian-owned salons (some in Asoke area) for natural/Afro-textured hair — finding the right specialization matters significantly. Booking: Japanese salons in particular require advance booking (sometimes weeks for popular stylists). Price reality: Bangkok prices seem affordable but Japanese/Korean salon prices reflect imported premium — ฿3,000 for a Japanese cut is still quality value compared to equivalent Tokyo pricing. English communication: most Bangkok international salons have English-speaking stylists or translation systems — describing hair goals via photos is universally effective.",
  },
  {
    name: "Nail Art & Beauty Treatments",
    emoji: "💅",
    area: "Nail salons throughout Bangkok (particularly dense in Siam, Thonglor, Ekkamai, On Nut)",
    price: "Basic nail care ฿200–500; Gel manicure ฿400–900; Nail art intricate design ฿800–3,000",
    why: "Bangkok's nail care culture is advanced and extremely price-competitive — the city has an enormous number of nail salons at every quality level. Thai nail technicians have developed notable expertise in nail art, particularly intricate hand-painted designs, gel extensions, and creative nail shapes. Bangkok nail prices are among the most competitive globally for the quality delivered — what costs $80–150 in Western cities is ฿400–900 in Bangkok. Korean-influenced nail trends have strong adoption in Bangkok's nail salons — minimalist nail art, glass nails, and aurora nail effects reflect K-beauty influence. Nail salons in shopping malls (EmQuartier, Central, Siam Paragon) maintain consistent quality; street-level salons vary more widely.",
    tip: "Bangkok nail salon quality signals: display books showing technician portfolio work, hygiene-focused processes (disposable liners for pedicure bowls, sterilized implements), and clear pricing menus are positive indicators. Nail art appointment length: detailed nail art designs take significantly longer than basic manicure — communicate your design expectation when booking so adequate time is allocated. Gel vs. regular polish: Bangkok's humidity makes regular polish more prone to chipping — gel manicure is worth the price premium for durability. Male nail care: Bangkok's male grooming culture is advanced; men's manicure and pedicure services are genuinely normal and widely available without any social awkwardness.",
  },
  {
    name: "Aesthetic Clinics & Beauty Treatments",
    emoji: "✨",
    area: "Aesthetic clinics throughout Sukhumvit, skin clinics in malls, dermatology clinics",
    price: "Facial treatment ฿500–3,000; Botox per area ฿3,000–12,000; Skin whitening treatment ฿2,000–8,000",
    why: "Bangkok is a significant hub for aesthetic medical treatments — the combination of qualified medical professionals, competitive pricing (20–50% below Western prices for equivalent procedures), and high-quality facilities makes Bangkok attractive for both Thais and medical tourists. The Bangkok aesthetic clinic scene is vast: from hospital-based dermatology departments (Bumrungrad, Samitivej have dermatology and aesthetic medicine departments) to standalone skin clinics throughout the city. Thai skin care culture places high value on whitening/brightening treatments — glutathione IV treatments, vitamin C infusions, and laser brightening have significant demand among Thai clientele. International-standard hyaluronic acid fillers, botulinum toxin, and laser treatments for pigmentation and texture are widely available.",
    tip: "Bangkok aesthetic clinic safety: choose board-certified dermatologists or plastic surgeons for invasive treatments — the Bangkok medical licensing system provides verification. Avoid walk-in injectable treatments at budget salons without medical supervision. Medical tourism logistics: clinics catering to international patients (Apex Medical Group, Absolute Health, Skin Center Thailand) have English-speaking doctors and price transparency. Recovery planning: aesthetic procedures requiring downtime (laser resurfacing, filler at high volumes) need accommodation time before departure. The 'Thai glow' skin care approach: Thai women's daily skin care routines often involve multiple SPF-focused products, hydrating serums, and vitamin C — Bangkok pharmacies (Watsons, Boots) carry high-quality Asian skincare brands at accessible prices.",
  },
];

export function BangkokBeauty() {
  return (
    <div className="rounded-2xl border border-rose-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-rose-700 mb-3">
        💇 Beauty in Bangkok — hair salons, nail art & aesthetic clinics
      </h2>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-rose-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-rose-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
