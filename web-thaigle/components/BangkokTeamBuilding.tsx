const IDEAS = [
  {
    type: "Cooking Class (Thai Cuisine)",
    emoji: "👨‍🍳",
    providers: ["Blue Elephant Cooking School — premium, 4-hour class ฿3,500–5,000/person", "Silom Thai Cooking School — mid-range ฿2,200/person, highly rated", "ABC Amazing Bangkok Cooking — group discount rates for 10+"],
    price: "฿1,800–5,000/person (group rates available for 10+)",
    why: "Bangkok's most popular corporate team-building. Groups cook a 4-course Thai meal together then eat it. Everyone participates — no hierarchies in the kitchen. Works for all cultures.",
    tip: "Book entire school for groups of 15+ — most schools offer private classes. Morning sessions (9am–1pm) are best — afternoon heat is challenging. Dietary restrictions accommodated.",
  },
  {
    type: "Muay Thai Workshop + Stadium Evening",
    emoji: "🥊",
    providers: ["Tiger Muay Thai group sessions (2-hour)", "Fairtex Training Center corporate package", "Rajadamnern Stadium ringside group booking"],
    price: "฿800–2,500/person",
    why: "Genuinely unique team-building only available in Thailand. Morning workshop = everyone learns basics together (fun, not competitive). Evening fight = professional stadium experience.",
    tip: "Combine same-day: 2-hour morning Muay Thai lesson + stadium fight evening. Packages through most reputable gyms. Great for overcoming comfort zones — bosses look as clumsy as everyone else.",
  },
  {
    type: "Long-tail Boat Race on Chao Phraya",
    emoji: "⛵",
    providers: ["Manohra Cruises group event", "Private canal boat rally through Bangkok canals", "Ayutthaya boat race day trip (3-hour from Bangkok)"],
    price: "฿1,500–3,500/person (minimum group 8+)",
    why: "Bangkok's canals and river provide a dramatic setting. Teams race wooden long-tail boats, navigate canal checkpoints, or compete in relay challenges. Distinctly Thai experience.",
    tip: "Full-day programs include market boat tour + cooking element + race. Best dry season (Nov–Mar) for stable river conditions. Evening river dinner cruise option if daytime is too hot.",
  },
  {
    type: "CSR Activity: Elephant Sanctuary",
    emoji: "🐘",
    providers: ["Elephant Jungle Sanctuary Pattaya (2.5 hours from Bangkok)", "Mahouts Elephant Foundation", "Wildlife Friends Foundation Thailand"],
    price: "฿2,500–4,000/person including transfer",
    why: "Meaningful CSR element that resonates with international teams. Feed, walk with, and bathe rescued elephants. Pairs team-building with wildlife conservation education. Popular with tech and finance companies.",
    tip: "Private group bookings available — minimum 6 people. Pattaya sanctuary closer to Bangkok than Chiang Mai options. Half-day programs return to Bangkok by 3pm.",
  },
];

export function BangkokTeamBuilding() {
  return (
    <div className="rounded-2xl border border-violet-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-violet-700 mb-3">
        🏆 Corporate team-building in Bangkok — unique experiences
      </div>
      <div className="space-y-2">
        {IDEAS.map((idea) => (
          <details key={idea.type} className="border border-violet-100 rounded-xl overflow-hidden group">
            <summary className="px-3 py-2.5 cursor-pointer flex items-center gap-2 hover:bg-violet-50 transition">
              <span className="text-2xl shrink-0">{idea.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{idea.type}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{idea.price}</span>
            </summary>
            <div className="px-3 pb-3 border-t border-violet-100 pt-2 space-y-1.5">
              <div className="text-[10px] text-[var(--fg)] leading-snug">{idea.why}</div>
              <ul className="space-y-0.5">
                {idea.providers.map((p) => (
                  <li key={p} className="text-[10px] text-violet-700 flex items-start gap-1.5">
                    <span className="shrink-0">•</span>{p}
                  </li>
                ))}
              </ul>
              <div className="text-[10px] text-orange-600">💡 {idea.tip}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
