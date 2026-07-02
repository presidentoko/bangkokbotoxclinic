"use client";

import { useState } from "react";

const QUESTIONS = [
  {
    q: "You're entering a Thai temple. What should you do?",
    options: [
      { label: "Take off your shoes and cover your knees and shoulders", correct: true },
      { label: "Just take off your shoes", correct: false },
      { label: "Keep shoes on, the floor is hot", correct: false },
    ],
    explain: "Shoes off + covered legs/shoulders is required at all major Bangkok temples. Some provide sarongs at the entrance.",
  },
  {
    q: "You want to point at something in Thailand — which body part do you use?",
    options: [
      { label: "Point with your whole hand (open palm)", correct: true },
      { label: "Point with your index finger", correct: false },
      { label: "Gesture with your foot", correct: false },
    ],
    explain: "Pointing with a single finger is considered rude in Thai culture. Use an open hand. Never use your foot to point — feet are the lowest/least sacred body part.",
  },
  {
    q: "A Thai person smiles but seems to be giving you bad news. Why?",
    options: [
      { label: "A smile masks discomfort, disappointment, or embarrassment", correct: true },
      { label: "They are actually happy about the situation", correct: false },
      { label: "They are joking", correct: false },
    ],
    explain: "The 'Thai smile' has many meanings. Thais often smile to mask negative emotions — it can mean embarrassment, confusion, or discomfort. Don't assume positivity.",
  },
  {
    q: "When paying at a restaurant, you should:",
    options: [
      { label: "Put money on the tray — don't hand it to the server", correct: true },
      { label: "Hand money directly into the server's hands", correct: false },
      { label: "Leave it under the plate", correct: false },
    ],
    explain: "Money is placed on the tray or bill folder, not handed person-to-person. This applies especially to female servers receiving money from male customers.",
  },
];

export function ThaiEtiquetteQuiz() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = QUESTIONS[current];

  const handleAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (q.options[idx].correct) setScore((s) => s + 1);
  };

  const next = () => {
    if (current + 1 >= QUESTIONS.length) {
      setDone(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
    }
  };

  const reset = () => {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setDone(false);
  };

  if (done) {
    const pct = Math.round((score / QUESTIONS.length) * 100);
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
        <div className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">🙏 Thai etiquette quiz</div>
        <div className="text-center py-4">
          <div className="text-4xl mb-2">{pct >= 75 ? "🎉" : pct >= 50 ? "👍" : "📚"}</div>
          <div className="font-black text-xl mb-1">{score}/{QUESTIONS.length} correct</div>
          <div className="text-sm text-[var(--muted)] mb-4">{pct >= 75 ? "You're culturally aware — Thais will appreciate it!" : pct >= 50 ? "Good start. Brush up before your visit." : "Study up — Thai etiquette matters a lot here."}</div>
          <button onClick={reset} className="text-xs font-bold text-orange-600 border border-orange-200 rounded-full px-4 py-1.5 hover:bg-orange-50 transition">
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        🙏 Thai etiquette quiz
      </div>
      <div className="text-xs text-[var(--muted)] mb-3">{current + 1} / {QUESTIONS.length}</div>
      <div className="font-bold text-sm mb-3">{q.q}</div>
      <div className="space-y-2 mb-3">
        {q.options.map((o, i) => {
          let cls = "border-[var(--border)] text-[var(--fg)]";
          if (selected !== null) {
            if (o.correct) cls = "border-green-400 bg-green-50 text-green-800";
            else if (i === selected && !o.correct) cls = "border-red-300 bg-red-50 text-red-700";
          }
          return (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              className={`w-full text-left text-xs font-medium px-4 py-2.5 rounded-xl border transition ${cls}`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <div className="text-[10px] text-[var(--muted)] bg-gray-50 rounded-xl p-2.5 mb-3 leading-relaxed">
          💡 {q.explain}
        </div>
      )}
      {selected !== null && (
        <button onClick={next} className="w-full text-xs font-bold text-white bg-orange-500 rounded-full py-2 hover:bg-orange-600 transition">
          {current + 1 >= QUESTIONS.length ? "See results →" : "Next question →"}
        </button>
      )}
    </div>
  );
}
