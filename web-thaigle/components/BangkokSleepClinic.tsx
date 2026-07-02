const TOPICS = [
  {
    title: "Sleep Disorder Diagnosis & Treatment in Bangkok",
    emoji: "😴",
    summary: "Bangkok's international hospitals offer comprehensive sleep medicine through dedicated sleep centers that match or exceed what's available in most Western countries. Bangkok sleep medicine services: (1) Polysomnography (sleep study): full overnight monitoring in hotel-style private rooms at Bumrungrad, Samitivej, and Bangkok Hospital sleep centers; the diagnostic rooms are designed to approximate home sleeping conditions while capturing full neurological, respiratory, and movement data; (2) Obstructive sleep apnea (OSA) diagnosis and CPAP titration: Thailand's high-humidity climate and specific anatomical risk factors in certain Asian populations have created strong local clinical experience with OSA; Bangkok sleep doctors are experienced with OSA presentations across diverse populations; (3) Insomnia treatment: cognitive behavioral therapy for insomnia (CBT-I, the evidence-based gold standard) is available from psychologists at Bangkok's international hospitals and private mental health clinics; medication management is also available; (4) Narcolepsy and parasomnias: specialist-level assessment for complex sleep disorders; (5) Pediatric sleep medicine: children's sleep disorder assessment at hospitals with pediatric subspecialty departments. Pricing: sleep study (polysomnography) at Bangkok international hospital ฿15,000–35,000; CPAP equipment purchase: ฿12,000–35,000; sleep consultation: ฿2,000–5,000.",
    action: "Bangkok sleep centers: Bumrungrad Sleep Center (Sukhumvit Soi 3), Samitivej Sleep Center (Sukhumvit 49), Bangkok Hospital Sleep Center, and Sleep Doctor Thailand for outpatient specialist consultation.",
  },
  {
    title: "Bangkok's 24-Hour City & Jet Lag Recovery",
    emoji: "🌙",
    summary: "Bangkok's 24-hour city character (BTS Skytrain until midnight, night markets, late-night restaurants, late-night pharmacies, 7-Eleven every 200 meters) creates both jet lag risk and recovery resources: (1) Jet lag challenge: Bangkok time (ICT, UTC+7) means travelers from Europe face 6–7 hour ahead adjustment; from West Coast USA a nearly 180-degree time shift; from East Asia the adjustment is smallest; (2) Light therapy approach: Bangkok's strong natural light (sunrise approximately 6am year-round) provides potent morning light cues for circadian adjustment; spending 30–60 minutes outside in early morning Bangkok light on days 1–2 of arrival strongly accelerates adaptation to Bangkok time; (3) Bangkok pharmacies for jet lag support: 7-Eleven and Boots Pharmacy branches carry melatonin supplements (available over the counter in Thailand at 0.5mg–3mg doses) that support circadian adjustment; (4) Sleep-helpful Bangkok neighborhoods: the quietest Bangkok hotel neighborhoods for actual sleeping are Sathorn (business district, less nightlife noise), Silom northern section, and Sukhumvit Soi 20–30 range; the most noise-affected areas are Sukhumvit Soi 11, Nana, and Patpong adjacents; (5) Bangkok massage for sleep: traditional Thai massage's parasympathetic nervous system activation (the 'rest and digest' relaxation response) creates genuine physiological preparation for sleep; an early evening Thai massage in Bangkok helps establish a sleep-positive end-of-day rhythm.",
    action: "Jet lag in Bangkok: prioritize morning outdoor exposure, take melatonin 0.5–1mg 30 minutes before intended sleep time for the first 2–3 nights, and use Thailand's accessible massage culture as a sleep preparation ritual.",
  },
  {
    title: "Bangkok Insomnia & Sleep Optimization Resources",
    emoji: "🛌",
    summary: "Bangkok's health and wellness culture provides multiple approaches to sleep optimization: (1) Traditional Thai medicine for sleep: traditional Thai pharmacies carry herbal preparations historically associated with sleep support — valerian root, passionflower, and distinctly Thai herbs like krachai dam (black ginger) that are traditionally classified as toning and calming; (2) Sleep-optimizing massage approaches: Nuad Rachsamnak (Royal Thai Massage) emphasizes long, flowing techniques that promote deep relaxation; some Bangkok wellness centers offer specific 'sleep massage' programs designed as bedtime preparation; (3) Yoga Nidra and meditation: Bangkok has active meditation center and yoga studio communities that offer Yoga Nidra ('yogic sleep' — a deeply relaxing guided meditation between wakefulness and sleep) and meditation practices with established sleep benefit evidence; (4) Blue light considerations in Bangkok: Bangkok's 24-hour screen-lit environment (ubiquitous phone use, bright LED signage, night markets) creates significant blue light exposure that disrupts melatonin production; Bangkok pharmacies sell blue light blocking glasses at ฿300–1,500; (5) Sleep-friendly accommodation selection: Bangkok hotels vary enormously in noise and light control; requesting a high-floor room, asking about window insulation, and selecting properties in quieter sois significantly affect sleep quality.",
    action: "Bangkok sleep optimization: book high-floor rooms in quieter sois, schedule traditional Thai massage at 7–8pm before intended bedtime, purchase melatonin at any Boots or Watsons pharmacy, and explore meditation at Bangkok's Dhamma meditation centers.",
  },
  {
    title: "CPAP Equipment & Sleep Supplies in Bangkok",
    emoji: "🔧",
    summary: "Bangkok is one of the best-supplied cities in Asia for CPAP (Continuous Positive Airway Pressure) and sleep medicine equipment — useful both for traveling patients who need CPAP supplies and for those considering purchasing equipment in Bangkok at competitive prices: (1) CPAP machine purchase: standard CPAP and APAP machines from major brands (ResMed, Philips Respironics, BMC Medical) are available at Bangkok medical equipment suppliers and international hospital sleep center medical shops at prices 20–40% below US retail (typical auto-CPAP: ฿15,000–25,000); (2) CPAP mask availability: most standard CPAP mask types and sizes (nasal pillow, nasal, full face) from ResMed and other brands are stocked at Bangkok CPAP suppliers; specialized or uncommon masks may require ordering; (3) Adapters and voltage: Thailand uses 220V/50Hz with Type A, B, and C outlets; most CPAP machines are automatically dual-voltage (100–240V) but checking the power supply label before travel is essential; (4) CPAP accessories: filters, tubing, humidifier water chambers, and mask cushion replacements are available at Bangkok's sleep equipment suppliers and online at Thai retail; (5) CPAP travel: Thailand's high humidity means the humidifier in a CPAP machine may require lower settings than home use; distilled water for humidifier use is available at 7-Eleven and pharmacies throughout Bangkok.",
    action: "CPAP in Bangkok: Thai CPAP Center (Nonthaburi, near Ngam Wong Wan), hospital medical equipment shops at Bumrungrad and Samitivej, and Lazada Thailand for accessories and replacement parts with fast Bangkok delivery.",
  },
];

export function BangkokSleepClinic() {
  return (
    <div className="rounded-2xl border border-indigo-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-indigo-700 mb-3">
        😴 Bangkok sleep medicine — sleep studies, jet lag recovery & CPAP equipment
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
