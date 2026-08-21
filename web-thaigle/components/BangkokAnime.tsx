const SPOTS = [
  {
    name: "Anime & Manga Culture in Bangkok",
    emoji: "⛩️",
    area: "MBK Center (anime floors 4–6), Siam Square anime shops, J-Avenue Thonglor",
    price: "Manga volume ฿180–350; Anime figure ฿500–15,000+; Convention ticket ฿300–1,500",
    why: "Bangkok has one of Southeast Asia's most active anime and manga communities — Thai anime fandom is enormous, driven by decades of Japanese animation broadcast on Thai television and a massive Thai doujinshi (fan-created manga) culture. MBK Center's upper floors are anime and gaming merchandise central — multiple shops selling figures, artbooks, doujinshi, cosplay materials, and anime merchandise at prices ranging from budget to premium collector. The Thai doujinshi scene is genuinely creative — Thai artists produce original derivative works at conventions that have a distinct Thai aesthetic influence. Bangkok's Japanese community sustains authentic Japanese anime culture including original import manga available at Japanese bookshops.",
    tip: "Bangkok anime shopping strategy: MBK Center's anime floor (4F–6F) has the highest density of shops but is tourist-visible — the mix of authentic collector items and tourist-grade merchandise requires selective shopping. For rare figures and limited releases: the specialist figure shops on Siam Square and along Silom's otaku corridor have better collector-grade stock. Japanese bookshops: Kinokuniya (Siam Paragon, Emporium) stocks original Japanese-language manga and artbooks — cheaper than importing and legitimately published. Community and events: the Bangkok anime community organizes events including Comic Con Thailand, AFA (Anime Festival Asia) Bangkok editions, and smaller regular meetups — search 'Bangkok Anime' on Facebook for community groups.",
  },
  {
    name: "Cosplay in Bangkok",
    emoji: "🎭",
    area: "Convention centers (BITEC, Impact Arena), Siam Square photo spots, J-Avenue Thonglor",
    price: "Cosplay costume ฿1,000–50,000+ depending on complexity; Convention entry ฿300–1,500",
    why: "Cosplay in Bangkok has developed into a serious creative community — Thai cosplayers are recognized internationally, with Thai creators winning international cosplay competitions. The technical standard of Bangkok's serious cosplay community is high: Thai cosplayers produce detailed armor, props, and complex costumes. The social infrastructure is substantial: Bangkok cosplay groups organize photoshoot meetups, convention groups, and skill-sharing workshops. Bangkok's convention circuit (Comic Con Thailand, Animefest, J-Culture events) provides regular performance venues for cosplay. The creative ecosystem: Bangkok's access to fabric markets (Pak Khlong Talat for fabric, Chatuchak for crafting materials) and craft supply shops provides the raw material access needed for costume building.",
    tip: "Bangkok cosplay community entry points: the Siam Square cosplay meetup area (especially weekend afternoons, near the cinema complex) is an informal gathering point — bring your costume or just come to watch and connect. Costume construction resources: Bangkok has professional prop makers and tailors who specialize in cosplay work — connecting through Facebook cosplay groups can lead to commissioned work or skill-exchange. Photography: Bangkok's urban landscape provides diverse cosplay photo locations — shopping mall lobbies, the Asiatique riverside at night, Pak Khlong Talat flower market at dawn — all have been used creatively by the Bangkok cosplay photography community.",
  },
  {
    name: "Japanese Pop Culture & K-Pop in Bangkok",
    emoji: "🎤",
    area: "K-pop shops (Siam, Thonglor), Japanese cultural events (Japan Foundation Bangkok), fan cafes",
    price: "K-pop album ฿400–1,200; Fan event ticket ฿500–5,000; Japanese cultural events often free",
    why: "Bangkok's East Asian pop culture scene extends well beyond anime — K-pop has an enormous Thai fanbase (Thailand is one of K-pop's largest non-Korean markets), and Korean and Japanese cultural exports (dramas, music, fashion, food) permeate Bangkok popular culture. K-pop fan cafes (themed cafes celebrating specific artists) operate in Thonglor and Siam areas — the Bangkok K-pop community organizes fan meetings, listening parties, and watching parties for Korean music show performances. Japan Foundation Bangkok provides regular Japanese cultural programming — language workshops, film screenings, art exhibitions — that extends the cultural dimension beyond commercial pop culture. Thai-language versions of Japanese and Korean dramas have created deep familiarity with East Asian cultural narratives across the Thai population.",
    tip: "Bangkok K-pop community participation: K-pop dance cover groups in Bangkok organize regular practice sessions and public performances — social media (TikTok Bangkok covers, YouTube dance cover channels) connects you to active groups. K-pop merchandise: specialist shops in Siam Square and Central World stock official and unofficial K-pop goods — authenticity varies. For serious collectors: line up for the Bangkok stops of K-pop world tours at Impact Arena (tickets through ThaiTicketMajor); major acts now regularly include Bangkok in Asian tour schedules. Japan Foundation Bangkok: located near Asoke area — free cultural programming including Japanese film festivals, manga exhibitions, and seasonal cultural events that provide deeper engagement with Japanese culture beyond entertainment media.",
  },
];

export function BangkokAnime() {
  return (
    <div className="rounded-2xl border border-pink-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-pink-700 mb-3">
        ⛩️ Anime, cosplay & J/K-pop in Bangkok — otaku culture, conventions & fan communities
      </h2>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-pink-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-pink-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
