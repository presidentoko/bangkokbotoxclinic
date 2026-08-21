const INFO = [
  {
    heading: "Beach Volleyball at Bangkok Parks",
    emoji: "🏐",
    area: "Lumpini Park, Benjakitti Park",
    price: "Free (public sand courts)",
    why: "Both major Bangkok parks have permanent sand volleyball courts. Pickup games happen daily, especially weekend mornings. Mix of Thai players and expats. Casual level — social rather than competitive. The sand courts in Bangkok parks are a welcome change from the concrete urban environment.",
    tip: "Arrive weekend morning (7–10am) for best chance of finding a game. Bring water — the sand reflects heat significantly. Court lights at some parks allow evening play until 9pm.",
  },
  {
    heading: "Beach Volleyball (Pattaya/Hua Hin Day Trip)",
    emoji: "🌊",
    area: "Pattaya beach, Hua Hin beach",
    price: "Free on public beach; Court rental ฿200–400/hour at resort",
    why: "Day trip from Bangkok to play beach volleyball on an actual beach — Pattaya (1.5 hrs) or Hua Hin (2.5 hrs). Jomtien Beach in Pattaya has multiple permanent beach volleyball nets and regular pickup games. The sand quality and ocean backdrop make this a significant upgrade from Bangkok park courts.",
    tip: "Weekends have more casual players gathering at Jomtien beach courts. Bring SPF — Thailand beach sun at midday is very intense. Best play timing: 7–10am or 4–7pm when heat is manageable.",
  },
  {
    heading: "Thai Volleyball (Watch Nationally Ranked Teams)",
    emoji: "🏆",
    area: "Major stadiums during season",
    price: "Tickets ฿200–600",
    why: "Thailand has an exceptional women's volleyball team — the team is beloved nationally. Thailand is consistently ranked Top 15 in the world. Thai Volleyball League matches are affordable to attend and very atmospheric. The national team's matches against China, South Korea, and Japan draw passionate crowds.",
    tip: "Thai female volleyball players have celebrity status — popular endorsements, TV appearances, huge social media followings. Watching a match is a genuinely exciting cultural experience beyond the sport itself.",
  },
];

export function BangkokVolleyball() {
  return (
    <div className="rounded-2xl border border-blue-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-blue-700 mb-3">
        🏐 Volleyball in Bangkok — park courts, beach volleyball & Thai national team
      </h2>
      <div className="space-y-2">
        {INFO.map((i) => (
          <div key={i.heading} className="border border-blue-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{i.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{i.heading}</div>
                <div className="text-[10px] text-[var(--muted)]">{i.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{i.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{i.why}</div>
            <div className="text-[10px] text-blue-700">💡 {i.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
