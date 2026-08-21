const CLUBS = [
  {
    name: "Royal Bangkok Sports Club (RBSC) Equestrian",
    emoji: "🏇",
    area: "Henri Dunant Road, Pathumwan (near MBK)",
    price: "Membership required for riding; Racing events: ฿100–500 grandstand",
    why: "RBSC's horse racing track is one of Bangkok's most unexpected landmarks — a horse racing oval in the middle of the city, walking distance from Siam BTS. Racing days (alternate Sundays) are a Bangkok institution — colorful crowd, totalisator betting, food vendors. Horse riding lessons and equestrian sports are available to club members. The club atmosphere is old-Bangkok colonial-era mixed with modern Thai racing culture.",
    tip: "RBSC racing days are one of Bangkok's best people-watching experiences even without interest in racing — the crowd mixture of Thai families, expats, and racing enthusiasts is fascinating. Grandstand entry is open to the public on racing days. Bring cash for food vendors and betting windows.",
  },
  {
    name: "Phufa Riding School & Equestrian Center",
    emoji: "🐴",
    area: "Nakhon Pathom Province (60km from Bangkok)",
    price: "Trial lesson ฿800–1,500/hour; Monthly membership ฿3,000–8,000",
    why: "Outside of central Bangkok, Nakhon Pathom and Ratchaburi provinces have several equestrian facilities with proper arenas and instruction programs. Phufa and similar schools offer beginner trail rides, jumping lessons, and dressage. Horse culture in Thailand is growing — younger Thai women in particular drive demand for English-style equestrian sports. Western-style trail riding in Thailand's rural environment is a different (and excellent) experience from urban arena riding.",
    tip: "The drive from Bangkok to Nakhon Pathom equestrian centers is 1–1.5 hours via Route 338. Easier than expected from Bangkok — a viable weekend activity. Bring SPF50+ and long sleeves for outdoor riding in Thailand regardless of season. The best riding weather in Bangkok day-trip range: November–February (cooler, less humidity).",
  },
  {
    name: "Horse Racing at Royal Turf Club (RTC)",
    emoji: "🏆",
    area: "Nang Linchi Road, Yannawa (Expressway area)",
    price: "Grandstand ฿50–200; VIP ฿500–2,000",
    why: "Thailand's two major horse racing tracks — RBSC and Royal Turf Club (RTC) — alternate racing Sundays. RTC at Nang Linchi is the larger venue with bigger crowds and more international horses. Racing in Thailand uses the Thai totalisator system — straightforward win/place/quinella betting. Thai thoroughbred racing features both Thai-owned horses and imported Australian/New Zealand thoroughbreds.",
    tip: "RTC racing days: alternate Sundays from RBSC. Check both clubs' schedules to find racing on your preferred weekend. For first-timers: skip the private enclosures and go to the main grandstand for the authentic experience. The paddock walk (horses paraded before each race) is worth watching closely — Thai racing fans are knowledgeable and will point out horses worth watching.",
  },
];

export function BangkokHorseRiding() {
  return (
    <div className="rounded-2xl border border-amber-300 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-amber-800 mb-3">
        🐴 Horse riding & racing in Bangkok — RBSC, RTC racing days & equestrian schools
      </h2>
      <div className="space-y-2">
        {CLUBS.map((c) => (
          <div key={c.name} className="border border-amber-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{c.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{c.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{c.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{c.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{c.why}</div>
            <div className="text-[10px] text-amber-800">💡 {c.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
