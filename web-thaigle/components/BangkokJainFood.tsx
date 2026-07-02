const SPOTS = [
  {
    name: "Jain & Sattvic Vegetarian Food in Bangkok",
    emoji: "🌱",
    area: "Indian restaurants in Sukhumvit area (Little India around Soi 11, Soi 3), Indian grocery stores near Soi 11, Silom Indian restaurant cluster",
    price: "Jain-friendly thali: ฿150–400; South Indian vegetarian set: ฿120–300; Pure veg restaurant meals ฿100–350; Sattvic restaurant: ฿200–600",
    why: "Bangkok's large Indian expat community (particularly from Gujarat and Rajasthan — regions with strong Jain populations) has created an ecosystem of pure vegetarian Indian food that ranges from basic North Indian vegetarian restaurants to establishments specifically catering to Jain dietary requirements (no root vegetables — onion, garlic, potato, carrot, beet — in addition to no meat). The Sukhumvit Soi 11 area (often called 'Little India' in Bangkok's expat community) concentrates the highest density of Indian vegetarian restaurant options. Many of these restaurants explicitly mark Jain-friendly items on their menus, and Indian restaurant staff in this area are familiar with Jain requirements. Bangkok also has several South Indian vegetarian restaurants (serving dosa, idli, sambar, rasam) that are naturally closer to Jain-compatible food given South Indian vegetarian tradition.",
    tip: "Jain dietary communication in Bangkok: (1) With Indian restaurant staff, saying 'Jain food' in English is understood at most Indian restaurants in Sukhumvit's Indian district; (2) Thai restaurants are generally challenging for strict Jain practice — garlic and onion are fundamental to Thai cuisine and usually not listed on menus when present; communicating specifically ('no garlic, no onion') in writing with a Thai translation is the most reliable approach; (3) Buddhist vegetarian restaurants in Bangkok (ahan jay, marked with yellow flags/signs) avoid meat, garlic, and onion by religious practice — these Thai Buddhist vegetarian restaurants are naturally compatible with Jain practice; look for the yellow flag symbol; (4) Self-catering for strict Jain: Bangkok's Indian grocery stores near Sukhumvit Soi 11 carry Indian spice mixes, lentils, and ready-to-cook items appropriate for Jain cooking in Bangkok apartments with basic kitchen access.",
  },
  {
    name: "Allergy-Aware & Dietary Restriction Dining",
    emoji: "⚠️",
    area: "Allergy-aware restaurants concentrated in international dining areas — Ekkamai, Thong Lor, Silom, and premium mall food courts",
    price: "Allergen-aware restaurants typically in ฿250–800/meal range; Premium accommodation for dietary restrictions at fine dining varies",
    why: "Bangkok's international dining scene has developed increasing allergen awareness — primarily driven by expat consumer demand and international hotel food service standards. The allergen communication challenge in Bangkok is genuine: Thai cuisine uses fish sauce (a fermented fish product, invisible in the dish but pervasive), shrimp paste (present in many Thai curry pastes and sauces), peanuts (common garnish and ingredient), eggs (in fried rice, pad thai), and gluten-containing soy sauce — these can be invisible to diners who don't know to ask. International restaurants in premium areas of Bangkok have menus with allergen markings and kitchens trained for allergen avoidance. Thai restaurants vary enormously — from market stalls where cross-contamination avoidance is impossible to high-end restaurants that can genuinely accommodate specific requirements with communication.",
    tip: "Bangkok food allergy communication strategy: (1) The most effective communication tool is a printed Thai-language allergy card specifically listing your restrictions — organizations like 'Equal Eats' produce professionally translated allergy cards in Thai for common allergens; (2) Shellfish allergy priority: Thai cuisine uses shrimp paste and dried shrimp extensively — 'no shellfish' must be communicated specifically to kitchen staff, not just front-of-house; (3) Peanut allergy: satay sauce, certain pad thai preparations, and some Thai curries use peanuts — always ask before ordering dishes where peanuts may appear; (4) Safe default categories in Bangkok: rice dishes (plain rice), fresh fruit, and simple stir-fries with explicit allergen communication reduce risk; (5) Restaurant apps: HappyCow (for veg/vegan) and international restaurant review apps increasingly include allergy information in user reviews.",
  },
  {
    name: "Raw Food & Cleansing Diets in Bangkok",
    emoji: "🥗",
    area: "Raw food restaurants in Thong Lor, Ekkamai, and wellness-focused areas — Broccoli Revolution, Veganerie, Peppina (plant-based pizza), Raw concept restaurants",
    price: "Raw food restaurant meal: ฿250–600; Cold-pressed juice: ฿150–350; Multi-day cleanse program: ฿3,000–15,000; Raw food desserts: ฿150–350",
    why: "Bangkok has a thriving raw food and plant-based restaurant scene that expanded significantly from 2017 onward — driven by the Thai wellness tourism market and health-conscious young Thai and expat consumers. Raw food restaurants in Bangkok typically serve: cold-pressed juices, smoothie bowls, raw vegan dishes (using dehydrators, spiralizers, and cold preparation rather than cooking), probiotic foods (kombucha, kefir, fermented vegetables), and plant-based interpretations of Thai flavors. Bangkok's wellness restaurant identity has been shaped by the intersection of the global raw food movement and Thai tropical ingredient abundance — fresh coconut, tropical fruits, young coconut yogurt, and fresh Thai herbs create a distinctive tropical raw food aesthetic. Multi-day cleanse programs (typically 3–5 day cold-pressed juice or raw food programs) are popular among Bangkok's wellness community and available at several Thong Lor area health-focused restaurants.",
    tip: "Bangkok raw food and cleanse experience: (1) Broccoli Revolution (Sukhumvit) is Bangkok's most established plant-based restaurant with consistent quality and a menu accommodating multiple dietary approaches; (2) Bangkok's climate consideration for cleanses: a juice cleanse in Bangkok's heat requires consistent air-conditioned rest and additional electrolyte support — the combination of reduced caloric intake and heat stress can cause dizziness; consult with the restaurant about hydration protocols; (3) Tropical fruit integration: incorporating Bangkok's fresh seasonal tropical fruits (rambutan, mangosteen, longan, durian in season) into a Bangkok wellness stay is both delicious and nutritionally supportive; (4) The coconut abundance: fresh young coconut water (available from street vendors for ฿30–50) is one of Bangkok's most accessible and genuinely nutritious beverages — naturally isotonic with potassium and electrolytes appropriate for Bangkok's climate.",
  },
];

export function BangkokJainFood() {
  return (
    <div className="rounded-2xl border border-green-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-green-700 mb-3">
        🌱 Bangkok dietary needs — Jain food, allergy-safe dining & raw food restaurants
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-green-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-green-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
