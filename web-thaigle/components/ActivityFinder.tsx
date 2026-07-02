"use client";
import { useState } from "react";

type Step = { question: string; options: { label: string; emoji: string; value: string }[] };

const STEPS: Step[] = [
  {
    question: "What's your vibe today?",
    options: [
      { label: "Active & sweaty", emoji: "💪", value: "active" },
      { label: "Relax & recharge", emoji: "🧘", value: "relax" },
      { label: "Eat everything", emoji: "🍜", value: "food" },
      { label: "Learn something", emoji: "📚", value: "learn" },
    ],
  },
  {
    question: "Solo or group?",
    options: [
      { label: "Solo", emoji: "🚶", value: "solo" },
      { label: "Couple", emoji: "👫", value: "couple" },
      { label: "Group of friends", emoji: "👯", value: "group" },
      { label: "Family", emoji: "👨‍👩‍👧", value: "family" },
    ],
  },
];

const RESULTS: Record<string, { title: string; url: string; why: string }> = {
  "active-solo":   { title: "Muay Thai training", url: "/activities/muay-thai", why: "Push your limits — solo training is personal and focused" },
  "active-couple": { title: "Yoga class for two", url: "/activities/yoga-pilates", why: "Move together, feel great together" },
  "active-group":  { title: "Muay Thai group class", url: "/activities/muay-thai", why: "Nothing bonds friends like a punch in the face (padded)" },
  "active-family": { title: "Yoga & wellness", url: "/activities/wellness", why: "Safe, fun, and connects all ages" },
  "relax-solo":    { title: "Thai spa day", url: "/activities/spa", why: "Your body will thank you for 2 hours of silence" },
  "relax-couple":  { title: "Couples spa package", url: "/for/couples", why: "Best 2 hours you'll spend in Bangkok" },
  "relax-group":   { title: "Group spa & massage", url: "/activities/spa", why: "Luxe day out — many spas do group bookings" },
  "relax-family":  { title: "Wellness & swimming", url: "/activities/wellness", why: "Kids and adults both win" },
  "food-solo":     { title: "Street food crawl", url: "/restaurants/cuisine/street_food", why: "Eat at your own pace, try everything twice" },
  "food-couple":   { title: "Romantic Thai dinner", url: "/for/date-night", why: "Set the mood with Bangkok's best" },
  "food-group":    { title: "Group Thai BBQ / hot pot", url: "/restaurants/cuisine/thai", why: "More people = more food = more fun" },
  "food-family":   { title: "Family-friendly restaurants", url: "/for/family", why: "Kids menus, space, and zero judgment" },
  "learn-solo":    { title: "Thai cooking class", url: "/activities/cooking", why: "Take home a skill that outlasts the sunburn" },
  "learn-couple":  { title: "Cooking class for two", url: "/activities/cooking", why: "Cook together, eat together, love it" },
  "learn-group":   { title: "Group cooking class", url: "/activities/cooking", why: "Most fun when someone burns the pad thai" },
  "learn-family":  { title: "Family cooking class", url: "/activities/cooking", why: "Kids go crazy for this — Thai food is interactive" },
};

export function ActivityFinder() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  function pick(value: string) {
    const next = [...answers, value];
    if (step < STEPS.length - 1) {
      setAnswers(next);
      setStep(step + 1);
    } else {
      setAnswers(next);
      setDone(true);
    }
  }

  function reset() {
    setStep(0);
    setAnswers([]);
    setDone(false);
  }

  const resultKey = answers.join("-");
  const result = RESULTS[resultKey];

  if (done && result) {
    return (
      <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4 my-4">
        <div className="text-xs text-orange-600 font-bold uppercase mb-1">We found your perfect match</div>
        <div className="font-black text-lg mb-1">{result.title}</div>
        <div className="text-xs text-[var(--muted)] mb-3">{result.why}</div>
        <div className="flex gap-2">
          <a href={result.url} className="flex-1 text-center bg-orange-500 text-white text-sm font-bold py-2 rounded-full hover:bg-orange-600 transition">
            See options →
          </a>
          <button onClick={reset} className="px-3 py-2 border border-[var(--border)] rounded-full text-xs text-[var(--muted)] hover:text-black transition">
            Start over
          </button>
        </div>
      </div>
    );
  }

  const current = STEPS[step];

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <div className="flex justify-between items-center mb-3">
        <div className="text-sm font-black">🎯 Find Your Activity</div>
        <div className="text-xs text-[var(--muted)]">{step + 1}/{STEPS.length}</div>
      </div>
      <div className="text-sm font-medium mb-3">{current.question}</div>
      <div className="grid grid-cols-2 gap-2">
        {current.options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => pick(opt.value)}
            className="flex items-center gap-2 border border-[var(--border)] rounded-xl p-2.5 text-left hover:border-orange-400 hover:bg-orange-50 transition"
          >
            <span className="text-lg">{opt.emoji}</span>
            <span className="text-xs font-medium">{opt.label}</span>
          </button>
        ))}
      </div>
      {step > 0 && (
        <button onClick={() => { setStep(step - 1); setAnswers(answers.slice(0, -1)); }} className="mt-2 text-xs text-[var(--muted)] hover:text-black transition">
          ← Back
        </button>
      )}
    </div>
  );
}
