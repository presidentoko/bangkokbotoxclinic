"use client";

import { useState, useEffect } from "react";

const PHRASES = [
  { thai: "ขอบคุณครับ / ครับ", roman: "Khob khun khrap / kha", meaning: "Thank you (male / female)", context: "Add ครับ (men) or ค่ะ (women) to be polite" },
  { thai: "เท่าไหร่ครับ?", roman: "Thao rai khrap?", meaning: "How much is it?", context: "Essential for markets and street food" },
  { thai: "ไม่เผ็ดนะครับ", roman: "Mai phet na khrap", meaning: "Not spicy please", context: "Say this at any street food stall" },
  { thai: "อร่อยมาก!", roman: "Aroy mak!", meaning: "Very delicious!", context: "Biggest compliment to any cook" },
  { thai: "ห้องน้ำอยู่ที่ไหนครับ?", roman: "Hong nam yu thi nai?", meaning: "Where is the toilet?", context: "Works in any restaurant or mall" },
  { thai: "ขอโทษครับ", roman: "Kho thot khrap", meaning: "I'm sorry / Excuse me", context: "Useful in crowded places like markets" },
  { thai: "ไม่เป็นไร", roman: "Mai pen rai", meaning: "Never mind / No problem", context: "Thailand's famous easygoing phrase" },
  { thai: "แพงไปครับ", roman: "Phaeng pai khrap", meaning: "It's too expensive", context: "Start of any Chatuchak Market negotiation" },
  { thai: "ลดได้ไหมครับ?", roman: "Lot dai mai khrap?", meaning: "Can you reduce the price?", context: "For bargaining at markets" },
  { thai: "สวัสดีครับ", roman: "Sawadee khrap", meaning: "Hello / Goodbye", context: "Works for both greetings and farewells" },
  { thai: "ไปไหน?", roman: "Pai nai?", meaning: "Where are you going?", context: "Casual greeting — no need to answer!" },
  { thai: "อร่อย", roman: "Aroy", meaning: "Delicious", context: "One word every Bangkok visitor needs" },
  { thai: "เมนูภาษาอังกฤษมีไหมครับ?", roman: "Menu phasa angkrit mi mai?", meaning: "Do you have an English menu?", context: "Most Bangkok restaurants have one" },
  { thai: "น้ำเปล่าครับ", roman: "Nam plao khrap", meaning: "Plain water please", context: "Tap water isn't safe — always say this" },
  { thai: "เดินทางปลอดภัยนะครับ", roman: "Dern thang plod phai na", meaning: "Safe travels!", context: "A warm Thai goodbye" },
];

export function ThaiPhrase() {
  const [phrase, setPhrase] = useState<typeof PHRASES[0] | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const idx = Math.floor(Date.now() / 86400000) % PHRASES.length;
      setPhrase(PHRASES[idx]);
    } catch {}
  }, []);

  if (!phrase || dismissed) return null;

  const copyPhrase = () => {
    navigator.clipboard.writeText(phrase.thai).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  };

  return (
    <div className="mb-6 p-4 rounded-2xl bg-teal-50 border border-teal-200 relative">
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-3 right-3 text-teal-400 hover:text-teal-700 text-lg leading-none"
        aria-label="Dismiss phrase"
      >×</button>
      <div className="text-[10px] font-bold uppercase tracking-widest text-teal-600 mb-1.5">🇹🇭 Thai phrase of the day</div>
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="text-xl font-bold text-teal-900 mb-0.5">{phrase.thai}</div>
          <div className="text-sm text-teal-700 italic mb-0.5">{phrase.roman}</div>
          <div className="text-sm font-bold text-teal-800 mb-1">{phrase.meaning}</div>
          <div className="text-xs text-teal-600">{phrase.context}</div>
        </div>
        <button
          onClick={copyPhrase}
          className="shrink-0 text-xs px-2.5 py-1 rounded-full border border-teal-300 text-teal-700 hover:bg-teal-100 transition font-bold mt-1"
        >
          {copied ? "✓" : "Copy"}
        </button>
      </div>
      <a href="/local-tips" className="mt-2 inline-flex text-[10px] font-bold text-teal-600 hover:underline">
        More local tips →
      </a>
    </div>
  );
}
