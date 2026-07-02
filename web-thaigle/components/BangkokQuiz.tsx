"use client";

import { useState } from "react";

type Question = {
  q: string;
  emoji: string;
  answers: { label: string; value: string }[];
};

type ResultType = {
  id: string;
  title: string;
  emoji: string;
  desc: string;
  color: string;
  recs: { label: string; url: string; emoji: string }[];
  dayPlanUrl?: string;
};

const QUESTIONS: Question[] = [
  {
    q: "What's your Bangkok vibe?",
    emoji: "✈️",
    answers: [
      { label: "Eat everything 24/7", value: "food" },
      { label: "Fitness & wellness first", value: "wellness" },
      { label: "Culture & hidden gems", value: "culture" },
      { label: "Party & nightlife", value: "night" },
    ],
  },
  {
    q: "How do you pick a restaurant?",
    emoji: "🍽️",
    answers: [
      { label: "Only the most reviewed spots", value: "popular" },
      { label: "Hidden local spots only", value: "local" },
      { label: "Instagram-worthy or nothing", value: "insta" },
      { label: "Whatever's cheapest", value: "budget" },
    ],
  },
  {
    q: "Your ideal Bangkok morning?",
    emoji: "🌅",
    answers: [
      { label: "Thai massage by 9am", value: "wellness" },
      { label: "Muay Thai training", value: "active" },
      { label: "Street food crawl", value: "food" },
      { label: "Working from a café", value: "nomad" },
    ],
  },
  {
    q: "Budget per day?",
    emoji: "💸",
    answers: [
      { label: "Under ฿1,500 — backpacker life", value: "budget" },
      { label: "฿1,500–4,000 — balanced", value: "mid" },
      { label: "฿4,000–10,000 — treat yourself", value: "premium" },
      { label: "No limit — YOLO", value: "luxury" },
    ],
  },
  {
    q: "How long is your Bangkok trip?",
    emoji: "🗓️",
    answers: [
      { label: "1–2 days (transit or weekend)", value: "short" },
      { label: "3–5 days (classic trip)", value: "mid" },
      { label: "1–2 weeks (deep dive)", value: "long" },
      { label: "I might never leave", value: "forever" },
    ],
  },
];

