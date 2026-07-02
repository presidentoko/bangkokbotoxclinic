const SPOTS = [
  {
    name: "Samitivej Organic Market & Farm-to-Table",
    emoji: "🌿",
    area: "Thonglor / Sukhumvit 38–55 area",
    price: "Organic restaurant mains ฿250–600",
    why: "Thonglor and the wider Sukhumvit 40–55 corridor has Bangkok's highest concentration of organic and farm-to-table dining. L'Authentique (Thonglor), Broccoli Revolution (Sukhumvit 49), and several Japanese natural food concepts cluster here. Organic certification in Thailand is controlled by the Organic Thailand (OT) label and international certifiers like IFOAM — ask restaurants which certification their produce holds.",
    tip: "Bangkok's 'organic' labeling is loosely regulated — some restaurants use the word for marketing without certification. True organic restaurants display supplier names, use seasonal menus, and often have a higher price point. If in doubt, ask about certification or supplier origin. The Sunday Farmer's Market at K Village (Sukhumvit 26) has certified organic vendors.",
  },
  {
    name: "Vegetarian & Organic Breakfast Culture",
    emoji: "☕",
    area: "Ari, Ekkamai, Charoennakorn",
    price: "Organic breakfast/brunch ฿200–500",
    why: "Bangkok's third-wave café culture has merged with organic and health-focused dining — cold-press juice bars, açaí bowl cafés, and gluten-free baking have proliferated in Ari, Ekkamai, and across the river in Charoennakorn. Mate Factor (Ari), Roast Coffee & Eatery (Thonglor), and various plant-based brunch concepts represent this movement. The morning organic café scene in Bangkok is a genuine cultural phenomenon among expat and affluent Thai communities.",
    tip: "Organic cold-press juice in Bangkok uses local tropical fruits — dragon fruit, sapodilla, guava, tamarind, and butterfly pea flower. These flavors are specific to Thailand and distinct from Western juice bar options. Many Bangkok health cafés offer Thai adaptogen tonics (turmeric, galangal, krachai) not found in most organic restaurants globally.",
  },
  {
    name: "Weekend Organic Markets",
    emoji: "🛒",
    area: "Chatuchak Weekend Market (section 22), K Village Sunday Market",
    price: "Produce ฿40–200; Prepared food ฿80–250",
    why: "Chatuchak Weekend Market section 22 has certified organic produce vendors selling direct from farms in Nakhon Pathom, Ratchaburi, and Chiang Mai. The K Village Sunday Organic Market (Sukhumvit 26) is Bangkok's most curated organic market — smaller than Chatuchak but with higher certification standards and prepared organic food vendors. Both markets run Saturday–Sunday mornings.",
    tip: "Arrive at organic markets before 10am for best selection and cooler temperatures. Thai heirloom rice varieties (Riceberry, Jasmine 105, Sangyod) are available in small quantities from Chatuchak organic vendors — these are genuinely distinct from commercial export rice. Northern Thailand's organic vegetable farms produce varieties rarely found in Bangkok supermarkets.",
  },
];

export function BangkokOrganicFood() {
  return (
    <div className="rounded-2xl border border-green-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-green-700 mb-3">
        🌿 Organic food in Bangkok — farm-to-table restaurants, health cafés & weekend markets
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
