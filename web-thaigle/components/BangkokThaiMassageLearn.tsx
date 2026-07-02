const SCHOOLS = [
  {
    name: "Wat Pho Traditional Massage School",
    emoji: "🙏",
    area: "Inside Wat Pho compound (near Grand Palace)",
    price: "2-hour introduction course: ฿500, Full 5-day certification: ฿7,000–10,000",
    duration: "From 2-hour sessions to 5-day certification",
    why: "Thailand's oldest and most respected Thai massage school. Training on-site at the temple where Thai massage was systematized. Certification recognized internationally.",
    certification: "Wat Pho Traditional Medical School Certificate — accepted in many countries",
    tip: "5-day intensive: Mon–Fri 9am–6pm. Hands-on practice on real clients daily. Many students come specifically for Wat Pho certification before opening massage businesses.",
  },
  {
    name: "Health Land Massage School",
    emoji: "💆",
    area: "Asok BTS (Health Land Spa & Massage)",
    price: "2-day basic course ฿3,500, Advanced: ฿5,500",
    duration: "2–5 day courses",
    why: "Bangkok's most popular mid-range Thai massage school. Part of the reputable Health Land spa chain. Good balance of theory, technique, and practice time.",
    certification: "Health Land certificate, Thai Ministry of Education-approved",
    tip: "Good if you want to use the techniques for personal use (on family/friends) vs professional certification. Less rigorous than Wat Pho but faster and more relaxed pace.",
  },
  {
    name: "Chetawan Thai Traditional Massage School",
    emoji: "🏫",
    area: "Sukhumvit area",
    price: "30-hour foundation course ฿6,500",
    duration: "5 days × 6 hours",
    why: "Well-regarded private Thai massage school popular with foreigners. English instruction available. Smaller class sizes than Wat Pho school. Good location near BTS.",
    certification: "Ministry of Public Health-accredited certificate",
    tip: "30-hour course meets requirements for licensing in Thailand and some international jurisdictions. Follow up with 60-hour advanced course to complete full certification.",
  },
];

const STYLES = [
  "Nuad Bo-Rarn (Traditional Thai) — floor mat, clothed, yoga-like stretching + pressure points",
  "Oil Massage (Nuad Nam Man) — table, unclothed under sheet, Swedish-style with Thai technique",
  "Foot Massage (Nuad Thao) — reflexology focusing on pressure points on feet and lower legs",
  "Head, Neck, Shoulder — seated, clothed, desk-worker favorite",
  "Herbal Compress (Luk Pra Kob) — heated herbs pressed into muscle — advanced technique",
];

export function BangkokThaiMassageLearn() {
  return (
    <div className="rounded-2xl border border-rose-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-rose-700 mb-3">
        🙏 Learn Thai massage in Bangkok — schools & courses
      </div>
      <div className="space-y-2 mb-3">
        {SCHOOLS.map((s) => (
          <details key={s.name} className="border border-rose-100 rounded-xl overflow-hidden group">
            <summary className="px-3 py-2.5 cursor-pointer flex items-center gap-2 hover:bg-rose-50 transition">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area} · {s.duration}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </summary>
            <div className="px-3 pb-3 border-t border-rose-100 pt-2 space-y-1">
              <div className="text-[10px] text-[var(--fg)] leading-snug">{s.why}</div>
              <div className="text-[10px] text-rose-700">📜 {s.certification}</div>
              <div className="text-[10px] text-orange-600">💡 {s.tip}</div>
            </div>
          </details>
        ))}
      </div>
      <div className="border border-rose-100 rounded-xl p-3">
        <div className="text-[10px] font-bold text-rose-700 mb-1.5">Thai massage styles covered in courses:</div>
        <ul className="space-y-0.5">
          {STYLES.map((style) => (
            <li key={style} className="text-[10px] text-[var(--fg)] flex items-start gap-1.5">
              <span className="text-rose-400 shrink-0">•</span>{style}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
