const TOPICS = [
  {
    title: "Finding Work in Bangkok — Job Market for Foreigners",
    emoji: "💼",
    summary: "Bangkok's job market for foreigners has specific legal requirements and concentrated opportunities: (1) Legal work requirement: all foreigners working in Thailand require a Non-Immigrant B visa plus a valid Work Permit (ใบอนุญาตทำงาน) from the Department of Employment; working on a tourist visa or visa exemption is illegal regardless of employer or work type; penalties include fines and deportation; (2) Job categories legally open to foreigners: many professional occupations are accessible to foreigners (engineer, architect, accountant, teacher, IT professional, executive) but Thailand's Alien Work Act reserves specific occupations exclusively for Thai nationals (traditional Thai medicine, accounting for Thai companies below a certain size, tourism guide, unskilled labor); (3) Bangkok's primary foreign employer sectors: (a) English teaching: the largest employer of non-Thai nationals; international schools, private language institutes, government school programs; TEFL/CELTA certification improves salary significantly; (b) Technology and digital: Bangkok has a growing tech sector; software development, data science, UX design, digital marketing employed by Thai companies and regional MNCs; (c) Tourism and hospitality: management-level hospitality roles at international hotel chains; tour operator management; (d) Finance: banking, investment, FinTech (Kasikorn Bank's tech subsidiary, True Money, 2C2P, Agoda, Lazada); (e) Education administration: universities (NIDA, AIT, Mahidol International College) employing foreign faculty; (4) Salary expectations: English teacher (international school, licensed): ฿50,000–120,000/month; English teacher (language institute): ฿30,000–60,000/month; mid-level IT professional: ฿60,000–150,000/month; executive role (Thai company, MNC regional): ฿150,000–500,000+; (5) Work permit processing: the employer initiates work permit applications; processing takes 3–10 business days at the Department of Employment (Mitmaitri Road); both employee and employer attend the application appointment.",
    action: "Job portals: Jobthai.com (largest Thai-language job portal, filter by English/bilingual), LinkedIn Thailand, JobsDB Thailand, Indeed Thailand; English teaching specific: ajarn.com (longest-running Thailand teaching jobs board); Department of Employment (doe.go.th) for work permit information.",
  },
  {
    title: "Teaching English in Bangkok — Requirements, Schools & Salaries",
    emoji: "📚",
    summary: "English teaching is the most accessible employment path for native English speakers in Bangkok: (1) Qualification spectrum: (a) Bare minimum: native speaker, bachelor's degree (any field), no criminal record; typical starting salary at private language institute (฿30,000–40,000/month); (b) TEFL/CELTA qualified: 120-hour TEFL certificate or CELTA (the most recognized qualification); salary range ฿35,000–55,000 at language institutes; (c) Teaching credential (PGCE, B.Ed., teaching certification in home country): access to international schools at significantly higher salary; international school teachers: ฿60,000–120,000/month; (2) School types: (a) Private international schools (NIST, Bangkok Patana, ISB, SHREWSBURY, KIS): fully credentialed teachers, higher salary, benefits package (housing allowance, flights, health insurance); (b) Government Bilingual and English-Program (EP) schools: state-funded bilingual programs; mixed conditions; typically ฿30,000–45,000/month; (c) Private Thai schools with foreign teacher programs: large market, highly variable quality and conditions; typical ฿35,000–55,000/month; (d) Language institutes (Wall Street English, Bell, ECC, Pratunam English Center, individual Thai owner-operated institutes): afternoon and evening focus (students after school/work); ฿30,000–50,000/month; (3) Non-native English speakers: Thailand's work permit rules for English teachers technically require recognized English-proficient nationality; non-native speakers with high English proficiency, teaching certification, and subject expertise are increasingly employed at international schools and universities; (4) Teaching burnout factors: large class sizes in Thai government schools (30–40 students); minimal teaching support; cultural adjustment to Thai educational expectations; payment delays at some schools; the language barrier between teacher and administration in some contexts; (5) Teaching rewards: school holidays aligned with international calendar; Thai school terms (2 terms: May–September, November–March); significant holiday time; Bangkok lifestyle quality; community connection through international school networks.",
    action: "International school teaching jobs: Search.Net (search.net.th) for international school postings; Ajarn.com for comprehensive English teaching in Thailand resources and job board; CELTA Bangkok: British Council (britishcouncil.or.th/celta) offers CELTA courses; IH Bangkok (ihbangkok.com) also runs CELTA.",
  },
  {
    title: "Bangkok Business Districts & Office Culture",
    emoji: "🏙️",
    summary: "Bangkok's commercial geography and office culture shape the working experience: (1) Primary business districts: (a) Silom/Sathorn: Bangkok's traditional CBD; Thai banks, financial institutions, multinational headquarters; high concentration of law firms and professional services; densely built; (b) Sukhumvit: mixed commercial and residential; international company regional offices; tech startups; marketing and digital agencies; (c) Ratchadapisek/Ladprao: emerging secondary business district; Thai-owned companies; newer office buildings; lower rents; (d) Bang Na/East Bangkok: logistics companies, industrial-linked businesses, EEC (Eastern Economic Corridor) feeder offices; (e) Bangkapi/Ramkhamhaeng: Thai business ecosystem with lower rents; manufacturing and distribution sector offices; (2) Thai workplace hierarchy: Thai business culture has pronounced hierarchical structure; the concept of กรุณา (gruna/polite consideration) and ของขวัญ (gift relationships between superiors and subordinates) inform workplace dynamics; questioning superiors publicly or causing 'loss of face' (เสียหน้า) is extremely damaging to working relationships; direct confrontation is avoided in favor of indirect communication; (3) Business hours: standard Thai business hours are 8:30am–5:30pm or 9am–6pm; office punctuality is expected by MNCs and international companies; Thai business culture has more flexibility around exact arrival times in some traditional Thai companies; (4) Business cards: exchanging business cards (นามบัตร) with both hands or right hand while left hand supports the right arm is the respectful Thai business card exchange protocol; receiving cards with two hands and placing on the table rather than immediately pocketing shows respect; (5) Language in business: Thai language proficiency significantly enhances career advancement in Thai companies; MNC and international company offices typically operate in English; Thai language study alongside English teaching or professional work dramatically expands career options and social integration.",
    action: "Bangkok coworking spaces for career exploration: HUBBA (hubba.co), Glowfish (Sukhumvit 23), Mango (multiple Bangkok locations); LinkedIn Bangkok professional networking; Bangkok International Business Club (BritCham, AmCham Thailand) for professional networking events.",
  },
];

export function BangkokCareerJobs() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-slate-700 mb-3">
        💼 Working in Bangkok — job market for foreigners, English teaching & Thai office culture
      </h2>
      <div className="space-y-1.5">
        {TOPICS.map((t) => (
          <details key={t.title} className="border border-slate-100 rounded-xl">
            <summary className="px-3 py-2 cursor-pointer font-bold text-xs flex items-center gap-2">
              <span>{t.emoji}</span>
              <span>{t.title}</span>
            </summary>
            <div className="px-3 pb-3">
              <div className="text-[10px] text-[var(--fg)] leading-snug mb-1">{t.summary}</div>
              <div className="text-[10px] text-slate-700">→ {t.action}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
