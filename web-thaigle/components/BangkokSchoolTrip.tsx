const IDEAS = [
  {
    name: "Educational Attractions for School Groups",
    emoji: "🏛️",
    area: "Grand Palace area, Dusit district, museum cluster",
    price: "Group entry ฿50–200/student (discounts often available)",
    why: "Bangkok's museum and cultural site cluster is excellent for school trips. Key sites: National Museum of Thailand (royal artifacts, Southeast Asian art history), Science Museum Bangkok (Technopolis, interactive exhibits), Jim Thompson House (Thai silk industry and traditional architecture), Dusit Palace area (Thai royal history), Vimanmek Mansion (world's largest golden teak building).",
    tip: "The National Museum requires English-speaking guide booking in advance — the museum's context is most valuable with proper explanation. Jim Thompson House offers structured school tour packages with silk-weaving demonstrations. Budget 2–3 sites maximum per day — Bangkok traffic between sites takes more time than expected.",
  },
  {
    name: "Science & Nature for Student Groups",
    emoji: "🔬",
    area: "Technopolis (Science Park), Bangkok Zoo, National Science Museum",
    price: "฿100–250/student with group booking",
    why: "Technopolis Science Park (Pathum Thani, 1 hour from central Bangkok) is Thailand's largest interactive science museum — robotics, environmental science, biology exhibits with hands-on learning stations. The National Science Museum campus has planetarium, natural history, and technology museum sections. Bangkok Zoo (Dusit Zoo) closed 2018 for relocation — Khao Kheow Open Zoo (Chonburi, 1.5 hrs) is the alternative for wildlife.",
    tip: "Technopolis requires advance group registration and minimum group sizes. The planetarium shows are available in English for international school groups with booking. For biology/ecology field trips: Bang Krachao mangrove area south of Bangkok or Ramsar wetland sites accessible as day trips.",
  },
  {
    name: "Cultural Exchange Programs",
    emoji: "🤝",
    area: "Partner Thai schools, community cultural programs",
    price: "Program fees vary by duration and activities ฿500–3,000/student",
    why: "School trip cultural exchange programs in Bangkok: traditional Thai cooking class for groups, Thai silk weaving at silk cooperatives, temple etiquette and Buddhist culture sessions, Thai dance class at cultural centers. Several Bangkok organizations specifically structure educational programs for visiting school groups — half-day or full-day options with bilingual facilitation.",
    tip: "The Mandarin Oriental's legendary cooking school offers school group packages. The Thailand Cultural Centre runs educational programs for student groups. Most programs require 2–3 weeks advance booking minimum for groups of 10+. Dress code guidance for temple visits is essential — students should be briefed before arrival.",
  },
];

export function BangkokSchoolTrip() {
  return (
    <div className="rounded-2xl border border-blue-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-blue-700 mb-3">
        🏛️ Bangkok school trips — museums, science, cultural exchange & group programs
      </h2>
      <div className="space-y-2">
        {IDEAS.map((i) => (
          <div key={i.name} className="border border-blue-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{i.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{i.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{i.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{i.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{i.why}</div>
            <div className="text-[10px] text-blue-700">💡 {i.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
