const EVENTS = [
  {
    name: "Startup Bangkok / Tech Networking",
    emoji: "💻",
    area: "HUBBA (Ekkamai), The Hive (Thonglor), True Digital Park",
    frequency: "Weekly and monthly events",
    why: "Bangkok has Southeast Asia's most active startup community outside Singapore. Regular pitch nights, demo days, founder meetups, investor-startup mixers. True Digital Park (Sukhumvit) is Thailand's official tech hub — massive events space, government-backed, 100+ startups in residence.",
    find: "Eventbrite Bangkok, Bangkok Startup Calendar, Techsauce Conference (annual). LinkedIn Bangkok Startup Group has 50,000+ members.",
  },
  {
    name: "Bangkok Business Chambers (AmCham, BritCham, EuroCham)",
    emoji: "🤝",
    area: "Varies — usually hotel ballrooms in CBD",
    frequency: "Monthly dinners, quarterly summits",
    why: "Foreign business chambers host regular networking events, industry dinners, and market briefings. AmCham Thailand, British Chamber of Commerce, Australian-Thai Chamber, and European Chamber all run active events programs. Best way to meet established international business community.",
    find: "Each chamber has an active website with event calendar. Some events are members-only, some open to visitors. The AmCham Annual Gala is the biggest annual business networking event.",
  },
  {
    name: "Digital Nomad & Remote Worker Meetups",
    emoji: "🌏",
    area: "Cafe coworking spaces, primarily Ari/Ekkamai/Silom",
    frequency: "Weekly (informal) to monthly (organized)",
    why: "Bangkok's large digital nomad community (50,000+ estimated long-stay) self-organizes through Facebook groups and Meetup.com. Coworking spaces like HUBBA, Co-Working Space Bangkok host weekly nomad happy hours. Less formal than business chambers but better for freelancers, remote employees, and independent entrepreneurs.",
    find: "Facebook: 'Bangkok Digital Nomads' group (40,000+ members), 'Nomad List Bangkok', Meetup.com Bangkok Remote Work events. The annual 7-Eleven bar crawl is a Bangkok nomad institution (community-organized).",
  },
  {
    name: "Industry-Specific Professional Groups",
    emoji: "🏢",
    area: "Industry-specific venues",
    frequency: "Monthly",
    why: "Bangkok has active professional communities across marketing, finance, real estate, hospitality, and legal sectors. Marketing Society Thailand, CFA Society Thailand (finance), RICS Thailand (property), and Thailand Management Association all run regular networking and professional development events.",
    find: "LinkedIn search + Bangkok. Most professional associations have LinkedIn groups. The Hotel & Restaurant Association of Thailand hosts sector-specific networking. Law firms often run client entertainment events open to extended professional networks.",
  },
];

export function BangkokNetworking() {
  return (
    <div className="rounded-2xl border border-blue-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-blue-700 mb-3">
        🤝 Business networking in Bangkok — tech, chambers & professional meetups
      </div>
      <div className="space-y-2">
        {EVENTS.map((e) => (
          <div key={e.name} className="border border-blue-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{e.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{e.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{e.area} · {e.frequency}</div>
              </div>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{e.why}</div>
            <div className="text-[10px] text-blue-700">🔍 {e.find}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
