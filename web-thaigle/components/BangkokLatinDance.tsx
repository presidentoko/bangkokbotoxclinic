const SPOTS = [
  {
    name: "Salsa & Bachata in Bangkok",
    emoji: "💃",
    area: "Salsa clubs (RCA area, Silom), social dance nights (rooftop venues, dedicated clubs)",
    price: "Salsa class ฿400–1,000; Social dance night entry ฿200–600; Monthly class pass ฿2,000–5,000",
    why: "Bangkok has a thriving salsa and bachata community — surprisingly active given Thailand's distance from Latin America, sustained by the Latin American expat community, European salsa travelers, and Thai dancers who have developed genuine technical proficiency. Bangkok salsa nights follow the international social dance structure: beginner group class followed by social dancing, typically starting at 8–9pm and running until 1–2am. The quality of Bangkok's salsa scene is genuinely international — visiting Cuban, Colombian, and European instructors regularly conduct workshops in Bangkok, and Bangkok dancers participate in Asian salsa festivals (Singapore, Hong Kong, Shanghai). Bachata (Dominican partner dance, typically slower and more romantic than salsa) has grown significantly alongside salsa in Bangkok's dance scene.",
    tip: "Bangkok salsa scene entry: finding current class schedules requires following Facebook groups ('Bangkok Salsa', 'Bangkok Bachateros') as venues and schedules change frequently. Dress code: smart casual is the default for Bangkok salsa socials — avoid shorts and sandals; women typically dress for social dancing (but not necessarily formally). The language of salsa: English is the working language at Bangkok's international salsa nights — Thai-language instruction for Thai-specific classes, English for workshops and expat-dominated events. Solo travelers: Bangkok's salsa community is one of the most welcoming for solo travelers — the social dance structure means you'll be dancing with different partners throughout the evening regardless of whether you arrive with company.",
  },
  {
    name: "Tango in Bangkok",
    emoji: "🩱",
    area: "Argentine tango practicas and milongas (Sukhumvit area, hotel ballrooms)",
    price: "Tango class ฿500–1,500; Milonga entry ฿300–800; Private lesson ฿1,500–3,000",
    why: "Argentine tango has a dedicated community in Bangkok — smaller than the salsa scene but committed, with regular practicas (informal practice sessions) and milongas (formal tango dances). Bangkok's tango community draws from the international expat community and from Thai dancers who have traveled to Buenos Aires or taken extended workshop programs. The tango connection to Argentina gives it a cultural depth that attracts serious dance students — Bangkok tango events sometimes bring Argentine instructors for intensive workshops. The intimacy and musical nuance of tango (interpretive response to Piazzolla, orquesta tíıpica, and tango nuevo music) creates a distinct social culture from salsa's more extroverted energy.",
    tip: "Bangkok tango finding strategy: the tango community is more insular than salsa and less discoverable through general social searches — contacting dance schools directly or asking at salsa socials for tango information is most effective. Milonga etiquette: traditional milonga cabeceo (invitation through eye contact, not verbal request) is maintained at formal Bangkok tango events — learning this invitation system before attending is respectful. Bangkok tango level reality: the community is relatively small, so a wide range of levels dance together at practicas — this is both a challenge for absolute beginners and an opportunity for intermediate dancers to dance with more experienced partners.",
  },
  {
    name: "Kizomba, Zouk & Social Dance in Bangkok",
    emoji: "🎶",
    area: "Social dance studios (Sukhumvit, Ari), various venue takeovers for themed nights",
    price: "Kizomba class ฿400–900; Brazilian zouk workshop ฿800–2,000; Social dance entry ฿200–500",
    why: "Bangkok's social dance community goes beyond salsa and tango — kizomba (Angolan partner dance, smooth and intimate) and Brazilian zouk (flowing, body-wave-focused partner dance distinct from carnaval samba-reggae zouk) have grown significantly in Bangkok's dance scene. These dances arrived via the global social dance community's spread through workshop culture — international teachers from Portugal, Brazil, France, and Germany circulate through Asian cities including Bangkok. The dance studio economy in Bangkok supports multiple social dance styles because it's a viable business model — Bangkok's social dance community has sufficient scale for regular events across styles. Kizomba's Angolan roots connect to African music culture that has very limited other representation in Bangkok's entertainment scene.",
    tip: "Bangkok zouk and kizomba resources: YouTube channels and Facebook groups are essential for navigating Bangkok's schedule-driven social dance scene. The best teachers in Bangkok for these styles typically have international training and competition backgrounds — ask about their study history. Connection technique: both kizomba and Brazilian zouk emphasize body connection and leading/following technique much more than footwork complexity — a beginner with good connection skills progresses faster than someone with memorized step patterns but poor body awareness. Multi-style social dances: Bangkok events sometimes mix salsa, bachata, kizomba, and zouk in a single night — attending these mixed events provides maximum variety and helps you discover which style resonates most.",
  },
];

export function BangkokLatinDance() {
  return (
    <div className="rounded-2xl border border-red-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-red-700 mb-3">
        💃 Latin dance in Bangkok — salsa, bachata, tango & zouk social dancing
      </h2>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-red-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-red-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
