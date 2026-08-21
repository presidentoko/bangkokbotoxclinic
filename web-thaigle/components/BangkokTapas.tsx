const SPOTS = [
  {
    name: "El Toro Spanish Restaurant & Bar",
    emoji: "🐂",
    area: "Sukhumvit area",
    price: "Tapas ฿120–350 per dish; Spanish wine ฿250–500/glass",
    why: "Bangkok's most authentic Spanish tapas restaurant. Patatas bravas, gambas al ajillo, jamón ibérico, croquetas, pan con tomate. Spanish wine list with Rioja, Albariño, Cava. Spanish expat and foodie Bangkok crowd. The kind of tapas that would pass in Barcelona.",
    tip: "Order 3–4 tapas per person — tapas culture is meant for sharing and ordering progressively. Arrive at 7pm and stay for 2 hours. The jamón ibérico (Iberico ham) is imported — expensive but genuine. Cava by the glass is the best value wine option.",
  },
  {
    name: "Arros y Cosas",
    emoji: "🥘",
    area: "Thonglor/Ekkamai area",
    price: "Tapas ฿150–400; Paella (2-person minimum) ฿600–900",
    why: "Spanish restaurant focused on Valencian food (paella homeland). Tapas section plus authentic paella prepared in traditional large pan. Spanish chefs. The paella here is notably more authentic than most Bangkok versions — proper socarrat (crispy rice bottom), correct broth-to-rice ratio.",
    tip: "Paella requires 20–25 minutes — order immediately when seated. Seafood or mixed paella both good. Tapas while waiting: boquerones (anchovies), ensaladilla rusa (potato salad), pimientos de padrón (blistered peppers).",
  },
  {
    name: "Wine Republic & Tapas Bars",
    emoji: "🍷",
    area: "Multiple Bangkok wine bars with tapas sections",
    price: "Sharing plates ฿200–500",
    why: "Bangkok's wine bar scene has developed a tapas influence — small sharing plates alongside natural and premium wines. Karmakamet Diner, La Cave, and several Ari neighborhood wine bars all offer European-style sharing plates that fit the tapas concept even if not explicitly Spanish.",
    tip: "The Bangkok wine bar/tapas crossover scene is particularly good for groups of 3–5. Order multiple small plates and share — this is how these venues are designed. Natural wine with charcuterie and cheese is Bangkok's current upscale social dining formula.",
  },
];

export function BangkokTapas() {
  return (
    <div className="rounded-2xl border border-red-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-red-700 mb-3">
        🥘 Spanish tapas in Bangkok — patatas bravas, jamón & paella
      </h2>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-red-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-red-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
