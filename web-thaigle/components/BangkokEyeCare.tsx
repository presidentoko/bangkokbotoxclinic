const SPOTS = [
  {
    name: "LASIK & Refractive Eye Surgery Bangkok",
    emoji: "👁️",
    area: "TRSC International LASIK Center (Asok), Rutnin Eye Hospital (Asok), Bangkok Eye Clinic (multiple locations), BDMS Wellness Clinic (Wireless Road), hospital-based eye surgery departments at major international hospitals",
    price: "LASIK consultation: ฿500–1,500; Conventional LASIK: ฿25,000–40,000 both eyes; Premium LASIK (Femto/SMILE): ฿45,000–80,000 both eyes; PRK: ฿20,000–35,000 both eyes; Comprehensive eye examination: ฿1,500–5,000",
    why: "Bangkok is one of Asia's premier LASIK and refractive surgery destinations — combining internationally trained ophthalmologists with equipment identical to what's used in the US/Europe, pricing at approximately 50–70% of Western costs, and deep surgical volume that produces excellent outcomes. Thailand's ophthalmology sector has developed extensive expertise: Rutnin Eye Hospital (established 1967) is one of Southeast Asia's most respected dedicated eye hospitals; TRSC International LASIK Center performs thousands of procedures annually with outcomes data publicly reported. The full spectrum of refractive procedures is available: conventional LASIK, femtosecond LASIK (all-laser, bladeless), LASEK/PRK (surface ablation), SMILE (minimally invasive lenticule extraction), and phakic IOL (implantable collamer lens) for high prescriptions outside LASIK range. Cataract surgery with premium multifocal intraocular lenses, macular degeneration treatment, and other complex retinal procedures are also performed at international quality at Bangkok's tertiary eye centers.",
    tip: "Bangkok LASIK practical considerations: (1) Contact lens pause: removing soft contact lenses 2 weeks before LASIK consultation (and 4 weeks for rigid/toric lenses) is required for accurate corneal mapping; planning this before your Bangkok trip rather than scrambling on arrival; (2) The consultation process at reputable Bangkok LASIK centers: comprehensive pre-operative evaluation (wavefront analysis, corneal topography, pachymetry, dilated fundus exam) takes 2–3 hours; rushed evaluations with minimal testing are red flags; (3) Post-operative care: LASIK and SMILE have 24–48 hour recovery before driving/swimming; avoid water in the eyes for 2 weeks; sun protection is important in Bangkok's high-UV environment post-surgery; (4) Medical tourism timing: having surgery at the beginning of a Bangkok stay (not the last day) allows several post-operative follow-up appointments within Thailand; most reputable Bangkok LASIK centers also provide virtual follow-up if you return home; (5) Prescription glasses in Bangkok: Bangkok's optical shops (Vision Plus, Malaya Optical, and countless mall opticians) offer eyeglasses at excellent prices with rapid turnaround (same-day or next-day for standard prescriptions).",
  },
  {
    name: "Bangkok Eyewear & Optical Shopping",
    emoji: "🕶️",
    area: "Malaya Optical (Sukhumvit), Vision Plus (widespread mall locations), Optical88 (widespread), specialty frame boutiques in Thonglor and Ari, luxury eyewear in Siam Paragon and Emporium, Chatuchak market independent optical vendors",
    price: "Comprehensive eye exam: ฿500–1,500; Standard prescription glasses (frame + lens): ฿800–2,500; Progressive/varifocal glasses: ฿3,000–8,000; Premium designer frames: ฿3,000–20,000+; Contact lens trial pack: ฿300–800; Monthly contact supply: ฿500–2,000",
    why: "Bangkok's optical market offers quality eyewear at prices significantly below Western markets — a standard frames-and-lenses pair at a reputable Bangkok optician costs what a budget option costs in the UK or US. The market spans: (1) Mall-based chains (Vision Plus, Malaya Optical, Optical88) — professional optometrist examination, quality lenses from major manufacturers (Nikon, Zeiss, Essilor), and certified frame brands; (2) Independent boutiques — particularly in Thonglor and Ari neighborhoods, increasingly stocking independent eyewear designers from Japan, Korea, and Europe alongside mainstream brands; (3) Chatuchak market optical — lower-price options with shorter consultation processes; (4) Luxury optical — Siam Paragon's level 1 has dedicated spaces for high-end frame brands (Lindberg, Kering group brands, Japanese premium labels). Same-day lens preparation is possible for simple prescriptions at major optical chains; progressive/varifocal lenses typically take 3–7 days.",
    tip: "Bangkok optical shopping practical guide: (1) Bring your prescription: if you have a recent prescription from home, Bangkok opticians can fill it directly; if not, a comprehensive eye examination at the optician is required first; (2) Anti-reflective coating: insist on AR coating for any prescription glasses ordered in Bangkok — the humid, air-conditioned, high-glare Bangkok environment makes AR coating particularly valuable; (3) UV 400 sunglasses: Bangkok's intense UV environment makes quality UV protection in sunglasses genuinely health-relevant rather than marketing; checking for authentic UV 400 certification (not just 'UV protection') matters; (4) Contact lens verification: bring your contact lens brand, power, base curve, and diameter specifications for easy reordering in Bangkok; most international brands (Acuvue, Bausch+Lomb, Air Optix) are available; (5) Speed tip: standard single-vision prescription lenses can be ready in 1–2 hours at mall opticians in major shopping centers; if time-constrained, mentioning urgency upfront allows the optician to manage expectations.",
  },
  {
    name: "Traditional Thai Eye Care & Vision Wellness",
    emoji: "🌿",
    area: "Traditional massage parlors offering eye massage and head massage (nationwide), eye acupressure services at Wat Pho traditional massage school, herbal eye treatment at spa and wellness centers",
    price: "Traditional eye/head massage (30 min): ฿200–500; Full face and eye acupressure: ฿400–800; Herbal eye compress treatment: ฿300–600; Reflexology with eye-point focus: ฿250–500",
    why: "Thai traditional medicine includes several practices specifically associated with eye care and vision health — drawing from Ayurvedic, traditional Chinese medicine, and distinctly Thai folk healing traditions. Traditional eye massage (focusing on the orbital area, temples, and supraorbital pressure points) is believed in traditional Thai medicine to reduce eye strain, improve circulation around the eyes, and address headache associated with vision fatigue. With Bangkok's population spending increasing screen time, demand for eye strain relief has grown the eye-wellness segment within Bangkok's traditional massage sector. Wat Pho's traditional massage school (one of Thailand's most respected traditional medicine institutions) includes eye acupressure points in its comprehensive traditional massage curriculum. Herbal eye compresses — herb-infused compress applied around closed eyes — provide gentle aromatic steaming that practitioners claim improves eye circulation and reduces inflammation.",
    tip: "Traditional eye care context for visitors: (1) These traditional practices should not substitute for optometric eye care for actual vision problems, infections, or medical eye conditions; they serve as relaxation and wellness practices; (2) Eye massage contraindications: active eye infections, recent eye surgery (including LASIK — minimum 6-week wait), glaucoma, retinal detachment, or any active eye condition — consult with your ophthalmologist before eye massage; (3) Wat Pho massage school: Wat Pho's traditional massage school (within the temple complex) offers genuine Thai traditional massage at student and professional level — one of Bangkok's most authentic experiences; (4) The head massage connection: many traditional Thai head massages (which address the entire scalp, temples, neck, and face) include the orbital pressure points as part of the full protocol — this provides some of the eye acupressure benefits within a broader session; (5) Screen-fatigue context: Bangkok's digital nomad community has developed its own informal eye care protocols (20-20-20 rule: every 20 minutes, look at something 20 feet away for 20 seconds) that complement traditional Thai eye relaxation practices.",
  },
];

export function BangkokEyeCare() {
  return (
    <div className="rounded-2xl border border-blue-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-blue-700 mb-3">
        👁️ Bangkok eye care — LASIK surgery, optical shopping & vision wellness
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-blue-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-blue-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
