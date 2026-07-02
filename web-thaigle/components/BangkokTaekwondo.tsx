const SPOTS = [
  {
    name: "Taekwondo in Bangkok",
    emoji: "🦵",
    area: "Taekwondo clubs throughout Bangkok, national sports complex (Hua Mark), university clubs",
    price: "Monthly class ฿1,500–4,000; Private lesson ฿800–2,000; Uniform (dobok) ฿800–2,000",
    why: "Taekwondo is an Olympic sport with strong institutional presence in Thailand — the Taekwondo Association of Thailand operates under the Thailand Sports Authority, and competitive taekwondo is a recognized school sport. Bangkok has numerous taekwondo clubs ranging from recreational adult classes to competitive programs for children and aspiring athletes. Korean cultural influence in Bangkok has strengthened taekwondo's profile — several Bangkok taekwondo clubs have Korean-trained instructors, and the WTF (World Taekwondo Federation, Olympic) style dominates over ITF (International Taekwondo Federation) in Bangkok. The Olympic connection: taekwondo is one of Thailand's competitive Olympic sports — Thai athletes have won medals in taekwondo at Asian Games level.",
    tip: "Bangkok taekwondo club selection: choose between WTF/WT (Olympic-style, point sparring, focus on kicking technique and competition rules) and ITF (traditional pattern-focused, full-contact sparring elements) based on your goals. For children: school-based taekwondo programs are often the most convenient entry point — many Bangkok international and Thai schools offer taekwondo as an after-school activity. Belt testing: Bangkok's established taekwondo clubs test through Kukkiwon (World Taekwondo's technical center in Korea) certification channels — ask about testing lineage before committing. Competition pathway: Bangkok's taekwondo community hosts regular open tournaments — junior competitors can accumulate competition experience locally before pursuing national selection.",
  },
  {
    name: "Karate Bangkok",
    emoji: "🥋",
    area: "Japanese community-affiliated dojos, sports clubs, university karate clubs",
    price: "Monthly class ฿1,500–4,000; Private lesson ฿1,000–2,500; Equipment ฿2,000–8,000",
    why: "Karate in Bangkok is sustained by the Japanese expat community (one of Bangkok's largest expatriate groups) and by Thai practitioners through the Sports Authority of Thailand's karate program. Multiple karate styles exist in Bangkok — Shotokan (the most widely practiced Japanese style globally) has the strongest presence, but Kyokushin (full-contact tournament karate), Gojo-ryu, and Wado-ryu dojos also operate. The Tokyo 2020 Olympics inclusion of karate (as a one-time Olympic event) raised the sport's profile in Thailand. Karate as a discipline: the kata (form) and kihon (basic technique) emphasis in traditional karate dojos provides a structured training method distinct from sport sparring-focused martial arts.",
    tip: "Bangkok karate dojo culture: traditional Japanese dojo etiquette (bowing in/out, maintaining keigo/formal address to seniors, strict uniform standards) is generally maintained at authentic dojos — understanding the cultural framework is part of the practice. Kyokushin karate in Bangkok: Kyokushin has dedicated practitioners in Bangkok — the full-contact sparring (no face strikes, emphasizing body and leg strikes) provides a distinctive training style. Karate for children: Bangkok's karate dojos are welcoming to children and offer structured progression through belt ranks — the discipline focus of traditional karate training is often cited by parents as a key benefit beyond physical fitness. Competition: WUKO (World Union of Karate Organizations) and WKF-affiliated competitions provide the main tournament framework in Thailand.",
  },
  {
    name: "Judo in Bangkok",
    emoji: "⚔️",
    area: "Bangkok Judo Club (established Japanese community institution), sports clubs, university judo clubs",
    price: "Monthly membership ฿1,500–3,500; Judogi (uniform) ฿2,000–8,000; Competition entry ฿500–2,000",
    why: "Judo in Bangkok has historical depth — the Bangkok Judo Club was established by the Japanese community and has operated for decades, providing structured judo practice and a pathway to IJF (International Judo Federation) competition standards. The Judo Association of Thailand has national competitive programs and university judo clubs across Bangkok. Judo's Olympic status gives it institutional support and structured competition at school and university levels. The Japanese expat community in Bangkok sustains multiple judo clubs at standard Japanese dojo quality — for practitioners who trained in Japan, Bangkok judo provides a culturally continuous experience.",
    tip: "Bangkok judo quality indicators: look for dojos affiliated with the IJF through the Judo Association of Thailand, with certified dan-grade instructors. The key distinction in Bangkok judo quality is teaching method — traditional judo pedagogy (proper nage-waza throw technique, ne-waza ground work progression) versus sport-only competition drilling. For competitive judo: Bangkok's universities (particularly those with physical education programs) have strong judo teams that compete in university championships — these are the most consistently high-quality training environments. Judogi rules: competitions require IJF-approved judogi (different specifications from budget training uniforms) — confirm requirements before purchasing competition gear.",
  },
];

export function BangkokTaekwondo() {
  return (
    <div className="rounded-2xl border border-indigo-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-indigo-700 mb-3">
        🦵 Taekwondo, karate & judo in Bangkok — Olympic martial arts clubs & training
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-indigo-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-indigo-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
