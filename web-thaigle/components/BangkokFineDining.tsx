const SPOTS = [
  {
    name: "Bangkok's Michelin-Starred & World's 50 Best Restaurants",
    emoji: "⭐",
    area: "Le Du (Silom) — Thailand's highest-rated restaurant; Gaggan Anand (Ratchada) — Indian progressive; Mezzaluna (River City) — Italian fine dining; R-HAAN (Sukhumvit) — Thai fine dining; Sorn (Ekkamai) — Southern Thai",
    price: "Michelin-starred tasting menu: ฿3,500–12,000 per person; With wine pairing: ฿6,000–18,000; World's 50 Best Bangkok restaurant: ฿5,000–20,000; Reservation lead time: 2–8 weeks for top tables",
    why: "Bangkok has emerged as one of Asia's most significant fine dining cities — with multiple Michelin-starred restaurants, consistent representation on Asia's 50 Best and World's 50 Best restaurant lists, and a unique culinary proposition: Bangkok's finest restaurants can offer world-class execution at 40–60% of what equivalent experiences cost in New York, London, or Tokyo. The 2024 Bangkok fine dining landscape: (1) Le Du — Chef Thitid 'Ton' Tassanakajohn's Thai-modern restaurant consistently ranks among the world's best, celebrating Thai ingredients through contemporary French-trained technique; (2) Sorn — Southern Thai cuisine elevated to the same intellectual framework as traditional Japanese kaiseki; one of the few restaurants in the world where a regional Thai cuisine receives this level of reverence; (3) Gaggan Anand — Chef Gaggan's boundary-pushing progressive Indian restaurant; (4) Mezzaluna — rooftop Italian fine dining in the historic River City building with panoramic views; (5) R-HAAN — traditional Thai royal court cuisine reconstructed with historical authenticity. Bangkok's culinary ambition is reflected in the dozens of serious but non-starred restaurants that bring equivalent creativity to slightly more accessible price points.",
    tip: "Bangkok fine dining practical navigation: (1) Reservation systems: all top Bangkok restaurants use online reservation systems (most directly on their websites, many also on Eatigo or the local equivalent); reservations 4–8 weeks in advance are standard for the most sought-after tables; (2) Dress code: Bangkok's top restaurants are generally smart casual rather than formal — collared shirts for men (jackets not typically required); elegant casual attire for women; (3) Dietary communication: serious Bangkok fine dining restaurants accommodate dietary restrictions when communicated at reservation time; the sophisticated kitchen teams handle multiple dietary variations simultaneously; (4) Sommelier service: Bangkok's top restaurants have professional sommeliers with wine lists spanning multiple continents; asking for a Thai wine recommendation reveals emerging domestic producers; (5) Post-meal geography: many of Bangkok's best restaurants are embedded in the same Sukhumvit and Silom neighborhoods as the best cocktail bars — planning a restaurant-then-bar evening produces a complete premium Bangkok evening.",
  },
  {
    name: "Bangkok's Rooftop Fine Dining & View Restaurants",
    emoji: "🌆",
    area: "Vertigo (Banyan Tree Hotel, Sathorn) — 61st floor Thai and international; The Deck (Arun Residence, Rattanakosin) — Wat Arun view; Blue Sky (Carlton Hotel) — all-day panoramic; Sky Bar at Lebua — State Tower iconic",
    price: "Rooftop fine dining dinner (per person): ฿3,000–8,000; Cocktail-only (minimum spend): ฿500–1,500; Sunset view dinner (premium timing): ฿4,000–12,000; Sirocco at Lebua — Bangkok's most famous dinner experience",
    why: "Bangkok's rooftop restaurant and bar scene has become one of the city's defining luxury experiences — a combination of the dramatic Bangkok skyline, the warm tropical evenings, and the remarkable verticality of Bangkok's hotel towers creating view platforms that rival any city in the world. Vertigo and Moon Bar at the Banyan Tree Hotel's 61st floor was among the world's first true rooftop bar experiences and set the template that dozens of Bangkok properties have subsequently refined. The Deck at Arun Residence takes a different approach — river level on the opposite bank from Wat Arun, the view of the illuminated temple at sunset is one of Bangkok's most photographed perspectives. Sky Bar at State Tower/Lebua (popularized by The Hangover Part II) remains iconic; the outdoor bar extends to glass-railed edges with vertiginous drops and Bangkok panorama. Rooftop dining in Bangkok is particularly spectacular during transition weather (October–November, March–April) when clear skies combine with lower humidity.",
    tip: "Bangkok rooftop dining practical tips: (1) Dress code enforcement: Bangkok's most exclusive rooftop venues strictly enforce smart casual or smart dress codes — shorts, flip-flops, or sleeveless clothing are typically refused at the door regardless of hotel guest status; (2) Sunset timing: Bangkok sunset runs from approximately 6pm to 6:30pm year-round (consistent tropical latitude); arriving at Vertigo or similar venues by 5:30pm positions for the best natural light transitions; (3) Pre-booking: most Bangkok rooftop restaurants accept same-day walk-ins for cocktails but not dinner; dinner reservations 3–7 days in advance secures table placement with the preferred view; (4) Minimum spend reality: many Bangkok rooftop bars have minimum consumption requirements (typically ฿1,000–2,000/person for cocktails) that apply in addition to food if dining; (5) Alternative rooftop access: Bangkok has dozens of less-famous but similarly spectacular rooftop bar options at mid-range hotels throughout the city — hotel Instagram accounts or ThailandExpatClub recommendations find current unlocked gems at lower prices.",
  },
  {
    name: "Chef's Table & Tasting Menu Experiences in Bangkok",
    emoji: "👨‍🍳",
    area: "Chef's table experiences at top Bangkok restaurants and hotels; private kitchen dinner experiences; cooking-school chef's table formats; pop-up dinner events throughout Bangkok",
    price: "Chef's table at top restaurant: ฿5,000–20,000 per person; Private kitchen dinner: ฿8,000–30,000 per person; Cooking school chef's table: ฿3,500–8,000; Special event pop-up: ฿3,000–15,000",
    why: "Bangkok's chef's table format — an intimate counter or table directly adjacent to (or within) the kitchen where the chef presents each course personally with explanation — has been adopted from Western fine dining practice into Bangkok's most ambitious restaurants. The proximity to the kitchen creates a fundamentally different dining experience: heat, movement, sound, and the theater of professional service all become part of the meal; the chef-to-guest ratio means personalized course explanation and dialogue rather than distant table service. Bangkok's private kitchen dinner format (a small group of guests invited into a professional kitchen for a bespoke meal prepared by a recognized chef) has grown into a significant luxury hospitality category — with both established restaurants offering private kitchen packages and independent chefs creating pop-up private dining experiences for the growing premium clientele who want personalized versus crowd-room experiences.",
    tip: "Bangkok tasting menu and chef's table booking: (1) Menu structure: Bangkok's serious tasting menus typically run 7–12 courses (not portions but complete small dishes); pace is typically 2.5–4 hours; confirming the estimated duration at booking allows appropriate schedule planning; (2) Wine vs. non-alcoholic pairing: top Bangkok restaurants now offer sophisticated non-alcoholic beverage pairings (juice reductions, fermented drinks, specialty teas) alongside their wine pairings — both are designed to complement the courses; (3) Dietary accommodation: communicating dietary restrictions at reservation provides time to design alternative courses; Bangkok's skilled kitchen teams handle multiple concurrent dietary accommodations with impressive results; (4) The kitchen counter: at restaurants where the chef's table is literally at the kitchen counter, the experience of watching professional kitchen service at full speed is itself entertainment — arriving in a food-curious mindset maximizes what the format offers; (5) Instagram etiquette: top Bangkok restaurants have their own photography policies — some permit photography of all courses, others request no flash or no photography during certain courses; confirming at the start avoids awkward mid-meal conversations.",
  },
];

export function BangkokFineDining() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-slate-700 mb-3">
        ⭐ Bangkok fine dining — Michelin stars, rooftop restaurants & chef's table experiences
      </h2>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-slate-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-slate-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