const RESULTS: ResultType[] = [
  {
    id: "foodie",
    title: "The Bangkok Foodie",
    emoji: "🌶️",
    desc: "You're here for the food and nothing else. Street stalls at 2am, 5-star tasting menus at 8pm — you do it all. Your Instagram is basically a food diary. No regrets.",
    color: "from-orange-500 to-red-500",
    recs: [
      { label: "Best Thai Restaurants", url: "/restaurants/cuisine/thai", emoji: "🍛" },
      { label: "Thai Street Food Guide", url: "/guide/best-thai-food-bangkok", emoji: "🥢" },
      { label: "Thai Cooking Classes", url: "/activities/cooking", emoji: "👨‍🍳" },
    ],
    dayPlanUrl: "/day-plan/thonglor/foodie",
  },
  {
    id: "wellness",
    title: "The Wellness Warrior",
    emoji: "🧘",
    desc: "Thai massage every day, yoga at sunrise, detox smoothies for lunch. Bangkok is your annual reset. You leave feeling like a completely different person — and you are.",
    color: "from-green-500 to-teal-500",
    recs: [
      { label: "Best Spas & Massage", url: "/activities/spa", emoji: "💆" },
      { label: "Yoga & Pilates Studios", url: "/activities/yoga-pilates", emoji: "🧘" },
      { label: "Wellness Centers", url: "/activities/wellness", emoji: "🌿" },
    ],
    dayPlanUrl: "/day-plan/thonglor/wellness",
  },
  {
    id: "fighter",
    title: "The Muay Thai Pilgrim",
    emoji: "🥊",
    desc: "You didn't come to Bangkok to relax. You came to train. Morning sessions, afternoon runs, evening fights. You'll go home with bruised shins and the best story at every dinner party.",
    color: "from-red-500 to-orange-600",
    recs: [
      { label: "Best Muay Thai Gyms", url: "/activities/muay-thai", emoji: "🥊" },
      { label: "Muay Thai Guide", url: "/guide/best-muay-thai-gyms-bangkok", emoji: "📖" },
      { label: "Post-Training Restaurants", url: "/best/highly-recommended", emoji: "🍽️" },
    ],
    dayPlanUrl: "/day-plan/sukhumvit/active",
  },
  {
    id: "nomad",
    title: "The Digital Nomad",
    emoji: "💻",
    desc: "Meetings before 10am, café-hopping from 11am, co-working by day, rooftop bars by night. Bangkok is your office. A very good office with extremely affordable lunch.",
    color: "from-blue-500 to-purple-500",
    recs: [
      { label: "Best Coworking Spaces", url: "/activities/coworking", emoji: "💻" },
      { label: "Digital Nomad Guide", url: "/activities/digital-nomad", emoji: "🗺️" },
      { label: "Cafés & Remote Work", url: "/restaurants/cuisine/cafe", emoji: "☕" },
    ],
    dayPlanUrl: "/day-plan/thonglor/foodie",
  },
  {
    id: "explorer",
    title: "The Hidden Gem Hunter",
    emoji: "🔍",
    desc: "You go to the places no one knows about. Tiny alley restaurants with 2,000 reviews and zero English signage. Hole-in-the-wall massage shops that tourists walk past. You find the real Bangkok.",
    color: "from-amber-500 to-yellow-500",
    recs: [
      { label: "Hidden Gem Restaurants", url: "/restaurants/bangkok/hidden-gems", emoji: "💎" },
      { label: "Explore by District", url: "/restaurants/bangkok", emoji: "📍" },
      { label: "Anti-Tourist Traps", url: "/restaurants/bangkok/tourist-traps", emoji: "🚩" },
    ],
    dayPlanUrl: "/day-plan/old-town/foodie",
  },
  {
    id: "budget",
    title: "The Budget Champion",
    emoji: "💪",
    desc: "50 baht pad see ew? You found it. Massage for 200 baht? Been there 3 times already. You get more out of Bangkok for less than anyone else. A skill, honestly.",
    color: "from-emerald-500 to-green-600",
    recs: [
      { label: "Budget-Friendly Restaurants", url: "/best/affordable", emoji: "🍜" },
      { label: "Budget Bangkok Activities", url: "/activities/budget", emoji: "🎯" },
      { label: "Street Food Bangkok", url: "/restaurants/cuisine/street_food", emoji: "🥢" },
    ],
    dayPlanUrl: "/day-plan/ari/foodie",
  },
];

function scoreToResult(answers: string[]): ResultType {
  const counts: Record<string, number> = {};
  for (const a of answers) {
    counts[a] = (counts[a] ?? 0) + 1;
  }
  if ((counts.wellness ?? 0) + (counts.active ?? 0) >= 2 && (counts.active ?? 0) >= 1) return RESULTS[2]; // fighter
  if ((counts.wellness ?? 0) >= 2) return RESULTS[1]; // wellness
  if ((counts.food ?? 0) + (counts.popular ?? 0) >= 2) return RESULTS[0]; // foodie
  if ((counts.nomad ?? 0) >= 1) return RESULTS[3]; // nomad
  if ((counts.local ?? 0) >= 1) return RESULTS[4]; // explorer
  if ((counts.budget ?? 0) >= 2) return RESULTS[5]; // budget
  return RESULTS[Math.floor(Math.random() * RESULTS.length)];
}

