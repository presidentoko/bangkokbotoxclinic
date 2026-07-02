const TOPICS = [
  {
    title: "Sanuk — The Thai Philosophy of Fun",
    emoji: "😊",
    summary: "'Sanuk' (สนุก) — fun, enjoyment, playfulness — is one of Thai culture's most central values. Activities should be sanuk; work should be approached with sanuk; even serious endeavors become easier when sanuk is found.",
    action: "Understanding sanuk in Bangkok life: (1) Sanuk is why Thai colleagues make their workplace feel light despite serious work — finding enjoyment in the task rather than grimly persisting is valued; (2) Sanuk explains Thai humor: Thai humor tends toward playful teasing, wordplay (Thai has many homophones making puns easy), and physical comedy — Thai people are generally delighted by unexpected moments of absurdity; (3) For visitors: approaching Bangkok activities with a sanuk mindset — accepting the unexpected, laughing at minor inconveniences, finding the enjoyment in waiting, in getting slightly lost, in miscommunication — creates dramatically better experiences than frustration-focused problem-solving; (4) The sanuk-work balance: Thai work culture has evolved significantly, particularly among younger urban Thais, but the core preference for sanuk workplace culture (team events, celebrations, decorating the office for festivals) remains distinctive compared to East Asian work cultures that are more austerity-oriented.",
  },
  {
    title: "Kreng Jai — Thai Conflict Avoidance",
    emoji: "🙏",
    summary: "'Kreng jai' (เกรงใจ) is the cultural value of avoiding burdening others, not causing discomfort, and preserving another's feelings — central to understanding Thai communication patterns that can confuse foreign visitors.",
    action: "Practical kreng jai guide for Bangkok: (1) The Thai 'yes' that means 'maybe' or 'no': a Thai person may agree to something to avoid the discomfort of declining — interpreting all Thai agreements as confirmations rather than possibilities leads to miscommunication; follow up with specific logistics questions to verify actual commitment; (2) Why Thai people don't complain about poor service to the staff: making a staff member feel bad about their mistake violates kreng jai — complaints happen indirectly (to managers later, in reviews) rather than directly to the individual; (3) Why street food vendors add extra garnish without asking: anticipating your needs before you have to ask (and thus burden them with a request) is kreng jai in action; (4) How to benefit from understanding kreng jai: acknowledge when you impose on someone, express appreciation explicitly, and give Thai counterparts easy 'face-saving' exits from difficult situations — 'perhaps this time doesn't work; maybe another time?' creates a comfortable exit that preserves the relationship.",
  },
  {
    title: "Saving Face — Naam Jai & Thai Dignity",
    emoji: "😌",
    summary: "Thai social life is organized significantly around the concept of face (hnaa, หน้า) — maintaining dignity, avoiding public embarrassment, and preserving social harmony through careful management of public perception.",
    action: "Bangkok face culture practical guide: (1) Public confrontation creates face loss for both parties — raising your voice, pointing fingers, or demanding acknowledgment of fault in public are all face-damaging. Business disputes, service complaints, and interpersonal conflicts are best handled quietly and privately; (2) The smile in adversity: a Thai person who maintains a smile during a stressful situation is not being dismissive — the smile is a face-preserving mechanism that maintains composure and indicates the situation hasn't destroyed equanimity; (3) Naam jai (น้ำใจ) — 'water of the heart' — the complementary Thai value of generous giving and consideration. Bangkok residents who go significantly out of their way to help a lost tourist without expectation of reward are expressing naam jai; (4) Gifts and face: gift-giving in Bangkok professional contexts follows elaborate face-maintaining protocols — gifts are given and often not opened immediately (opening in front of the giver creates potential awkward face-loss situations); quality of gift matters relative to relationship.",
  },
  {
    title: "Wai — The Thai Greeting & Respect System",
    emoji: "🙏",
    summary: "The wai (ไหว้) — hands pressed together, slight bow — is Thailand's greeting gesture carrying layers of meaning about social hierarchy, respect, and acknowledgment.",
    action: "Wai etiquette for Bangkok visitors: (1) The basic wai: palms together at chest height, slight bow of head — appropriate for general greeting in most formal and semi-formal contexts; (2) The height matters: higher wai (hands near forehead) shows deeper respect — appropriate for monks, elderly people, and royalty; lower wai (chest height) is standard social greeting; (3) As a foreigner: you will frequently receive wais from service staff, hotel employees, and in formal situations — returning a wai (even imperfectly) is deeply appreciated and shows cultural awareness; not returning is considered somewhat rude; (4) When NOT to wai: young children, service staff doing their job (acknowledge their wai but you don't need to return it in every transaction context), and strangers in casual urban settings don't typically require a formal wai exchange; (5) The service wai: Bangkok's hospitality industry trains staff to wai as a service gesture — these are appreciated but needn't create a wai exchange; a smile and slight nod acknowledges it appropriately; (6) Common mistake: touching an elder or monk before they have indicated such contact is welcome is disrespectful — the wai maintains respectful distance while expressing deep greeting.",
  },
];

export function BangkokThaiCulture() {
  return (
    <div className="rounded-2xl border border-yellow-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-yellow-700 mb-3">
        🙏 Thai culture decoded — sanuk, kreng jai, saving face & the wai greeting
      </div>
      <div className="space-y-1">
        {TOPICS.map((t) => (
          <details key={t.title} className="border border-yellow-100 rounded-xl">
            <summary className="cursor-pointer p-3 flex items-center gap-2">
              <span className="text-xl">{t.emoji}</span>
              <span className="font-bold text-xs flex-1">{t.title}</span>
              <span className="text-[10px] text-[var(--muted)] shrink-0">{t.summary.slice(0, 60)}…</span>
            </summary>
            <div className="px-3 pb-3 text-[10px] text-[var(--fg)] leading-snug border-t border-yellow-50 pt-2">
              {t.summary}
              <div className="mt-1 text-yellow-700">▶ {t.action}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
