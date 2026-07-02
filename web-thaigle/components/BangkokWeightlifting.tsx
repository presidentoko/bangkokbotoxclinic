const OPTIONS = [
  {
    name: "Powerlifting & Strength Gyms in Bangkok",
    emoji: "🏋️",
    area: "Asoke, Ekkamai, Ratchada — serious lifting hubs",
    price: "Membership ฿1,500–3,500/month; Day pass ฿150–300",
    why: "Bangkok has a growing powerlifting community — proper strength gyms with squat racks, deadlift platforms, and heavy free weights (unlike commercial gyms that hide heavy plates). FitMax, Revolution Gym Asoke, and a growing number of independent powerlifting-focused facilities cater to serious strength athletes. Thai powerlifting federation holds sanctioned meets.",
    tip: "Bangkok gym culture is friendly about strength sports — unlike some countries, no ego or 'don't use the squat rack for curls' drama. Chalk is available at most serious gyms. Competition prep services (coaching, meet registration) available through the Thai Powerlifting Federation social media.",
  },
  {
    name: "Olympic Weightlifting in Bangkok",
    emoji: "🥇",
    area: "Huamark Sports Complex, Olympic Training Center, university clubs",
    price: "Government facilities ฿50–100/session; Private coaching ฿2,000–4,000/month",
    why: "Thailand has a strong Olympic weightlifting tradition — Sopita Tanasan won gold at Rio 2016. National training facilities at Huamark have Olympic platforms and coaches. University (Kasetsart, Mahidol) sports clubs often have weightlifting sections with qualified coaches accessible to non-students. Technique coaching for the snatch and clean & jerk available.",
    tip: "Bangkok's Thailand Institute of Physical Education (IPE) and adjacent facilities at Huamark are the epicentre of Thai competitive weightlifting. Foreign serious athletes training in Bangkok have been accepted into club programs — email politely and consistently.",
  },
  {
    name: "Bangkok Gym Culture Essentials",
    emoji: "💪",
    area: "Citywide",
    price: "Varies by facility",
    why: "Bangkok's gym scene has expanded massively post-COVID — from mid-tier commercial chains (FitD, FitnessFirst, Virgin Active) to boutique strength studios and CrossFit affiliates. 24-hour facilities widely available. Gym etiquette: clean up chalk, re-rack weights, don't monopolize peak hour equipment — similar to global standards. Air-conditioned is essential given Bangkok's heat.",
    tip: "FitD nationwide chain has the most locations and reasonable day pass pricing. For serious lifting, Revolution Gym (Asoke/Ari) has better equipment depth than commercial chains. The expat fitness community is active on Facebook — search 'Bangkok lifting' groups for recommendations and training partners.",
  },
];

export function BangkokWeightlifting() {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-zinc-700 mb-3">
        🏋️ Weightlifting & powerlifting in Bangkok — serious gyms, meets & training
      </div>
      <div className="space-y-2">
        {OPTIONS.map((o) => (
          <div key={o.name} className="border border-zinc-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{o.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{o.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{o.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{o.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{o.why}</div>
            <div className="text-[10px] text-zinc-700">💡 {o.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
