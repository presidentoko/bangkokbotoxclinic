const IDEAS = [
  {
    name: "Rooftop Celebration Dinner",
    emoji: "🌆",
    venue: "Sky Bar Lebua / Above Eleven / Bar.Yard",
    price: "฿1,500–4,000 per person",
    why: "Nothing says achievement like Bangkok's iconic skyline at night. Most rooftop venues offer graduation package packages with minimum spend. Group reservations secure the best spots. Spectacular photo backdrop.",
    tip: "Book at least 2 weeks ahead for groups of 8+. Mention 'graduation party' — some venues add complimentary cake or decorations. Smart dress code at most skyline rooftops. Request a corner table for group photos.",
    group: "6–20 people",
  },
  {
    name: "Thai Fine Dining Experience",
    emoji: "🍽️",
    venue: "Gaggan Anand / Bo.lan / Nusara",
    price: "฿2,500–6,000 per person (set menu)",
    why: "Celebrate with Bangkok's world-famous Thai fine dining. Gaggan and Bo.lan consistently appear on Asia's 50 Best Restaurants. A once-in-a-lifetime dinner that marks a milestone perfectly. Unforgettable tasting menus.",
    tip: "Reserve Gaggan Anand 6–8 weeks out — small tables, very popular. Bo.lan offers excellent private dining room for 8–10. Best if the graduate appreciates food culture — non-foodies may prefer rooftop over tasting menu.",
    group: "2–10 people",
  },
  {
    name: "Luxury Hotel Pool Party Package",
    emoji: "🏊",
    venue: "W Hotel / SO / Indigo — day-use pool packages",
    price: "฿1,800–3,500 per person (food + pool access)",
    why: "W Bangkok and SO/ offer day-use pool access packages that work perfectly for group graduation celebrations. Infinity pools, cocktails, DJ on weekends. More social and less formal than dinner.",
    tip: "Book W Hotel's 'WET pool day-use' for the best Bangkok pool party experience. Weekend rates include food credit. Groups of 15+ often qualify for buyout pricing — ask events team. Sunscreen essential.",
    group: "10–40 people",
  },
  {
    name: "Private Chef Experience",
    emoji: "👨‍🍳",
    venue: "AirKitchen / Cookly / private villa booking",
    price: "฿1,200–2,500 per person",
    why: "Book a private Thai cooking class-turned-dinner. Chef comes to your Airbnb or villa, teaches group to cook 4–5 signature Thai dishes, then you eat what you made. Intimate and unique graduation experience.",
    tip: "AirKitchen Bangkok has vetted chefs for private groups (6–20 people). Add cocktail-making component for ฿400/person more. Great for mixed groups who want activity + dinner. Book 1 week ahead minimum.",
    group: "6–20 people",
  },
];

export function BangkokGraduationParty() {
  return (
    <div className="rounded-2xl border border-rose-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-rose-700 mb-3">
        🎓 Graduation party ideas in Bangkok — celebrate the milestone
      </h2>
      <div className="space-y-2">
        {IDEAS.map((i) => (
          <div key={i.name} className="border border-rose-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{i.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{i.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{i.venue} · Group: {i.group}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{i.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{i.why}</div>
            <div className="text-[10px] text-rose-700">💡 {i.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
