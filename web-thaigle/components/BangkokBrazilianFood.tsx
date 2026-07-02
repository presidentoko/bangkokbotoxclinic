const RESTAURANTS = [
  {
    name: "Texas Rodizio (Sukhumvit Churrascaria)",
    emoji: "🥩",
    area: "Sukhumvit 11",
    price: "All-you-can-eat ฿899–1,290 per person",
    why: "Bangkok's most-visited Brazilian churrascaria (rodizio). Passadores (meat carvers) circulate with 12+ cuts of beef, lamb, chicken, and pork on giant skewers. Carve and serve tableside. Unlimited until you flip your disk to red.",
    tip: "The gold/green disk at your seat = keep coming (green side up) or stop (red side up). Pace yourself — the salad buffet is a trap. Focus on picanha (top sirloin cap) — Brazil's prized cut. Ask passador for the end piece (more charred).",
  },
  {
    name: "Feijoada Bangkok (Weekend Special)",
    emoji: "🫘",
    area: "Various expat restaurants, weekend only",
    price: "Feijoada set ฿380–580",
    why: "Brazil's national dish — black bean stew with various pork parts (ear, snout, pork belly, smoked sausage). Served Saturday in Brazil — some Bangkok restaurants follow this tradition. Rich, earthy, deeply satisfying.",
    tip: "Search for 'feijoada Bangkok' on Facebook or Google Maps to find current availability. Not permanently on most menus — special event dish. Accompanied by farofa (toasted cassava flour), rice, collard greens, and orange slices.",
  },
  {
    name: "Pão de Queijo — Brazilian Bakery Options",
    emoji: "🧀",
    area: "Embassy area bakeries and expat cafés",
    price: "Per piece ฿30–60",
    why: "Brazil's famous cheese bread — naturally gluten-free (tapioca starch + cheese). Crispy outside, stretchy cheesy inside. Found at some bakeries in diplomatic district. Nostalgia-inducing for any Brazilian expat or visitor.",
    tip: "Bon Vivant Bakery (near Silom) occasionally stocks pão de queijo by request. Brazilian community in Bangkok sometimes sells via social media groups. Not widely available — it's a find-of-the-day discovery.",
  },
];

export function BangkokBrazilianFood() {
  return (
    <div className="rounded-2xl border border-green-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-green-700 mb-3">
        🇧🇷 Brazilian food in Bangkok — churrasco rodizio & feijoada
      </div>
      <div className="space-y-2">
        {RESTAURANTS.map((r) => (
          <div key={r.name} className="border border-green-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{r.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{r.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{r.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{r.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{r.why}</div>
            <div className="text-[10px] text-green-700">💡 {r.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
