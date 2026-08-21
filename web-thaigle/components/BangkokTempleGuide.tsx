const TEMPLES = [
  {
    name: "Wat Pho (Temple of Reclining Buddha)",
    emoji: "🛕",
    highlight: "49m reclining Buddha covered in gold leaf",
    area: "Rattanakosin (Tha Tien pier)",
    hours: "8am–6:30pm",
    admission: "฿200",
    time: "1–1.5 hrs",
    tip: "Come early morning before crowds. Massage school inside — ฿420/hr. Mother temple of Thai massage.",
  },
  {
    name: "Wat Arun (Temple of Dawn)",
    emoji: "🌅",
    highlight: "Porcelain-encrusted spires on Chao Phraya riverside. Best at sunset from the east bank.",
    area: "Arun Amarin (ferry from Tha Tien)",
    hours: "8am–6pm",
    admission: "฿100",
    time: "45 min–1 hr",
    tip: "Cross the river from Tha Tien pier for ฿5. Climb the steep central prang — 360° views. Sunrise from the east bank (free photo spot at Tha Tien).",
  },
  {
    name: "Wat Phra Kaew + Grand Palace",
    emoji: "👑",
    highlight: "Thailand's most sacred site. Home of the Emerald Buddha.",
    area: "Rattanakosin (Tha Chang pier)",
    hours: "8:30am–3:30pm (last entry 3pm)",
    admission: "฿500",
    time: "2–3 hrs",
    tip: "Must cover knees and shoulders. Sarongs rentable at gate for free. Go early — closes 3:30pm, fills up by 10am with tour groups.",
  },
  {
    name: "Wat Saket (Golden Mount)",
    emoji: "⛰️",
    highlight: "Artificial hill with golden chedi. 344 steps. City panorama 360°.",
    area: "Phra Nakhon (Khlong Saen Saep boat)",
    hours: "8am–5pm",
    admission: "฿20",
    time: "45 min",
    tip: "Underrated. Less crowded than Wat Pho/Phra Kaew. November festival (Loy Krathong) is spectacular — lanterns everywhere.",
  },
  {
    name: "Wat Benchamabophit (Marble Temple)",
    emoji: "⬜",
    highlight: "Italian Carrara marble exterior. Monks collecting alms 5:30–6:30am.",
    area: "Dusit (near Chitralada Palace)",
    hours: "8am–5pm",
    admission: "฿20",
    time: "30–45 min",
    tip: "Least-visited of the major temples. Quiet, beautiful. Go at 5:30am to witness the alms-giving procession — longest single-temple procession in Bangkok.",
  },
];

const DRESS_CODE = [
  "No shorts (must cover knees)",
  "No sleeveless tops (shoulders must be covered)",
  "No tight clothing",
  "Remove shoes before entering any temple building",
  "Never point feet toward Buddha image",
  "Never touch monks if you are female",
];

export function BangkokTempleGuide() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        🛕 Bangkok temples — essential guide
      </h2>
      <div className="space-y-2 mb-3">
        {TEMPLES.map((t) => (
          <div key={t.name} className="border border-[var(--border)] rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-xl shrink-0">{t.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{t.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">📍 {t.area} · {t.hours} · ⏱️ {t.time}</div>
              </div>
              <span className="shrink-0 text-[11px] font-mono font-black text-green-700">{t.admission}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-1 leading-snug">{t.highlight}</div>
            <div className="text-[10px] text-orange-600">💡 {t.tip}</div>
          </div>
        ))}
      </div>
      <div className="text-xs font-black mb-2">Temple dress code</div>
      <div className="space-y-1">
        {DRESS_CODE.map((d) => (
          <div key={d} className="text-[10px] flex gap-1.5 items-start">
            <span className="shrink-0 text-red-500">✗</span>{d}
          </div>
        ))}
      </div>
    </div>
  );
}
