const INFO = [
  {
    name: "Knitting & Yarn Craft in Bangkok",
    emoji: "🧶",
    area: "Chatuchak Weekend Market (Section 9), Siam Paragon & Central World fabric zones",
    price: "Yarn: ฿80–500/skein; Pattern books: ฿150–400",
    why: "Bangkok has a growing hand-knitting community driven primarily by Thai millennials and expats looking for meditative craft hobbies in a city that can feel overwhelming. Thai climate makes heavier knitting (wool sweaters, blankets) impractical for personal use, so Bangkok knitters focus on cotton amigurumi (knitted/crocheted figures), lightweight accessories, plant hangers, and gifts for cooler-climate relatives. The craft community is predominantly female and very active on Instagram and Facebook.",
    tip: "Thai craft community on Facebook: 'ถักวงใย' (Knitting Circle) and 'Crochet Thailand' have tens of thousands of members and organize regular meetups at cafés across Bangkok. The Chatuchak Market yarn section (Section 9, weekend only) has significantly lower yarn prices than Paragon or Central World. Import yarns (Drops, Paintbox) are available at dedicated craft shops in Siam and On Nut areas.",
  },
  {
    name: "Crochet Amigurumi Scene",
    emoji: "🐻",
    area: "Online-first community; workshops at various Bangkok studios",
    price: "Beginner workshop ฿500–1,200; Amigurumi kit ฿200–500",
    why: "Amigurumi (Japanese term for crocheted/knitted stuffed animals and figures) has exploded in Bangkok — hand-made character figures at weekend markets, Chatuchak stalls, and online marketplaces. The Bangkok amigurumi scene is distinct from Western knitting — patterns include Thai characters, kawaii-influenced designs, and custom commissions for LINE/K-pop fan content. Teaching amigurumi is a micro-business for many Bangkok craft makers.",
    tip: "Amigurumi workshops range from 2-hour beginner sessions (make one small character) to 3-day courses covering pattern reading, tension control, and stuffing technique. The best Bangkok amigurumi workshops are booked through Eventbrite, Facebook events, or the MakeClub Thailand website. Students keep their project — a finished 10cm character after a 3-hour session.",
  },
  {
    name: "Crochet & Weaving Workshop Cafés",
    emoji: "☕",
    area: "Ari, Ekkamai, Silom — craft café studios",
    price: "Workshop with café ฿400–900/session",
    why: "The Bangkok craft café concept (workshop + coffee in the same session) has popularized weaving, knitting, and crochet as social activities. Several Ari and Ekkamai cafés run weekly sessions with an instructor at each table — arrive, order coffee, pick up a project kit, start making. The social environment removes intimidation for solo first-timers. Many regulars attend weekly as a de-stress routine.",
    tip: "The workshop-café format is specifically designed to be interruptable — you can put down your project at any point. This makes it more accessible than a structured class. Look for Thai terms: 'เวิร์คชอป' (workshop) and 'ถักโครเชต์' (crochet). A Google search for 'Bangkok crochet workshop café' produces current active venues as the specific shops change seasonally.",
  },
];

export function BangkokKnitting() {
  return (
    <div className="rounded-2xl border border-pink-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-pink-700 mb-3">
        🧶 Knitting & crochet in Bangkok — yarn shops, amigurumi workshops & craft cafés
      </div>
      <div className="space-y-2">
        {INFO.map((i) => (
          <div key={i.name} className="border border-pink-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{i.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{i.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{i.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{i.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{i.why}</div>
            <div className="text-[10px] text-pink-700">💡 {i.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
