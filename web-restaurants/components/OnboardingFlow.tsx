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
  { value: "casual_local", label: "캐주얼 로컬", emoji: "🏪" },
  { value: "fine_dining", label: "파인다이닝", emoji: "🍷" },
  { value: "rooftop", label: "루프탑 / 뷰", emoji: "🌆" },
  { value: "family", label: "가족 식사", emoji: "👨‍👩‍👧" },
  { value: "date", label: "데이트", emoji: "🕯️" },
  { value: "group", label: "단체 / 회식", emoji: "🥂" },
];

const DIETARY_OPTIONS = [
  { value: "vegetarian", label: "채식주의" },
  { value: "vegan", label: "비건" },
  { value: "halal", label: "할랄" },
  { value: "gluten_free", label: "글루텐프리" },
  { value: "dairy_free", label: "유제품X" },
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
    localStorage.setItem("snsstopper_prefs", JSON.stringify(prefs));
    onComplete(prefs);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg)]">
      <div className="w-full max-w-lg mx-auto px-4">
        <ProgressDots step={step} />

        {step === 0 && (
          <>
            <h2 className="font-serif-display text-3xl text-center text-[var(--fg)] mb-2">어떤 음식 좋아해요?</h2>
            <p className="text-sm text-[var(--muted)] text-center mb-6">취향에 맞는 맛집만 보여드릴게요</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
              {CUISINE_OPTIONS.map(([key, label]) => {
                const selected = cuisines.includes(key);
                return (
                  <button
                    key={key}
                    onClick={() => setCuisines(toggle(cuisines, key))}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition ${
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
              <button onClick={onSkip} className="flex-1 py-3 rounded-2xl border border-[var(--border)] text-sm text-[var(--muted)]">
                건너뛰기
              </button>
              <button
                onClick={() => setStep(1)}
                disabled={cuisines.length === 0}
                className="flex-1 py-3 rounded-2xl bg-[var(--accent)] text-white font-bold text-sm disabled:opacity-40"
              >
                다음 →
              </button>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <h2 className="font-serif-display text-3xl text-center text-[var(--fg)] mb-2">어떤 분위기 선호해요?</h2>
            <p className="text-sm text-[var(--muted)] text-center mb-6">복수 선택 가능</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
              {ATMOSPHERE_OPTIONS.map((opt) => {
                const selected = atmosphere.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    onClick={() => setAtmosphere(toggle(atmosphere, opt.value))}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition ${
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
              <button onClick={() => setStep(0)} className="flex-1 py-3 rounded-2xl border border-[var(--border)] text-sm text-[var(--muted)]">
                ← 이전
              </button>
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-3 rounded-2xl bg-[var(--accent)] text-white font-bold text-sm"
              >
                다음 →
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="font-serif-display text-3xl text-center text-[var(--fg)] mb-2">식이제한 있어요?</h2>
            <p className="text-sm text-[var(--muted)] text-center mb-6">선택 사항이에요</p>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {DIETARY_OPTIONS.map((opt) => {
                const selected = dietary.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    onClick={() => setDietary(toggle(dietary, opt.value))}
                    className={`px-5 py-2.5 rounded-2xl border-2 text-sm font-medium transition ${
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
              <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-2xl border border-[var(--border)] text-sm text-[var(--muted)]">
                ← 이전
              </button>
              <button
                onClick={finish}
                className="flex-1 py-3 rounded-2xl bg-[var(--accent)] text-white font-bold text-sm"
              >
                맞춤 추천 보기 →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
