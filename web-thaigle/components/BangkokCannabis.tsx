const TOPICS = [
  {
    title: "Thailand Cannabis Law — Current Status (2026)",
    emoji: "⚖️",
    summary: "Thailand's cannabis legal status has been in flux since the landmark 2022 decriminalization (removal from the narcotics schedule), which allowed medical and personal use within specific parameters. As of 2026, Thailand's cannabis regulatory framework remains under active legislative review — the Thai government has been working to restrict recreational use to medical and wellness contexts following concerns about the proliferation of cannabis dispensaries and recreational use by tourists in the 2022–2025 period. The legal situation for foreign nationals (tourists and expatriates) requires real-time verification before any cannabis consumption — the regulatory environment is genuinely dynamic and this summary may not reflect current law at time of reading. Consulting authoritative current sources (official Thai government announcements, established news outlets) before any cannabis-related activity is essential.",
    action: "For travelers seeking current status: check the Thai FDA website and recent news (Bangkok Post, Coconuts Bangkok) for the most current regulatory information. The important legal reality regardless of current retail status: cannabis consumption must only occur in designated legal contexts; public consumption has remained restricted throughout the regulatory changes. For medical users from abroad: Thailand has developed medical cannabis programs — consult with a Thai-licensed physician for any medical cannabis needs. The key principle for foreigners: being a tourist does not grant any special protections from Thai drug law — penalties for violations of narcotics laws in Thailand are among the most serious in Southeast Asia.",
  },
  {
    title: "Medical Cannabis & Wellness in Bangkok",
    emoji: "🏥",
    summary: "Bangkok has developed significant medical cannabis infrastructure following Thailand's 2022 policy shift. Licensed medical cannabis clinics and pharmacies operated under proper authorization have provided access to cannabis-derived medical products (CBD oil, THC medications for specific conditions) through proper physician consultation channels. Bangkok's wellness sector incorporated CBD products into spa treatments, restaurants, and wellness services in the 2022–2025 period. The key distinction from a regulatory standpoint: medical cannabis accessed through licensed healthcare providers with proper physician consultation versus recreational cannabis consumption — the former has been explicitly supported under Thai law; the latter has been subject to ongoing restriction and potential re-criminalization efforts.",
    action: "Medical cannabis access protocol: Thai licensed physicians can prescribe cannabis-based medications for qualifying conditions. The process involves a legitimate medical consultation at a licensed cannabis clinic (available in Bangkok's international hospital ecosystem and specialized clinics). CBD products (hemp-derived, within legal THC limits) have been available at pharmacies and wellness shops. The wellness cannabis landscape: if seeking CBD-based wellness services (massage oils, spa treatments, foods), verify that the establishment is operating under proper licensing — the sector had both properly licensed businesses and grey-area operators during the 2022–2025 expansion period.",
  },
  {
    title: "What Foreigners Need to Know",
    emoji: "✈️",
    summary: "Thailand's international reputation as a country with severe penalties for drug offenses remains a critical context even during periods of cannabis regulatory liberalization. The Thai Criminal Code's narcotics provisions carry penalties that range from fines and brief detention for minor possession to multi-year imprisonment or death penalty for trafficking — the distinction between personal possession and trafficking is not always clearly defined and enforcement is at the discretion of individual officers. The 2022 decriminalization did not eliminate all legal risk associated with cannabis use; it modified the scheduling, not the entire enforcement framework. Foreign nationals who have been arrested in Thailand for drug offenses have experienced legal processes that are expensive, lengthy, and in worst cases, permanently life-altering.",
    action: "Essential guidance for foreign nationals: (1) Verify current legal status before any activity — law changes can occur without public fanfare; (2) Never transport cannabis across Thailand's borders — regardless of domestic status, border crossing with cannabis remains a serious criminal offense; (3) Never purchase from unlicensed sources — street-level cannabis sales may involve police entrapment or criminal actors; (4) Any arrest for any drug offense in Thailand requires immediate contact with your country's embassy — consular assistance is your first call; (5) Travel insurance does not typically cover drug-related legal situations. The risk-adjusted advice for uncertain situations: abstain until you have verified current legal status from authoritative sources.",
  },
];

export function BangkokCannabis() {
  return (
    <div className="rounded-2xl border border-green-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-green-700 mb-3">
        ⚖️ Cannabis in Thailand — legal status guide, medical access & what foreigners need to know
      </h2>
      <div className="space-y-2">
        {TOPICS.map((t) => (
          <details key={t.title} className="border border-green-100 rounded-xl p-3 group">
            <summary className="flex items-center gap-2 cursor-pointer list-none">
              <span className="text-lg">{t.emoji}</span>
              <span className="font-bold text-xs flex-1">{t.title}</span>
              <span className="text-[10px] text-green-400 group-open:hidden">▼ expand</span>
              <span className="text-[10px] text-green-400 hidden group-open:inline">▲ collapse</span>
            </summary>
            <div className="mt-2 space-y-1">
              <div className="text-[10px] text-[var(--fg)] font-medium leading-snug">{t.summary}</div>
              <div className="text-[10px] text-green-700 leading-snug">→ {t.action}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
