const TOPICS = [
  {
    title: "Bangkok's Environmental Challenges",
    emoji: "🌫️",
    summary: "Bangkok faces significant environmental pressures — air pollution, traffic emissions, flooding risk, heat island effect, and plastic waste management are the city's primary environmental concerns.",
    action: "Bangkok environmental reality briefing: (1) Air quality: Bangkok's PM2.5 levels regularly exceed WHO safe limits, particularly December–March when northern agricultural burning creates a pollution plume over Central Thailand; the IQAir AQI app provides real-time Bangkok air quality data; N95/KN95 masks are appropriate (not cloth masks) when AQI exceeds 150; (2) Heat island: Bangkok experiences a 2–5°C urban heat island effect compared to surrounding rural areas — Bangkok's low-income communities (typically in less-green, poorly-ventilated neighborhoods) experience this most severely; (3) Flooding: Bangkok sits on the Chao Phraya delta at approximately 1.5m above sea level in many areas — sea level rise and subsidence (Bangkok is sinking at 1–3cm/year due to groundwater extraction and building weight) create serious long-term flood risk; (4) Plastic: Thailand is among the world's top 10 ocean plastic polluters; Bangkok's klongs (canals) carry significant plastic waste; plastic single-use bans have been enacted but enforcement varies; (5) Water: Bangkok tap water is treated but chlorine levels are noticeable — bottled water or filtered water dispensers are universal for drinking.",
  },
  {
    title: "Sustainable Travel in Bangkok",
    emoji: "♻️",
    summary: "Practical sustainable choices for Bangkok visitors — from transport decisions to consumption patterns that reduce environmental impact while maintaining the Bangkok travel experience.",
    action: "Bangkok sustainable travel practices: (1) Transport: BTS Skytrain and MRT Metro have dramatically lower per-passenger emissions than private vehicles in Bangkok's traffic — these systems move millions of passengers daily at a fraction of taxi/private car emissions; (2) Food: eating at market stalls and street food vendors (typically serving small plates of local produce with minimal packaging) is inherently more sustainable than international chain restaurants importing processed food; (3) Accommodation: mid-range Thai-owned guesthouses and boutique hotels have significantly smaller environmental footprints than large international resort chains — seek GreenLeaf certified Thai hotels (Thailand's national eco-certification for hospitality); (4) Plastic reduction: carry a refillable water bottle — Bangkok's 7-Eleven and other convenience stores sell filtered water for ฿5–10 at refill stations, dramatically reducing bottle waste; refusable bags for shopping (most large Bangkok grocery stores now charge for plastic bags); (5) Ethical wildlife: avoid all attractions involving performing animals, selfies with tigers/monkeys, or forced animal shows — these involve animal welfare violations; walking safaris and sanctuary observation without contact are the ethical alternatives.",
  },
  {
    title: "Bangkok's Green Spaces & Urban Ecology",
    emoji: "🌳",
    summary: "Bangkok's parks, green corridors, and urban ecology initiatives — where the city has succeeded in creating genuine green space in one of Asia's densest urban environments.",
    action: "Bangkok green infrastructure: (1) Benchakitti Forest Park (Sukhumvit area, near MRT Queen Sirikit station) — the city's largest recent park development, with genuine forest planting, wetland areas, cycling/walking paths, and urban ecology design; adjacent to Lumpini Park creating a linked green corridor; (2) Bang Kachao — the 'green lung of Bangkok,' a 30km² river bend area preserved as orchard, wetland, and market garden land accessible by boat from Bangkok's riverside; genuinely rural feel 30 minutes from central Bangkok; (3) Chatuchak Park and Rotfai Park — established green areas with mature trees providing genuine cooling and wildlife habitat in northern Bangkok; (4) Railway park (100 Rai Ratchadapisek) — recently developed linear park along former railway corridor with ecological design; (5) Vertical greening: Bangkok's building regulations now increasingly include rooftop gardens and green walls — some premium buildings have genuinely significant green infrastructure. Urban heat mitigation: Bangkok's street-tree planting campaigns under the BMA have increased canopy coverage in some neighborhoods.",
  },
  {
    title: "Responsible Tourism in Thailand",
    emoji: "🌏",
    summary: "Beyond Bangkok — practicing responsible tourism in Thailand's diverse tourism landscape, from temple etiquette to economic justice in the tourism economy.",
    action: "Thailand responsible tourism framework: (1) Temple etiquette: cover shoulders and knees at all temple sites (เสื้อผ้าสุภาพ — 'polite clothing'); remove shoes as indicated; avoid photographing worshippers in prayer without permission; maintain quiet in sacred spaces; (2) Economic choices: purchasing from local artisan vendors, small restaurant operators, and family-owned guest houses keeps more of your spending in local hands than international chain equivalents; (3) Bargaining respect: market bargaining is culturally normal but excessive bargaining on very low-cost items (20 baht for a mango, 50 baht for a meal) is unkind — the seller's margin is already razor-thin; (4) Wildlife tourism: 'Elephant sanctuaries' that allow riding require breaking the elephant's spirit through abusive training (phajaan); ethical observation-only sanctuaries allow natural behavior — the difference is visible; (5) Sea tourism: 'no touch, no stand, no collect' reef rules protect coral ecosystems — certified dive operators enforce these; snorkel tours that encourage touching corals or standing on reefs should be avoided; (6) Donation tourism: bringing school supplies to rural schools perpetuates supply-pull dependency that professional NGOs address more effectively through systems approaches.",
  },
];

export function BangkokSustainability() {
  return (
    <div className="rounded-2xl border border-green-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-green-700 mb-3">
        🌿 Bangkok sustainability — environment, green travel & responsible tourism
      </h2>
      <div className="space-y-1">
        {TOPICS.map((t) => (
          <details key={t.title} className="border border-green-100 rounded-xl">
            <summary className="cursor-pointer p-3 flex items-center gap-2">
              <span className="text-xl">{t.emoji}</span>
              <span className="font-bold text-xs flex-1">{t.title}</span>
              <span className="text-[10px] text-[var(--muted)] shrink-0">{t.summary.slice(0, 60)}…</span>
            </summary>
            <div className="px-3 pb-3 text-[10px] text-[var(--fg)] leading-snug border-t border-green-50 pt-2">
              {t.summary}
              <div className="mt-1 text-green-700">▶ {t.action}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
