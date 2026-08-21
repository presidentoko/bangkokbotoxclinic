const ITEMS = [
  {
    name: "Burmese/Myanmar Restaurants (Near Mae Sot & Bangkok)",
    emoji: "🫙",
    area: "Ladprao, Din Daeng — areas with Myanmar migrant communities",
    price: "Main dishes ฿80–180",
    why: "Bangkok's large Myanmar migrant worker community (estimated 500,000+) has created dozens of Myanmar restaurants in Bangkok's outer neighborhoods. Authentic dishes: mohinga (fish chowder noodles, Myanmar national dish), lahpet (fermented tea leaf salad), ngapi (fermented shrimp paste dishes), ohn no khao swè (coconut chicken noodle).",
    tip: "Authentic Myanmar restaurants mostly in Din Daeng and Huai Khwang areas — less accessible to tourists but genuinely worth the trip. Lahpet (tea leaf salad) is uniquely Myanmar — available nowhere else in Bangkok. Ask for it specifically.",
  },
  {
    name: "Lahpet Thoke (Tea Leaf Salad) — Key Dish",
    emoji: "🍃",
    area: "Any Burmese restaurant",
    price: "฿80–150 per serving",
    why: "Myanmar's signature dish — fermented tea leaves (lahpet) mixed with sesame seeds, fried garlic, peanuts, dried shrimp, lime, and green chili. The fermented tea gives it a unique bitter-sour-umami flavor unlike anything else in Southeast Asian cuisine. This dish alone is worth seeking out Burmese restaurants in Bangkok.",
    tip: "The fermented tea leaves may be an acquired taste — the first bite is always surprising. Let the flavors develop. Some Bangkok Burmese restaurants also serve ohno khao swè (coconut milk curry noodle soup) as their main attraction alongside lahpet.",
  },
  {
    name: "Myanmar Cuisine Cultural Context",
    emoji: "🌿",
    area: "N/A — informational",
    price: "N/A",
    why: "Myanmar cuisine is influenced by India (north), China (east), and Thailand (south-east) but remains distinctly its own. Heavy use of fermented ingredients, sesame oil, and salads. Less chili-forward than Thai cuisine. Monsoon curries are coconut-based. Myanmar's Buddhist culture means pork is widely eaten (unlike Muslim neighbors).",
    tip: "Most Bangkok Myanmar residents come from Shan State (northern Myanmar) — so Shan-style dishes (Shan noodles, shan tofu) are more common than lower Burma dishes. Shan noodles are mild, slightly oily, topped with tomato-based pork sauce.",
  },
];

export function BangkokBurmeseFood() {
  return (
    <div className="rounded-2xl border border-green-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-green-700 mb-3">
        🍃 Myanmar/Burmese food in Bangkok — lahpet, mohinga & Shan noodles
      </h2>
      <div className="space-y-2">
        {ITEMS.map((i) => (
          <div key={i.name} className="border border-green-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{i.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{i.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{i.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{i.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{i.why}</div>
            <div className="text-[10px] text-green-700">💡 {i.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
