const VENUES = [
  {
    name: "IMPACT Arena & Exhibition Center",
    emoji: "🏟️",
    area: "Nonthaburi (near Don Mueang Airport)",
    capacity: "Exhibition hall: 100,000 sqm; Meeting rooms: 10–5,000 pax",
    why: "Thailand's largest conference and exhibition complex. IMPACT Challenge Arena (10,000 seats), IMPACT Exhibition Center (100,000 sqm exhibition halls), and over 30 meeting rooms. Hosts Thailand's major trade exhibitions, concerts, and international conferences. Direct connection to BTS Gold Line at Impact Challenger station. 30 minutes from Suvarnabhumi Airport.",
    tip: "IMPACT has an integrated hotel (Novotel IMPACT) for conference attendees. The exhibition halls are massive and may require shuttle service between different halls — budget extra time. Catering is managed in-house — quality is serviceable for large events but premium food requires external arrangement.",
  },
  {
    name: "Centara Grand & Bangkok Convention Centre",
    emoji: "🏢",
    area: "Central World, Ratchaprasong (BTS Chit Lom)",
    capacity: "Convention center: up to 5,000 pax; Breakout rooms: various",
    why: "Prime central Bangkok location at CentralWorld shopping complex. Full convention center with multiple ballrooms (Grand Ballroom 2,500 pax), executive meeting rooms, and breakout spaces. Part of Centara Grand luxury hotel — accommodation, F&B, and AV all integrated. Walking distance from BTS and MRT. Competitive for mid-size international conferences that need central Bangkok location.",
    tip: "The CentralWorld integration means conference attendees can easily access shopping, restaurants, and entertainment within the complex. Ratchaprasong area is Bangkok's most internationally accessible location. The meeting rooms have modern AV but sound isolation between adjacent rooms is variable — consider this for simultaneous sessions.",
  },
  {
    name: "Bangkok Marriott Marquis Queen's Park — MICE",
    emoji: "🌐",
    area: "Sukhumvit Soi 22, BTS Phrom Phong",
    capacity: "Grand Ballroom 2,200 pax; Meeting rooms: 10–800 pax",
    why: "One of Bangkok's premier MICE (Meetings, Incentives, Conferences, Events) hotels. The Grand Ballroom is among Bangkok's most impressive — 2,700 sqm with divisible sections and modern AV. Full convention services team, dedicated event coordinator, accommodation block rates. Sukhumvit location near restaurants and entertainment makes it popular for international corporate events.",
    tip: "The Marriott Marquis convention team is experienced with international groups — translation services, dietary accommodation, and international billing all smoothly handled. Incentive travel packages (conference + team activity, Bangkok evening entertainment) are well-coordinated through their MICE team.",
  },
];

export function BangkokConferenceVenue() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-slate-700 mb-3">
        🏟️ Conference venues in Bangkok — IMPACT, CentralWorld & MICE hotel packages
      </h2>
      <div className="space-y-2">
        {VENUES.map((v) => (
          <div key={v.name} className="border border-slate-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{v.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{v.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{v.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-slate-700 text-right max-w-[120px]">{v.capacity}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{v.why}</div>
            <div className="text-[10px] text-slate-700">💡 {v.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
