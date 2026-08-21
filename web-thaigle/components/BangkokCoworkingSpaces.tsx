const SPACES = [
  {
    name: "Hubba Ekkamai",
    emoji: "💻",
    area: "Ekkamai Soi 12 (Ekkamai BTS)",
    price: "Day pass ฿250–350, Monthly ฿3,500–6,000",
    wifi: "High-speed fiber, 200Mbps+",
    why: "Bangkok's most popular coworking for digital nomads and startup founders. Strong community events. Coffee roaster on-site.",
    hours: "Mon–Fri 8am–midnight, Sat–Sun 9am–8pm",
    tip: "Monthly pass includes 24/7 access and locker. Community Slack channel active for networking events.",
  },
  {
    name: "Paperwork (Thonglor)",
    emoji: "📄",
    area: "Thonglor BTS area (multiple locations)",
    price: "Day ฿200–280, Monthly ฿3,000–5,000",
    wifi: "Stable 100Mbps",
    why: "Best café-coworking hybrid in Bangkok. Natural light, good AC, quiet atmosphere. No minimum order. Can work 8 hours on one coffee.",
    hours: "Daily 8am–10pm",
    tip: "The Thonglor branch has the most natural light. Table size varies — bring your own multi-plug for laptop + phone.",
  },
  {
    name: "True Digital Park",
    emoji: "🚀",
    area: "Punnawithi BTS (end of Sukhumvit line)",
    price: "Free common areas. Coworking from ฿300/day.",
    wifi: "Thailand's fastest coworking WiFi. 1Gbps fiber.",
    why: "Southeast Asia's largest tech and startup campus. Free wifi in common areas. Startup events weekly. The best large-scale workspace.",
    hours: "Mon–Fri 8am–8pm. Events run 24/7.",
    tip: "Register for a free True Digital Park account online — gives access to common areas and some events for free.",
  },
  {
    name: "Mango House Coworking",
    emoji: "🥭",
    area: "Ari BTS (3 min walk)",
    price: "Day ฿180, Monthly ฿2,800",
    wifi: "100Mbps stable",
    why: "Best-value coworking in central Bangkok. Quiet, professional atmosphere. Ari neighborhood great for work-life balance with nearby cafés and restaurants.",
    hours: "Mon–Sat 8am–8pm",
    tip: "Very popular with freelancers and remote workers. Book a private booth ahead if you need video calls — shared tables are quiet but open.",
  },
];

export function BangkokCoworkingSpaces() {
  return (
    <div className="rounded-2xl border border-blue-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-blue-700 mb-3">
        💻 Bangkok coworking spaces — remote work & digital nomad guide
      </h2>
      <div className="space-y-2">
        {SPACES.map((s) => (
          <div key={s.name} className="border border-blue-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area} · {s.hours}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-blue-700 mb-0.5">📶 WiFi: {s.wifi}</div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-orange-600">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
