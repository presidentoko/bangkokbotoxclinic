const TOPICS = [
  {
    title: "Food Allergies in Bangkok — Thai Cuisine Allergy Risks & Safe Communication",
    emoji: "🚨",
    summary: "Navigating food allergies in Bangkok requires understanding Thai cuisine's hidden ingredient structures: (1) Fish sauce (nam pla) is everywhere: Thai cuisine uses fish sauce as a fundamental flavoring across virtually all savory dishes — curries, stir-fries, salads, soups, and dipping sauces all routinely contain fish sauce; the sauce is invisible in finished dishes but contributes both salt and umami; people with fish/seafood allergies must communicate this explicitly rather than assuming fish-containing dishes are obvious; (2) Shrimp paste (kapi) contamination: Thai curry pastes (green, red, massaman, panang) typically contain dried shrimp paste as a base ingredient; even dishes that appear to be 'vegetarian' curries may contain kapi; this is a significant allergy and vegan/vegetarian concern; (3) Peanut exposure: peanuts (and peanut powder) appear in pad thai, satay sauce, certain salads (som tam variations), and as garnishes on multiple dishes; asking specifically about peanuts is essential for nut-allergic visitors; Thai kitchen cross-contamination from multiple dish types is common in open-kitchen street food settings; (4) Shellfish cross-contamination: Thai restaurant and street food kitchens typically share equipment across dishes; shellfish (shrimp, crab, squid) and fish-sauce-based dishes are so common that kitchen cross-contamination risk is high even when a specific dish doesn't list shellfish; severe shellfish or fish allergic visitors require clear communication and ideally dedicated preparation; (5) Gluten hidden sources: soy sauce (which contains wheat) appears in stir-fries and noodle dishes; oyster sauce (contains wheat starch) is a common stir-fry additive; soy-free tamari is not routinely available in standard Bangkok restaurants; visitors requiring true gluten-free must research specifically gluten-free restaurants.",
    action: "Thai allergy communication cards: print or save allergy statement cards in Thai from allergyeats.com or translated by Google Translate; critical Thai phrases: 'pae [ingredient]' = 'allergic to [ingredient]'; 'mai sai' = 'don't put in'; 'khae mak' = 'severely allergic'; Bangkok hospitals for allergy reactions: Bumrungrad 02-667-1000; gluten-free Bangkok community: Thai Celiac Support Group Facebook; Bangkok allergy-friendly restaurants: The Gourmet market (Siam Paragon) has labelled allergen information on packaged products.",
  },
  {
    title: "Dietary Restrictions & Thai Buddhism — Vegetarian Month, Yellow Flag & Jae Food",
    emoji: "🌼",
    summary: "Thailand's Buddhist vegetarian tradition creates a seasonal surge in certified vegetarian options and a unique restaurant labeling system: (1) Jae (เจ) food: the Thai 'jae' symbol (Chinese-origin vegetarian food system derived from Taoist Chinese Vegetarian Festival) excludes not just meat/fish but also the five pungent vegetables (garlic, onions, shallots, leeks, and chives); jae food is the strictest Thai vegetarian classification; look for the yellow flag/sign with red jae character outside restaurants; (2) The Thai Vegetarian Festival: Bangkok's Vegetarian Festival (Ngan Kin Jae) runs for 9 days starting on the first day of the 9th lunar month (typically September–October); during this festival, the yellow jae flag appears at food stalls across Bangkok (particularly in Chinese-Thai areas); prices are typically reasonable and food quality at jae stalls can be excellent; (3) 'Mang sa wirat' (มังสวิรัติ) vs. jae: mang sa wirat means vegetarian (excluding meat/fish) but typically includes garlic and onion (unlike strict jae); restaurants describing themselves as mang sa wirat typically use these aromatics and are not suitable for jae practitioners but are accessible to Western-style vegetarians; (4) Restaurant identification: yellow flag with red 'เจ' character is the Bangkok signal for jae-certified food; some restaurants display this flag year-round; others only during festival season; Chinatown and areas with Chinese-Thai communities have the highest density of year-round jae restaurants; (5) App-based finding: Bangkok's vegetarian and jae restaurants are mapped on Happy Cow (international vegetarian restaurant database), local Thai apps (Wongnai with vegetarian filter), and Facebook groups (Vegetarian Bangkok, Bangkok Vegan); Chatuchak Weekend Market's vegetarian vendor section has good quality jae options on weekends.",
    action: "HappyCow (happycow.net) for Bangkok vegetarian restaurant map; Wongnai vegetarian filter for Thai-reviewed restaurant search; Chinatown jae concentrations: Yaowarat Road and adjacent sois during festival season; year-round jae: Wat Mangkon Kamalawat area, Yaowarat evening food streets; Punnithee vegetarian restaurant (multiple Bangkok locations, established chain) for reliable jae-certified Thai food; look for 'เจ' yellow-flag at any street food stall.",
  },
  {
    title: "Bangkok for People with Diabetes — Low-Sugar Thai Food & Glycemic Management",
    emoji: "🩺",
    summary: "Thai cuisine presents specific glycemic considerations for people managing blood sugar: (1) Thai food's sugar content: Thai cuisine uses palm sugar and granulated sugar as flavoring in multiple savory dishes — pad thai, stir-fries, Thai salads, and even curries often have added sugar; the sweetness of Thai food is a deliberate flavor component, not incidental; this makes glycemic management more complex in Thailand than in cuisines where sugar is primarily in desserts; (2) White jasmine rice glycemic load: Thailand's dominant rice type (jasmine rice, long-grain, high GI approximately 73–75) has higher glycemic impact than brown rice or basmati; white rice forms the base of most Thai meals; requesting 'khao sanpaporang' (brown rice, sometimes available at health-conscious restaurants) or smaller portions is a management strategy; (3) Low-glycemic Thai dishes: Bangkok offers genuinely diabetes-friendly options: larb (minced meat salad, low carb), yam (Thai salads, minimal added sugar versions), grilled fish (pla pao), tom yum without noodles, green papaya salad (som tam), stir-fried vegetables with protein (pad pak), and satay (protein-focused); (4) Dessert navigation: Thai desserts range from acceptable (coconut milk-based desserts are lower sugar, fresh fruit is available) to extremely high glycemic (sticky rice preparations, Thai sweet desserts with palm sugar); asking for fruit (fresh cut tropical fruit) as an alternative dessert at Thai restaurants is always possible; (5) Bangkok hospital diabetes management: Bangkok's international hospitals (Bumrungrad's diabetes clinic, Bangkok Hospital's Diabetes Centre) provide modern diabetes management services at international standard; continuous glucose monitoring supplies (Freestyle Libre, Dexam) are available at Bangkok's medical supply shops and some pharmacies; insulin refrigeration in Bangkok hotels is manageable with communication to hotel staff about refrigeration access.",
    action: "Bumrungrad Diabetes Centre for ongoing diabetes management during extended Bangkok stays; Tops Market and Villa Market for imported lower-GI foods (whole grain crackers, nut butters, almonds) to supplement Bangkok meals; Bangkok diabetic supply: Guardian Pharmacy (multiple locations), boots.co.th for glucose strips and monitoring supplies; request dishes specifically: 'mai wan' (not sweet) in Thai restaurants reduces sugar addition; fruit salad without sweet dressing: 'yam polamai, mai wan' avoids the sugary dressings on Thai fruit salads.",
  },
];

export function BangkokFoodAllergy() {
  return (
    <div className="rounded-2xl border border-orange-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-orange-700 mb-3">
        🚨 Bangkok dietary needs — food allergy navigation, Thai vegetarian culture & diabetes management
      </div>
      <div className="space-y-1.5">
        {TOPICS.map((t) => (
          <details key={t.title} className="border border-orange-100 rounded-xl">
            <summary className="px-3 py-2 cursor-pointer font-bold text-xs flex items-center gap-2">
              <span>{t.emoji}</span>
              <span>{t.title}</span>
            </summary>
            <div className="px-3 pb-3">
              <div className="text-[10px] text-[var(--fg)] leading-snug mb-1">{t.summary}</div>
              <div className="text-[10px] text-orange-700">→ {t.action}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
