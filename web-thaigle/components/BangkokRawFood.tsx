const SPOTS = [
  {
    name: "Broccoli Revolution",
    emoji: "🌱",
    area: "Sukhumvit Soi 49, Thonglor area",
    price: "Main dishes ฿280–480",
    why: "Bangkok's premier plant-based and raw food restaurant. Extensive raw food menu alongside cooked vegan options. Raw zucchini pasta, raw tacos, raw cheesecakes made from cashew cream and dates. Champions organic and locally sourced ingredients. Very Bangkok health-conscious crowd.",
    must_try: "Raw 'tuna' (marinated avocado + seaweed), raw cashew cheese board, raw chocolate mousse cake. Cold-pressed juice bar on same premises.",
  },
  {
    name: "Rasayana Retreat",
    emoji: "🧘",
    area: "Sukhumvit area",
    price: "Meals ฿300–600",
    why: "Dedicated raw vegan restaurant and retreat center. Thailand's first raw food restaurant. Serves pure uncooked plant-based food — living foods philosophy. Teaching menu with explanations of raw food benefits. Raw Thai dishes: raw tom kha (coconut soup), raw pad thai (zucchini noodles), raw mango salad.",
    must_try: "Raw Thai green curry (marinated vegetables in raw coconut cream sauce). Raw ice cream made from frozen blended fruit. The full raw food philosophy explained by staff.",
  },
  {
    name: "Ruam Jai Health Food (Local Options)",
    emoji: "🥗",
    area: "Health food stores across Bangkok",
    price: "฿50–200 for prepared items",
    why: "Thai health food culture supports raw food easily — fresh tropical fruit salads, som tam (papaya salad, raw), fresh coconut, raw sprouts, raw vegetable dishes. Tops Supermarket and Villa Market both have health food sections. The abundance of tropical fruit makes Bangkok one of the best cities for raw food.",
    must_try: "Young coconut flesh (raw, direct from coconut — ฿30–50 from vendors), fresh-cut fruit platters from street stalls, raw papaya salad (specify no fish sauce for fully raw/vegan).",
  },
];

const BENEFITS = [
  "Bangkok's tropical fruit abundance makes raw food eating naturally easier than colder climates",
  "Raw food philosophy: nutrients preserved, enzymes active, maximum bioavailability",
  "Thai temple food tradition (jay cuisine) overlaps with raw eating in fruit-forward dishes",
  "Dehydrated raw crackers, raw trail mixes available at health food stores (Lemon Farm is the best chain)",
  "Raw food detox retreats in Koh Samui and Phuket — day trips from Bangkok or weekend getaways",
];

export function BangkokRawFood() {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-emerald-700 mb-3">
        🌱 Raw food & plant-based dining in Bangkok
      </h2>
      <div className="space-y-2 mb-3">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-emerald-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-emerald-700">⭐ {s.must_try}</div>
          </div>
        ))}
      </div>
      <details className="border border-emerald-100 rounded-xl overflow-hidden">
        <summary className="px-3 py-2 cursor-pointer text-[10px] font-bold text-emerald-700 hover:bg-emerald-50">
          Raw food in Bangkok — why it works here
        </summary>
        <ul className="px-3 pb-3 pt-1 space-y-0.5">
          {BENEFITS.map((b) => (
            <li key={b} className="text-[10px] text-[var(--fg)] flex items-start gap-1.5">
              <span className="text-emerald-400 shrink-0">•</span>{b}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
