const SPOTS = [
  {
    name: "Lumpini Park — Morning Tai Chi Community",
    emoji: "🌅",
    area: "Lumpini Park, Silom — free community practice 6–8am daily",
    price: "Free (community); Formal lessons ฿500–1,500/session",
    why: "Lumpini Park hosts Bangkok's most accessible tai chi community — groups of Chinese-Thai practitioners gather under the trees near the park's northern entrance between 5:30–8:00am daily. This is authentic community tai chi practice (not tourist-oriented), primarily older Chinese-Thai residents maintaining a cultural tradition brought from mainland China and Taiwan generations ago. Several styles visible simultaneously — Yang, Wu, Chen. The social culture around it includes qigong, fan forms, and sword forms alongside the hand forms.",
    tip: "Joining the Lumpini Park tai chi group: arrive early (6–6:30am) and observe before joining — the etiquette is to watch a group's style and ask permission to practice alongside. Most practitioners are welcoming to respectful foreign participants, especially if you demonstrate any existing form knowledge. The groups speak primarily Thai and Cantonese/Mandarin — bringing a Thai friend or learning a few words of greeting in Chinese goes a long way. Wear comfortable shoes (not sneakers — traditional tai chi footwear is flat-soled).",
  },
  {
    name: "Chen Village Tai Chi Bangkok",
    emoji: "🐉",
    area: "Various locations; check FB group 'Tai Chi Bangkok'",
    price: "Group class ฿200–400/session; Private ฿800–2,000",
    why: "Bangkok has a small but committed tai chi teaching community with certified instructors in Yang, Chen, and Wu styles. Chen style (the oldest lineage, with explosive movements and silk-reeling) has a particularly active Bangkok presence through instructors who trained in the Chen Village lineage. The community connects through Facebook groups and occasional seminars bringing visiting masters from China, Taiwan, and Singapore. Authentic lineage-based teaching is available in Bangkok for serious practitioners.",
    tip: "Finding reliable tai chi instruction in Bangkok: the 'Tai Chi Bangkok' Facebook group and 'Traditional Chinese Martial Arts Thailand' are the best starting points. Beware of 'tai chi' offerings in tourist gyms that are more fitness class than transmission of the art. A legitimate lineage teacher will demonstrate a form clearly, explain the martial principles behind each movement, and have identifiable lineage connections (teacher → grandteacher). Short-form Yang (the 24-form) is the most widely available beginner path.",
  },
  {
    name: "Qigong & Medical Qigong in Bangkok",
    emoji: "🧘",
    area: "TCM clinics, Chinese community associations, wellness centers",
    price: "Group class ฿200–500; TCM clinic qigong sessions ฿300–800",
    why: "Qigong (chi gung) — the breathing, movement, and meditation practices closely related to tai chi — has a broader presence in Bangkok than tai chi itself. Traditional Chinese Medicine (TCM) clinics throughout Bangkok incorporate qigong into their therapeutic offerings. The Chinese-Thai associations (Huay Khwang has a substantial Chinese-Thai community) offer qigong instruction as cultural preservation. Baduanjin (Eight Brocades) and Yijin Jing (Muscle-Tendon Changing Classic) are the two most commonly taught therapeutic qigong sequences.",
    tip: "Medical qigong in Bangkok: look for TCM clinics that explicitly offer qigong alongside acupuncture — this pairing indicates a more traditional clinical approach. The Hua Chiew Hospital (Chinese community hospital) has TCM and qigong programming. For standalone qigong classes, Benjamarachutit Park in Ratchathewi has morning qigong groups. Even 15 minutes of qigong practice in the morning in a Bangkok park (especially Lumpini) provides immediate wellbeing benefits in the humid morning air.",
  },
];

export function BangkokTaiChi() {
  return (
    <div className="rounded-2xl border border-emerald-300 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-emerald-800 mb-3">
        🐉 Tai chi & qigong in Bangkok — Lumpini Park morning practice, Chen style & qigong classes
      </h2>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-emerald-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-emerald-800">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
