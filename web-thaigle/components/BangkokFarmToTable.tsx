const TOPICS = [
  {
    title: "Organic Markets & Farm-to-Table Dining in Bangkok",
    emoji: "🥬",
    summary: "Bangkok's organic food movement has grown from niche health food stores to a recognizable ecosystem of farmer's markets and farm-connected restaurants: (1) Organic farmers markets in Bangkok: Chatuchak Weekend Market's organic section (weekends, JJ Green area); Samitivej Hospital organic market (Sunday, Sukhumvit Soi 49); BTS/MRT station organic market pop-ups (Ari BTS, On Nut); Nai Lert Park Heritage Home Saturday market (Wireless Road); these markets connect Bangkok consumers with Thai organic farms producing rice, vegetables, herbs, and fermented food products; (2) Bangkok farm-to-table restaurants: Err (urban Thai cuisine with farm connections), Baan Phadthai (using heritage Thai rice varieties and organic produce), and several Sukhumvit fine dining restaurants that explicitly source from partner farms in Ratchaburi, Nakhon Pathom, and Chiang Mai; (3) Thai organic certification: organic certification in Thailand (under Thailand's National Bureau of Agricultural Commodity and Food Standards) is less developed than in Europe; some Bangkok organic vendors use PGS (Participatory Guarantee System) peer certification rather than formal inspection; (4) Hydroponic and urban farming: Bangkok's space constraints have driven hydroponic farming innovation; several Bangkok organic food suppliers grow leafy vegetables hydroponically in Bangkok's unused industrial spaces; (5) Cooking school connections: some Bangkok cooking schools specifically source organic or traditional-variety Thai ingredients for cooking classes, connecting participants to food provenance awareness as part of the culinary education.",
    action: "Chatuchak Weekend Market JJ Green section (Saturday–Sunday, BTS Mo Chit); Nai Lert Park Saturday Market (Wireless Road, Saturday morning); search Bangkok Farmers Market Facebook group for current pop-up market schedule.",
  },
  {
    title: "Bangkok's Vegetarian & Vegan Restaurant Scene",
    emoji: "🌱",
    summary: "Bangkok's vegetarian and vegan food landscape has transformed from limited to genuinely excellent: (1) Thai Buddhist vegetarian tradition: Thai Chinese Buddhist festival vegetarianism (J Festival — เทศกาลกินเจ — occurring in October based on lunar calendar) creates city-wide vegetarian food availability at traditional Chinese Buddhist restaurants; yellow-flag restaurants indicating J food proliferate across Bangkok; (2) Plant-based restaurant growth: Bangkok's vegan restaurant scene has exploded post-2018; Veggipedia, Broccoli Revolution (Thonglor), Ethos (Banglamphu), and multiple Sukhumvit-area vegan cafés now serve international-quality plant-based food; (3) Traditional Thai vegetarian challenges: authentic Thai cooking uses fish sauce (nam pla) and shrimp paste (kapi) as foundational flavor components; requesting 'jay' (เจ — Buddhist vegan) at traditional Thai restaurants produces fish sauce-free cooking that replaces these with soy sauce; (4) Street food vegetarian access: Bangkok street food vegetarian navigation works through 'mai sai nua, mai sai pla' (no meat, no fish) and 'mai sai nam pla' (no fish sauce); Bangkok street food vendors are accustomed to these requests, particularly in tourist areas; (5) Vegan Thai fine dining: Broccoli Revolution and similar Bangkok vegan fine dining establishments serve Thai-inspired cooking using entirely plant-based ingredients with professional kitchen quality that surprises visitors expecting compromise.",
    action: "Broccoli Revolution (multiple Bangkok locations, broccolirevolution.com) for quality plant-based dining; Ethos (Banglamphu, vegetarian and vegan-friendly international food); 'J' flagged restaurants throughout Bangkok during J Festival October for traditional Thai Buddhist vegan food.",
  },
  {
    title: "Bangkok's Seafood Culture — Fresh From Gulf & Andaman",
    emoji: "🦞",
    summary: "Bangkok's seafood culture benefits from proximity to both Gulf of Thailand and Andaman Sea coastal fishing grounds, creating year-round abundance: (1) Talad Thai seafood market: north Bangkok's Talat Thai wholesale market (near Don Mueang Airport) is Bangkok's largest fresh food market; the seafood section supplies restaurants and operates at wholesale to retail crossover; visiting 3–5am when wholesale pricing applies provides access to fresh arrivals; (2) Seafood restaurant districts: Soi Po Chai (Yaowarat area), Charoen Krung seafood restaurants, and the Thonburi riverside (accessible by boat) have Bangkok's most concentrated high-volume fresh seafood restaurants; (3) Key Thai seafood species: Bangkok seafood menus feature species not commonly available outside Thailand; pla krabon (stingray), hoi malaeng phu (mussels Thai-style), poo nim (soft shell crab), pla gapong (sea bass), and various size categories of shrimp and prawn; (4) Set net squid (pla meuk): Thai squid (calamari) is distinct from Mediterranean squid; larger species (hom thong — giant squid) are charcoal-grilled whole; smaller species are wok-fried or dried; both are widely available at Bangkok seafood restaurants and markets; (5) Processed and dried seafood: Bangkok's Sampheng Lane and Chinatown markets have extensive dried seafood sections; dried shrimp, squid, fish, and abalone are both culinary ingredients and food products that represent a significant price range (inexpensive dried shrimp through premium dried abalone).",
    action: "Talat Thai North Bangkok (talatthai.com) for wholesale fresh seafood access before 5am; Charoen Krung and Yaowarat area seafood restaurants for dinner service fresh seafood; Sampheng Lane for dried seafood purchase and Thai seafood ingredient sourcing.",
  },
  {
    title: "Bangkok's Specialty Food Markets — Ingredients & Foodie Tourism",
    emoji: "🧄",
    summary: "Bangkok's wholesale and specialty food markets provide access to ingredients and food culture at depth: (1) Or Tor Kor Market (Chatuchak): government-operated premium agricultural market adjacent to Chatuchak Weekend Market; highest quality fresh produce in Bangkok including premium tropical fruits (Monthong durian, Nam Dok Mai mangoes, mangosteens), herbs, and specialty agricultural products; (2) Pak Klong Talat (Flower and Produce Market): Bangkok's 24-hour wholesale produce market alongside the famous flower market; the produce section (vegetables, herbs, fruits for restaurants) operates through the night into early morning; (3) Sampheng Lane (Wang Burapha): Bangkok's historic Chinese wholesale market; concentrated ingredient and food product purchasing; dried goods, preserved foods, Chinese ingredients, and specialty Thai cooking supplies; (4) Khlong Toey Market: Bangkok's largest traditional wet market operating 24 hours; the neighborhood market serving Bangkok's working-class Thai population; freshest prices for everyday Thai cooking ingredients; unfiltered market experience far from tourist areas; (5) Makro wholesale: the Thai Cash & Carry wholesale chain (30+ Bangkok locations) is the most practical bulk ingredient source for serious home cooks, food entrepreneurs, and chefs visiting Bangkok; professional-quality ingredients at wholesale pricing.",
    action: "Or Tor Kor Market (Chatuchak, BTS Mo Chit — open daily, 6am–8pm) for premium Thai produce; Pak Klong Talat (Yodpiman Flower Mall complex, riverside) any time through the night for wholesale produce and flowers; Sampheng Lane (Chinatown, daytime) for Chinese ingredient wholesale.",
  },
];

export function BangkokFarmToTable() {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-emerald-700 mb-3">
        🥬 Bangkok food sourcing — organic markets, vegetarian dining, seafood & specialty ingredients
      </div>
      <div className="space-y-1.5">
        {TOPICS.map((t) => (
          <details key={t.title} className="border border-emerald-100 rounded-xl">
            <summary className="px-3 py-2 cursor-pointer font-bold text-xs flex items-center gap-2">
              <span>{t.emoji}</span>
              <span>{t.title}</span>
            </summary>
            <div className="px-3 pb-3">
              <div className="text-[10px] text-[var(--fg)] leading-snug mb-1">{t.summary}</div>
              <div className="text-[10px] text-emerald-700">→ {t.action}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
