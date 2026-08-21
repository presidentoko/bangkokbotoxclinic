const TOPICS = [
  {
    title: "Medical Weight Loss & Bariatric Surgery in Bangkok",
    emoji: "⚕️",
    summary: "Bangkok's international hospitals offer comprehensive medical weight management from supervised diet programs through laparoscopic bariatric surgery: (1) Bariatric surgery types available: sleeve gastrectomy (stomach sleeve reduction — most common), Roux-en-Y gastric bypass, laparoscopic adjustable gastric banding, and mini-gastric bypass; (2) Cost advantage: sleeve gastrectomy at Bangkok international hospitals runs ฿250,000–400,000 (approximately USD 7,000–11,000); comparable procedures in the USA run $15,000–25,000 and in Australia $20,000–30,000 out-of-pocket; (3) Surgeon qualifications: Thai bariatric surgeons who trained in Australia, USA, or Europe operate within international hospital accreditation frameworks (JCI certification); (4) Medical weight management programs: before bariatric surgery, Bangkok's hospitals offer supervised VLCD (very low calorie diet) programs, GLP-1 agonist prescribing (semaglutide/Ozempic, liraglutide/Victoza), and comprehensive metabolic workups; (5) Post-surgery support: Bangkok's bariatric programs include dietitian follow-up, psychological support, and telemedicine post-operative monitoring for international patients who return home. Pricing: bariatric consultation ฿2,000–5,000; full pre-operative workup ฿15,000–30,000; sleeve gastrectomy ฿250,000–400,000 all-inclusive.",
    action: "Bangkok bariatric resources: Bumrungrad Bariatric Center, Bangkok Hospital Bariatric Surgery Unit, Samitivej Weight Management Center — all accept international patients with pre-operative virtual consultation.",
  },
  {
    title: "Bangkok Body Contouring & Non-Surgical Slimming",
    emoji: "💊",
    summary: "Non-surgical body contouring treatments are extensively available at Bangkok's aesthetic clinics at prices 50–70% below Western equivalents: (1) CoolSculpting (cryolipolysis): fat freezing using controlled cooling; widely available at Bangkok aesthetic clinics; ฿5,000–15,000 per treatment area vs. $700–1,500 in USA; (2) HIFU (High-Intensity Focused Ultrasound): Ultherapy and generic HIFU for both skin lifting and body contouring; ฿8,000–25,000 per session; (3) Emsculpt and similar: electromagnetic muscle stimulation for body sculpting (simultaneously builds muscle and reduces fat); ฿8,000–20,000 per session; (4) Radiofrequency body contouring: BodyTite, Morpheus8, Thermage Body — radiofrequency for fat reduction and skin tightening; ฿6,000–20,000; (5) Lipodissolve injections: phosphatidylcholine/deoxycholic acid injections for localized fat dissolution; ฿5,000–15,000 per session; (6) IV cocktails for weight management: Bangkok wellness clinics offer weight management IV protocols (L-carnitine, alpha lipoic acid, B vitamins, fat-burning cocktails); ฿2,000–6,000 per session.",
    action: "Bangkok body contouring clinics: APEX Medical Center (multiple branches), Absolute Beauty Clinic, Better Skin Bangkok, and medical spa chains throughout Sukhumvit — most offer same-week or same-day appointments.",
  },
  {
    title: "Bangkok Fitness, Nutrition & Wellness Weight Management",
    emoji: "🥗",
    summary: "Beyond medical procedures, Bangkok's wellness ecosystem offers comprehensive active weight management support: (1) Muay Thai as weight loss: Muay Thai training at Bangkok gyms is one of the most effective sustained calorie-burn activities available; a serious 2-hour Muay Thai session burns 800–1,200 calories; training 5x/week while in Bangkok creates measurable results within 2–3 weeks; (2) CrossFit Bangkok: an active CrossFit community with multiple boxes (CrossFit Tha Ko, CrossFit Bangkok, CrossFit Suphan) offering drop-in classes; (3) Personalized nutrition consultation: Bangkok's international hospitals have clinical dietitians who speak English and provide evidence-based nutrition therapy; private nutrition practices in Sukhumvit offer more accessible one-on-one consultations; (4) Detox and cleanse programs: Bangkok has multiple residential and day-retreat formats for supervised cleansing programs (juice fasting, raw food programs, colonic hydrotherapy combined with diet); (5) Thai food as weight management tool: traditional Thai cooking is relatively low in saturated fat, high in vegetables, and moderate in protein; working with a Thai cooking school to understand the principles of Thai home cooking provides a sustainable dietary approach that works with Bangkok's incredible food environment.",
    action: "Bangkok active weight management: Fairtex Muay Thai gym (Bangplee) for serious training, GX Thailand for personalized nutrition consultation, and raw food and juice cleanse retreats accessible from Bangkok (Koh Samui, Koh Phangan) for structured detox programs.",
  },
  {
    title: "GLP-1 Medications & Bangkok Pharmacy Access",
    emoji: "💉",
    summary: "Bangkok's pharmacy system provides access to GLP-1 agonist medications (Ozempic/semaglutide, Victoza/liraglutide, Trulicity/dulaglutide) under prescription that may be more accessible or competitively priced than in the visitor's home country: (1) Prescription requirement: GLP-1 medications require a prescription from a licensed Thai physician; Bangkok's international hospitals, private clinics, and even some mall-based GP clinics can provide consultations and prescriptions after appropriate medical assessment; (2) Ozempic pricing in Bangkok: Ozempic 0.5mg pens (4 doses) in Thailand retail at approximately ฿3,000–5,000 versus USD $800–1,000 in USA without insurance; (3) Ozempic availability: global semaglutide supply constraints have periodically affected Bangkok availability as they have worldwide; checking current stock at Bumrungrad's pharmacy or major Bangkok pharmacies before the visit is advisable; (4) Prescription transfer: Thai prescriptions are issued by Thai physicians; medications purchased in Thailand carry no automatic recognition for continuing prescriptions in the visitor's home country; planning refill supply or continuing care before departure is the visitor's responsibility; (5) Legitimate medical assessment: taking GLP-1 medications without appropriate medical supervision (including cardiac assessment, contraindication review, and dose titration guidance) carries genuine risk; Bangkok's easy prescription access should be matched with genuine medical consultation rather than used to bypass appropriate oversight.",
    action: "Bangkok GLP-1 access: Bumrungrad International Pharmacy (reliable stock, English service), Bangkok Hospital Pharmacy, private weight management clinics in Sukhumvit — all require physician consultation before prescription.",
  },
];

export function BangkokWeightLoss() {
  return (
    <div className="rounded-2xl border border-teal-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-teal-700 mb-3">
        ⚕️ Bangkok weight management — bariatric surgery, body contouring, nutrition & GLP-1
      </h2>
      <div className="space-y-1.5">
        {TOPICS.map((t) => (
          <details key={t.title} className="border border-teal-100 rounded-xl">
            <summary className="px-3 py-2 cursor-pointer font-bold text-xs flex items-center gap-2">
              <span>{t.emoji}</span>
              <span>{t.title}</span>
            </summary>
            <div className="px-3 pb-3">
              <div className="text-[10px] text-[var(--fg)] leading-snug mb-1">{t.summary}</div>
              <div className="text-[10px] text-teal-700">→ {t.action}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
