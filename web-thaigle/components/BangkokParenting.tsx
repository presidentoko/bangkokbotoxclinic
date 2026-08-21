const TOPICS = [
  {
    title: "International Schools in Bangkok",
    emoji: "🏫",
    summary: "Bangkok has over 40 accredited international schools covering British, American, IB, French, German, and Japanese curricula. Annual tuition ranges from ฿200,000 (Thai-bilingual) to ฿1,000,000+ (top-tier British/American schools). Waiting lists at premium schools can be 1–2 years long.",
    action: "Top international schools: Bangkok Patana (British, Sukhumvit), ISB (American, Bangna), NIST (IB, Silom), Ruamrudee International (American, Lad Prao). Apply 1–2 years before your target start date if possible. Most schools run on academic years: British (September start), American (August start), Thai (May start). Assessment interviews for children vary by school — typically language proficiency and academic readiness tests.",
  },
  {
    title: "Healthcare for Children",
    emoji: "👶",
    summary: "Bangkok's private hospitals have dedicated pediatric departments staffed by pediatricians who trained internationally. Vaccinations follow WHO schedule. Expat children have access to the same standard of care as adult expat healthcare.",
    action: "Pediatric-focused hospitals: Samitivej Sriracha (close to international school belt), Bangkok Hospital's children's wing, Bumrungrad International. Health insurance for children: add-on to parent policy or separate children's policy. Typical Bangkok child vaccination schedule is identical to UK/US schedule — some additional vaccines recommended for Southeast Asia (Japanese Encephalitis, Typhoid). Get IPHO (International Pediatric Health Organization) certified pediatrician if available.",
  },
  {
    title: "Activities for Expat Children",
    emoji: "🎠",
    summary: "Bangkok has extensive child activity infrastructure: playgrounds in expat neighborhoods, swimming lessons (most condos have pools), martial arts, international sports leagues (BISAC community sports), coding classes, and creative arts programs.",
    action: "Community resources: BAMBI (Bangkok Mothers and Babies International) — oldest expat mothers' support organization in Bangkok. BISAC (Bangkok International Sports Association for Children) — weekend league sports for children of all nationalities. Facebook groups: 'Expat Mums Bangkok' and 'Families in Bangkok' have the most current activity listings. International churches (Immanuel Church, Bangkok Christian Church) have English-language children's programs.",
  },
];

export function BangkokParenting() {
  return (
    <div className="rounded-2xl border border-blue-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-blue-700 mb-3">
        👶 Expat parenting in Bangkok — international schools, children's healthcare & activities
      </h2>
      <div className="space-y-2">
        {TOPICS.map((t) => (
          <details key={t.title} className="border border-blue-100 rounded-xl p-3 group">
            <summary className="flex items-center gap-2 cursor-pointer list-none">
              <span className="text-xl shrink-0">{t.emoji}</span>
              <span className="font-bold text-xs flex-1">{t.title}</span>
              <span className="text-[10px] text-blue-400 group-open:hidden">▼ expand</span>
              <span className="text-[10px] text-blue-400 hidden group-open:inline">▲ collapse</span>
            </summary>
            <div className="mt-2 space-y-1">
              <div className="text-[10px] text-[var(--fg)] font-medium leading-snug">{t.summary}</div>
              <div className="text-[10px] text-blue-700 leading-snug">→ {t.action}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
