const INFO = [
  {
    name: "Traditional Chinese Medicine (TCM) Clinics in Bangkok",
    emoji: "🪡",
    area: "Yaowarat (Chinatown), Silom, Sukhumvit; hospital-based TCM departments",
    price: "Acupuncture session ฿600–2,500; Full TCM consultation ฿800–3,000; Herbal formula ฿500–2,000",
    why: "Bangkok's Chinese-Thai community maintains a robust traditional Chinese medicine infrastructure — Yaowarat (Chinatown) has both traditional herb shops (selling dried herbs, roots, and preparations) and registered TCM clinics with qualified practitioners. Several Bangkok private hospitals have dedicated TCM departments (Rutnin Eye Hospital has a traditional medicine wing; some larger hospitals offer integrative medicine combining Western and TCM). Acupuncture (needle insertion at meridian points), cupping, and moxibustion are the primary treatment modalities. Bangkok's TCM practitioners often hold qualifications from Chinese universities (Beijing TCM University, Shanghai TCM University).",
    tip: "Finding reputable TCM in Bangkok: look for practitioners with certificates from Chinese universities or registration with the Thai Medical Council's Thai Traditional Medicine division. Yaowarat's established shops (in business for 20+ years with family lineage) often provide authentic quality. Hospital-based TCM departments (where practitioners are medically supervised) are the most quality-assured option for first-time visitors. What to expect: initial TCM consultation involves pulse reading, tongue inspection, and detailed health history — allow 60–90 minutes. Acupuncture sensation: the 'de qi' sensation (heaviness, warmth, or mild aching at needle sites) is normal and expected — different from Western massage.",
  },
  {
    name: "Thai Traditional Medicine & Herbal Healing",
    emoji: "🌿",
    area: "Wat Pho (traditional medicine school), Thai traditional clinics, government hospitals",
    price: "Thai traditional massage (medical) ฿400–800; Herbal compress session ฿500–1,200",
    why: "Thai traditional medicine (nuad thai, the traditional medical practice system) is distinct from Chinese traditional medicine — it has its own philosophical framework (wind, fire, water, earth elements), diagnostic methods, and treatment approaches. Wat Pho (Bangkok's most famous temple) operates a traditional medicine school that has taught Thai massage and traditional medicine for centuries. Government hospitals have Thai traditional medicine departments (free or low-cost for Thai citizens). Thai herbal medicine (using local plants — kaffir lime, galangal, turmeric, ginger, neem) has been codified in the national pharmacopoeia and has research backing for some applications.",
    tip: "Thai traditional medicine access: the Wat Pho Traditional Medical School offers treatment in addition to training — patients can receive traditional massage and therapeutic sessions from supervised student practitioners at lower rates than private clinics. Government hospital traditional medicine departments: Bangpakok 9 Hospital and several large government hospitals have departments providing affordable traditional treatment to patients. Thai herbal products: government-endorsed Thai herbal products ('Samunprai' brand) are available at pharmacies — formulations for common conditions (digestive, respiratory) made with standardized Thai herbs. For self-care: Thai herbal steam bath (using traditional herb bundles) is available at spa facilities and some traditional clinics.",
  },
  {
    name: "Integrative Medicine & Wellness Clinics",
    emoji: "💆",
    area: "Wellness clinics throughout Sukhumvit, Sathorn, and premium medical zones",
    price: "Integrative consultation ฿2,000–5,000; IV therapy ฿1,500–8,000; Functional medicine panel ฿5,000–20,000",
    why: "Bangkok's private medical sector has developed sophisticated integrative and functional medicine offerings — clinics combining Western diagnostic precision (blood panels, genetic testing, gut microbiome analysis) with alternative and complementary interventions (IV nutrient therapy, ozone therapy, acupuncture, detox protocols). The wellness clinic market in Bangkok caters primarily to health-conscious Thais and medical tourists who can access these services at significantly lower cost than equivalent Western facilities. Bumrungrad International Hospital, Bangkok Hospital, and Samitivej Hospital all have wellness/integrative medicine departments within their networks.",
    tip: "Bangkok integrative medicine navigation: the quality and evidence base of 'integrative medicine' services varies enormously — some are well-evidenced (certain IV vitamin protocols, proper functional medicine approaches) while others overlap with pseudoscience. Stick to clinics with MD-trained integrative physicians rather than standalone alternative practitioners without medical degrees. For IV therapy specifically: Bangkok's IV therapy café culture (walk-in vitamin drip clinics) has become trendy — the clinical value of most IV vitamin formulas for healthy people is low, but for specific deficiencies or recovery applications there may be benefit. Medical tourism: Bangkok's combination of low cost + high quality makes legitimate integrative medicine treatments here worth considering for overseas visitors.",
  },
];

export function BangkokAcupuncture() {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-emerald-700 mb-3">
        🪡 Traditional medicine in Bangkok — TCM acupuncture, Thai herbal healing & integrative wellness
      </h2>
      <div className="space-y-2">
        {INFO.map((i) => (
          <div key={i.name} className="border border-emerald-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{i.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{i.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{i.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{i.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{i.why}</div>
            <div className="text-[10px] text-emerald-700">💡 {i.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
