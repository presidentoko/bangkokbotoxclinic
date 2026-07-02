const SPOTS = [
  {
    name: "Bangkok Aesthetic Clinics — Skin & Face Treatments",
    emoji: "✨",
    area: "Aesthetic clinics throughout Bangkok — concentration in Sukhumvit (Thong Lor, Phrom Phong), Silom medical district, premium hospitals",
    price: "Botox (per unit): ฿100–300; Filler (per syringe): ฿8,000–25,000; Laser treatment (full face): ฿3,000–15,000; Skin booster (Juvederm/Restylane): ฿6,000–15,000; Thread lift: ฿15,000–50,000",
    why: "Bangkok is one of the world's leading medical aesthetics destinations — the combination of board-certified dermatologists and plastic surgeons trained at top institutions, international-standard equipment (HIFU, ultherapy, various laser platforms), competitive pricing (30–60% below comparable treatments in the US/UK/Australia), and the cultural importance of skin care in Thai society has created an exceptional aesthetic medicine market. Bangkok's aesthetic clinic density in the premium areas is remarkable: Thong Lor alone has dozens of clinics from neighborhood walk-in skin centers to flagship aesthetic hospitals. The quality differential at Bangkok's top clinics is genuine: Lelux Hospital, Vanity Aesthetic, Bangkok International Aesthetic Center, and others operate with patient safety protocols and technique quality comparable to leading Western providers. Thai medical aesthetic consumers are sophisticated — the extensive domestic market means clinicians have significantly higher procedure volumes than equivalent Western practitioners.",
    tip: "Bangkok aesthetic clinic selection guidance: (1) Board certification matters — verify the treating physician's Thai Medical Council registration and specialty board certification (dermatology or plastic surgery) through the Thai Medical Council website; (2) Consultation expectation: reputable Bangkok aesthetic clinics provide detailed consultations before recommending treatment — avoid clinics that immediately push the most expensive packages without assessment; (3) Filler brand verification: request to see the sealed filler syringe before injection — Juvederm, Restylane, Belotero, and other named brands should be verifiable; avoid unbranded or discount-priced fillers; (4) Recovery planning: some treatments (particularly laser resurfacing, deeper chemical peels) require 3–7 days of social downtime — factor this into travel timing; (5) Photographic documentation: request before/after photographs at each treatment session — this creates the comparative record for assessing results.",
  },
  {
    name: "Bangkok Facial Treatments & Facials",
    emoji: "💆",
    area: "Facial spas throughout Bangkok — standalone facial studios, day spas, aesthetic clinics with facial treatment rooms",
    price: "Basic cleansing facial ฿500–1,500; HydraFacial ฿2,500–5,000; Chemical peel ฿1,500–6,000; LED therapy ฿1,000–3,000; Microneedling ฿3,000–8,000",
    why: "Bangkok's facial treatment landscape extends from traditional spa facial treatments to medical-grade procedures available at licensed clinics. The most popular Bangkok facial treatment categories: HydraFacial (deep cleansing + serum infusion, appropriate for Bangkok's pollution and humidity effects on skin), chemical peels (AHA/BHA peels for exfoliation and brightening, glycolic acid for skin renewal), LED therapy (red/blue light for anti-inflammatory and anti-acne effects), and microneedling (collagen stimulation for skin texture and pore size). Bangkok's climate specifically — the combination of high humidity, intense UV, and air pollution (PM2.5) — creates skin challenges that the facial treatment industry is calibrated to address. The Bangkok facial spa experience is enhanced by the general service culture: attentive care, additional neck and shoulder massage often included, complimentary beverages, and genuine client relationship building.",
    tip: "Bangkok facial treatment timing: (1) Avoid aggressive facial treatments (chemical peels, laser, microneedling) immediately before outdoor events or beach trips — treatments require sun avoidance during healing; (2) HydraFacial is an excellent 'first Bangkok facial' choice — no downtime, appropriate for all skin types, and immediately visible results (skin appears dewy and refined post-treatment); (3) Series pricing: Bangkok facial studios offer significant discounts for packages (typically 5 or 10 sessions at 20–40% reduction) — evaluating whether a series matches your Bangkok stay length before committing; (4) Communication about skin goals: Bangkok aestheticians respond well to specific outcome goals ('I want less congestion' / 'I want brighter skin' / 'I want smoother texture') rather than simply booking by treatment name; (5) Test your skin's reaction: if using novel active ingredients (AHA, retinol, vitamin C serums) for the first time in Bangkok's humidity, test on a small skin area before full application.",
  },
  {
    name: "Bangkok Cosmetic Surgery Overview",
    emoji: "⚕️",
    area: "Major Bangkok hospitals with cosmetic surgery programs — Bumrungrad International, Bangkok Hospital Medical Center, Samitivej, and specialist cosmetic surgery hospitals",
    price: "Rhinoplasty: ฿60,000–250,000; Double eyelid surgery: ฿30,000–100,000; Liposuction (small area): ฿50,000–150,000; Breast augmentation: ฿80,000–250,000; Recovery accommodation: ฿1,500–8,000/night",
    why: "Bangkok is one of the world's most significant cosmetic surgery tourism destinations — the Thai Board of Plastic Surgeons trains surgeons to international standards, major Bangkok hospitals are accredited by the Joint Commission International (JCI — the global hospital quality accreditation), and procedure costs are 40–70% below equivalent pricing in the US, UK, or Australia. Bangkok cosmetic surgery specialties: rhinoplasty (Thai surgeons have exceptional technique in Asian rhinoplasty including bridge augmentation and tip refinement using cartilage techniques), double eyelid surgery (blepharoplasty — extremely high volume in Bangkok given regional demand), gender affirmation surgery (Bangkok is the world's leading destination for gender affirmation surgical care). The surgeon certification path matters: the Thai Board of Plastic Surgeons (TBPS) board certification is the relevant credential for cosmetic and reconstructive procedures.",
    tip: "Bangkok cosmetic surgery research requirements: (1) This is major medical decision territory — research surgeons directly (not through medical tourism agencies who take referral fees), verify credentials at the Thai Medical Council website, review portfolios with real patient before/after examples (not stock photos), and consult with at least 2–3 surgeons before deciding; (2) Recovery timeline reality: most cosmetic procedures require minimum 1–2 weeks Bangkok-based recovery before flying — bruising, swelling, and drain management require in-person follow-up; (3) International travel insurance: most standard travel insurance excludes elective cosmetic procedures — verify coverage specifically; (4) Post-operative complications: research the surgeon's protocols for handling complications including emergency contact, hospital admission procedures, and revision surgery policies before agreeing to proceed; (5) The genuine Bangkok advantage: the highest-quality Bangkok cosmetic surgery at accredited hospitals with board-certified surgeons is genuinely world-class — this is not a cost-cutting compromise when the right surgeon and facility are selected.",
  },
];

export function BangkokAesthetics() {
  return (
    <div className="rounded-2xl border border-pink-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-pink-700 mb-3">
        ✨ Bangkok aesthetic medicine — clinics, facial treatments & cosmetic surgery guide
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-pink-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-pink-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
