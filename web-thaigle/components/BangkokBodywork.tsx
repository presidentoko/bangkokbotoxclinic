const SPOTS = [
  {
    name: "Thai Massage — Traditional Therapeutic vs. Tourist",
    emoji: "🙌",
    area: "Nuad Thai schools near Wat Pho, medical Thai massage clinics; tourist street shops in Sukhumvit",
    price: "Tourist street massage ฿300–500/hour; Traditional therapeutic ฿500–1,500; Wat Pho-trained ฿800–1,800",
    why: "Thai massage (nuad thai, UNESCO-listed intangible cultural heritage) divides into authentic therapeutic practice and the tourist-facing street version. The difference is significant — trained nuad thai practitioners complete 150–800+ hours of formal training covering anatomy, sen lines (energy pathways), and the sequence and pressure techniques developed over centuries. The street-shop version (abundant throughout Bangkok) is often performed by minimally-trained staff providing pleasant relaxation but lacking therapeutic depth. Knowing which you're seeking is the starting point. Wat Pho's school produces graduates who have completed rigorous training; medical facilities offer supervised clinical Thai massage.",
    tip: "Distinguishing quality Thai massage in Bangkok: ask about the practitioner's training background and hours — graduates of Wat Pho, ITM, or other recognized nuad thai schools have genuine credentials. The therapeutic version involves active participation (being moved into passive stretches), pressure point work, and a specific sen-line-following sequence — not just general body rubbing. For therapeutic results: book with practitioners at nuad thai schools directly or through hospital-affiliated traditional medicine departments. The foot massage subspecialty (reflexology) follows the same quality spectrum — reflexology practitioners at dedicated foot massage studios typically have more specialized training than street shops.",
  },
  {
    name: "Myofascial Work, Deep Tissue & Sports Massage",
    emoji: "💆",
    area: "Sports medicine clinics, premium massage centers (Sukhumvit, Silom), physiotherapy clinics",
    price: "Deep tissue/sports massage ฿1,200–3,500/hour; Myofascial release ฿1,500–4,000/session",
    why: "Bangkok's premium massage and bodywork sector goes well beyond Thai massage — deep tissue massage (targeting specific muscle groups with sustained pressure), myofascial release (addressing fascial restrictions and connective tissue dysfunction), and sports massage (pre/post-activity focused) are all available from qualified practitioners. The Bangkok medical tourism infrastructure has attracted international-standard therapists — some combining Western sports science training with Thai bodywork traditions. Several Bangkok wellness clinics offer package programs combining multiple bodywork modalities for chronic pain or athletic performance optimization.",
    tip: "Finding Bangkok deep tissue and sports massage: look for practitioners with International certification (NCBTMB from US, BTEC from UK, or equivalent) alongside Thai massage training. Sports clinics associated with major Bangkok gyms or athletic clubs often have the best-trained sports massage therapists. Scheduling: serious therapeutic bodywork (deep tissue, trigger point therapy) typically needs 5–7 days between sessions for tissue to recover — don't schedule daily when using strong pressure techniques. What to communicate: clear communication about pressure preference, areas to focus on, and any injuries is essential — Bangkok therapists at quality establishments speak enough English for this; bring a Thai phrase card if needed at traditional clinics.",
  },
  {
    name: "Body Treatment & Wellness Rituals",
    emoji: "🛁",
    area: "Luxury day spas (Mandarin Oriental, Four Seasons, Aman), day spa centers throughout Bangkok",
    price: "Signature body treatment ฿3,000–12,000; Full-day spa package ฿5,000–25,000",
    why: "Bangkok's luxury spa culture — built around the world-class hospitality infrastructure of the Oriental, Mandarin, Aman, and other hotel spas — offers body treatment rituals that integrate Thai herbal traditions (lemongrass, kaffir lime, turmeric, galangal, jasmine) with international spa techniques. The Bangkok hotel spa experience is internationally recognized: The Spa at Mandarin Oriental Bangkok regularly appears in 'world's best spa' rankings. Beyond hotel spas, standalone Bangkok day spas (Health Land chain, Let's Relax, and independent premium spas) offer similar quality at lower price points. The herbal steam bath (atha steam, using a bundle of Thai medicinal herbs heated with steam) is an authentic traditional treatment available at spa facilities.",
    tip: "Best value Bangkok spa experiences: Health Land Spa (multiple locations, ฿2,200–3,500 for 2-hour package) offers hotel-comparable quality at standalone prices. For luxury: booking weekday off-peak appointments at 5-star hotel spas often gets 20–30% discount from rack rate. Thai herbal body scrubs (using rice flour, tamarind, turmeric) are a highly distinctive Bangkok treatment — authentic versions use real Thai herbs, not commercial pre-packaged scrub products. Post-massage drink: serious Thai massage facilities serve traditionally-prepared herbal teas (lemongrass, pandan, Thai ginger) as post-treatment restorative — these are a quality indicator of traditional practice continuity.",
  },
];

export function BangkokBodywork() {
  return (
    <div className="rounded-2xl border border-teal-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-teal-700 mb-3">
        🙌 Bodywork & massage in Bangkok — authentic Thai massage, deep tissue & luxury spa rituals
      </h2>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-teal-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-teal-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
