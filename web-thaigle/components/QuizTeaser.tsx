"use client";
import { useEffect, useState } from "react";

const QUESTIONS = [
  "Are you a solo explorer, couple, or group?",
  "Budget ฿500/day or ฿5,000/day — which fits you?",
  "Street food or sit-down restaurant?",
  "Morning yoga or late-night rooftop bar?",
  "Hidden gem or famous Instagram spot?",
];

export function QuizTeaser() {
  const [q, setQ] = useState("");

  useEffect(() => {
    const idx = Math.floor(Date.now() / 86400000) % QUESTIONS.length;
    setQ(QUESTIONS[idx]);
  }, []);

  if (!q) return null;

  return (
    <a
      href="/quiz"
      className="block rounded-2xl border border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 p-4 my-4 hover:border-orange-400 hover:shadow-md transition group"
    >
      <div className="text-xs font-black uppercase tracking-widest text-orange-600 mb-1.5">🎯 Quick question</div>
      <div className="font-bold text-sm text-orange-900 group-hover:text-orange-700 transition mb-1">{q}</div>
      <div className="text-xs text-orange-700 opacity-80">
        Take the 5-question Bangkok quiz → get personalized picks
        <span className="ml-1 group-hover:translate-x-1 inline-block transition">→</span>
      </div>
    </a>
  );
}
