const SPOTS = [
  {
    name: "Pole Dancing Fitness Studios — Bangkok",
    emoji: "💫",
    area: "Thonglor, Ekkamai, Ari — multiple dedicated studios",
    price: "Trial class ฿500–800; Monthly unlimited ฿4,000–8,000",
    why: "Bangkok's pole fitness scene has matured significantly — dedicated pole dancing studios with professional apparatus (removable static/spinning poles, crash mats) have opened across Thonglor, Ekkamai, and Ari. The rebranding from 'exotic' to athletic pole fitness has driven mainstream participation in Bangkok, particularly among women in their 20s–40s. The athletic demands are genuine: a 6-month committed student develops upper body strength, core stability, and flexibility at a level comparable to gymnastics or aerial training. Competition pole (IPSF — International Pole Sports Federation) has a Thai chapter.",
    tip: "Starting pole fitness in Bangkok: bring grip shorts (bare skin grips the pole — loose clothing slides). Expect significant bruising on shins and inner thighs in the first 3–4 weeks as your skin conditions — this is normal and diminishes. Most Bangkok pole studios offer female-only classes alongside mixed classes — ask when booking if this is a preference. The studio atmosphere at Bangkok pole fitness venues is strongly supportive and body-positive — judgment-free is the culture norm.",
  },
  {
    name: "Aerial Hoop (Lyra) & Aerial Silks",
    emoji: "🎪",
    area: "Aerial and circus arts studios, primarily Ekkamai and Lat Phrao",
    price: "Trial class ฿400–700; Monthly ฿3,500–7,000",
    why: "Aerial arts — lyra (iron ring/hoop), silks (fabric), and rope — have a small but dedicated Bangkok community. Several studios offer full aerial programs alongside or in place of pole fitness, as the strength and flexibility requirements overlap. Bangkok's circus arts community (small but connected) provides context for aerial training that goes beyond fitness into performance. The riggers (structural engineers and aerial arts safety specialists) at Bangkok's better studios have internationally recognized certifications.",
    tip: "Aerial silks vs. lyra for beginners: silks require more initial upper body strength (pulling yourself up from hanging) while lyra allows more weight distribution through the hoop's structure — lyra is often the gentler entry point. Both require significant callous development on hands. Studio selection for aerial: verify that ceiling rigging points are professionally engineered (load-rated bolts, safety backups) rather than improvised — aerial apparatus falls are serious. Bangkok's reputable aerial studios have certification paperwork available if asked.",
  },
  {
    name: "Thai Traditional & Classical Dance",
    emoji: "🙏",
    area: "Cultural centers, Thai cultural institutions, temple festivals",
    price: "Khon performance tickets ฿600–3,000; Lessons ฿500–1,500/session",
    why: "Thai classical dance (Khon — masked drama, Lakhon — court dance, Ram Thai — general classical) is a UNESCO Intangible Cultural Heritage tradition. The National Theatre in Bangkok hosts Khon performances by the Fine Arts Department. Classical dance lessons are available through cultural centers and some temples, particularly for foreigners interested in authentic Thai arts. Khon's elaborate gilded costumes and Ramayana-based narratives make performances extraordinary visual experiences even without cultural context. Thai dance technique (finger positions, foot angles, eye focus) requires years of dedicated study for mastery.",
    tip: "Experiencing Thai classical dance in Bangkok: the National Theatre (Sanam Luang area) and Sala Chalermkrung Royal Theatre host regular Khon performances — check schedules in advance as performances aren't daily. Suan Pakkad Palace (heritage house museum) occasionally has small-scale classical dance demonstrations included with museum entry (฿100). For lessons: the Chulalongkorn University fine arts faculty offers some community classes; Wat Pho's cultural center program includes Thai massage, cooking, AND traditional dance.",
  },
];

export function BangkokPoleDance() {
  return (
    <div className="rounded-2xl border border-violet-300 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-violet-800 mb-3">
        💫 Pole fitness & aerial arts in Bangkok — studios, lyra, silks & Thai classical dance
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-violet-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-violet-800">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
