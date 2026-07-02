const TOPICS = [
  {
    title: "Thailand's Third Gender Culture — Kathoey History, Identity & Social Position",
    emoji: "🌈",
    summary: "Thailand's relationship with gender diversity is one of the most complex and distinctive in Asia, requiring nuanced understanding beyond Western LGBTQ frameworks: (1) Kathoey identity: 'kathoey' (กะเทย) is a Thai term that historically designated 'third gender' individuals born male who identify as female or take on a feminine role; Western media simplified this to 'ladyboy,' a term that is considered offensive in many contexts; modern Thai gender vocabulary is evolving with younger generations preferring terms aligned with international gender identity language (transgender woman, trans woman); (2) Thailand's gender diversity vs. formal legal status: Thailand has significant social visibility and relative acceptance of gender diversity alongside formal legal limitations; Thai law (as of 2024–2026) does not allow legal gender change on national ID documents; same-sex civil partnerships have moved toward legalization through parliamentary processes but the legal situation continues to evolve; visiting gender-diverse individuals should verify current legal status through current sources; (3) Historical and cultural context: pre-modern Thailand (and many Southeast Asian cultures influenced by Indian cosmology) recognized third-gender roles in religious contexts; Hinduism's inclusion of gender-fluid deities (Ardhanarishvara) and Ayutthaya-period court culture both incorporated gender-diverse individuals in specific social roles; this historical presence provides context for Thailand's relatively (not absolutely) open social environment; (4) Entertainment industry prominence: kathoey performers (typically in cabaret, beauty pageants, comedy, and entertainment) have high visibility in Thai media and entertainment; the annual Miss Tiffany Universe pageant (specifically for trans women) is nationally televised; the prominence is simultaneous with significant discrimination in employment and housing for trans people outside entertainment; (5) Bangkok's practical gender diversity landscape: Bangkok's diverse neighborhoods (particularly Silom, Bang Rak, and RCA area) have trans-friendly spaces; Silom Soi 4 (Bangkok's main gay bar street) includes spaces welcoming all gender expressions; the Babylon Bangkok and DJ Station (Silom area) have been long-established venues.",
    action: "Bangkok Rainbow Sky Association (BRSA) for HIV/sexual health services and community resources; Thai Trans Coalition for transgender advocacy contacts; current legal status of Thai same-sex partnerships: check recent news sources as legislation was in active development (2024–2026); gender-inclusive medical care in Bangkok: Bangkok Hospital, Bumrungrad International (gender-affirming surgery and hormone therapy available at international quality).",
  },
  {
    title: "Bangkok's Gay Nightlife — Silom Soi 4, Soi 2 & the Full LGBT Scene",
    emoji: "🏳️‍🌈",
    summary: "Bangkok has one of Southeast Asia's most visible and active gay scenes, centered on the Silom area: (1) Silom Soi 4 and Soi 2: Silom Soi 4 is Bangkok's main gay bar strip, with multiple venues including DJ Station (the largest gay club), Telephone Bar (long-running institution), and various smaller bars; Silom Soi 2 has primarily gay go-go bars; the Silom area concentration makes bar-hopping efficient; (2) DJ Station: DJ Station (Silom Soi 2) is Bangkok's most famous gay nightclub, operating since the 1990s; the venue (multiple floors, resident DJs, full nightclub format) draws both Thai and international clientele and has a strong drag performance tradition; (3) Bangkok gay scene hours: Bangkok's gay bar district (Silom area) runs roughly 10pm–2am; the area is densely concentrated and walking-accessible between venues; Grab is the most practical transport after midnight; (4) RCA and alternative venues: Royal City Avenue (RCA) has some mixed gay-inclusive spaces; the Thong Lo and Ekkamai area (younger Bangkok's nightlife hub) has mixed bars with gay-inclusive atmosphere; Bangkok's newer cocktail bars in Charoen Krung and Talad Noi area include gay-owned or gay-popular establishments; (5) Gay-specific accommodation in Bangkok: while most Bangkok hotels are gay-friendly, some specifically market to gay travelers; several boutique hotels near Silom have primarily gay clientele; the international hotel brands (InterContinental, Marriott, etc.) in Bangkok are all formally LGBTQ-inclusive in policy.",
    action: "DJ Station Bangkok (Silom Soi 2) for Bangkok's main gay club experience; Silom Soi 4 bar strip for progressive bar-hopping; Telephone Bar (Silom Soi 4) for a more relaxed atmosphere; Bangkok Pride events (typically June) for annual major events; Out BKK (Bangkok LGBTQ magazine/website) for current venue listings; Utopia Asia (utopia-asia.com) for regional gay travel guide.",
  },
  {
    title: "Bangkok Gender-Affirming Healthcare — Hospitals, Surgeons & Medical Tourism",
    emoji: "🏥",
    summary: "Bangkok is one of the world's leading destinations for gender-affirming medical procedures, drawing patients from across Asia, Europe, and North America: (1) Thailand's gender-affirming surgery global position: Thailand has the highest volume of gender-affirming surgeries globally (estimated 2,000–3,000 procedures annually), driven by trained surgeons, international cost competitiveness (60–80% below US/European equivalent), and established protocols; Bangkok hospitals have decades of experience in these procedures; (2) Leading surgical centers: Preecha Aesthetic Institute (Dr. Preecha Tiewtranon, developed several surgical techniques used internationally); Suporn Clinic (Chonburi, 130km from Bangkok, considered by many patients as the world's finest GRS surgeon); Bangkok Pattaya Hospital; Bamrungrad International; Bangkok Hospital; (3) Procedure types and costs: primary gender-affirming surgeries available in Bangkok include gender confirmation/reassignment surgery (GRS/SRS): ฿250,000–450,000; facial feminization surgery (FFS): ฿150,000–350,000; breast augmentation/mastectomy: ฿80,000–200,000; tracheal shave: ฿30,000–60,000; procedures in Thailand are significantly below Western pricing; (4) Medical tourism infrastructure: Bangkok's gender-affirming medical tourism infrastructure includes medical tourism facilitators (liaisons who coordinate between patients and hospitals), recovery guesthouses (Bangkok has guesthouses specifically serving post-surgical recovery for trans patients, particularly near Pratunam), and online patient communities (Reddit communities specific to each Bangkok surgeon with detailed patient reports); (5) Hormone therapy access in Bangkok: hormone therapy medications (estrogen, anti-androgens, testosterone) are available at Bangkok hospitals with appropriate evaluation; some Thai pharmacies sell hormone medications without prescription (not recommended without medical supervision); informed consent model hormone access at international hospitals requires medical consultation but is generally accessible for adults.",
    action: "Preecha Aesthetic Institute (pai.co.th) for GRS consultation contact; Bangkok Hospital medical tourism (bangkokhospital.com) for general gender-affirming care; Reddit communities r/Transgender_Surgeries and specific surgeon communities for patient reviews; medical facilitator services for Bangkok surgical tourism: ICIT (Intercare International) and similar services; Thai law currently requires psychological evaluation + approval before certain procedures: verify current requirements with specific hospitals.",
  },
];

export function BangkokGenderDiversity() {
  return (
    <div className="rounded-2xl border border-pink-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-pink-700 mb-3">
        🌈 Bangkok gender diversity — kathoey culture, gay nightlife & gender-affirming healthcare
      </div>
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
