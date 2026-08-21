const SPOTS = [
  {
    name: "Nepali & Himalayan Restaurants in Bangkok",
    emoji: "🏔️",
    area: "Sukhumvit Soi 7, Silom, near the UN-affiliated organizations (Sukhumvit corridor)",
    price: "Thali set ฿250–500; Dal bhat ฿180–350; Momos (dumplings) ฿150–300",
    why: "Bangkok has a small but authentic Nepali restaurant scene — sustained by the Nepali community (Nepal sends significant labor migration to Thailand across construction and security sectors) and by UN and international NGO workers (many of whom rotate through Nepal and other South Asian postings). Dal bhat (lentil soup + rice + curried vegetables, the Nepali national staple) is available at several Bangkok restaurants catering to Nepali workers. Momos (Himalayan dumplings, either steamed or fried, filled with buffalo, chicken, or vegetables) are the most accessible entry point — similar to but distinct from Chinese or Japanese dumplings.",
    tip: "Finding Nepali food in Bangkok: the areas with high Nepali worker concentration (particularly near construction sites and employment centers) have informal Nepali food stalls and small restaurants not easily discovered through Google. The Sukhumvit Soi 7 area (which has significant South Asian population) is the most reliable starting point. Nepali Buddhist festivals: the Nepali community in Bangkok celebrates Dashain (September–October), Tihar/Diwali, and Losar (Tibetan/Nepali New Year) — community temples host festival food gatherings open to respectful visitors. Nepali diaspora versus Indian food: Nepali food shares ingredients with North Indian cooking but has distinct preparations — dal bhat's lentil consistency, sel roti (ring donuts), and gundruk (fermented greens) distinguish it.",
  },
  {
    name: "Sri Lankan & South Indian Food",
    emoji: "🍛",
    area: "Silom area (SL community restaurants), Indian grocery shops (Pahurat/Little India)",
    price: "Rice and curry ฿200–400; Hoppers (appam) ฿60–120 each",
    why: "Sri Lankan food is distinct from Indian cuisine despite geographic and cultural overlap — hoppers (fermented rice flour and coconut milk crepes, either bowl-shaped or flat), kottu roti (chopped flatbread stir-fried with egg, vegetables, and meat), and the distinctive Sri Lankan curry preparation (more coconut milk, different spice balance than North Indian) represent a unique food tradition. Bangkok's Sri Lankan community (small but established) maintains community restaurants near the Silom area. South Indian food (dosa, idli, sambar, rasam, coconut-based curries from Tamil Nadu/Kerala traditions) appears at Indian restaurants throughout Bangkok's Pahurat/Little India area.",
    tip: "Bangkok's Little India (Pahurat area) is the best starting point for South Indian and Sri Lankan food exploration — the market area around Pahurat Cloth Market (BTS Saphan Taksin direction, near Si Phraya) has Indian restaurants ranging from authentic community spots to tourist-facing places. Key South Indian dishes at Bangkok Indian restaurants: masala dosa (crispy fermented rice crepe with potato filling), idli sambar (steamed rice cakes with lentil and vegetable soup), and Kerala-style fish curry (with coconut milk and kudampuli sourness) are reliable markers of authentic South Indian cooking. Friday lunch at the mosques adjacent to the Indian community area often includes curry rice distributions open to visitors — respectful participation welcomed.",
  },
  {
    name: "Pakistani & Bangladeshi Community Food",
    emoji: "🫙",
    area: "Pratunam area, Silom Soi 3, mosque-adjacent restaurant areas",
    price: "Nihari ฿200–400; Biryani ฿180–350; Karahi ฿250–450",
    why: "Bangkok's Muslim South Asian community (Pakistani, Bangladeshi, and North Indian Muslims) supports a cluster of restaurants near Pratunam and along the Silom mosque corridor. Pakistani-style food (nihari — slow-cooked bone marrow stew; karahi — wok-cooked meat in tomato and spice reduction; biryani with Pakistani spice profile) differs from Indian restaurant biryani in Thailand. Bangladeshi community restaurants serve their national dishes — hilsa fish preparations, mixed vegetable curries, and dal varieties specific to Bengal. These community restaurants operate primarily as working-people's establishments rather than fine dining.",
    tip: "Bangkok Pakistani food practical tips: the restaurants near Pratunam that serve Pakistani/Bangladeshi community food are often unmarked or have Thai-language-only signage — navigating by Google Maps review images showing the food is more reliable than signage. Halal certification: all Pakistani, Bangladeshi, and Muslim Indian community restaurants in Bangkok are halal — the certification is the operational baseline, not an add-on. Nihari is a slow-cooked dish that takes many hours — restaurants making it properly start cooking overnight for lunch service. Asking for it 'spicy' in Thai (เผ็ด, phed) typically has the server adjust to a level Thai-appropriate, not necessarily Pakistani-spice-level — specify 'very spicy' (เผ็ดมาก) clearly.",
  },
];

export function BangkokNepaleseFood() {
  return (
    <div className="rounded-2xl border border-orange-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-orange-700 mb-3">
        🏔️ Himalayan & South Asian food in Bangkok — Nepali, Sri Lankan & Pakistani cuisine
      </h2>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-orange-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-orange-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
