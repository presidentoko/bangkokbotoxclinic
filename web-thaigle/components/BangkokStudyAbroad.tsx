const TOPICS = [
  {
    title: "Studying in Bangkok — International Universities & Degree Programs",
    emoji: "🎓",
    summary: "Bangkok offers English-language degree programs at internationally recognized universities: (1) Major Thai universities with English programs: Chulalongkorn University (Thailand's oldest and most prestigious; international programs in business, economics, Thai studies); Thammasat University (political science, law, international affairs — historically progressive); Mahidol University (international college MUIC; also strong in health sciences); Asian Institute of Technology (AIT, Pathum Thani near Bangkok; graduate engineering and technology — ABET accredited); Assumption University (ABAC — private, English-medium, large international student body); Bangkok University International College (BUIC); (2) International exchange programs: Bangkok is a popular study abroad destination for exchange programs through university partnerships (Chulalongkorn, Thammasat, Mahidol accept international exchange students from partner universities in Europe, US, Australia, Japan, Korea); credit transfer and course equivalency is managed between partner institutions; (3) Short programs: summer programs, winter programs, and semester-abroad programs specifically designed for international students are offered by CIEE Bangkok, AIFS Bangkok, and direct university programs; these typically run 4–8 weeks with intensive cultural and language programming; (4) Thai language programs at university level: Chulalongkorn University's Thai Language Institute offers intensive Thai language study programs (8-week intensives and semester-long programs) for foreigners; certificate programs are available for non-degree-seeking students; (5) Tuition ranges: public university semester fees for international students (Chulalongkorn, Thammasat): ฿50,000–150,000 per semester; private university fees (ABAC, Bangkok University): ฿80,000–200,000 per semester; AIT graduate program tuition: approximately US$3,000–6,000 per semester.",
    action: "Chulalongkorn University International Programs (inter.chula.ac.th); Thammasat University International Programs (tu.ac.th/en/international); Mahidol University International College (muic.mahidol.ac.th); Asian Institute of Technology (ait.ac.th); CIEE Bangkok programs (ciee.org/study-abroad/thailand); StudyLink Thailand for scholarship opportunities.",
  },
  {
    title: "Bangkok as Study Base — Libraries, Cafés & Study Culture",
    emoji: "📚",
    summary: "Bangkok has excellent infrastructure for studying and working independently: (1) University libraries for public access: Chulalongkorn University Library (Central Library) is one of Southeast Asia's largest academic libraries; day access passes for non-students are available at some branches; Thammasat University's Pridi Banomyong Library on the riverside campus is architecturally significant; National Library of Thailand (Samsen Road, near Thewet) holds the national collection; (2) Study café culture: Bangkok's café culture is deeply compatible with extended studying; many cafés operate explicitly as study spaces (with generous table time, power outlets, WiFi, and quiet policies); Ekkamai, Ari, and Tha Phra Chan (near Thammasat) concentrations of study-friendly cafés have become identifiable subcultural spaces; (3) Co-working for students: Bangkok's co-working spaces (HUBBA, Glowfish, Mango) offer day passes (฿200–400) that include high-speed WiFi, printing, and professional desk infrastructure; better than café environments for serious focus work; (4) Bookshops for English-language material: Kinokuniya (Siam Paragon, EmQuartier) is Bangkok's best English-language bookshop; B2S (Central chain bookshop) has English-language sections; Asia Books (in multiple malls) specializes in English-language books for Bangkok's expat and tourist market; (5) Study groups and academic community: Bangkok's university campuses have active student association networks; international students connecting with Thai university student organizations (through university international office introduction) access peer study networks and campus social infrastructure.",
    action: "Chulalongkorn Central Library public access: check library.car.chula.ac.th; HUBBA co-working (hubba.co); Kinokuniya Bangkok (kinokuniya.co.th); National Library of Thailand (nlt.go.th); study café recommendations: ask at your university's international student office for current student-recommended study spots.",
  },
  {
    title: "Thai Language Learning in Bangkok — Courses, Apps & Immersion",
    emoji: "🇹🇭",
    summary: "Learning Thai while in Bangkok is uniquely accessible through formal courses and immersion opportunities: (1) Formal Thai language schools: Chulalongkorn University Language Institute (most academically respected), AUA Language Center (American University Alumni — long established), NLC Language School (Thong Lo area), Walen Language School (Sukhumvit) — multiple levels from zero-beginner to advanced reading; (2) Thai script literacy: Thai script (44 consonants, 32 vowels, 5 tones, and associated tone rules) is learnable but requires deliberate study; most tourist-level Thai speakers skip script literacy; learning to read Thai opens understanding of signage, menus, and communication with Thai-language digital platforms; (3) Apps and online resources: Duolingo (basic Thai), Ling App (Thai focus), Thai Romanization tools, Learning Thai Alphabet (beginner), Anki with Thai vocabulary decks, and YouTube channels (Thai with Grace, Thai Pod 101) supplement formal class learning; (4) Language exchange with Thai students: Bangkok's university communities regularly organize Thai-foreign language exchange programs (Thai student practices English, foreign student practices Thai); university international offices and apps like HelloTalk or Tandem facilitate language exchange partner matching; (5) Daily life immersion: Bangkok provides constant Thai language immersion opportunities; ordering at street food stalls, communicating with taxi drivers (who mostly speak minimal English), shopping at local markets (not tourist markets), and watching Thai TV create natural language acquisition contexts beyond classroom learning.",
    action: "AUA Language Center Bangkok (auathailand.org); Chulalongkorn University Language Institute (culi.chula.ac.th) for intensive Thai; Walen Thai Language School (walen.com); Thai with Grace (YouTube, beginner Thai); Ling App (ling-app.com/learn-thai) for self-study; HelloTalk (hellotalk.com) for language exchange partners.",
  },
];

export function BangkokStudyAbroad() {
  return (
    <div className="rounded-2xl border border-violet-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-violet-700 mb-3">
        🎓 Studying in Bangkok — international universities, study cafes & Thai language learning
      </h2>
      <div className="space-y-1.5">
        {TOPICS.map((t) => (
          <details key={t.title} className="border border-violet-100 rounded-xl">
            <summary className="px-3 py-2 cursor-pointer font-bold text-xs flex items-center gap-2">
              <span>{t.emoji}</span>
              <span>{t.title}</span>
            </summary>
            <div className="px-3 pb-3">
              <div className="text-[10px] text-[var(--fg)] leading-snug mb-1">{t.summary}</div>
              <div className="text-[10px] text-violet-700">→ {t.action}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
