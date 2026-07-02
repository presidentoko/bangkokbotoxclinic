const SPOTS = [
  {
    name: "Dating Apps in Bangkok — The Landscape",
    emoji: "📱",
    area: "Bangkok-wide digital landscape, primary meeting platforms for expats and locals",
    price: "Free basic tiers; Premium subscriptions ฿500–2,000/month; Dating app paid features generally recommended",
    why: "Bangkok has one of the world's highest concentrations of dating app users relative to expatriate population — the intersection of a young, tech-literate Thai population, a large expat community, and a city with active social life creates significant platform activity. The dominant apps by user base in Bangkok: Tinder (largest general pool, Thai and international users), Bumble (more common among Thai professional women and expat women), OkCupid (more detailed profiles, popular among intellectuals and those seeking cultural connection), and Badoo (popular among Thai users). Thai-specific apps: Twisting by Pantip has historically served the Thai domestic market. LINE remains the communication app — phone numbers are rarely exchanged; LINE IDs are.",
    tip: "Bangkok dating app practical reality: profile optimization is important — Bangkok's expat-tourist mix creates significant signal-to-noise ratio issues. Clear profile photos (face visible), brief bio explaining your situation (visiting, living here, what you're looking for), and reasonable expectations create better outcomes. Safety: meet in public spaces for first meetings — Bangkok has excellent café and restaurant infrastructure for this. The Bangkok timing reality: many people on apps are in Bangkok temporarily (tourists, short-term residents), which affects expectation-setting. For genuine long-term connections, identifying whether the person is a Bangkok resident (not just passing through) early in conversation saves time.",
  },
  {
    name: "Bangkok Social Life for Singles",
    emoji: "🎉",
    area: "Sukhumvit Soi 11 corridor, Thong Lor, Silom, Ari neighborhood, rooftop bars",
    price: "Bar entry ฿0–300; Drinks ฿150–500 each; Social events ฿200–1,000 admission",
    why: "Bangkok's social scene for singles extends well beyond apps — the city's extensive bar, rooftop, and event culture provides genuine in-person meeting contexts across social strata. Social geography: Sukhumvit Soi 11 area has the highest concentration of international bars and the most active expat social mixing (Levels, Insanity, Iron Fairies are long-established venues). Thong Lor is the upscale Japanese-Korean-Thai professional social scene. Silom/Patpong area has the LGBT+ social scene. Ari is the younger creative professional scene with wine bars and jazz cafés. Rooftop bars (Sky Bar, Vertigo, Above Eleven) serve the Instagram-experience crowd with significant social mingling.",
    tip: "Bangkok single's social strategy: organized social events (Internations, themed social nights, trivia nights at international bars) provide lower-barrier introductions than open bar scenes. Language exchange events (Thais practicing English, foreigners practicing Thai) are genuinely one of the most effective social mixing events — shared vulnerability about language learning creates authentic connection. The BTS Silom and Sukhumvit lines at peak weekend evening hours are themselves social spaces. Cooking classes and wine tasting events attract the engaged-in-Bangkok demographic more than pure tourism activities. Bangkok's café culture (particularly in Thong Lor, Ari, and Phrom Phong neighborhoods) has become a primary daytime social infrastructure.",
  },
  {
    name: "Cross-Cultural Relationships in Bangkok",
    emoji: "💑",
    area: "Bangkok-wide, with specific cultural considerations for Thai–foreigner relationships",
    price: "N/A — this is contextual and educational information",
    why: "Bangkok has an exceptionally high rate of Thai–foreign relationships among its long-term expat community — the combination of attractive cultural exchange, lifestyle compatibility, and Bangkok's social openness creates conditions for genuine long-term partnerships. Important context: Thai culture values family integration differently than Western norms — meeting a partner's family carries significant relational weight, and the family's approval or disapproval is a meaningful factor in Thai relationship context. The financial dynamics of relationships in Bangkok are complex and often discussed in expat communities — context matters enormously, and generalizing is both inaccurate and unhelpful. Language: Thai partners typically have varying levels of English fluency; some expats learn Thai both for practical navigation and as a meaningful gesture of cultural engagement.",
    tip: "Cross-cultural relationship practical guidance: learning some Thai (even basic greetings and courtesy phrases) is a significant positive signal in any Thai relationship context. Understanding Buddhist concepts (karma, merit-making, reincarnation) provides useful context for how Thai partners may approach ethics and life choices. Family introductions in Thailand: when invited to a Thai family home, bringing a gift (fruit basket, quality food) is expected etiquette. Key cultural differences to understand: Thai concept of 'face' (not embarrassing someone publicly), indirect communication styles, and the role of hierarchy and respect for elders — these are not barriers but context that makes relationships richer when understood.",
  },
];

export function BangkokDatingApps() {
  return (
    <div className="rounded-2xl border border-pink-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-pink-700 mb-3">
        💑 Bangkok dating & social life — apps, bar scenes & cross-cultural relationships
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-pink-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-pink-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
