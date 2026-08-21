const TOPICS = [
  {
    title: "Annual Health Checkup Packages — What to Expect",
    emoji: "🏥",
    summary: "Bangkok's private hospitals offer comprehensive annual health checkup packages covering blood panels, ECG, chest X-ray, urine analysis, abdominal ultrasound, and specialist consultations. Package prices: basic (฿2,000–5,000), comprehensive (฿8,000–20,000), executive (฿25,000–50,000+). These are significantly cheaper than equivalent packages in the US, UK, or Singapore while using the same technology and often the same laboratory equipment brands.",
    action: "Recommended Bangkok hospitals for health checkups: Bumrungrad International (most international patient experience, full specialist teams), Bangkok Hospital (large network, JCI accredited), Vejthani Hospital (strong cardiology and oncology packages), Samitivej (family-focused, good pediatric packages). Book checkups online or by phone — packages can be customized by adding specialist consultations (dermatologist, ophthalmologist, gynecologist). Fasting 8–12 hours before blood draw required for most packages.",
  },
  {
    title: "Cancer Screening — Specialized Clinics & Technology",
    emoji: "🔬",
    summary: "Bangkok's top hospitals have invested heavily in cancer screening technology — PET-CT scanners, 3T MRI, digital mammography, and genetic testing (BRCA, hereditary cancer panels) are available at internationally competitive price points. Some Thailand-specific screenings are worth adding: liver cancer screening (hepatocellular carcinoma — high risk in SE Asia due to hepatitis B prevalence), cervical cancer (HPV testing), and colorectal cancer.",
    action: "Cancer screening centers: Bumrungrad's Horizon Regional Cancer Center, Bangkok Hospital's Cancer Center (Rama 9), Vejthani Hospital's Oncology Department. For comprehensive cancer screening packages (including PET-CT full body): factor ฿30,000–80,000. Genetic counseling with BRCA or hereditary cancer panels: ฿15,000–40,000. Health tourism note: foreigners often combine Bangkok health checkups with a Thailand holiday — hospital international departments have experience coordinating multi-day checkup schedules around travel plans.",
  },
  {
    title: "Dental Checkup & Preventive Care",
    emoji: "🦷",
    summary: "Bangkok's dental infrastructure for preventive care is excellent and cost-effective — cleaning, X-rays, and full dental examination at premium dental chains run ฿1,000–3,000 (vs. ฿5,000–15,000+ in Western countries for equivalent care). Several Bangkok dental chains have international accreditation and use the same materials and equipment as high-end US/European practices.",
    action: "Recommended Bangkok dental clinics: Thantakit International Dental Center (large multi-specialty practice, English-speaking staff), Bangkok Smile Dental (multiple Sukhumvit locations), Dental Hospital Bangkok (near Asok, comprehensive). For health tourism planning: dental treatment requiring multiple appointments is a common Bangkok health tourism driver — scaling/cleaning/whitening can be completed in one visit while more complex work (implants, orthodontics) requires multiple visits spread over days.",
  },
];

export function BangkokMedicalCheckup() {
  return (
    <div className="rounded-2xl border border-sky-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-sky-700 mb-3">
        🏥 Medical checkup in Bangkok — health packages, cancer screening & dental care
      </h2>
      <div className="space-y-2">
        {TOPICS.map((t) => (
          <details key={t.title} className="border border-sky-100 rounded-xl p-3 group">
            <summary className="flex items-center gap-2 cursor-pointer list-none">
              <span className="text-xl shrink-0">{t.emoji}</span>
              <span className="font-bold text-xs flex-1">{t.title}</span>
              <span className="text-[10px] text-sky-400 group-open:hidden">▼ expand</span>
              <span className="text-[10px] text-sky-400 hidden group-open:inline">▲ collapse</span>
            </summary>
            <div className="mt-2 space-y-1">
              <div className="text-[10px] text-[var(--fg)] font-medium leading-snug">{t.summary}</div>
              <div className="text-[10px] text-sky-700 leading-snug">→ {t.action}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
