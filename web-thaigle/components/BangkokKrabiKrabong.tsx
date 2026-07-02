const SPOTS = [
  {
    name: "Krabi Krabong — Thailand's Ancient Sword Fighting",
    emoji: "⚔️",
    area: "Traditional Krabi Krabong schools in Bangkok, demonstrations at the National Museum Bangkok, occasional performances at temple fairs and royal ceremonies, specialized martial arts academies in Nonthaburi",
    price: "Krabi Krabong introduction class: ฿800–2,000; Regular training (per session): ฿400–800; Traditional weapons (practice swords): ฿500–3,000; Demonstration viewing: free–฿300",
    why: "Krabi krabong (กระบี่กระบอง) is Thailand's traditional armed martial art — using swords, staffs, pikes, and shields in stylized combat forms that trace directly to the weapons systems of the Ayutthaya and early Rattanakosin kingdoms. The name combines the two primary weapons: krabi (single-edged curved sword, similar to a short machete) and krabong (staff). Krabi krabong is one of the most visually spectacular of Southeast Asia's traditional martial systems — the stylized forms (mae mai) create flowing, dance-like patterns that, combined with theatrical costumes and traditional music, produce performances that blur the line between combat demonstration and ceremonial dance. The art is closely related to Muay Thai historically — Muay Thai is the unarmed component of the same kingdom military system; krabi krabong is the armed component. Thailand's royal military academies and the Physical Education Department preserve and teach the art, and several Bangkok schools maintain lineages of traditional teaching.",
    tip: "Krabi krabong access in Bangkok: (1) Cultural context first: viewing a demonstration before attempting training provides essential cultural orientation — the National Museum Bangkok occasionally hosts demonstrations, and some traditional school open days include performances; (2) Training availability: dedicated traditional krabi krabong training (as opposed to modern sport performance arts) is concentrated at a small number of serious traditional schools in Bangkok; these require genuine commitment and aren't typically offered as tourist drop-in experiences; (3) Related Muay Boran connection: Muay Boran (ancient boxing, the predecessor to modern Muay Thai) is taught at several Bangkok schools alongside krabi krabong — these traditional combat arts schools provide authentic training experiences; (4) Souvenir weapons: traditional Thai sword reproductions (krabi) are available at Chatuchak market and specialty shops — the curved single-edge blade is distinctively Thai and differs from Chinese and Japanese sword aesthetics; (5) Documentary resources: the Association Krabi Krabong has worked to preserve and document the art; searching in Thai-language sources reveals more current school locations than English resources.",
  },
  {
    name: "Silat — Malay Martial Art in Bangkok",
    emoji: "🥋",
    area: "Bangkok's Southern Thai and Malay Muslim communities (Silom area, Bang Rak), periodic workshops by visiting Silat masters, Martial arts festivals that include Silat demonstrations",
    price: "Silat class: ฿400–900 per session; Workshop with master: ฿1,500–3,500; Training equipment: ฿1,000–5,000; Demonstration/performance: free–฿200",
    why: "Pencak Silat — the umbrella term for the Malay-Indonesian archipelago's traditional martial art systems — has a presence in Bangkok through Thailand's Malay Muslim community (concentrated in the southern provinces but with significant Bangkok migration) and growing interest from martial arts practitioners seeking traditional Southeast Asian combat systems. Silat encompasses hundreds of regional styles across Malaysia, Indonesia, and the Philippines, each with distinct emphasis — some focused on weapons (blade, sarong, staff), some on ground fighting, some on striking. The Thai style practiced in Bangkok's southern Muslim community context is often Silat Melayu Kelantan or related forms from the Thai-Malay border region. Silat differs aesthetically and technically from both Muay Thai and Chinese martial arts — the footwork patterns (langkah) and the integration of rhythmic movement with sudden explosive technique give Silat a distinctive character.",
    tip: "Finding Silat in Bangkok: (1) Community access: Bangkok's Silat training is embedded in the Malay Muslim community rather than openly marketed; connecting through the Islamic Cultural Center Bangkok, mosque communities in Silom area, or martial arts enthusiast Facebook groups reaches the practitioners; (2) Malaysian community link: the Malaysian Embassy in Bangkok occasionally hosts Malaysian cultural events that include Silat demonstrations — checking embassy social media for event announcements; (3) Bangkok martial arts festivals: occasional multi-art festivals that gather traditional Southeast Asian martial arts (Muay Boran, Silat, Bokator, Arnis) provide demonstration opportunities; (4) The aesthetic dimension: Silat performance (gelanggang) incorporates music (gendang tambourine and serunai wind instruments) and costume — the cultural performance aspect is significant and viewing this before any training provides essential context; (5) Regional proximity: visiting Pattani, Kelantan (Malaysia), or Yala province on a longer Thailand trip reaches deeper Silat cultural contexts than Bangkok offers.",
  },
  {
    name: "Capoeira Bangkok — Brazilian Martial Art Community",
    emoji: "🌀",
    area: "Capoeira groups in Bangkok — Lumpini Park (outdoor practice groups, weekend mornings), dedicated capoeira academies in Sukhumvit area, occasional batizado events with visiting mestres",
    price: "Capoeira class: ฿350–700 per session; Monthly training: ฿2,500–5,000; Batizado (grading event): ฿1,500–4,000; Berimbau (traditional instrument): ฿2,000–8,000",
    why: "Capoeira — the Afro-Brazilian martial art that combines fighting, dance, music, and acrobatics into an expressive dialogue between partners — has an active community in Bangkok with multiple groups maintaining regular training. The art was developed by enslaved Africans in Brazil as a disguised form of combat, set to music to appear as dance during oppressive colonial conditions; the contemporary practice maintains this dual nature — genuine combat capability expressed through musical, rhythmic, and acrobatic movement. Bangkok's capoeira groups draw both from the substantial Brazilian expat community (working in Bangkok's fashion, design, and international business sectors) and from Thai practitioners who encountered the art through martial arts cross-training or international travel. The jogo (game) — the improvised sparring between two capoeiristas within a roda (circle of musicians and participants) — creates a community gathering event unlike any other martial art.",
    tip: "Bangkok capoeira community access: (1) Roda participation is open: capoeira rodas (the circle training sessions with live music) typically welcome respectful observers who want to watch before participating; the community energy and music create a compelling spectator experience even without training background; (2) Live music requirement: capoeira without music is not capoeira — training includes learning to clap, sing, and play simple percussion instruments alongside the physical practice; (3) Bangkok groups: searching 'Capoeira Bangkok' on Facebook and Instagram reveals currently active groups; groups vary in lineage (Angola, Regional, or Contemporary approaches) and openness to beginners; (4) Batizado events: periodic batizado (graduation ceremonies) bring visiting mestres (masters) to Bangkok for seminars and demonstrations — these provide access to high-level traditional practitioners; (5) Lumpini Park outdoor practice: some Bangkok capoeira groups meet at Lumpini Park on weekend mornings — the outdoor setting, alongside other martial arts and fitness groups that use the park, creates an interesting cultural mosaic.",
  },
];

export function BangkokKrabiKrabong() {
  return (
    <div className="rounded-2xl border border-red-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-red-700 mb-3">
        ⚔️ Bangkok traditional martial arts — Krabi Krabong, Silat & Capoeira
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-red-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-red-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
