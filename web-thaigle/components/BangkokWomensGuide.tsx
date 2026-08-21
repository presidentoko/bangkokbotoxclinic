const TOPICS = [
  {
    title: "Women's Safety in Bangkok",
    emoji: "🛡️",
    summary: "Bangkok is generally considered safe for women travelers and residents — female solo travelers regularly rate it among Asia's more comfortable destinations. The Thai culture's emphasis on 'saving face' and public decorum significantly reduces street harassment compared to many global cities. The main risks are the same as for all travelers: opportunistic bag snatching (keep valuables close), drink spiking in entertainment areas (never leave drinks unattended, use the buddy system in party environments), and unlicensed taxi situations (always use Grab or metered taxis, never unmarked vehicles). Public transport (BTS, MRT) is safe and populated throughout operating hours. The entertainment district areas (Nana, Patpong) are more uncomfortable for women walking alone at night — the sex tourism industry in these areas creates an environment where solo women may receive unwanted attention; avoiding these specific areas after dark is the simplest solution.",
    action: "Use Grab app exclusively for late-night transport; keep phone charged for emergency communication; dress modestly in temple areas (shoulders and knees covered — both for cultural respect and to reduce attention); trust your instincts in any situation that feels uncomfortable — Thai culture makes it socially acceptable to disengage without explanation.",
  },
  {
    title: "Women's Health Resources in Bangkok",
    emoji: "🏥",
    summary: "Bangkok's medical infrastructure is genuinely excellent for women's health — international hospitals (Bumrungrad, Samitivej, Bangkok International) have dedicated women's health departments including gynecology, obstetrics, breast health, and reproductive medicine at international standards. Contraception is accessible: oral contraceptives are available over-the-counter at pharmacies without prescription (Watsons, Boots, local pharmacies), though prescription brands may need a clinic visit. Emergency contraception is available at pharmacies. LGBTQ+ affirming healthcare: Bangkok has medical providers specifically known for LGBTQ+ inclusive care — the Pride-supporting hospital departments at BNH and Vejthani are noted by the community. Prenatal care for expats: all international hospitals have expat-oriented prenatal programs with English-speaking obstetricians.",
    action: "Register with a hospital before needing urgent care — Bumrungrad's international patient registration is straightforward online. For expats: health insurance covering gynecological care and regular screening is strongly recommended. Mental health support: international therapists serving women (including issues of expatriate adjustment, relationship stress, and identity) are available in Bangkok through services like Counselling Bangkok and via online platforms connecting to English-speaking therapists.",
  },
  {
    title: "Women's Networking & Community in Bangkok",
    emoji: "👩‍💼",
    summary: "Bangkok has a substantial expat women's community with organized social and professional infrastructure. Internations Bangkok regularly hosts events where expat women connect. Professional women's networks (Women's Economic Forum Bangkok, American Women's Club Bangkok, Junior League Bangkok) offer structured networking and social programs. Female digital nomad communities are active in Bangkok's coworking spaces — the high concentration of female solo travelers and digital nomads has created organic community in specific cafes and coworking environments (Hubba, Mango Studio, Dojo Bali-Bangkok community). Thai women's networks: Bangkok's Thai professional women's associations (in finance, law, business) are less porous to expat connection but overlap in specific industries (particularly advertising, fashion, hospitality).",
    action: "Start with Internations Bangkok events (the female-attended events are specifically noted in reviews as comfortable and well-organized). Facebook groups 'Expat Women Bangkok' and 'Bangkok Female Travellers' are active and responsive for advice. The coworking community at HUBBA Ekkamai tends to have higher female expat representation than most Bangkok coworking spaces.",
  },
];

export function BangkokWomensGuide() {
  return (
    <div className="rounded-2xl border border-pink-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-pink-700 mb-3">
        🛡️ Women's guide to Bangkok — safety, health resources & community for women
      </h2>
      <div className="space-y-2">
        {TOPICS.map((t) => (
          <details key={t.title} className="border border-pink-100 rounded-xl p-3 group">
            <summary className="flex items-center gap-2 cursor-pointer list-none">
              <span className="text-xl shrink-0">{t.emoji}</span>
              <span className="font-bold text-xs flex-1">{t.title}</span>
              <span className="text-[10px] text-pink-400 group-open:hidden">▼ expand</span>
              <span className="text-[10px] text-pink-400 hidden group-open:inline">▲ collapse</span>
            </summary>
            <div className="mt-2 space-y-1">
              <div className="text-[10px] text-[var(--fg)] font-medium leading-snug">{t.summary}</div>
              <div className="text-[10px] text-pink-700 leading-snug">→ {t.action}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
