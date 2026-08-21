const BOWLS = [
  {
    name: "Poke Bowl Bangkok (multiple locations)",
    emoji: "🐟",
    area: "Ari, Thong Lo, Siam",
    price: "Poke bowl ฿280–420",
    why: "Bangkok's most consistently rated Hawaiian poke chain. Fresh ahi tuna, salmon, and scallop options. Build-your-own with 15+ toppings. Rice, quinoa, or salad base available.",
    tip: "Salmon avocado with sesame and wasabi soy is the house-recommended combination. Pre-packed bowls available for quick lunches. Keto-friendly (rice swap to greens) accommodated.",
  },
  {
    name: "Ohana Poke (Silom / Sathorn)",
    emoji: "🌺",
    area: "Silom area",
    price: "Bowls ฿290–450",
    why: "Hawaiian-themed restaurant with authentic poke recipe from Honolulu. Lilikoi (passion fruit) dressing is the differentiator. Signature 'Maui bowl' with macadamia nuts and coconut.",
    tip: "The Maui Bowl (ahi, avocado, mango, macadamia, coconut dressing) best if you want something distinctly Hawaiian. Lunch set includes 2 toppings ฿250.",
  },
  {
    name: "The Poke Lab (Ekkamai)",
    emoji: "🧪",
    area: "Ekkamai / Thong Lo",
    price: "Bowls ฿280–380",
    why: "Lab concept with interchangeable toppings and sauce experimentation. Creates unusual combinations like tom yum-infused poke, yuzu-jalapeño, and Thai herb poke. Interesting fusion approach.",
    tip: "Mix half rice / half quinoa base for best texture. 'Discovery Bowl' (chef's choice daily creation) is always interesting. Wednesday delivery promotions on Grab.",
  },
];

const TOPPINGS = ["Edamame", "Mango chunks", "Cucumber", "Corn", "Seaweed salad", "Masago (fish roe)", "Crunchy garlic", "Truffle oil drizzle"];

export function BangkokPokeGuide() {
  return (
    <div className="rounded-2xl border border-sky-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-sky-700 mb-3">
        🐟 Poke bowls in Bangkok — Hawaiian-inspired fresh fish bowls
      </h2>
      <div className="space-y-2 mb-3">
        {BOWLS.map((b) => (
          <div key={b.name} className="border border-sky-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{b.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{b.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{b.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{b.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{b.why}</div>
            <div className="text-[10px] text-sky-700">💡 {b.tip}</div>
          </div>
        ))}
      </div>
      <div className="border border-sky-100 rounded-xl p-3">
        <div className="text-[10px] font-bold text-sky-700 mb-1.5">Best topping combos to try:</div>
        <div className="flex flex-wrap gap-1">
          {TOPPINGS.map((t) => (
            <span key={t} className="px-1.5 py-0.5 bg-sky-50 text-sky-700 rounded text-[10px]">{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
