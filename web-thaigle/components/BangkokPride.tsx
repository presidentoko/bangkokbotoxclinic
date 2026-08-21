const INFO = [
  {
    name: "Bangkok Pride — Annual Pride Parade & Festival",
    emoji: "🌈",
    area: "Silom Road (main); venues across Silom-Patpong-Surawong area",
    price: "Parade: free; Festival events: ฿200–1,000",
    why: "Bangkok Pride has established itself as Southeast Asia's largest LGBTQ+ pride celebration — the parade along Silom Road draws tens of thousands of participants and spectators. Thailand's cultural attitude toward gender and sexuality has historically been among the most accepting in Asia — the visibility of kathoey (ladyboys) in mainstream Thai society predates Western LGBTQ+ movements. Bangkok Pride events (Pride Week includes film screenings, drag performances, community events) reflect a genuine Thai LGBTQ+ community celebration rather than primarily tourist-facing marketing. The legal context: same-sex marriage legislation passed Thailand's parliament in 2024, making Thailand a Southeast Asian pioneer.",
    tip: "Bangkok Pride timing: typically held in May/June — check the Bangkok Pride Facebook page for exact dates (the date shifts annually). The Silom Road parade starts at Si Lom intersection — arrive by 4pm for good viewing positions. The after-party venue cluster (Silom Soi 2, 4, and the DJ Station area) has pre-parade events from early afternoon. Silom's Rainbow Hotel block is Bangkok Pride's unofficial hospitality center. The surrounding neighborhood is LGBTQ+-friendly year-round — Bangkok Pride is the concentrated celebration of a more diffuse ongoing community.",
  },
  {
    name: "Silom Soi 2 & 4 — Bangkok's LGBTQ+ Heartland",
    emoji: "🏳️",
    area: "Silom Soi 2 and Soi 4, Bangkok (BTS Sala Daeng)",
    price: "Bar cover ฿0–200; Drinks ฿150–350",
    why: "Silom Soi 2 and Soi 4 form Bangkok's primary LGBTQ+ entertainment district — a concentrated block of gay bars, drag venues, clubs, and restaurants that functions as a genuine community space year-round. The DJ Station (Soi 2) is Bangkok's most famous LGBTQ+ nightclub, operating for decades as a landmark. Telephone Bar and G Bangkok are institutions with long histories. The broader Silom area — extending to Patpong and Surawong — has numerous LGBTQ+-owned businesses beyond just nightlife. The area's openness and safety is well-established.",
    tip: "Silom Soi 2/4 practical: the district comes alive from 9pm; the peak is midnight–2am. Cover charges are generally low or none before midnight. The crowd is genuinely mixed — Thai locals, Thai-Chinese community, expats, and tourists. Drag shows at the main venues (check schedules posted at doors) are high-production. The street food options between the bars (grilled squid, tom yum at street stalls) are excellent — Bangkok's universal rule that street food is better than restaurant food applies even in the entertainment district.",
  },
  {
    name: "Bangkok LGBTQ+ Community & Support",
    emoji: "💙",
    area: "Community centers, online groups, various Bangkok venues",
    price: "Community events: free–฿300",
    why: "Beyond nightlife, Bangkok has a substantive LGBTQ+ community infrastructure — Rainbow Sky Association of Thailand (HIV prevention and LGBTQ+ community support), APCOM (Asia Pacific Coalition on Male Sexual Health), and multiple LGBTQ+-affirming religious and secular community organizations. For expats relocating to Bangkok, the established LGBTQ+ expat community provides both social connection and practical support. Thailand's social acceptance doesn't translate to full legal equality (despite the 2024 marriage equality legislation) — workplace discrimination protections remain limited.",
    tip: "LGBTQ+-affirming resources in Bangkok: International Health Care (IHC) clinic on Sukhumvit is widely used by the LGBTQ+ community for PrEP, PEP, and sexual health services. Rainbow Sky Association provides community programming and counseling. For social connection: the 'Bangkok LGBTQ Expats' and 'Gay Bangkok' Facebook groups are active. Transgender healthcare (a significant medical tourism driver) — Bangkok Hospital has a comprehensive gender clinic, and several private clinics specialize in gender-affirming procedures for both local and international patients.",
  },
];

export function BangkokPride() {
  return (
    <div className="rounded-2xl border border-purple-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-purple-700 mb-3">
        🌈 Bangkok Pride & LGBTQ+ scene — Silom parade, Soi 2/4 bars & community resources
      </h2>
      <div className="space-y-2">
        {INFO.map((i) => (
          <div key={i.name} className="border border-purple-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{i.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{i.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{i.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{i.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{i.why}</div>
            <div className="text-[10px] text-purple-700">💡 {i.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
