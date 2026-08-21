const SPOTS = [
  {
    name: "Bangkok B-Boy Scene — Street Battles & Cipher",
    emoji: "🕺",
    area: "Siam Square, Terminal 21 open areas, underground car parks",
    price: "Battle events ฿100–200 entry; Crew jams free",
    why: "Bangkok has a legitimate breakdancing (B-Boy/B-Girl) scene with roots going back to the 1990s. The Thai B-Boy community competes internationally — Thai crews have placed in Asian and world-level competitions. The street cipher culture (impromptu dance circles) happens regularly at Siam Square and around major shopping malls. Battle events (organized competitive breakdancing) occur monthly, typically promoted through Thai hip-hop and street dance Instagram/Facebook communities. The technical level of Bangkok B-Boys is genuinely high.",
    tip: "Finding Bangkok's B-Boy scene: follow @bboythailand and search #bboybangkok on Instagram for battle event announcements. The Siam Square area (between Siam Center and Siam Discovery) sees regular informal ciphers on weekend evenings — if you see cardboard laid down, a B-Boy practice session is likely starting. Respectful observation leads to invitation in the cipher culture. Thai B-Boys are generally welcoming to foreign practitioners who demonstrate basic respect for hip-hop culture.",
  },
  {
    name: "Hip-Hop & Street Dance Studios",
    emoji: "🎤",
    area: "Ekkamai, Thonglor, On Nut dance studio belt",
    price: "Drop-in ฿250–500; Monthly ฿2,000–5,000",
    why: "Bangkok's commercial dance studio scene has expanded significantly — with studios in Ekkamai and Thonglor offering hip-hop, popping, locking, waacking, and house dance classes taught by instructors who've trained in Los Angeles, Korea, and Japan. The Korean pop culture influence on Thai youth has created strong demand for K-Pop dance classes alongside more traditional hip-hop forms. The technical instruction quality at Bangkok's top studios is internationally competitive.",
    tip: "Bangkok's best dance studios for street styles: SMASH (multiple locations), Dancer Space (Thonglor), and Club EK are established names. Class schedules and Instagram followings indicate quality — studios with regular updates showing instructor freestyles (not just choreography videos) indicate deeper cultural engagement. Trial classes (usually ฿200–300) are available at most studios. For serious street dance, look for instructors with B-Boy/Popper backgrounds rather than just choreography experience.",
  },
  {
    name: "Popping, Locking & Animation Bangkok",
    emoji: "⚡",
    area: "Street dance studio belt, freestyle events",
    price: "Class ฿300–600; Battle events ฿150–300",
    why: "Beyond breaking (B-Boying), Bangkok has active communities for popping (muscle isolation technique developed in Fresno, CA), locking (James Brown-influenced funk dance), and animation (tutting, liquid motion). These styles have distinct Bangkok communities with their own practice nights and competitions. The popping community in Bangkok is particularly strong — several Thai poppers have competed at Red Bull BC One and other major international events.",
    tip: "Street dance battle events in Bangkok: Red Bull Thailand promotes annual dance battle events in Bangkok that draw major talent. Monthly battles happen at venues like Neon Bangkae and Studio 38 (check social media for current schedules). The street dance community uses Instagram and LINE groups almost exclusively for communication — events rarely appear on mainstream event listing platforms. The community is tight but accessible through genuine engagement with the culture.",
  },
];

export function BangkokBreakdance() {
  return (
    <div className="rounded-2xl border border-purple-300 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-purple-800 mb-3">
        🕺 Breakdance & street dance in Bangkok — B-boy scene, hip-hop studios & popping events
      </h2>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-purple-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-purple-800">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
