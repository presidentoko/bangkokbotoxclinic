const TOPICS = [
  {
    title: "NGOs & Social Organizations in Bangkok",
    emoji: "🤝",
    summary: "Bangkok is Southeast Asia's NGO hub — the city hosts the regional headquarters of major international NGOs, UN agencies, and domestic Thai civil society organizations: (1) United Nations regional presence: UNDP, UNICEF, WHO, UNESCO, UNHCR, UNODC all have Bangkok regional offices; the United Nations campus area (Ratchadaphisek) concentrates UN and affiliated agency presence; (2) International NGOs in Bangkok: Médecins Sans Frontières (MSF) Thailand chapter, Save the Children Thailand, Oxfam in Asia, Human Rights Watch Southeast Asia, International Justice Mission Bangkok — international civil society presence reflects Bangkok's regional importance; (3) Domestic Thai civil society: Thailand has a mature domestic NGO sector covering environment (WWF Thailand, Greenpeace Thailand Southeast Asia office), child welfare (Foundation for the Child Development, CPCR), HIV/AIDS (AHF Thailand, Raks Thai), and urban poverty (Human Development Foundation operating in Bangkok's Klong Toey slum community); (4) Bangkok Foundation for the Deaf: representative of Thailand's disability rights and service NGO sector; (5) Duang Prateep Foundation: established by Prateep Ungsongtham Hata (known as the 'Teacher of the Slum'), this foundation operates education and social welfare programs in Klong Toey — Bangkok's largest urban slum community — and represents Bangkok's most visible domestic poverty response NGO.",
    action: "UN Thailand office (th.undp.org) for development programming; Foundation for the Child Development (fcd.or.th) for child welfare; Duang Prateep Foundation (dpf.or.th) for Klong Toey community programs; Human Development Foundation (mercycentre.org) for urban community work.",
  },
  {
    title: "Temple-Based Charity & Buddhist Social Work in Bangkok",
    emoji: "🙏",
    summary: "Thailand's Buddhist temple (wat) network serves as the foundation of Thai social welfare in ways that parallel the church-based social service tradition in Western countries: (1) Temple charity kitchens: many Bangkok temples operate merit-making meals (tang satthu — free rice and food for the poor) daily; community members and businesses donate food and funds; the elderly poor, homeless, and destitute access meals through temple networks without stigma; (2) Donation-funded education: Bangkok temples frequently operate free schools (rongrian wat — temple schools) and fund scholarships for children whose families cannot afford education; Thai temple donations (tam boon — merit-making) create a sustainable funding model; (3) Buddhist disaster relief: when Bangkok floods, fires in slum communities, or industrial accidents occur, temple networks mobilize quickly with food, temporary shelter, and material support through existing donation networks; (4) Monk-led environmental work: Thailand has a tradition of 'ecology monks' who ordain trees (wrapping them in orange robes to sacralize them against cutting) and organize community conservation through Buddhist authority; (5) Suan Dok Temple HIV/AIDS support (Chiang Mai model): Buddhist-led HIV/AIDS care pioneered in northern Thailand provides a model for Thai religious institution welfare engagement.",
    action: "Bangkok temples at which visitors witness/participate in charity: Wat Pho (during early morning food donation), Wat Saket during festivals, and neighborhood temples in non-tourist Bangkok areas where the merit-making food system operates daily.",
  },
  {
    title: "Child & Youth Social Programs in Bangkok",
    emoji: "👧",
    summary: "Bangkok's child welfare challenges include child labor risks (particularly among migrant worker families from Myanmar, Cambodia, and Laos), street children populations in tourist districts, and educational access gaps for undocumented children: (1) Mercy Centre (Klong Toey): Father Joe Maier's Mercy Centre is Bangkok's most well-known English-speaking charity serving Klong Toey slum children; operating for 50+ years; programs include early childhood education, youth development, and family social support; (2) The Mirror Foundation (Chiang Rai): although based in northern Thailand, this organization addressing human trafficking and hill tribe children's welfare is accessible to Bangkok-based supporters; (3) Camillian Social Centre Bangkok: Catholic-operated social welfare center serving street children, elderly, and HIV-affected families in Bangkok; provides medical and social support; (4) HopeLand School (Kanchanaburi): serving stateless and undocumented border children; supported through Bangkok-accessible donation and volunteer channels; (5) FCEM (Foundation for Child Mental Health): Bangkok-based organization providing mental health support for Bangkok's most at-risk children; Bangkok school mental health programming has expanded significantly following COVID disruption to children's social development.",
    action: "Mercy Centre Klong Toey (mercycentre.org) for foundational Bangkok child charity with English-language engagement; HopeLand Foundation for stateless children support; Camillian Social Centre (camillian.or.th) for comprehensive Bangkok social welfare programming.",
  },
  {
    title: "Environmental & Animal Welfare Charities in Bangkok",
    emoji: "🌿",
    summary: "Bangkok's environmental and animal welfare NGO sector reflects the city's growing awareness of environmental challenges: (1) WWF Thailand Bangkok office: World Wildlife Fund's Thailand office focuses on wildlife conservation (tigers, elephants, sea turtles), sustainable seafood, and climate policy; Bangkok-based, internationally connected; (2) Wildlife Friends Foundation Thailand (WFFT): sanctuary and rescue operation for trafficked and abused wildlife (including bears, gibbons, and tigers rescued from illegal trade); based in Phetchaburi province (accessible from Bangkok); (3) Soi Dog Foundation (Phuket-based, Bangkok-accessible donation): Thailand's most internationally known animal welfare organization; addresses Bangkok and Thailand's stray dog crisis through TNR (trap-neuter-return) programs; (4) Bangkok Stray Cat Welfare programs: Bangkok has a significant stray cat welfare network operated by volunteer groups (accessible through Facebook communities 'Bangkok Cats Help'); (5) EarthSafe Thailand: Bangkok-based environmental education and advocacy organization working with Thai youth on climate awareness; (6) Plastic-free initiatives: Bangkok-based plastic waste reduction organizations working with restaurants, hotels, and markets on elimination of single-use plastic — responding to Thailand's status as one of the world's top plastic ocean polluters.",
    action: "Soi Dog Foundation (soidog.org) for stray animal welfare; Wildlife Friends Foundation Thailand (wfft.org) for wildlife rescue; WWF Thailand (wwf.or.th) for wildlife conservation; local Bangkok cat rescue via Facebook 'Bangkok Cats Help' community.",
  },
];

export function BangkokCharity() {
  return (
    <div className="rounded-2xl border border-green-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-green-700 mb-3">
        🤝 Bangkok NGOs & social impact — temples, child welfare, environmental charities
      </h2>
      <div className="space-y-1.5">
        {TOPICS.map((t) => (
          <details key={t.title} className="border border-green-100 rounded-xl">
            <summary className="px-3 py-2 cursor-pointer font-bold text-xs flex items-center gap-2">
              <span>{t.emoji}</span>
              <span>{t.title}</span>
            </summary>
            <div className="px-3 pb-3">
              <div className="text-[10px] text-[var(--fg)] leading-snug mb-1">{t.summary}</div>
              <div className="text-[10px] text-green-700">→ {t.action}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
