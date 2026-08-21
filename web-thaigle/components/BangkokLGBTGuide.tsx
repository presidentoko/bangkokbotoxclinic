const INFO = {
  overview: "Bangkok is one of Asia's most LGBTQ+-friendly cities. Same-sex relationships are not criminalized, and the scene is vibrant and visible. Thai culture tends toward tolerance and a 'live and let live' attitude — displays of affection in public are fine in gay-friendly areas.",
  areas: [
    { name: "Silom Soi 4", type: "Main gay street", why: "Bangkok's 'Gay Street.' Bars, clubs, drag shows. Open from 8pm–2am nightly." },
    { name: "Silom Soi 2", type: "Clubs", why: "DJ Sanom, Telephone Bar — more clubbing-oriented. Peak 11pm–2am." },
    { name: "RCA (Royal City Avenue)", type: "Mixed clubs", why: "Mixed crowd, big venue clubbing. Less specifically gay but very accepting." },
    { name: "Nana Plaza (BKK)", type: "Adult entertainment", why: "Not specifically gay but very mixed. Tourist area, nightlife-focused." },
  ],
  events: [
    "Bangkok Pride (June) — parade and events citywide",
    "DJ Sanom & Fake Club weekly events",
    "Thailand Leather Pride (annual)",
  ],
  tips: [
    "Trans community is highly visible and accepted in mainstream Thai culture",
    "Kathoey (ladyboy) performers are prominent in mainstream entertainment",
    "Accommodation: Rainbow Flag hotels in Silom area specifically cater to LGBTQ+ travelers",
    "Bring Thai baht for smaller venues — cards not always accepted in bars",
  ],
};

export function BangkokLGBTGuide() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-2">
        🏳️‍🌈 Bangkok for LGBTQ+ travelers
      </h2>
      <p className="text-[10px] text-[var(--muted)] leading-relaxed mb-3">{INFO.overview}</p>
      <div className="space-y-1.5 mb-3">
        {INFO.areas.map((a) => (
          <div key={a.name} className="border border-[var(--border)] rounded-xl px-3 py-2">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span className="font-bold text-xs">{a.name}</span>
              <span className="text-[10px] text-purple-600 font-bold">{a.type}</span>
            </div>
            <div className="text-[10px] text-[var(--muted)]">{a.why}</div>
          </div>
        ))}
      </div>
      <div className="text-xs font-black mb-1.5">Events</div>
      <div className="space-y-1 mb-3">
        {INFO.events.map((e) => (
          <div key={e} className="text-[10px] flex gap-1.5 items-start">
            <span className="shrink-0">🎉</span>{e}
          </div>
        ))}
      </div>
      <div className="text-xs font-black mb-1.5">Tips</div>
      <div className="space-y-1">
        {INFO.tips.map((t) => (
          <div key={t} className="text-[10px] flex gap-1.5 items-start">
            <span className="shrink-0 text-purple-500">▸</span>{t}
          </div>
        ))}
      </div>
    </div>
  );
}
