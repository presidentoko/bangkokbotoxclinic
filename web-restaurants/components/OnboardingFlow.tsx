"use client";
import { useState } from "react";
import { CUISINE_LABELS, CUISINE_ICONS } from "@/lib/types";

export type UserPrefs = {
  cuisines: string[];
  atmosphere: string[];
  dietary: string[];
  completedAt: number;
};

const CUISINE_OPTIONS = Object.entries(CUISINE_LABELS).filter(([key]) =>
  ["thai", "japanese", "korean", "chinese", "italian", "western", "seafood", "vegetarian", "cafe", "street_food"].includes(key)
);

const ATMOSPHERE_OPTIONS = [
  { value: "casual_local", label: "Casual local", emoji: "🏪" },
  { value: "fine_dining", label: "Fine dining", emoji: "🍷" },
  { value: "rooftop", label: "Rooftop / view", emoji: "🌆" },
  { value: "family", label: "Family meal", emoji: "👨‍👩‍👧" },
  { value: "date", label: "Date night", emoji: "🕯️" },
  { value: "group", label: "Group / party", emoji: "🥂" },
];

const DIETARY_OPTIONS = [
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "halal", label: "Halal" },
  { value: "gluten_free", label: "Gluten-free" },
  { value: "dairy_free", label: "Dairy-free" },
];

function ProgressDots({ step }: { step: number }) {
  return (
    <div className="flex justify-center gap-2 mb-6">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={`w-2 h-2 rounded-full transition ${i === step ? "bg-[var(--accent)]" : "bg-[var(--border)]"}`}
        />
      ))}
    </div>
  );
}

export function OnboardingFlow({
  onComplete,
  onSkip,
}: {
  onComplete: (prefs: UserPrefs) => void;
  onSkip: () => void;
}) {
  const [step, setStep] = useState(0);
  const [cuisines, setCuisines] = useState<string[]>([]);
  const [atmosphere, setAtmosphere] = useState<string[]>([]);
  const [dietary, setDietary] = useState<string[]>([]);

  function toggle<T>(arr: T[], val: T): T[] {
    return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
  }

  function finish() {
    const prefs: UserPrefs = { cuisines, atmosphere, dietary, completedAt: Date.now() };
    try { localStorage.setItem("snsstopper_prefs", JSON.stringify(prefs)); } catch {}
    onComplete(prefs);
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[var(--bg)]">
      <div className="min-h-full flex items-center justify-center py-10">
        <div className="w-full max-w-lg mx-auto px-4 relative">
          <button
            onClick={onSkip}
            aria-label="Close"
            className="absolute -top-2 right-4 min-h-[44px] min-w-[44px] flex items-center justify-center text-xl text-[var(--muted)] hover:text-[var(--fg)]"
          >
            ✕
          </button>
          <ProgressDots step={step} />

          {step === 0 && (
            <>
              <h2 className="font-serif-display text-3xl text-center text-[var(--fg)] mb-2">What do you like to eat?</h2>
              <p className="text-sm text-[var(--muted)] text-center mb-6">We'll tailor picks to your taste</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                {CUISINE_OPTIONS.map(([key, label]) => {
                  const selected = cuisines.includes(key);
                  return (
                    <button
                      key={key}
                      onClick={() => setCuisines(toggle(cuisines, key))}
                      className={`flex flex-col items-center gap-2 p-4 min-h-[44px] rounded-2xl border-2 transition ${
                        selected
                          ? "border-[var(--accent)] bg-[var(--accent-light)] text-[var(--accent)]"
                          : "border-[var(--border)] bg-[var(--card)] text-[var(--fg)] hover:border-[var(--accent)]"
                      }`}
                    >
                      <span className="text-2xl">{CUISINE_ICONS[key] ?? "🍴"}</span>
                      <span className="text-sm font-medium">{label}</span>
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-3">
                <button onClick={onSkip} className="flex-1 min-h-[44px] py-3 rounded-2xl border border-[var(--border)] text-sm text-[var(--muted)]">
                  Skip
                </button>
                <button
                  onClick={() => setStep(1)}
                  disabled={cuisines.length === 0}
                  className="flex-1 min-h-[44px] py-3 rounded-2xl bg-[var(--accent)] text-white font-bold text-sm disabled:opacity-40"
                >
                  Next →
                </button>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <h2 className="font-serif-display text-3xl text-center text-[var(--fg)] mb-2">What's your vibe?</h2>
              <p className="text-sm text-[var(--muted)] text-center mb-6">Pick as many as you like</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                {ATMOSPHERE_OPTIONS.map((opt) => {
                  const selected = atmosphere.includes(opt.value);
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setAtmosphere(toggle(atmosphere, opt.value))}
                      className={`flex flex-col items-center gap-2 p-4 min-h-[44px] rounded-2xl border-2 transition ${
                        selected
                          ? "border-[var(--accent)] bg-[var(--accent-light)] text-[var(--accent)]"
                          : "border-[var(--border)] bg-[var(--card)] text-[var(--fg)] hover:border-[var(--accent)]"
                      }`}
                    >
                      <span className="text-2xl">{opt.emoji}</span>
                      <span className="text-sm font-medium">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(0)} className="flex-1 min-h-[44px] py-3 rounded-2xl border border-[var(--border)] text-sm text-[var(--muted)]">
                  ← Back
                </button>
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 min-h-[44px] py-3 rounded-2xl bg-[var(--accent)] text-white font-bold text-sm"
                >
                  Next →
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="font-serif-display text-3xl text-center text-[var(--fg)] mb-2">Any dietary needs?</h2>
              <p className="text-sm text-[var(--muted)] text-center mb-6">Optional</p>
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {DIETARY_OPTIONS.map((opt) => {
                  const selected = dietary.includes(opt.value);
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setDietary(toggle(dietary, opt.value))}
                      className={`px-5 py-2.5 min-h-[44px] rounded-2xl border-2 text-sm font-medium transition ${
                        selected
                          ? "border-[var(--accent)] bg-[var(--accent-light)] text-[var(--accent)]"
                          : "border-[var(--border)] bg-[var(--card)] text-[var(--fg)] hover:border-[var(--accent)]"
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 min-h-[44px] py-3 rounded-2xl border border-[var(--border)] text-sm text-[var(--muted)]">
                  ← Back
                </button>
                <button
                  onClick={finish}
                  className="flex-1 min-h-[44px] py-3 rounded-2xl bg-[var(--accent)] text-white font-bold text-sm"
                >
                  See my picks →
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
