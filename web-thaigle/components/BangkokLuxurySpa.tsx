const SPAS = [
  {
    name: "Mandarin Oriental Spa — Bangkok's Historic Luxury",
    emoji: "🌺",
    area: "Mandarin Oriental Hotel, Charoen Krung (riverfront)",
    price: "90-min signature treatment ฿5,000–9,000; Full day package ฿15,000–30,000",
    why: "The Mandarin Oriental Spa Bangkok occupies a converted Thai-style pavilion complex on the riverfront — one of Asia's most atmosphere-rich spa environments. Treatments incorporate traditional Thai healing ingredients (jasmine, galangal, lemongrass, turmeric) in premium formulations. The spa's architectural setting (lush garden, river views, traditional pavilion rooms) amplifies the experience beyond the treatment itself. Consistent recognition in Condé Nast Traveler and Travel + Leisure 'World's Best Spas' lists. A landmark Bangkok experience for special occasions.",
    tip: "Mandarin Oriental Spa booking: advance reservation required, 1–2 weeks for weekend dates. Arrive 30 minutes early to use the steam room and relaxation facilities (included). The Thai Herbal Pouch massage (luk pra kob) is the most distinctively Thai treatment — heated bundles of lemongrass, kaffir lime, turmeric, and other herbs applied to muscles. Non-hotel guests can access the spa (no hotel stay required). The spa's café serves light healthy food — plan the lunch there as part of the spa day.",
  },
  {
    name: "Divana Signature Spa — Authentic Thai Luxury",
    emoji: "💆",
    area: "Sukhumvit Soi 25; multiple Bangkok locations",
    price: "60-min treatment ฿1,500–3,000; Signature 3-hour packages ฿4,500–8,000",
    why: "Divana is Bangkok's most celebrated Thai-owned luxury spa brand — multiple locations across the city maintaining consistent quality without hotel pricing. Emphasis on Thai traditional healing: tok sen (tapping massage with wooden tools along meridians), yam khang (foot rolling on herbs and warm spices), and traditional Thai herbal treatments. The spa environments are designed with Thai architectural sensibility — teak wood, lotus pond water features, garden courtyards. Divana has won multiple international spa awards and is consistently recommended by Bangkok-knowledgeable travelers over hotel spas for value and authenticity.",
    tip: "Divana booking: their online booking is reliable; advance booking 2–3 days recommended. The signature 3-hour Thai Oasis package (massage + scrub + facial or wrap combination) provides the most comprehensive experience. The tok sen treatment (if available — requires specialized therapist) is uniquely Thai — the sound and sensation of wooden pegs tapping meridians is unlike any other modality. Staff speak English well. Couples' packages with side-by-side treatment rooms are popular for romantic occasion bookings.",
  },
  {
    name: "Rarinjinda Wellness Spa — Chiang Mai Luxury (Bangkok Branch)",
    emoji: "🌸",
    area: "Sathorn, Bangkok; flagship in Chiang Mai",
    price: "60-min treatment ฿1,800–3,500; Packages ฿5,000–12,000",
    why: "While Rarinjinda's flagship is in Chiang Mai (considered by some the finest Thai spa experience in the country), their Bangkok presence in Sathorn maintains the same Northern Thai tradition-focused approach — Lanna healing practices, northern Thai herbal formulas, and a quieter contemplative atmosphere than Bangkok's typically busier spa environments. The distinction between Northern Thai massage tradition (slower, deeper, more meditative) and Southern/Central Thai massage is palpable here. Favored by Bangkok's yoga and wellness community.",
    tip: "Arriving at Rarinjinda: their Bangkok location is designed as a sanctuary — phones requested to be silenced, conversation subdued. This is for clients seeking genuine therapeutic quiet rather than social spa experience. The Northern Thai herbal steam (herb-infused steam room) is a signature offering — open the pores before a full body treatment for dramatically enhanced absorption. Their herbal product line (skincare, essential oil blends using Northern Thai botanicals) is available for purchase — genuine quality that isn't just hotel gift shop branding.",
  },
];

export function BangkokLuxurySpa() {
  return (
    <div className="rounded-2xl border border-rose-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-rose-700 mb-3">
        🌺 Luxury spas in Bangkok — Mandarin Oriental, Divana signature treatments & Thai healing
      </h2>
      <div className="space-y-2">
        {SPAS.map((s) => (
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
