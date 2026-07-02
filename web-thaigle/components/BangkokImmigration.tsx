const TOPICS = [
  {
    title: "Thai Visa Types & Entry Requirements for Bangkok",
    emoji: "🛂",
    summary: "Thailand's visa system for foreign visitors has multiple tiers with Bangkok as the primary processing hub: (1) Visa Exemption (visa-free): citizens of 65+ countries (US, UK, EU, Australia, Japan, South Korea, etc.) can enter Thailand visa-free for 30 days (extended to 60 days for some nationalities effective 2024); this covers the majority of international visitors; (2) Tourist Visa (TR): 60-day single-entry tourist visa requiring application at a Thai embassy/consulate in your home country; extendable once for 30 additional days at Thai immigration; (3) Thailand Elite Visa: long-term privilege visa for 5–20 year stays; requires fee payment (฿500,000–1,000,000+) through Thailand Privilege Card; used by affluent retirees and location-independent wealthy individuals; (4) LTR (Long-Term Resident) Visa: launched 2022; 10-year visa for retirees (pension income ≥US$80,000/year), work-from-Thailand professionals (remote workers with income ≥US$80,000/year), and high-potential investors; significant privileges including work authorization for self; (5) Education Visa (ED): student visa tied to enrollment at Thai language school, university, or vocational institution; used by those learning Thai or pursuing Thai university education; commonly used by long-term Bangkok residents to extend stays via Thai language school enrollment.",
    action: "Thai e-Visa system: thaievisa.go.th for online visa applications; Thailand Privilege Card: thailandprivilege.com; LTR Visa details: ltr.boi.go.th; For current visa-exemption list and policy updates (policies change frequently): thaiembassy.com or official Royal Thai Embassy website for your country.",
  },
  {
    title: "Bangkok Immigration Office — 90-Day Reports, Extensions & Visa Runs",
    emoji: "📋",
    summary: "Bangkok's immigration bureaucracy involves several recurring requirements for long-term residents: (1) Bangkok Immigration Division 1 (Chaeng Wattana Government Complex): the primary immigration processing center for Bangkok visa extensions, 90-day reports, and work permit applications; located in northern Bangkok (accessible by MRT Nonthaburi and shuttle); notoriously busy with queues; arriving at 7:30am before opening or booking specific services online reduces waiting; (2) 90-day reporting: non-immigrants on valid long-term visas must report their address to immigration every 90 days; this can be done in person, by mail (registered mail with tracking), or online through the immigration online reporting system; (3) Visa extensions: 30-day tourist visa extensions cost ฿1,900 and require the immigration form (TM.7), passport photos, and photocopies of relevant passport pages; (4) Visa runs: border crossings to extend Thailand visa-exempt status (by exiting and immediately re-entering) remain possible but Thailand has significantly tightened policy on repeat visa-exempt border crossings; border crossings by air typically receive full exemption while frequent land border crossings face increasing scrutiny; (5) Overstay consequences: overstaying a Thai visa is a serious offense; overstays are recorded in passport with fines (฿500/day, maximum ฿20,000); overstays over 90 days result in multi-year re-entry bans.",
    action: "Bangkok Immigration (Chaengwattana): imm.immigration.go.th for online 90-day reporting; arrive by 7:30am at physical office; bring all original documents plus photocopies; queue numbers issued at the door opening time.",
  },
  {
    title: "Work Permits & Digital Nomad Legal Status in Bangkok",
    emoji: "💼",
    summary: "Thailand's work permit system and the emerging digital nomad legal landscape: (1) Traditional work permit: foreigners working in Thailand legally require a Non-Immigrant B visa plus a work permit issued by the Department of Employment; the employer or Thai entity sponsors the work permit application; 4-year validity possible; restrictions on work type; (2) Digital nomad legal ambiguity: remote workers (working for companies outside Thailand, earning in foreign currency, not serving Thai clients) exist in a legal gray area; technically, working in Thailand without a work permit is illegal; practically, Thai immigration has not enforced against remote workers earning exclusively from foreign employers; (3) LTR Work-From-Thailand visa: the 2022 LTR Work-From-Thailand Professional category provides legal remote work status for qualified applicants (foreign employer, minimum income); the first Thai visa specifically designed for digital nomads; (4) SMART Visa: Thailand's SMART Visa targets high-potential digital economy, innovation, startup, and investment talent; 4-year multi-entry visa; requires endorsement from specific Thai agencies; income and qualification thresholds vary by category; (5) Thailand as digital nomad hub: Bangkok consistently ranks highly on global digital nomad indexes due to: internet infrastructure (1Gbps fiber available from ฿500/month), cost of living, coworking space abundance, and the informal tolerance of remote work.",
    action: "LTR Work-From-Thailand Visa: ltr.boi.go.th; SMART Visa: smartvisa.io; Work permit application through Department of Employment (doe.go.th); Thailand Board of Investment (boi.go.th) for investment-related visa categories.",
  },
  {
    title: "Thai Citizenship, Permanent Residency & Naturalization",
    emoji: "🇹🇭",
    summary: "The path to Thai permanent residency and citizenship for foreign residents: (1) Permanent Residency (PR): Thailand allows qualified foreign nationals to apply for permanent residency after holding a non-immigrant visa for 3 consecutive years; PR application quotas are limited (approximately 100 slots per nationality per year); income thresholds apply; the application requires documentation of continuous legal residence, tax compliance, and character references; PR holders can live in Thailand indefinitely without visa renewals; (2) Thai citizenship by naturalization: Thai citizenship by naturalization requires 10 years of permanent residency (PR), basic Thai language proficiency (tested), and application approval; the process is demanding and rarely completed by foreigners; (3) Thai citizenship through marriage: marriage to a Thai citizen does not automatically confer Thai citizenship; PR through marriage is faster (3 years continuous residence on marriage visa) but citizenship naturalization time requirements are the same; (4) Children's citizenship: children born in Thailand to at least one Thai parent acquire Thai citizenship; children born to two foreign parents (even with long-term Thai residence) do not automatically acquire Thai citizenship (statelessness risk for undocumented children of migrant workers is a significant Thailand social issue); (5) Name change for citizenship: Thai citizenship applicants traditionally adopt a Thai name; some choose to maintain their given name in Thai transliteration while adopting a Thai-compliant surname.",
    action: "Permanent residency application: Immigration Bureau Thailand (imm.immigration.go.th) — download PR application forms (TM.9); naturalization: Ministry of Interior Thailand; Siam Legal International (siamlegal.com) provides comprehensive guidance on Thai immigration pathways.",
  },
];

export function BangkokImmigration() {
  return (
    <div className="rounded-2xl border border-indigo-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-indigo-700 mb-3">
        🛂 Bangkok immigration guide — visa types, 90-day reports, work permits & PR pathways
      </div>
      <div className="space-y-1.5">
        {TOPICS.map((t) => (
          <details key={t.title} className="border border-indigo-100 rounded-xl">
            <summary className="px-3 py-2 cursor-pointer font-bold text-xs flex items-center gap-2">
              <span>{t.emoji}</span>
              <span>{t.title}</span>
            </summary>
            <div className="px-3 pb-3">
              <div className="text-[10px] text-[var(--fg)] leading-snug mb-1">{t.summary}</div>
              <div className="text-[10px] text-indigo-700">→ {t.action}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
