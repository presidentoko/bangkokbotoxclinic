const CAFES = [
  {
    name: "Cat's Library (แคทส์ ไลบรารี่)",
    emoji: "🐱",
    area: "Ekkamai BTS area",
    price: "Entry ฿200–300 (includes 1 drink)",
    animal: "Cats (20+ resident cats)",
    why: "Bangkok's most Instagram-famous cat café. Bookshelf aesthetic, comfortable seating, resident cats are friendly and well-socialized. Excellent coffee.",
    tip: "No children under 7. Don't wake sleeping cats. Best visited on weekdays — weekends very busy. Book via phone or Instagram.",
  },
  {
    name: "BKK Bunny Café",
    emoji: "🐰",
    area: "Sukhumvit area",
    price: "Entry ฿150 + food/drinks",
    animal: "Rabbits + small animals",
    why: "Feed and interact with rabbits, hedgehogs, and guinea pigs in a supervised setting. Very popular with families and animal lovers.",
    tip: "Bring your own carrots for extra rabbit interaction. Purchase their organic rabbit feed for ฿30 inside.",
  },
  {
    name: "Hedgehog Café",
    emoji: "🦔",
    area: "Rachathewi / Victory Monument area",
    price: "Entry ฿200 including handling session",
    animal: "Hedgehogs (and some small exotics)",
    why: "Very niche experience. Gloved hedgehog handling included. Not everyone's cup of tea but memorable.",
    tip: "Hedgehogs are nocturnal — morning sessions they're sleepier. Evening sessions (after 5pm) more active animals.",
  },
  {
    name: "Alpaca Hill Bangkok (Day Trip)",
    emoji: "🦙",
    area: "Khao Yai area (day trip, 2.5hr from Bangkok)",
    price: "Entry ฿450, alpaca feeding ฿100",
    animal: "Alpacas, donkeys, rabbits, mini horses",
    why: "Not a café but a petting farm. Worth combining with Khao Yai winery/scenic area. Unusual Bangkok day trip.",
    tip: "Go Saturday or Sunday, combine with Khao Yai winery tour and Khorat chocolate factory. Full day out of Bangkok.",
  },
];

export function BangkokPetCafes() {
  return (
    <div className="rounded-2xl border border-pink-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-pink-700 mb-3">
        🐱 Bangkok pet cafés & animal experiences
      </h2>
      <div className="space-y-2">
        {CAFES.map((c) => (
          <div key={c.name} className="border border-pink-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{c.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{c.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{c.animal} · {c.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{c.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{c.why}</div>
            <div className="text-[10px] text-pink-700">💡 {c.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
