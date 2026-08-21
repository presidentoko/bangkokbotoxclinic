const SPOTS = [
  {
    name: "Bangkok International Schools — Overview",
    emoji: "🎓",
    area: "Throughout Bangkok — major concentrations in Sukhumvit (Nana, Asok, Ekkamai, On Nut), Sathorn, and Ari districts",
    price: "Annual tuition ฿350,000–1,200,000+ (USD 10,000–35,000); Registration fees ฿50,000–200,000; Capital levy (one-time) ฿50,000–500,000+",
    why: "Bangkok has one of Southeast Asia's most developed international school ecosystems — over 150 international schools, including flagship campuses of globally recognized institutions that make relocating families' educational transitions comparatively smooth. The major international school brands with Bangkok campuses: International School Bangkok (ISB, American curriculum), Bangkok Patana School (British IB, Bangna), NIST International School (IB, Silom), Ruamrudee International School (RIS, American/Christian), Harrow International School (British, Don Mueang), Garden International School, and Wells International School. The school market is stratified by: curriculum (American, British, IB, French, German, Singapore), fees (wide range within the international category), and community character (some schools are predominantly Western expat; others are more Thai or Asian international family-focused).",
    tip: "Bangkok international school selection process: (1) curriculum compatibility — if relocating within the same curriculum system, continuity matters for children in critical exam years (IGCSE, IB, AP, SAT); (2) location relative to residence — Bangkok traffic makes school commute time critical; many families choose residence near the chosen school rather than vice versa; (3) waiting lists — Bangkok's top schools have waiting lists that can extend 1–3 years; early application is essential; (4) language support — schools vary significantly in EAL (English as Additional Language) support for children joining mid-stream; verify this if your child is not a native English speaker. The Facebook group 'Expats in Bangkok' and school-specific parent groups provide current community feedback on schools' actual experience.",
  },
  {
    name: "Thai Schools & Bilingual Options",
    emoji: "📚",
    area: "Thai government schools (nationwide), Thai-English bilingual schools (throughout Bangkok)",
    price: "Thai government school: ฿0–50,000/year; Thai-English bilingual school: ฿80,000–350,000/year; Thai private school with English program: ฿150,000–600,000/year",
    why: "Thai schools are a realistic option for families with long-term Thailand commitments and children who have (or are developing) Thai language — or who are younger and language-adaptable. The Thai government school system is comprehensive and technically provides free education; quality varies significantly by school and location. Thai-English bilingual schools provide a middle path: half the school day in Thai, half in English, substantially lower cost than full international schools, and better Thai language and cultural integration. Private Thai schools with English programs (like the Thida chain, ABAC preparatory schools) offer more structured English exposure than government schools while maintaining Thai curriculum. For families considering long-term Thailand residence, Thai language fluency from early schooling is a significant lifetime asset.",
    tip: "Thai school practical guidance: for foreign children enrolling in Thai government schools, coordination with the Ministry of Education's expat enrollment process is required. Thai language: even 1–2 years in a Thai bilingual program gives young children Thai language foundations that are difficult to achieve later — the language window for children (approximately ages 4–10) is real. School culture differences: Thai school culture emphasizes respect for hierarchy (teachers, elders), group harmony, and rote learning approaches — these are genuinely different from Western progressive education norms. Cultural adaptation: children who attend Thai schools integrate into Thai society and friendships differently than those in exclusively expat international schools — a significant long-term consideration for families planning extended Thailand residence.",
  },
  {
    name: "Thai University System — Chula, Thammasat & AIT",
    emoji: "🏛️",
    area: "Chulalongkorn University (Phayathai), Thammasat University (Sanam Luang/Rangsit), AIT (Pathumthani), MUIC, Mahidol",
    price: "Thai public university: ฿20,000–100,000/year; International programs at Thai universities: ฿100,000–400,000/year; AIT graduate programs: ฿300,000–800,000/year (USD equivalent)",
    why: "Thailand's leading universities offer genuine international-quality education at dramatically lower cost than Western institutions — particularly at the graduate level. Chulalongkorn University (Chula) is Thailand's most prestigious and one of Asia's top 200 universities — its English-medium international programs attract students from across Asia. Thammasat University (established 1934, political significance in Thai history) has strong law, economics, and social science faculties. AIT (Asian Institute of Technology, Pathumthani province north of Bangkok) is a regional technical graduate institution with significant international student body — engineering, environment, and technology master's programs are well-regarded in the region. Mahidol University has strong medical and health science programs internationally recognized within Asia.",
    tip: "Thai university for international students: English-medium programs are expanding — MBA, master's in international relations, engineering, and other programs at Chula, Thammasat, NIDA, and Mahidol all serve international students with full English instruction. Application process: direct application to Thai universities is more straightforward than Western systems — documentation requirements focus on transcripts, language test scores (IELTS/TOEFL), and recommendation letters. Scholarship availability: Thai government scholarships for foreign students (through OHEC) and ADB/international institutional scholarships fund regional students; domestic Thai student scholarships are extensive. Research programs: Chula and Mahidol have English-language PhD programs that have attracted international researchers — particularly for Thai/Southeast Asian study topics.",
  },
];

export function BangkokInternationalSchool() {
  return (
    <div className="rounded-2xl border border-blue-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-blue-700 mb-3">
        🎓 Bangkok education guide — international schools, Thai bilingual options & universities
      </h2>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-blue-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-blue-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
