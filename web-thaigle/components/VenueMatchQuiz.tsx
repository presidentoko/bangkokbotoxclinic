"use client";

import { useState } from "react";

const QUESTIONS = [
  {
    q: "How do you feel about spice?",
    options: [
      { label: "The hotter the better 🌶️", value: "spicy" },
      { label: "Medium is fine", value: "medium" },
      { label: "I prefer mild", value: "mild" },
    ],
  },
  {
    q: "What matters most to you?",
    options: [
      { label: "Atmosphere & vibe 🌃", value: "vibe" },
      { label: "Pure food quality 🍜", value: "food" },
      { label: "Value for money 💸", value: "value" },
    ],
  },
];

const RESULTS: Record<string, { title: string; url: string; desc: string; emoji: string }> = {
  "spicy-vibe":    { emoji: "🌶️", title: "Chinatown street food", desc: "Bold flavours, electric atmosphere", url: "/restaurants/bangkok/chinatown" },
  "spicy-food":    { emoji: "🔥", title: "Isaan restaurant", desc: "Pure Northeastern Thai — som tam, grilled pork, sticky rice", url: "/restaurants/bangkok" },
  "spicy-value":   { emoji: "🛺", title: "Local Isaan market", desc: "Best bang per baht in Bangkok", url: "/restaurants/bangkok" },
  "medium-vibe":   { emoji: "🌿", title: "Ari neighbourhood café", desc: "Relaxed, hip, great all-day dining", url: "/restaurants/bangkok/ari" },
  "medium-food":   { emoji: "👨‍🍳", title: "Nahm or Paste", desc: "World-class Thai fine dining with depth of flavour", url: "/restaurants/bangkok/silom" },
  "medium-value":  { emoji: "🏬", title: "Terminal 21 food court", desc: "Pier 21 — best cheap authentic food in Bangkok", url: "/restaurants/bangkok/sukhumvit" },
  "mild-vibe":     { emoji: "🌃", title: "Thonglor rooftop bar", desc: "Tokyo-vibe izakayas and cocktail rooftops", url: "/restaurants/bangkok/thonglor" },
  "mild-food":     { emoji: "🍣", title: "Japanese Sukhumvit belt", desc: "Bangkok has some of Asia's best Japanese outside Japan", url: "/restaurants/bangkok/sukhumvit" },
  "mild-value":    { emoji: "🥡", title: "Or Tor Kor Market", desc: "Premium local produce, non-spicy options, great value", url: "/restaurants/bangkok" },
};

export function VenueMatchQuiz() {
  const [answers, setAnswers] = useState<string[]>([]);

  const current = answers.length < QUESTIONS.length ? QUESTIONS[answers.length] : null;
  const resultKey = answers.join("-");
  const result = answers.length === QUESTIONS.length ? RESULTS[resultKey] : null;

  const handleAnswer = (value: string) => setAnswers([...answers, value]);
  const reset = () => setAnswers([]);

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-gradient-to-br from-orange-50 to-amber-50 p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-orange-700 mb-3">
        🎯 Quick venue match
      </div>
      {current && (
        <div>
          <div className="font-bold text-sm text-[var(--fg)] mb-3">{current.q}</div>
          <div className="space-y-2">
            {current.options.map((o) => (
              <button
                key={o.value}
                onClick={() => handleAnswer(o.value)}
                className="w-full text-left text-xs font-medium px-4 py-2.5 rounded-xl border border-orange-200 bg-white hover:border-orange-400 hover:shadow-sm transition"
              >
                {o.label}
              </button>
            ))}
          </div>
          <div className="mt-2 text-[10px] text-[var(--muted)] text-center">{answers.length + 1} of {QUESTIONS.length}</div>
        </div>
      )}
      {result && (
        <div>
          <div className="text-center mb-3">
            <div className="text-3xl mb-1">{result.emoji}</div>
            <div className="font-black text-sm">{result.title}</div>
            <div className="text-xs text-[var(--muted)] mt-0.5">{result.desc}</div>
          </div>
          <a
            href={result.url}
            className="block text-center text-xs font-bold text-white bg-orange-500 rounded-full py-2 hover:bg-orange-600 transition mb-2"
          >
            See restaurants →
          </a>
          <button
            onClick={reset}
            className="block w-full text-center text-xs font-bold text-orange-600 border border-orange-200 rounded-full py-1.5 hover:bg-orange-50 transition"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
