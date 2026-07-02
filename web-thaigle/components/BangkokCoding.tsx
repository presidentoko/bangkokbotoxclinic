const SPOTS = [
  {
    name: "Coding Bootcamps & Tech Education in Bangkok",
    emoji: "💻",
    area: "Startup District (Ekkamai, Ari, True Digital Park Sukhumvit 101), coworking campuses",
    price: "Intensive bootcamp ฿50,000–200,000/full program; Part-time course ฿15,000–50,000; Online-hybrid ฿10,000–30,000",
    why: "Bangkok's tech education ecosystem has matured significantly — the concentration of tech companies (AGODA, LINE Thailand, Lazada, Grab's Thai operation) and startups has created demand for programming education that local universities haven't fully met. Coding bootcamps (Le Wagon Bangkok, Ironhack Bangkok, General Assembly partners, and local providers like Codecamp) offer intensive full-stack, data science, and UX design programs. The Bangkok bootcamp ecosystem caters significantly to career changers — young Thai professionals pivoting from finance, engineering, or business backgrounds to tech roles. Remote-work-compatible tech skills are especially sought after given Bangkok's large digital nomad community.",
    tip: "Bangkok coding bootcamp selection: look for programs with strong job placement data (ask for specific hiring partner names and placement rates, not just percentages). Language of instruction matters: some Bangkok bootcamps are Thai-medium, others English-medium — clarify before applying. True Digital Park (Sukhumvit 101) is Bangkok's largest dedicated tech campus — multiple coding education providers are physically located there, and the ecosystem creates networking opportunities. Self-taught alternative: Bangkok's digital nomad cafe culture (Hubba, Mango Studio, CAMP Coffees with good wifi) provides the environment for self-directed online learning (Udemy, Coursera, freeCodeCamp) at a fraction of bootcamp cost.",
  },
  {
    name: "Tech Meetups & Developer Community",
    emoji: "🤝",
    area: "True Digital Park, Hub53, HUBBA coworking (Ekkamai), StartupTH events",
    price: "Most meetups free; Hackathons free–฿500 entry; Conferences ฿1,000–10,000",
    why: "Bangkok's developer community hosts regular meetups across programming languages and technology stacks — BKK.js (JavaScript), Python Bangkok, Google Developers Group Bangkok, and various hackathon communities run events that provide learning and networking outside formal education. Thailand's tech industry is characterized by a talent shortage in senior developers — the meetup community connects junior developers with experienced practitioners and employers. The startup community and developer community significantly overlap in Bangkok — tech meetups often function as pre-recruitment networking for both startup founders and corporate tech teams. Bangkok's developer salary trajectory: developers with proven practical skills (demonstrable projects, open-source contributions) command significant salary premiums over university graduates alone.",
    tip: "Bangkok developer community access: Eventbrite, Meetup.com (Bangkok Tech), and Facebook groups ('Bangkok Startup Community', 'Bangkok JavaScript') are the main event discovery channels. Hackathons: Bangkok regularly hosts corporate-sponsored hackathons (AIS, True, SCB, Agoda-affiliated) with substantial prize pools — these are both networking opportunities and portfolio project sources. The English-Thai language dynamic: Bangkok's international tech community mostly operates in English; Thai developer communities may switch between English and Thai freely — expat developers comfortable operating in mixed-language environments integrate most easily. Coworking spaces with developer-specific events: HUBBA Ekkamai, Mango Studio, and True Digital Park host programming-specific events beyond general networking.",
  },
  {
    name: "Data Science, AI & Emerging Tech in Bangkok",
    emoji: "🤖",
    area: "Universities with data science programs (KMUTT, Mahidol, Chulalongkorn), AI Lab Bangkok, corporate AI centers",
    price: "University course audit (if available) free; Professional data science course ฿20,000–100,000; AI conference ฿2,000–15,000",
    why: "Bangkok is developing a significant AI and data science ecosystem — driven by the Thai government's Thailand 4.0 initiative (digital transformation of industry) and by corporate investment from banks (SCB 10X, Kasikorn Bank x venture arm), telecom companies, and retail groups. NECTEC (National Electronics and Computer Technology Center) in Bangkok's Science Park is the national AI research center. International AI companies (including Google Cloud, Microsoft Azure, and AWS) maintain Bangkok-based teams supporting Southeast Asian operations. The data science demand in Bangkok is acute — financial services, e-commerce, and healthcare organizations are all building data teams and struggling to hire at sufficient scale.",
    tip: "Bangkok AI and data science community: DataTH community (meetups, Discord, Kaggle Thailand) is the primary hub for Thai data practitioners. The corporate AI training landscape: leading Thai banks and retail conglomerates run internal AI upskilling programs — some are open to external participants. For international data scientists: Bangkok's English-medium data science community (predominantly expat and international Thai returnees) has its own meetup circuits. Key organizations to follow: NECTEC, AIT (Asian Institute of Technology — has data science master's programs), Software Park Thailand. Thai language NLP: the Thai language processing niche is both technically challenging (tonal language, no word spacing) and professionally valuable — Thai-language AI capabilities are in high demand at Thai tech companies.",
  },
];

export function BangkokCoding() {
  return (
    <div className="rounded-2xl border border-violet-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-violet-700 mb-3">
        💻 Coding & tech community in Bangkok — bootcamps, developer meetups & AI scene
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-violet-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-violet-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
