const SPOTS = [
  {
    name: "Maker Space Bangkok — Robotics & Electronics",
    emoji: "🤖",
    area: "Fab Cafe Bangkok (Thonglor), HUBBA-TO co-working/maker space",
    price: "Day pass ฿500–800; Membership ฿3,000–6,000/month",
    why: "Bangkok's maker culture has developed a small but active community of robotics enthusiasts, electronics hobbyists, and hardware hackers. Maker spaces in Thonglor and Silom provide access to 3D printers, laser cutters, soldering stations, and electronics workbenches. The hardware startup community in Bangkok (connected to the ICT ministry's DEPA — Digital Economy Promotion Agency) overlaps with the maker community. Thai engineering culture is strong — Thailand produces significant numbers of engineering graduates who participate in these communities.",
    tip: "Finding Bangkok's maker/robotics community: the Thailand Maker Alliance Facebook group and Bangkok Maker Space community are the primary gathering points. Arduino, Raspberry Pi, and drone building communities operate through online groups with periodic in-person meetups. NECTEC (National Electronics and Computer Technology Center — Government agency) has occasional open robotics competitions and workshops. For robot combat specifically: the Thai Robot Instructor Association organizes annual competitions.",
  },
  {
    name: "Drone Flying & FPV Racing",
    emoji: "🚁",
    area: "Dedicated drone parks, outskirts of Bangkok (regulations apply in city center)",
    price: "FPV racing event entry ฿200–500; Drone park session ฿200–400",
    why: "Thailand's Civil Aviation Authority regulates drone flying (registration required for drones over 2kg, no-fly zones cover most of Bangkok city center). However, FPV (First Person View) drone racing has an active Thai community operating at dedicated fields outside central Bangkok. The Thai FPV Racing League organizes competitions. Camera drone photography is permitted in many rural and suburban areas. The drone modification and racing community connects through Drone Pilot Thailand and FPV Thailand Facebook groups.",
    tip: "Drone flying in Bangkok: register drones with CAAT (Civil Aviation Authority of Thailand) to avoid legal issues. The app DroneZone shows permitted zones in Thailand. FPV racing community: most organized race events happen at fields in Pathum Thani and Samut Prakan provinces — 30–60 minutes from Bangkok proper. Getting into FPV racing: the entry kit (a practice 'whoops' drone, radio controller, goggles, batteries) costs ฿5,000–15,000 for budget setups. The Thai FPV community is welcoming to beginners.",
  },
  {
    name: "3D Printing & Rapid Prototyping Community",
    emoji: "🖨️",
    area: "Multiple maker spaces, Pantip Plaza tech mall (MBK area)",
    price: "3D printing service ฿50–500/hour or per-gram pricing",
    why: "3D printing access in Bangkok is practical and affordable — multiple print services operate out of Pantip Plaza (Bangkok's tech/electronics mall) and standalone services around the engineering university areas. The maker space community provides access to machines for self-printing at lower cost. Thai designers and engineering students actively use these facilities for prototyping. The culture is collaborative — sharing files, print settings, and material recommendations is common in the maker community.",
    tip: "3D printing in Bangkok: if you need something printed and don't want to operate a machine yourself, Pantip Plaza has multiple shops that will print STL files same-day (bring a USB drive or email the file). Filament materials available beyond standard PLA: ABS, PETG, flexible TPU, and specialty materials at higher prices. For serious making: HUBBA-TO (community maker space, Sukhumvit 26) and similar spaces are the most cost-effective for accessing multiple fabrication tools under one membership.",
  },
];

export function BangkokRoboticsClub() {
  return (
    <div className="rounded-2xl border border-slate-300 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-slate-700 mb-3">
        🤖 Robotics & maker culture in Bangkok — maker spaces, FPV drones & 3D printing
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-slate-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-slate-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
