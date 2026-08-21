const TOPICS = [
  {
    title: "Bangkok Mid-Range Budget Planning (฿3,000–7,000/day)",
    emoji: "💰",
    summary: "A mid-range Bangkok travel budget of ฿3,000–7,000 per day (approximately $85–200 USD) unlocks quality accommodation, good restaurant dining, paid activities, and comfortable transport without the compromises of budget travel or the excess of luxury.",
    action: "Mid-range Bangkok budget allocation framework: (1) Accommodation: ฿1,200–2,500/night covers boutique hotels, well-reviewed 3-star properties with pool, and serviced apartments in central locations (Sukhumvit Soi 1–30, Silom, Sathorn); properties like Citadines Apart'hotel, Eastin Hotel, and Riva Surya represent excellent quality-to-price; (2) Food budget: ฿600–1,500/day covers: street food and casual Thai meals (฿60–150 per dish), mid-range restaurant dinners at quality Thai, Japanese, or international restaurants (฿250–600 per meal), and occasional higher-end dining experiences; (3) Transport: ฿200–400/day using BTS/MRT for main movement plus occasional Grab cars for non-rail routes — avoids the premium of hotel taxis without the hassle of tuk-tuk negotiation; (4) Activities: ฿300–1,500/day covers museum admissions (฿100–300), cooking classes (฿1,200–2,500 for half-day), cooking tours, or boat trips; (5) Shopping budget: highly variable but setting a daily shopping allocation (฿0–2,000) prevents uncontrolled Chatuchak/mall spending; (6) Total realism check: a couple traveling mid-range in Bangkok can live comfortably for ฿7,000–14,000/day combined — one of the world's great value destinations at this tier.",
  },
  {
    title: "Bangkok 7-Day Itinerary — Mid-Range Traveler",
    emoji: "📅",
    summary: "A 7-day Bangkok mid-range itinerary that balances major sights, neighborhood exploration, day trips, food experiences, and cultural depth without rushing or overspending.",
    action: "7-day Bangkok mid-range itinerary framework: (1) Day 1 — Arrival & Sukhumvit orientation: settle into hotel, evening exploration of Sukhumvit nightlife and street food scene; (2) Day 2 — Grand Palace & Historic Bangkok: morning Grand Palace and Wat Phra Kaew, afternoon Wat Pho, evening rooftop bar at a central hotel for panoramic views; (3) Day 3 — Chatuchak Weekend (if Saturday/Sunday) or Cultural Bangkok: Chatuchak Weekend Market (Saturday/Sunday), Jim Thompson House (weekdays), afternoon at the National Museum; (4) Day 4 — Chinatown & Riverside: morning Yaowarat, afternoon Charoenkrung Creative District, Mandarin Oriental Afternoon Tea (splurge option) or riverfront cafés; (5) Day 5 — Day trip: Ayutthaya by train (full day, trains ฿15–20 each way) or Amphawa Floating Market (weekend market); (6) Day 6 — Modern Bangkok: weekend morning yoga class, brunch at a Thonglor café, afternoon MoCA (Museum of Contemporary Art), evening Asiatique Riverfront; (7) Day 7 — Personal interest day: spa morning (Thai massage ฿300–800 for 2 hours), final shopping, airport departure; (Adjust for actual arrival day of week around Chatuchak's Sat/Sun schedule.)",
  },
  {
    title: "Bangkok Accommodation Zones — Value Assessment",
    emoji: "🏨",
    summary: "Bangkok's different neighborhoods offer dramatically different accommodation value — understanding which zone fits your travel style prevents paying Sukhumvit premium for a trip that would benefit from Silom proximity, or vice versa.",
    action: "Bangkok accommodation zone guide: (1) Sukhumvit (Soi 1–30): Bangkok's most international area; excellent restaurant, nightlife, and shopping access; BTS from Nana through Asok to Thonglor; premium for location; best for first-timers who want convenience; (2) Sukhumvit (Soi 31–71): quieter, increasingly residential; still good BTS access; Thonglor (Soi 55) and Ekamai (Soi 63) have excellent café and restaurant scenes; often 20–30% cheaper than inner Sukhumvit for equivalent quality; (3) Silom/Sathorn: Bangkok's financial district; quieter at weekends, excellent weekday energy; BTS Sala Daeng / MRT Silom; best access to Lumphini Park; good value for business or long-stay; (4) Historic/Riverside (Rattanakosin Island): proximity to Grand Palace, Wat Pho, Wat Arun; limited accommodation options (mostly boutique/heritage hotels); quieter nightlife; best for cultural immersion focus travelers; (5) Pratunam/Ratchaprasong: central shopping focus (Siam, Central World, Pratunam Market); good for shoppers; not the best food or cultural scene; (6) Ari/Phahonyothin: increasing popularity with Bangkok food enthusiasts; residential neighborhood feel; slightly removed from tourist sites; excellent value and neighborhood character.",
  },
  {
    title: "Bangkok Tipping Culture & Hidden Costs",
    emoji: "💸",
    summary: "Bangkok has no mandatory tipping culture — but understanding service charges, hidden costs, and the situations where tipping is appreciated prevents both underpaying service workers and getting overcharged.",
    action: "Bangkok tipping and cost transparency guide: (1) Restaurant service charge: most mid-range and upscale Bangkok restaurants add a 10% service charge and 7% VAT to bills automatically — the printed menu price plus 17% is the actual cost; (2) Street food and casual: no tipping expected; the prices are already correct; rounding up to nearest ฿10 on small transactions is fine but not required; (3) Massage tip: genuine tip at traditional massage shops (฿50–100 per hour is appreciated, ฿100–200 for exceptional service); tourist-area massage shops often expect more; (4) Taxi and ride-hail: no tip expected on metered taxis or Grab; if a taxi goes significantly out of their way or helps with luggage, a ฿20–50 tip is generous; (5) Hidden hotel costs: most Bangkok hotels now charge 10% service + 7% VAT at the point of billing; room rates advertised as 'net' include these charges; rates without these charges will add 17% — confirming which price type applies before booking prevents bill shock; (6) ATM fees: each Bangkok ATM withdrawal from a foreign card incurs a ฿220 international fee (set by Thai banks, not your bank) plus your bank's own international fee — minimizing withdrawals and using credit cards where accepted reduces costs; (7) Airport transfer premium: taxi from Suvarnabhumi involves: meter + ฿50 airport surcharge + expressway tolls (฿55–75 each) — total typically ฿300–450 to central Bangkok.",
  },
];

export function BangkokMidrangePlanning() {
  return (
    <div className="rounded-2xl border border-green-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-green-700 mb-3">
        💰 Bangkok mid-range travel planning — budget, itinerary & accommodation guide
      </h2>
      <div className="space-y-1">
        {TOPICS.map((t) => (
          <details key={t.title} className="border border-green-100 rounded-xl">
            <summary className="cursor-pointer p-3 flex items-center gap-2">
              <span className="text-xl">{t.emoji}</span>
              <span className="font-bold text-xs flex-1">{t.title}</span>
              <span className="text-[10px] text-[var(--muted)] shrink-0">{t.summary.slice(0, 60)}…</span>
            </summary>
            <div className="px-3 pb-3 text-[10px] text-[var(--fg)] leading-snug border-t border-green-50 pt-2">
              {t.summary}
              <div className="mt-1 text-green-700">▶ {t.action}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
