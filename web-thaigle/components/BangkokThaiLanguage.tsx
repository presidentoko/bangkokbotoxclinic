const PHRASES = [
  { category: "Basics", items: [
    { thai: "สวัสดี", romanized: "Sawasdee (kha/khrap)", english: "Hello / Goodbye", note: "Add 'kha' if female speaker, 'khrap' if male" },
    { thai: "ขอบคุณ", romanized: "Khob khun", english: "Thank you", note: "Add kha/khrap to be polite" },
    { thai: "ใช่ / ไม่ใช่", romanized: "Chai / Mai chai", english: "Yes / No", note: "Tonal — practice before arriving" },
    { thai: "ไม่เป็นไร", romanized: "Mai pen rai", english: "Never mind / No problem", note: "Thai philosophy in three words" },
  ]},
  { category: "Food & Restaurants", items: [
    { thai: "อร่อย", romanized: "Aroy", english: "Delicious", note: "Give this compliment freely — Thais love it" },
    { thai: "ไม่เผ็ด", romanized: "Mai phet", english: "Not spicy", note: "Essential survival phrase" },
    { thai: "เผ็ดน้อย", romanized: "Phet noi", english: "A little spicy", note: "'A little' is still Thai-hot" },
    { thai: "เก็บตังค์", romanized: "Kep tang", english: "Bill please", note: "Waiter: 'check bin' (from English) also works" },
  ]},
  { category: "Getting Around", items: [
    { thai: "ไป...เท่าไหร่", romanized: "Pai... tao rai?", english: "How much to go to...?", note: "For tuk-tuks and taxis" },
    { thai: "เปิดมิเตอร์ด้วย", romanized: "Poet mitoe duay", english: "Use the meter please", note: "Say this when getting in every taxi" },
    { thai: "จอดที่นี่", romanized: "Jort tee nee", english: "Stop here", note: "For motorbike and taxi" },
  ]},
];

export function BangkokThaiLanguage() {
  return (
    <div className="rounded-2xl border border-purple-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-purple-700 mb-3">
        🇹🇭 Thai language basics — essential phrases
      </div>
      <div className="space-y-3">
        {PHRASES.map((section) => (
          <div key={section.category}>
            <div className="text-[10px] font-black uppercase tracking-widest text-purple-600 mb-1.5">{section.category}</div>
            <div className="space-y-1.5">
              {section.items.map((item) => (
                <div key={item.thai} className="border border-purple-100 rounded-xl px-3 py-2">
                  <div className="flex items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <span className="font-black text-purple-800 text-sm mr-2">{item.thai}</span>
                      <span className="text-[11px] text-[var(--muted)] italic">{item.romanized}</span>
                      <div className="text-[10px] font-bold text-[var(--fg)] mt-0.5">{item.english}</div>
                    </div>
                  </div>
                  <div className="text-[10px] text-orange-600 mt-0.5">💡 {item.note}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 text-[10px] bg-purple-50 rounded-xl p-2.5 text-purple-800">
        <strong>Tones matter!</strong> Thai has 5 tones. "Kha" and "Khaa" mean different things. Use a free app like Ling or Thai-English Dictionary (App Store) to hear pronunciation.
      </div>
    </div>
  );
}
