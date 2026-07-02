const EVENTS = [
  {
    name: "Silent Disco Bangkok (Monthly Event)",
    emoji: "🎧",
    organizer: "BKK Silent Party + various venue hosts",
    price: "฿350–600 (includes headphones)",
    format: "3 channels of different music (choose your vibe)",
    why: "Bangkok's growing silent disco scene. 3 DJs broadcast on different frequencies — headphones let you pick your channel. Everyone dances to different music but you hear only your own. Surreal when you take headphones off.",
    tip: "Find events via Facebook 'Silent Disco Bangkok'. Venues change — usually rooftop bars or warehouse spaces. The colored lights on headphones show which channel you're on — easy to synchronize with someone. Communication is signing or lip-reading.",
  },
  {
    name: "NEON GARDEN x Silent Disco (EmQuartier rooftop)",
    emoji: "🌈",
    organizer: "EmQuartier partnered events",
    price: "฿450 (ticket includes 1 drink)",
    format: "2–3 channels, usually 2 hours",
    why: "More established recurring event at EmQuartier. Rooftop setting + Bangkok skyline + neon lights + silent music = Instagram perfection. Runs monthly — check EmQuartier event page. Good starter event if new to silent disco.",
    tip: "Come early to secure a good rooftop spot. The light-up headphones make for great group photos. Switch channels often — the 'discover you're in the same channel as someone across the room' moment is the silent disco magic.",
  },
  {
    name: "House Party Silent Disco (Airbnb Events)",
    emoji: "🏠",
    organizer: "Airbnb Experiences Bangkok (search 'silent')",
    price: "฿500–900 per person",
    format: "Hosted private experience, small group",
    why: "Intimate version of silent disco in private villa setting. Hosted by English-speaking Bangkok expats. More social, less about dancing and more about conversation-through-music discovery. Good for solo travelers or couples.",
    tip: "Book via Airbnb Experiences (not regular Airbnb rental). Small groups mean you'll actually meet people. More suitable for a unique experience than a full dancing night out.",
  },
];

const WHY_DIFFERENT = [
  "Everyone dances — but to different songs. You see chaotic movement that's secretly synchronized",
  "When you remove headphones, you hear silence + everyone's humming or singing to themselves",
  "Switching channels mid-song and suddenly syncing with someone is unexpectedly fun",
  "No sound noise = easier conversation than a normal club (take headphones off to talk)",
  "Great for groups who can't agree on music — everyone wins",
];

export function BangkokSilentDisco() {
  return (
    <div className="rounded-2xl border border-purple-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-purple-700 mb-3">
        🎧 Silent disco Bangkok — dance with headphones, Bangkok's weirdest fun
      </div>
      <div className="space-y-2 mb-3">
        {EVENTS.map((e) => (
          <div key={e.name} className="border border-purple-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{e.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{e.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{e.format} · {e.organizer}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{e.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{e.why}</div>
            <div className="text-[10px] text-purple-700">💡 {e.tip}</div>
          </div>
        ))}
      </div>
      <details className="border border-purple-100 rounded-xl overflow-hidden">
        <summary className="px-3 py-2 cursor-pointer text-[10px] font-bold text-purple-700 hover:bg-purple-50">
          Why silent disco is actually great
        </summary>
        <ul className="px-3 pb-3 pt-1 space-y-0.5">
          {WHY_DIFFERENT.map((w) => (
            <li key={w} className="text-[10px] text-[var(--fg)] flex items-start gap-1.5">
              <span className="text-purple-400 shrink-0">•</span>{w}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
