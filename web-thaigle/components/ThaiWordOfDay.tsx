"use client";
import { useEffect, useState } from "react";

const WORDS = [
  { thai: "อร่อย", romanized: "aroi", meaning: "Delicious", context: "The most important word for any Bangkok foodie." },
  { thai: "เท่าไหร่", romanized: "tao rai", meaning: "How much?", context: "Essential for markets and street food. Always ask before picking up." },
  { thai: "ขอบคุณ", romanized: "khob khun", meaning: "Thank you", context: "Add ครับ (khrap) if you're male or ค่ะ (kha) if female to be extra polite." },
  { thai: "ห้องน้ำ", romanized: "hong nam", meaning: "Toilet / bathroom", context: "Literally 'water room'. You'll use this one a lot." },
  { thai: "สวัสดี", romanized: "sawasdee", meaning: "Hello / goodbye", context: "Works for both greeting and farewell. Always well-received with a smile and wai." },
  { thai: "เผ็ด", romanized: "phet", meaning: "Spicy", context: "Warn the chef: ไม่เผ็ด (mai phet) = not spicy. Essential for sensitive stomachs." },
  { thai: "ไม่เป็นไร", romanized: "mai bpen rai", meaning: "Never mind / no worries", context: "Thailand's national philosophy — relax, go with the flow." },
  { thai: "มีที่นั่งไหม", romanized: "mee tee nang mai", meaning: "Do you have a table?", context: "Used at busy restaurants when the front is chaotic." },
];

export function ThaiWordOfDay() {
  const [word, setWord] = useState<typeof WORDS[number] | null>(null);

  useEffect(() => {
    const seed = Math.floor(Date.now() / 86400000);
    setWord(WORDS[seed % WORDS.length]);
  }, []);

  if (!word) return null;

  return (
    <div className="rounded-2xl border border-teal-200 bg-teal-50 p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-teal-700 mb-3">
        🇹🇭 Thai word of the day
      </div>
      <div className="flex items-start gap-3">
        <div className="shrink-0 text-center px-3 py-2 bg-teal-600 rounded-xl">
          <div className="text-white font-black text-lg leading-tight">{word.thai}</div>
          <div className="text-teal-200 text-[10px] font-medium mt-0.5">{word.romanized}</div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-black text-sm text-teal-900">= &ldquo;{word.meaning}&rdquo;</div>
          <div className="text-xs text-teal-800 opacity-90 leading-snug mt-1">{word.context}</div>
        </div>
      </div>
      <a
        href="/local-tips"
        className="mt-3 block text-center text-xs font-bold text-teal-700 border border-teal-300 bg-white rounded-full py-1.5 hover:bg-teal-100 transition"
      >
        More Thai phrases →
      </a>
    </div>
  );
}
