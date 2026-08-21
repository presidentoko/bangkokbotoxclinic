const OPTIONS = [
  {
    name: "Public Swimming Pool Lessons",
    emoji: "🏊",
    area: "Lumpini Swimming Pool, Rama 9 Swimming Pool, various district pools",
    price: "Government pools: ฿20–50 entry; Lessons ฿150–300/hour",
    why: "Bangkok's government-run swimming pools offer affordable swim lessons through the Sports Authority of Thailand. Pool quality varies — Lumpini Olympic Pool is nicest. Thai swimming coaches available for adult and child lessons. Very good value — same coaching quality as private pools at a fraction of the price.",
    tip: "Bring your own swimming cap (required at all government pools in Thailand). Proper swimwear required — no board shorts at lap pool lanes. Government pool schedules posted at entry. Lessons need to be arranged directly with the pool's coaching staff (usually through reception).",
  },
  {
    name: "Hotel Pool Day Pass + Lessons",
    emoji: "🏨",
    area: "5-star hotels Sukhumvit and Silom",
    price: "Day pass ฿800–2,000 includes pool access; Lessons ฿500–1,000/hour extra",
    why: "Book a hotel day pass that includes access to their lap pool and swimming instructor services. Bangkok's top hotels (JW Marriott, Banyan Tree, SO Bangkok) have competitive-standard pools with credentialed instructors. Best option for adult learners who want a more private, premium environment.",
    tip: "Call ahead to confirm instructor availability on the day you want. The quiet period (10am–noon weekday) gives most personalized instruction time. Hotel pools are generally 25m — shorter than Olympic standard but sufficient for learning. Lesson packages available for children staying at the hotel.",
  },
  {
    name: "Private Swim Schools",
    emoji: "🎓",
    area: "Swimming academies across Bangkok — On Nut, Ekkamai, Thonglor",
    price: "Private lesson ฿600–1,200/hour; Group lesson ฿300–500/class",
    why: "Bangkok has multiple specialized swimming academies offering professional adult and children's instruction. STSA (Swim Thailand Swimming Academy), Bangkok Aquatics, and various school-affiliated swim clubs provide structured learn-to-swim programs. Results-oriented — many Bangkok children learn competitive swimming from young ages.",
    tip: "For children: structured 8–12 lesson packages more effective than casual sessions. Ask about certified instructors (Thai Swimming Federation or ASA-certified). Trial lesson often available. Competitive swim training available for children who show ability — Bangkok has produced national-level swimmers.",
  },
];

export function BangkokSwimmingLessons() {
  return (
    <div className="rounded-2xl border border-blue-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-blue-700 mb-3">
        🏊 Swimming lessons in Bangkok — public pools, hotels & swim academies
      </h2>
      <div className="space-y-2">
        {OPTIONS.map((o) => (
          <div key={o.name} className="border border-blue-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{o.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{o.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{o.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{o.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{o.why}</div>
            <div className="text-[10px] text-blue-700">💡 {o.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
