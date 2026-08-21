const TOPICS = [
  {
    title: "Bangkok Safety for Women — Real Assessment of Risk Levels",
    emoji: "🛡️",
    summary: "Bangkok ranks as one of Asia's safer cities for solo female travelers but with specific context: (1) Street-level safety: Bangkok's street-level safety for women is generally high; violent crime against tourists is rare; street harassment is less aggressive than many Southeast Asian and South Asian destinations; Thai culture's emphasis on face-saving (avoiding public confrontation) reduces harassment incidents; (2) Transportation safety: Bangkok's BTS Skytrain and MRT Metro are safe at all hours; women-only train cars exist on MRT (optional, marked in pink); Grab and taxi rides have tracking features — sharing ride details with contacts reduces remaining risks; avoiding unlicensed tuk-tuk and motorcycle taxi rides alone at night is recommended; (3) Nightlife caution zones: areas near Nana Plaza (Sukhumvit Soi 4), Patpong (Silom), and Soi Cowboy (Sukhumvit Soi 21–23) are Bangkok's entertainment districts where unsolicited male attention increases; these areas are not dangerous but require normal big-city alertness; (4) Scam landscape vs. physical safety: Bangkok's risk profile for women leans toward scams (gem scams, overpriced tuk-tuk tours) rather than physical danger; being confident and walking purposefully reduces the likelihood of being targeted by scam operators who favor visibly uncertain tourists; (5) Accommodation selection: selecting accommodation in non-entertainment district neighborhoods (Ari, Phrom Phong, Ladprao, Ekkamai) and reading women's travel reviews (Solo Female Travelers Facebook group has Bangkok-specific reviews) provides more accurate safety assessment than generic travel advisories.",
    action: "Solo Female Travelers (solofemaletravelers.com) Bangkok section; Girls LOVE Travel Facebook group for Bangkok-specific safety updates; Tourist Police: 1155 (English-speaking); Emergency: 191; Bangkok's women-only BTS car (marked): front of train in all stations.",
  },
  {
    title: "Women's Health, Beauty & Wellness in Bangkok",
    emoji: "💆",
    summary: "Bangkok offers extensive women's health and wellness infrastructure for female residents and travelers: (1) OB-GYN and women's health: Bangkok's international hospitals (Bumrungrad, Samitivej, Bangkok Hospital, BNH) have English-speaking OB-GYN departments with international-quality care at significantly lower prices than Western countries; HPV vaccine (Gardasil 9) costs approximately ฿4,500–6,500 per injection series in Bangkok vs. US$600+ in the US; (2) Bangkok spa culture: Thai traditional massage and beauty treatments are extensively available and legitimate professional services (not conflated with adult entertainment); reputable Thai massage parlors employ female therapists and have professional certificates displayed; Wat Pho Thai Traditional Massage School is the most reputable; (3) Feminine hygiene products: all Bangkok pharmacies, 7-Eleven, and supermarkets carry comprehensive feminine hygiene product selections (Kotex, Sofy, Carefree brands widely available); menstrual cup brands (DivaCup, Lunette) available at Boots Pharmacy and health food stores; (4) Mental health resources: Bangkok's international medical infrastructure includes English-language mental health professionals; Bumrungrad Hospital has a psychiatric department with English-speaking psychiatrists; Expat women's networks maintain referral lists for therapists experienced with expat-specific stress and transition; (5) Abortion law (context for travelers): Thailand passed legislation in 2021 allowing abortion up to 12 weeks; this is relevant context for medical emergencies — the existing law change removed previous near-total prohibition; resources including international clinics in Bangkok are available through Marie Stopes International's Thailand contact.",
    action: "Bumrungrad Hospital women's health (bumrungrad.com): English language appointments, OB-GYN, and women's wellness programs; Samitivej Sukhumvit women's center; Boots Pharmacy Bangkok (most BTS stations) for health products; Wat Pho Traditional Massage School for certified legitimate massage.",
  },
  {
    title: "Female-Led Thailand — Local Women's Culture & Community",
    emoji: "👩",
    summary: "Understanding Thai women's social roles and the female expat community in Bangkok enriches the experience: (1) Thai women in business: Thai women have historically held prominent business and commercial roles in Thai society; the perception of Thai culture as male-dominated underestimates the economic and family decision-making authority of Thai women; in many traditional Thai businesses (market stalls, small retail, food production), women are primary operators; (2) Thai feminist movement: Thailand's feminist movement, while less visible internationally than Western movements, has been active since the 1970s; the Anjaree Foundation (1986) focused on lesbian and women's rights; contemporary Thai feminist activism is active on social media (particularly Twitter/X) around issues including the abortion law reform, domestic violence legislation, and political representation; (3) Bangkok's expat women's community: the Bangkok expat women's community has multiple organized groups; Bangkok Ladies Circle and InternNations women's networking events provide entry points for female expats building Bangkok social networks; professional women's networks in specific industries (finance, legal, NGO) are also established; (4) Women-owned restaurants and businesses: Bangkok's food scene includes notable women-owned and women-operated businesses; the fine dining sector has several prominent female chefs and restaurant operators; the market and home-food delivery sectors (particularly during COVID expansion) are dominated by female food entrepreneurs; (5) Thai women's fashion and beauty standards: Thailand's beauty industry is enormous and heavily influences self-presentation norms; skin whitening products (whitening cosmetics, vitamin supplements marketed for skin-brightening) are mainstream; understanding these products in cultural context (historical association of lighter skin with higher class) helps interpret Bangkok's beauty retail landscape without imposing external judgments.",
    action: "InternNations Bangkok (internations.org) women's events; Bangkok Expat Women Facebook group (search directly — name varies); Bumrungrad Hospital's comprehensive women's health department; Anjaree Foundation historical archives for Thai women's rights history; Pridi Phanomyong Institute for contemporary Thai feminist scholarship.",
  },
];

export function BangkokFemaleTraveler() {
  return (
    <div className="rounded-2xl border border-pink-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-pink-700 mb-3">
        👩 Bangkok for women — solo travel safety, health resources & female expat community
      </h2>
      <div className="space-y-1.5">
        {TOPICS.map((t) => (
          <details key={t.title} className="border border-pink-100 rounded-xl">
            <summary className="px-3 py-2 cursor-pointer font-bold text-xs flex items-center gap-2">
              <span>{t.emoji}</span>
              <span>{t.title}</span>
            </summary>
            <div className="px-3 pb-3">
              <div className="text-[10px] text-[var(--fg)] leading-snug mb-1">{t.summary}</div>
              <div className="text-[10px] text-pink-700">→ {t.action}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
