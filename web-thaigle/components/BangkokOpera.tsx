const SPOTS = [
  {
    name: "Classical Music & Opera in Bangkok",
    emoji: "🎼",
    area: "Thailand Cultural Centre (Ratchadaphisek); Prince Mahidol Hall (Mahidol University); Goethe-Institut Bangkok; Alliance Française Bangkok; British Council Bangkok",
    price: "Thailand Philharmonic Orchestra concert: ฿200–1,000; Bangkok Symphony: ฿300–1,500; Opera (visiting production): ฿800–3,000; Cultural center recital: ฿200–600",
    why: "Bangkok's classical music scene spans the Thailand Philharmonic Orchestra at Mahidol University (Southeast Asia's most respected university music faculty), the Bangkok Symphony Orchestra performing at Thailand Cultural Centre, and visiting opera productions from international companies. European cultural centers — Goethe-Institut and Alliance Française — host chamber music recitals and small ensemble performances at accessible prices with high musical quality. Mahidol's Saturday public concert series is a particularly strong value, 40 minutes from central Bangkok. Free outdoor classical concerts appear in Lumpini and Benjakitti Parks during December–February cool season, organized by Bangkok Metropolitan Administration.",
    tip: "Check Thailand Cultural Centre (tcc.or.th) schedule directly for complete program listings. Mahidol Saturday concerts offer exceptional music faculty and guest artist quality. World-class soloists on Asian tours frequently stop in Bangkok — following Thai classical music Facebook groups provides advance notice of these one-off performances.",
  },
  {
    name: "Muay Thai Stadiums — Real Competition vs Tourist Shows",
    emoji: "🥊",
    area: "Rajadamnern Stadium (Ratchadamnoen, Mon/Wed/Thu/Sat nights); Lumpini Stadium (Tue/Fri/Sat); training gyms throughout Bangkok: Yokkao Training Center (Ramkhamhaeng), Evolve MMA (multiple locations), and numerous Sukhumvit-area tourist-friendly training gyms",
    price: "Rajadamnern ringside seat: ฿2,000–3,000; Rajadamnern standard (foreigner): ฿1,500–2,000; Lumpini ticket: ฿500–2,000; Training session (1 hour): ฿400–800; Private lesson: ฿1,000–3,000; 1-week training camp: ฿8,000–25,000",
    why: "Rajadamnern and Lumpini stadiums host authentic professional Muay Thai competition where Thai fighters compete for rankings and prize money — fundamentally different from tourist-oriented shows at Asiatique or Patpong. The stadium experience includes traditional sarama music, referee calls, and Thai spectator betting energy that creates genuine sporting atmosphere. The Wai Kru Ram Muay (pre-fight ritual obeisance dance honoring trainer and the art) precedes every professional bout and is as culturally significant as the fight itself. For training, the distinction is between tourist-first gyms offering experiences versus professional gyms primarily serving Thai and serious foreign fighters — Yokkao and Evolve MMA provide technical standards closer to the professional side while remaining accessible.",
    tip: "Buy tickets at stadium box office (cash, arrive 1 hour before first fight) without agency premiums. Arrive early for the complete card — fights intensify progressively toward the main event. Photography is permitted (no flash). Women's Muay Thai bouts now appear on major stadium cards and represent the most visible growth area of Thai combat sport.",
  },
  {
    name: "Cabaret Shows & Thai Cultural Spectaculars",
    emoji: "🌟",
    area: "Calypso Cabaret (Asiatique Riverfront, nightly); Mambo Cabaret (Victory Monument, multiple shows); Siam Niramit (On Nut — 2,000-seat spectacular, Tue–Sun); Sala Rim Naam dinner theatre (Mandarin Oriental riverside); Muangthai Rachadalai Theatre (Ratchadaphisek, Thai musical productions)",
    price: "Calypso Cabaret: ฿900–1,200; Mambo Cabaret: ฿750–1,000; Siam Niramit: ฿1,200–2,800; Sala Rim Naam dinner + Thai classical dance: ฿2,500–4,500; Muangthai theatre production: ฿800–2,500",
    why: "Bangkok's entertainment spectacle scene spans Thailand's kathoey (transgender) cabaret tradition to large-scale cultural productions. Calypso Cabaret (40+ year history) and Mambo Cabaret produce genuinely theatrical professional shows with elaborate costumes — not adult entertainment, but skilled stage performance. Siam Niramit is Bangkok's most ambitious cultural spectacular: 2,000 seats, multi-million-dollar stage technology, 80-minute wordless presentation of Thai cultural history and mythology accessible to all language speakers. Sala Rim Naam at the Mandarin Oriental combines colonial riverside setting with authentic Khon and Lakhon classical dance during dinner — one of Bangkok's most refined cultural entertainment experiences.",
    tip: "Siam Niramit is completely language-independent (pure physical performance and spectacle) — the most accessible Thai cultural show for non-Thai speakers. Book popular weekend shows 1–2 weeks ahead. Dinner + show packages at Sala Rim Naam represent better value than restaurant + separate show ticket. Calypso's kathoey performers have professional stage training — experiencing the show with awareness of Thailand's kathoey (third gender) cultural tradition adds dimension beyond novelty entertainment.",
  },
];

export function BangkokOpera() {
  return (
    <div className="rounded-2xl border border-indigo-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-indigo-700 mb-3">
        🎼 Bangkok performing arts — classical music, Muay Thai stadiums & cabaret spectacles
      </h2>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-indigo-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-indigo-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
