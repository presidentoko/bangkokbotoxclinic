const SPOTS = [
  {
    name: "NGOs & Social Impact Organizations in Bangkok",
    emoji: "🤝",
    area: "NGO offices throughout Bangkok — concentration near UN offices in Rajdamnoen area, development organization district near Ratchadapisek, and community organizations throughout the city",
    price: "Volunteering: free (some organizations accept donations); NGO employment: competitive nonprofit salaries; Donation opportunities: direct to organizations",
    why: "Bangkok is a significant hub for international development and humanitarian organizations in Southeast Asia — the city hosts UNODC (UN Office on Drugs and Crime), UN Environment Programme regional office, International Labour Organization Southeast Asia, Asian Development Bank offices, and numerous international NGOs working across the Mekong region. Thailand's position as a regional hub for refugee processing (Thailand hosts significant numbers of displaced people from Myanmar and other countries), labor migration (millions of migrant workers from Myanmar, Cambodia, Laos), and development assistance means Bangkok-based organizations address genuine regional humanitarian need. Organizations active in Bangkok: International Rescue Committee (IRC), Save the Children Thailand, UNHCR Bangkok, World Food Programme, Médecins Sans Frontières (MSF), and hundreds of Thai NGOs addressing domestic issues including human trafficking, rural development, urban poverty, and environmental conservation.",
    tip: "Bangkok NGO and volunteer engagement: (1) Skills-based volunteering is more impactful than generic volunteering — organizations working in Thailand need legal expertise, medical skills, language skills (particularly Burmese, Khmer, and Lao speakers), tech skills, and data management — matching your skills to organizational needs creates genuine value; (2) Short-term volunteering caution: 'voluntourism' programs that charge visitors to volunteer (particularly with orphanages or child programs) are frequently criticized for creating harm rather than providing benefit — research the organization carefully before paying to volunteer; (3) Legitimate engagement: established international organizations (listed NGOs, UN agencies, academic research organizations) typically have formal internship and fellowship programs with structured application processes; (4) Donation transparency: Thailand's NGO sector varies in transparency — organizations registered with the Ministry of Social Development and Human Security and those with international affiliations tend to have better accountability structures.",
  },
  {
    name: "Environmental Conservation in Thailand",
    emoji: "🌿",
    area: "Marine conservation in Gulf of Thailand and Andaman coasts, wildlife rescue operations, urban environmental initiatives in Bangkok",
    price: "Marine volunteer programs: ฿5,000–25,000/week (includes accommodation and training); Wildlife rescue donation: ฿500–10,000; Urban tree planting events: free",
    why: "Thailand's environmental challenges and conservation opportunities span diverse ecosystems — marine coral reef conservation (the Gulf of Thailand's reefs face warming and bleaching; dive operators in Koh Tao and Koh Samui area support reef monitoring); sea turtle nesting conservation (Hat Mai Khao in Phuket and several Gulf coast sites have active nest protection programs); elephant welfare (multiple 'ethical elephant sanctuary' operations around Chiang Mai offer genuine elephant sanctuary observation rather than riding or exploitative contact); mangrove restoration (Bangkok's coastal areas and eastern provinces have active mangrove replanting programs). Bangkok urban environment: the Bangkok Metropolitan Administration (BMA) hosts periodic public tree-planting events and recycling education initiatives; the Trash Hero Thailand organization runs regular beach and canal cleanup events near Bangkok and throughout Thailand.",
    tip: "Thailand environmental engagement guidance: (1) Ethical elephant experience: distinguish between sanctuaries that allow elephant rides (exploitative — requires training that harms elephants) vs. observation-only sanctuaries (ethical — elephants are protected and allowed natural behavior); the Elephant Nature Park (Chiang Mai) model has been replicated by legitimate operators; (2) Marine volunteer selection: certifications required — marine volunteer programs for reef monitoring typically require open water scuba certification minimum; programs claiming to need no diving experience for underwater conservation are often marketing experiences rather than conservation; (3) Coral fragments planting programs: several dive operators in the Gulf run legitimate coral fragment nursery programs where divers can attach coral fragments to reef structures — verify the program is research-connected; (4) Bangkok canal cleanup: monthly cleanup events organized by Trash Hero Bangkok are accessible and allow direct participation in Bangkok's environmental improvement with no prior commitment required.",
  },
  {
    name: "Thai Social Entrepreneurs & Impact Investment",
    emoji: "💡",
    area: "Social enterprise ecosystem — Ashoka Thailand, Impact Hub Bangkok, and B Corp certified Thai businesses",
    price: "Social enterprise support programs: application-based; Impact Hub membership: ฿3,000–8,000/month; Social enterprise products: premium pricing reflects social mission",
    why: "Thailand's social enterprise sector is developing with government support — the Thai Social Enterprise Office (TSEO) provides a certification framework for social enterprises, and organizations like Ashoka Thailand support social entrepreneurs across the country. Bangkok's impact ecosystem: Impact Hub Bangkok (co-working and accelerator specifically for social impact ventures), Ashoka Thailand (international network of social entrepreneurs), and a growing number of Thai B Corps and certified social enterprises in food, education, healthcare, and environmental sectors. Notable Thai social enterprises: ISSC (social enterprise certification body), DON'T BUY THIS MAN (fashion enterprise employing refugees), and multiple social enterprises addressing rural-urban inequality through craft production and agricultural development. Thailand's Buddhist cultural identity creates fertile ground for social enterprise — concepts of community service and merit-making align with social enterprise values.",
    tip: "Bangkok social impact engagement: (1) Social enterprise products to support — several Thai social enterprises produce genuinely excellent consumer products including food, craft, and lifestyle goods; seeking out these businesses for everyday purchases in Bangkok creates direct positive social impact; (2) Impact Hub Bangkok events: the Impact Hub community regularly hosts pitch events, workshops, and networking for the social impact community — non-member access to events is typically available; (3) The OTOP (One Tambon One Product) government program: at Bangkok's department stores and OTOP fairs, rural community products are sold with quality certification — purchasing OTOP products directly supports rural community income. Thai craft cooperatives at Chatuchak Weekend Market (look for verified cooperative vendor signage) similarly support rural artisan communities.",
  },
];

export function BangkokNGO() {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-emerald-700 mb-3">
        🤝 Bangkok NGOs & social impact — international organizations, conservation & social enterprise
      </h2>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-emerald-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-emerald-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
