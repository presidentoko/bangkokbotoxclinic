const CLINICS = [
  {
    name: "Registered Osteopaths in Bangkok",
    emoji: "🦴",
    area: "Sukhumvit, Silom, Nana — expat healthcare hubs",
    price: "Session ฿2,000–4,500/hour",
    why: "Osteopathy (structural musculoskeletal manipulation distinct from chiropractic) has a small but established expat-serving practice in Bangkok. Several UK and Australian-trained osteopaths operate in Bangkok, typically at international health clinics. Osteopathic treatment addresses: back and neck pain, sports injuries, postural issues, joint dysfunction, and headaches through manual manipulation.",
    tip: "Distinguish osteopath from chiropractor and traditional Thai massage therapist — they are distinct disciplines with different training and approaches. Registered osteopaths in Bangkok typically have DO (Doctor of Osteopathic Medicine) or BOst degrees from accredited programs. Ask about qualifications — 'osteopath' is not a protected title in Thailand.",
  },
  {
    name: "Chiropractic Care in Bangkok",
    emoji: "💆",
    area: "International clinics throughout Sukhumvit",
    price: "Initial consultation ฿1,500–3,000; Follow-up ฿800–2,000",
    why: "Chiropractic care is more established than osteopathy in Bangkok — several chiropractic clinics serve the expat community. Bangkok Chiropractor, Bumrungrad Hospital chiropractic department, and independent chiropractors in the Sukhumvit area. Most Bangkok chiropractors are North American (USA/Canada) trained — DC degree holders. Spinal adjustment, soft tissue work, rehabilitation exercises.",
    tip: "Bumrungrad Hospital's rehabilitation department has chiropractic services with the most clinical oversight of any Bangkok option. For lower-back or neck issues common among desk workers, Bangkok's chiropractic scene is competent and priced significantly lower than equivalent care in the US or Europe.",
  },
  {
    name: "Physiotherapy & Sports Medicine in Bangkok",
    emoji: "⚕️",
    area: "BDMS clinics, Bumrungrad, Bangkok Hospital, private physio clinics",
    price: "Session ฿800–2,500; Hospital based ฿1,500–4,000",
    why: "Bangkok's physiotherapy scene is well-developed — partly due to Thailand's sports medicine culture (Muay Thai training injuries, expat athlete needs) and the country's medical tourism sector. Sports medicine physiotherapists at Bangkok Hospital and Bumrungrad serve both Thai athletes and expats with sports injuries. Manual therapy, exercise prescription, ultrasound, and TENS therapy all available.",
    tip: "Bangkok Hospital Sports Medicine Center (Phetchaburi branch) is the most specialized sports injury clinic in Bangkok — treating national team athletes and serious amateur sportspeople. Private physiotherapy clinics near major gyms and Muay Thai camps in Sukhumvit offer more convenient access for regular training support.",
  },
];

export function BangkokOsteopath() {
  return (
    <div className="rounded-2xl border border-blue-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-blue-700 mb-3">
        🦴 Osteopathy & physio in Bangkok — registered osteopaths, chiropractic & sports medicine
      </h2>
      <div className="space-y-2">
        {CLINICS.map((c) => (
          <div key={c.name} className="border border-blue-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{c.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{c.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{c.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{c.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{c.why}</div>
            <div className="text-[10px] text-blue-700">💡 {c.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
