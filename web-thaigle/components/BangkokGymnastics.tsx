const OPTIONS = [
  {
    name: "Acrobatics & Gymnastics Schools",
    emoji: "🤸",
    area: "Sukhumvit, Ari, Ladprao",
    price: "Kids class ฿1,500–3,000/month; Adults ฿2,000–4,500/month",
    why: "Bangkok has a growing gymnastics scene driven by both competitive youth programs and adult acrobatics interest (tumbling, flexibility, aerial). Dedicated gymnastics schools: Flippin Kids Gymnastics, Bangkok Gymnastics Club, and several CircuSiam-adjacent studios. Adult beginner classes available — gymnastics as fitness (core strength, flexibility, coordination) is trending in Bangkok's wellness community.",
    tip: "Adult gymnastics/acrobatics classes in Bangkok are genuinely beginner-friendly — trainers understand most adults have never trained gymnastics. First classes typically focus on handstands, forward rolls, cartwheels, and flexibility work. More dramatic skills (back walkovers, aerials) come after 3–6 months of consistent training.",
  },
  {
    name: "Rhythmic Gymnastics in Bangkok",
    emoji: "🎀",
    area: "Sports complexes and university facilities",
    price: "Classes ฿1,500–3,500/month",
    why: "Rhythmic gymnastics (ribbon, hoop, ball, clubs) has a Thai following — Thailand competes internationally in rhythmic gymnastics. Bangkok has several rhythmic gymnastics schools primarily for children/youth, with some adult hobby classes available. The combination of dance, apparatus skills, and flexibility makes it very accessible as a non-competitive adult fitness activity.",
    tip: "Rhythmic gymnastics classes for adult beginners focus on ribbon and hoop skills, flexibility, and basic choreography — a cross between dance and gymnastics. Completely non-competitive classes available. Very unusual activity for Bangkok expats and tourists to try — memorable and photogenic.",
  },
  {
    name: "Trampoline & Aerial Parks",
    emoji: "🎪",
    area: "Major malls — Mega Bangna, Central Eastville, Seacon Square",
    price: "30 min session ฿150–250",
    why: "Bangkok's trampoline parks have proliferated in major shopping malls. Jumpzone, Bounce, and Sky World are the main chains. Equipment: interconnected trampolines, foam pit, dodgeball courts, aerial silks (some venues). Popular for kids and adults — bounce sessions run in 30–60 minute increments. Adjacent to gymnastics as a body awareness and cardiovascular activity.",
    tip: "Wear sports socks (required at all trampoline parks — grip socks available for purchase). Book ahead on weekends — parks fill to capacity. The foam pit is universally enjoyed regardless of age. Some parks have designated quiet hours on weekday mornings for younger children.",
  },
];

export function BangkokGymnastics() {
  return (
    <div className="rounded-2xl border border-purple-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-purple-700 mb-3">
        🤸 Gymnastics in Bangkok — schools, trampoline parks & adult acrobatics
      </h2>
      <div className="space-y-2">
        {OPTIONS.map((o) => (
          <div key={o.name} className="border border-purple-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{o.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{o.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{o.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{o.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{o.why}</div>
            <div className="text-[10px] text-purple-700">💡 {o.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
