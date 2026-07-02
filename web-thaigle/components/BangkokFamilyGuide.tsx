const ACTIVITIES = [
  {
    name: "SEA Life Bangkok Ocean World",
    emoji: "🦈",
    age: "All ages",
    location: "Siam Paragon B1, Siam BTS",
    cost: "฿990–1,290 adult / ฿790–990 child",
    tip: "World's largest aquarium. Book online for discount. Glass tunnel under sharks is the highlight.",
  },
  {
    name: "Dream World",
    emoji: "🎢",
    age: "5+",
    location: "Rangsit (30 min from city)",
    cost: "฿200–400 entry + ride tickets",
    tip: "Thailand's top theme park. Smaller than international parks but great for kids. Grab to get there.",
  },
  {
    name: "Safari World",
    emoji: "🦒",
    age: "All ages",
    location: "Minburi (40 min from city)",
    cost: "฿1,100 adult / ฿850 child (drive-through)",
    tip: "Drive-through safari with lions, giraffes, rhinos. Also has marine park. Full day. Hire a car.",
  },
  {
    name: "Dusit Zoo (Khao Din Wittayasat)",
    emoji: "🦁",
    age: "2+",
    location: "Dusit, near Victory Monument",
    cost: "฿300 adult / ฿150 child",
    tip: "Bangkok's historic zoo. Good size, not too crowded. Hippos and white tigers.",
  },
  {
    name: "Children's Discovery Museum",
    emoji: "🔬",
    age: "2–12",
    location: "Chatuchak Park (Mo Chit BTS)",
    cost: "Free",
    tip: "Interactive exhibits for younger kids. Right next to Chatuchak Park for outdoor play after.",
  },
  {
    name: "KidZania Bangkok",
    emoji: "👷",
    age: "4–14",
    location: "Siam Paragon, Siam BTS",
    cost: "฿990–1,190 child / ฿490 adult (supervisor)",
    tip: "Kids roleplay as adults (doctor, pilot, chef). 3–4 hours minimum. Book weekdays to avoid queues.",
  },
];

export function BangkokFamilyGuide() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        👨‍👩‍👧 Bangkok with kids — best family activities
      </div>
      <div className="space-y-2">
        {ACTIVITIES.map((a) => (
          <div key={a.name} className="flex gap-3 border border-[var(--border)] rounded-xl p-3">
            <span className="text-2xl shrink-0">{a.emoji}</span>
            <div className="min-w-0">
              <div className="font-bold text-xs">{a.name}</div>
              <div className="text-[10px] text-[var(--muted)] mb-0.5">📍 {a.location} · 👶 Age {a.age}</div>
              <div className="text-[10px] text-green-700 mb-0.5">💰 {a.cost}</div>
              <div className="text-[10px] text-[var(--muted)] leading-snug">💡 {a.tip}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 text-[10px] text-amber-700 bg-amber-50 rounded-xl p-2.5 border border-amber-200">
        <strong>Family tip:</strong> Bangkok is very family-friendly. Thais adore children. Most malls have prayer rooms and baby changing facilities. Grab car seats available on request in the Grab app.
      </div>
    </div>
  );
}
