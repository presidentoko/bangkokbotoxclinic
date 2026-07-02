const TOPICS = [
  {
    title: "Thailand Work Permit & Employment Visa — Requirements, Process & DOE Rules",
    emoji: "📋",
    summary: "Working legally in Thailand requires both a Non-Immigrant B (Business) visa and a Work Permit issued by the Department of Employment: (1) The two-document requirement: unlike many countries where a single document allows both residence and work, Thailand requires: (a) Non-Immigrant B visa (allows staying in Thailand to work, issued by Thai embassies abroad or immigration office), AND (b) Work Permit (permits actual work activities, issued by Department of Employment in Bangkok); having only one document is illegal; tourist visas and tourist exemptions explicitly prohibit work; (2) Work Permit application process: employer (Thai or BOI-registered company) must apply for the work permit on behalf of the employee; requirements include: employer company registration, employee education certificates, police clearance, medical certificate, passport-size photos, application fee; the process typically takes 3–10 business days at the Department of Employment (Mitmaitri Road, Din Daeng, Bangkok); (3) BOI companies and simplified process: companies with BOI promotional privileges have a simplified work permit process through the BOI One Stop Service Center (Chamchuri Square, Bangkok); BOI-promoted companies can obtain work permits and visas simultaneously in one location in significantly shorter time; (4) Minimum employee ratio: Thai labor law generally requires Thai employees to foreign employee ratio (typically 4 Thai employees per 1 foreign work permit); BOI and SEZ companies have different ratios; companies must maintain this ratio to retain their foreign employees' work permit eligibility; (5) Restricted occupations: Thailand maintains a list of occupations restricted to Thai nationals (approximately 39 categories including: manual unskilled labor, agriculture, ceramics, goldsmithing, hair dressing, guide for domestic tours, and others); foreigners are prohibited from working in these categories even with a work permit; IT, management, engineering, education, and professional services are generally open.",
    action: "Department of Employment Bangkok (Mitmaitri Road, Din Daeng, Bangkok, DOE.go.th) for work permit application; BOI One Stop Service Center (Chamchuri Square, Pathumwan) for BOI-promoted company applications; TLTA (Thailand Long-Term Residents and Expat Association) for community guidance; legal/immigration law firms in Bangkok (Sunbelt Legal Advisors, Thai Law House) for complex situations; BOI website (boi.go.th) for BOI privilege verification and SMART Visa program for tech/senior experts.",
  },
  {
    title: "Thailand SMART Visa & LTR Visa — New Long-Stay Pathways for Professionals",
    emoji: "🪪",
    summary: "Thailand has introduced new visa categories for high-value international residents that differ from the traditional B-visa/work permit path: (1) SMART Visa: Thailand's SMART Visa (introduced 2018, BOI-administered) provides 4-year multiple entry visas with no work permit required in target industries; categories: SMART-T (Talent, 5+ years specialized experience in S-curve industries), SMART-I (Investor, minimum ฿20M investment in target industries), SMART-E (Executive, c-suite position at BOI-promoted company), SMART-S (Startup, with NSTDA/NIA endorsement); eligibility requirements are specific and verified by BOI; (2) Long-Term Resident (LTR) Visa: Thailand's LTR Visa (introduced 2022) provides 10-year visa + work authorization for qualifying foreigners; four LTR categories: Wealthy Global Citizen (minimum $1M assets + $80k annual income or $500k Thai investment), Wealthy Pensioner (minimum 50 years old + $80k pension income or $250k Thai investment), Work-from-Thailand Professional (minimum $80k annual income, company in established country), Highly Skilled Professional (minimum $80k income OR $40k income with accepted credentials); (3) LTR vs. traditional process benefits: LTR visa holders get: 10-year renewable visa, work authorization without separate work permit for Work-from-Thailand professionals, 17% flat personal income tax rate (vs. progressive rates up to 35%), customs exemption for household goods, 5 fast-track airport services; (4) Digital Nomad Reality vs. LTR Visa: the LTR Work-from-Thailand Professional requires minimum $80k/year income — well above typical digital nomad income; lower-income remote workers remain in the grey zone of tourist visa renewals; (5) Elite Visa (Thailand Privilege): the Thailand Privilege Card (formerly Thailand Elite) provides 5–20 year membership with multiple-entry non-immigrant visa; Entry E Visa (5 years, ฿900,000) through Gold Membership (20 years, ฿2,000,000) provide long stays without income requirement but no automatic work authorization.",
    action: "BOI SMART Visa application (smartvisa.boi.go.th) for SMART visa program; EEC office (eeco.or.th) for EEC special visa provisions; Thailand Board of Investment One Stop Service (Chamchuri Square) for SMART visa evaluation; Thailand Privilege Card (thailandprivilege.com) for Elite Visa membership; LTR Visa Office (ltr.boi.go.th) for Long-Term Resident Visa details and application; immigration lawyers: check current visa programs as Thailand's visa policies update regularly.",
  },
  {
    title: "Bangkok Retirement Visa & Long-Stay Thailand — Non-Immigrant O-A Requirements",
    emoji: "🏠",
    summary: "Thailand's retirement visa (Non-Immigrant O-A) allows foreigners aged 50+ to reside in Thailand for 1-year renewable periods: (1) Retirement visa eligibility: minimum age 50 years; no criminal record in Thailand or home country; health insurance coverage meeting minimum requirements (currently ฿40,000 outpatient and ฿400,000 inpatient minimum); no contagious disease; (2) Financial requirements: must show one of three financial proofs: (a) ฿800,000 deposited in Thai bank (must remain for 3 months before and 3 months after renewal); (b) pension/income ฿65,000+/month from abroad; (c) combination ฿800,000 bank + income totaling ฿800,000 annually; requirements have evolved and must be verified against current immigration rules; (3) Bangkok Immigration Bureau: the main Bangkok Immigration bureau (Chaeng Wattana Government Complex, Northern Bangkok) handles visa extensions; arriving prepared with complete documents reduces wait; online appointment booking available; (4) 90-day reporting: all foreigners in Thailand on long-stay visas must report to immigration every 90 days (TM30 report); the 90-day report can be done in person at immigration, by mail, or via the Thailand Immigration app; failure to report results in fines (฿2,000); (5) Retirement visa practical reality: Thailand's retirement visa program is one of Asia's most accessible long-term stay programs at its financial threshold; the ฿800,000 deposit requirement represents approximately USD $22,000 held in a Thai bank; this relatively accessible requirement has attracted large expat retirement communities in Chiang Mai, Hua Hin, Pattaya, and Phuket; Bangkok itself is a less common retirement destination due to cost of living but remains a choice for urban-preference retirees.",
    action: "Bangkok Immigration Bureau (Chaeng Wattana, Building B, Gate 3 — take BTS to Mo Chit then taxi); Thailand Immigration website (immigration.go.th) for current O-A requirements; Thai bank account opening: Kasikorn (KBank) and Bangkok Bank have English-language service for foreign account opening; health insurance for O-A: Pacific Cross, AXA Thailand, Cigna Thailand offer O-A-compliant health insurance; expat community resources: Internations Bangkok, Facebook expat groups for current practical experience.",
  },
];

export function BangkokWorkPermit() {
  return (
    <div className="rounded-2xl border border-blue-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-blue-700 mb-3">
        📋 Bangkok legal residency — work permits, SMART/LTR visas & retirement O-A requirements
      </div>
      <div className="space-y-1.5">
        {TOPICS.map((t) => (
          <details key={t.title} className="border border-blue-100 rounded-xl">
            <summary className="px-3 py-2 cursor-pointer font-bold text-xs flex items-center gap-2">
              <span>{t.emoji}</span>
              <span>{t.title}</span>
            </summary>
            <div className="px-3 pb-3">
              <div className="text-[10px] text-[var(--fg)] leading-snug mb-1">{t.summary}</div>
              <div className="text-[10px] text-blue-700">→ {t.action}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