export function BangkokQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<ResultType | null>(null);
  const [copied, setCopied] = useState(false);

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers, value];
    if (step + 1 < QUESTIONS.length) {
      setAnswers(newAnswers);
      setStep(step + 1);
    } else {
      const r = scoreToResult(newAnswers);
      setResult(r);
      try { localStorage.setItem("thaigle_quiz_result", r.title); } catch {}
    }
  };

  const reset = () => {
    setStep(0);
    setAnswers([]);
    setResult(null);
    setCopied(false);
  };

  const shareResult = async () => {
    const text = `I got "${result?.emoji} ${result?.title}" on Thaigle's Bangkok traveler quiz! 🇹🇭 Find your type → https://thaigle.com/quiz`;
    if (navigator.share) {
      try { await navigator.share({ title: "My Bangkok Traveler Type", text }); return; } catch {}
    }
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (result) {
    return (
      <div className="max-w-lg mx-auto">
        <div className={`rounded-2xl bg-gradient-to-br ${result.color} p-1 shadow-xl`}>
          <div className="bg-white rounded-xl p-6">
            <div className="text-center mb-5">
              <div className="text-6xl mb-3">{result.emoji}</div>
              <div className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-1">Your Bangkok type is</div>
              <h2 className="text-2xl font-black mb-3">{result.title}</h2>
              <p className="text-sm text-[var(--muted)] leading-relaxed">{result.desc}</p>
            </div>

            {result.dayPlanUrl && (
              <a
                href={result.dayPlanUrl}
                className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 border border-amber-200 hover:border-amber-400 transition mb-4"
              >
                <span className="text-2xl">📅</span>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-amber-800">Your ideal Day Plan</div>
                  <div className="text-xs text-amber-600">Curated itinerary for your traveler type →</div>
                </div>
              </a>
            )}

            <div className="border-t border-[var(--border)] pt-4 mb-5">
              <div className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-3">Your personalized picks</div>
              <div className="space-y-2">
                {result.recs.map((rec) => (
                  <a
                    key={rec.url}
                    href={rec.url}
                    className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] hover:border-orange-300 hover:bg-orange-50 transition group"
                  >
                    <span className="text-xl">{rec.emoji}</span>
                    <span className="font-medium text-sm group-hover:text-orange-700 transition">{rec.label}</span>
                    <span className="ml-auto text-[var(--muted)] text-xs">→</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <button
                  onClick={shareResult}
                  className="flex-1 py-2.5 rounded-full bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 transition"
                >
                  {copied ? "✓ Copied!" : "📤 Share result"}
                </button>
                <button
                  onClick={reset}
                  className="px-4 py-2.5 rounded-full border border-[var(--border)] font-bold text-sm hover:border-orange-400 transition"
                >
                  Retake
                </button>
              </div>
              <div className="flex gap-2">
                <a
                  href={`https://line.me/R/msg/text/?${encodeURIComponent(`I got "${result?.emoji} ${result?.title}" on Thaigle's Bangkok quiz! 🇹🇭\nhttps://thaigle.com/quiz`)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex-1 py-2 rounded-full bg-[#00B900] text-white font-bold text-xs text-center hover:brightness-95 transition"
                >
                  Share on LINE
                </a>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`I got "${result?.emoji} ${result?.title}" on Thaigle's Bangkok quiz! 🇹🇭\nhttps://thaigle.com/quiz`)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex-1 py-2 rounded-full bg-[#25D366] text-white font-bold text-xs text-center hover:brightness-95 transition"
                >
                  WhatsApp
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://thaigle.com/quiz")}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex-1 py-2 rounded-full bg-[#1877F2] text-white font-bold text-xs text-center hover:brightness-95 transition"
                >
                  Facebook
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const q = QUESTIONS[step];

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-5">
        <div className="flex gap-1.5 mb-4">
          {QUESTIONS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                i < step ? "bg-orange-500" : i === step ? "bg-orange-300" : "bg-[var(--border)]"
              }`}
            />
          ))}
        </div>
        <div className="text-xs font-bold text-[var(--muted)] uppercase tracking-widest">
          Question {step + 1} of {QUESTIONS.length}
        </div>
      </div>

      <div className="bg-white border border-[var(--border)] rounded-2xl p-6 shadow-sm">
        <div className="text-4xl mb-3 text-center">{q.emoji}</div>
        <h3 className="text-xl font-black text-center mb-6">{q.q}</h3>
        <div className="space-y-2.5">
          {q.answers.map((a) => (
            <button
              key={a.value}
              onClick={() => handleAnswer(a.value)}
              className="w-full text-left p-4 rounded-xl border-2 border-[var(--border)] hover:border-orange-400 hover:bg-orange-50 hover:text-orange-800 transition font-medium text-sm active:scale-[0.98]"
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
