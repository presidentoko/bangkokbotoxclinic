const SCHOOLS = [
  {
    name: "Bangkok Patana School (British)",
    emoji: "🇬🇧",
    area: "Sukhumvit Soi 105 (On Nut), large campus",
    price: "Annual fees ฿680,000–920,000; Registration ฿60,000",
    why: "Bangkok's largest British international school, following the UK National Curriculum with IGCSE and A-Level pathways. Founded in 1957, serving the British expatriate community historically but now highly international (50+ nationalities). Extensive extracurricular programs including performing arts, sports academies, and Duke of Edinburgh Award. High university placement rate to UK Russell Group and US Ivy League equivalents. The most established British option in Bangkok.",
    tip: "Bangkok Patana application: register on the waitlist early (1–2 years ahead for popular year groups). The school holds assessment days for new students — these test age-appropriate English, mathematics, and reasoning. Sports facility is excellent (swimming pool, sports halls, playing fields), which matters for children who value athletics. On Nut campus location is convenient for families living along the eastern Sukhumvit line.",
  },
  {
    name: "International School Bangkok — ISB (American)",
    emoji: "🇺🇸",
    area: "Nichada Thani, Pak Kret (north Bangkok, near Don Mueang)",
    price: "Annual fees ฿800,000–1,100,000; Capital levy ฿200,000",
    why: "ISB is Thailand's premier American curriculum school — IB (International Baccalaureate) diploma programme for grades 11–12 alongside American standard curriculum for K–10. Located in Nichada Thani (gated compound with housing), many families live on-site or nearby. Strong AP program, extensive sports and arts. College placement team with strong US university relationship — high percentage of graduates attend top 50 US universities. The go-to school for American government and corporate expat families.",
    tip: "ISB location (Pak Kret, north Bangkok) means long commutes from central Bangkok — many ISB families choose to live in Nichada Thani or adjacent Nonthaburi communities. The school bus service covers most Bangkok areas. ISB's capital levy is refunded (proportionally) when leaving, which is important for families on multi-year postings. The Thai language programme is optional but strongly recommended for children who will remain in Thailand long-term.",
  },
  {
    name: "NIST International School (IB — Swiss)",
    emoji: "🌍",
    area: "Sukhumvit Soi 15, central Bangkok",
    price: "Annual fees ฿760,000–1,050,000; Enrollment ฿80,000",
    why: "NIST (New International School of Thailand) is the only school in Bangkok authorized to offer all three IB programmes (PYP, MYP, Diploma), making it the most rigorously IB-aligned school in the city. Swiss-founded with a European philosophical approach to education — emphasis on inquiry-based learning, community service (CAS), and international mindedness. Central Sukhumvit location (BTS Asok adjacent) makes it the most accessible of the major international schools for families living in Bangkok proper.",
    tip: "NIST's central location is its practical differentiator for Bangkok city-living expat families — no commute to Pak Kret or On Nut for families in Silom, Sathon, or mid-Sukhumvit. The school's MYP (Middle Years Programme) is particularly well-executed — this assessment-heavy international framework suits families intending to be internationally mobile. Waiting list applies — enquire at least one academic year ahead. The NIST community has an active Parent Association that organizes international cultural events.",
  },
  {
    name: "Wells International School & Other Options",
    emoji: "🏫",
    area: "Multiple Bangkok locations",
    price: "Annual fees ฿300,000–700,000 (more affordable bracket)",
    why: "Beyond the tier-one schools, Bangkok has multiple solid international schools at more accessible price points. Wells International (American curriculum, Sukhumvit Soi 18 and On Nut campuses) is respected for smaller class sizes and stronger Thai student integration. KIS International School (Swedish methodology), Ruamrudee International (American Catholic, Lat Prao), and Harrow International (British, Lad Prao) round out the market. Thai-bilingual international schools (Thai OBEC curriculum with heavy English supplementation) start from ฿100,000–200,000 annually.",
    tip: "School comparison advice for Bangkok expat families: visit on 'open day' events (typically August–October for January start, November–January for August/September start). Ask specifically about: teacher turnover rate (high turnover indicates management issues), university placement data (not just 'some students go to Harvard' but median outcomes), and what happens when parents disagree with school policy (governance culture). The Facebook group 'Families in Bangkok' has candid school discussions — read these alongside official marketing materials.",
  },
];

export function BangkokSchoolsGuide() {
  return (
    <div className="rounded-2xl border border-indigo-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-indigo-700 mb-3">
        🏫 International schools in Bangkok — British, American, IB options & fees guide
      </h2>
      <div className="space-y-2">
        {SCHOOLS.map((s) => (
          <div key={s.name} className="border border-indigo-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-indigo-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
